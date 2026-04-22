package services

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/franc/rateyourproject/internal/models"
	"github.com/franc/rateyourproject/internal/repository"
)

const (
	defaultRole      = "generalist"
	defaultSeniority = "mid-level"
	promptVersion    = "v1"
)

type ContextBuilderService struct {
	userRepo repository.UserRepository
}

type UserAnalysisProfile struct {
	UserID      string `json:"user_id"`
	Email       string `json:"email,omitempty"`
	Role        string `json:"role"`
	Seniority   string `json:"seniority"`
	IsPremium   bool   `json:"is_premium"`
	ProfileMode string `json:"profile_mode"`
}

type AnalysisContext struct {
	PromptVersion     string              `json:"prompt_version"`
	UserProfile       UserAnalysisProfile `json:"user_profile"`
	SystemInstruction string              `json:"system_instruction"`
	UserPrompt        string              `json:"user_prompt"`
	ProjectSnapshot   string              `json:"project_snapshot"`
}

func NewContextBuilderService(userRepo repository.UserRepository) *ContextBuilderService {
	return &ContextBuilderService{userRepo: userRepo}
}

func (s *ContextBuilderService) BuildAnalysisContext(userID string, result *AnalysisResultResponse) (*AnalysisContext, error) {
	if result == nil {
		return nil, fmt.Errorf("analysis result is required")
	}

	profile, err := s.resolveUserProfile(userID)
	if err != nil {
		return nil, fmt.Errorf("resolving user profile: %w", err)
	}

	projectSnapshot := buildProjectSnapshot(result)

	return &AnalysisContext{
		PromptVersion:     promptVersion,
		UserProfile:       profile,
		SystemInstruction: buildSystemInstruction(profile),
		UserPrompt:        buildUserPrompt(profile, result, projectSnapshot),
		ProjectSnapshot:   projectSnapshot,
	}, nil
}

func (s *ContextBuilderService) resolveUserProfile(userID string) (UserAnalysisProfile, error) {
	if strings.TrimSpace(userID) == "" {
		return UserAnalysisProfile{
			Role:        defaultRole,
			Seniority:   defaultSeniority,
			ProfileMode: "default",
		}, nil
	}

	user, err := s.userRepo.FindBySupabaseUserID(userID)
	if err != nil {
		return UserAnalysisProfile{}, err
	}

	if user == nil {
		return UserAnalysisProfile{
			UserID:      userID,
			Role:        defaultRole,
			Seniority:   defaultSeniority,
			ProfileMode: "default",
		}, nil
	}

	return mapUserToProfile(user), nil
}

func mapUserToProfile(user *models.User) UserAnalysisProfile {
	role := strings.TrimSpace(user.Role)
	if role == "" {
		role = defaultRole
	}

	seniority := strings.TrimSpace(user.Seniority)
	if seniority == "" {
		seniority = defaultSeniority
	}

	return UserAnalysisProfile{
		UserID:      user.SupabaseUserID,
		Email:       user.Email,
		Role:        role,
		Seniority:   seniority,
		IsPremium:   user.IsPremium,
		ProfileMode: "db",
	}
}

func buildSystemInstruction(profile UserAnalysisProfile) string {
	return strings.TrimSpace(fmt.Sprintf(`
You are a senior software reviewer using Gemini to evaluate real software projects.
Your goal is to determine how strong the uploaded project is for the target candidate profile.

Target role: %s
Target seniority: %s

Rules:
-IF THE TARGET ROLE IS BACKEND JUST QUALIFY THE BACKEND, ELSE QUALIFY THE FRONTEND.
-product_idea is how innovative is the product (for example: an ecommerce CRUD is to basic).
-if product_idea < 60, communicate why
- Evaluate the project only against the target role and seniority.
- Use the provided file tree, metrics, extracted file summaries, key files, and snippets.
- Be strict about architecture, maintainability, correctness, testing, product readiness, and communication signals.
- Do not reward complexity without clarity.
- If important information is missing, say so explicitly.
- Ground every judgment in evidence from the provided project snapshot.
- Return only the JSON fields requested by the schema.
- Keep the title short.
- Keep improvement items short and actionable.
`, profile.Role, profile.Seniority))
}

func buildUserPrompt(profile UserAnalysisProfile, result *AnalysisResultResponse, projectSnapshot string) string {
	return strings.TrimSpace(fmt.Sprintf(`
Analyze the uploaded software project for a %s %s candidate.

Return:
1. A short title for the project evaluation.
2. A dimension-by-dimension evaluation with numeric values from 0 to 100 for:
   architecture, code_quality, maintainability, testing, documentation, product_idea.
3. A short prioritized list of concrete improvements.
Project file: %s
Project snapshot follows.

%s
`, profile.Seniority, profile.Role, result.Filename, projectSnapshot))
}

func buildProjectSnapshot(result *AnalysisResultResponse) string {
	var builder strings.Builder

	builder.WriteString("PROJECT OVERVIEW\n")
	builder.WriteString(fmt.Sprintf("Filename: %s\n", result.Filename))
	builder.WriteString(fmt.Sprintf("Created at: %s\n", result.CreatedAt))

	if result.Summary != nil {
		builder.WriteString("\nSUMMARY\n")
		builder.WriteString(fmt.Sprintf("Total files: %d\n", result.Summary.TotalFiles))
		builder.WriteString(fmt.Sprintf("Code files: %d\n", result.Summary.CodeFiles))
		builder.WriteString(fmt.Sprintf("Config files: %d\n", result.Summary.ConfigFiles))
		builder.WriteString(fmt.Sprintf("Total lines: %d\n", result.Summary.TotalLines))
		builder.WriteString(fmt.Sprintf("Total chars: %d\n", result.Summary.TotalChars))

		if extensionsJSON, err := json.MarshalIndent(result.Summary.Extensions, "", "  "); err == nil {
			builder.WriteString("Extensions:\n")
			builder.WriteString(string(extensionsJSON))
			builder.WriteString("\n")
		}
	}

	if result.Metrics != nil {
		builder.WriteString("\nMETRICS\n")
		builder.WriteString(fmt.Sprintf("Total files: %d\n", result.Metrics.TotalFiles))
		builder.WriteString(fmt.Sprintf("Total lines: %d\n", result.Metrics.TotalLines))
		builder.WriteString(fmt.Sprintf("Has README: %t\n", result.Metrics.HasReadme))
		builder.WriteString(fmt.Sprintf("Has Docker: %t\n", result.Metrics.HasDocker))
		builder.WriteString(fmt.Sprintf("Has CI: %t\n", result.Metrics.HasCI))

		if languagesJSON, err := json.MarshalIndent(result.Metrics.Languages, "", "  "); err == nil {
			builder.WriteString("Language distribution:\n")
			builder.WriteString(string(languagesJSON))
			builder.WriteString("\n")
		}
	}

	if result.FileTree != "" {
		builder.WriteString("\nFILE TREE\n")
		builder.WriteString(result.FileTree)
		builder.WriteString("\n")
	}

	if len(result.KeyFiles) > 0 {
		builder.WriteString("\nKEY FILES\n")
		for _, keyFile := range result.KeyFiles {
			builder.WriteString(fmt.Sprintf("- %s (%d lines)\n", keyFile.RelativePath, keyFile.TotalLines))
			if len(keyFile.ExportedFuncs) > 0 {
				builder.WriteString(fmt.Sprintf("  Exported functions: %s\n", strings.Join(keyFile.ExportedFuncs, ", ")))
			}
			if keyFile.First60Lines != "" {
				builder.WriteString("  Snippet:\n")
				builder.WriteString(indentBlock(keyFile.First60Lines, "    "))
				builder.WriteString("\n")
			}
		}
	}

	if len(result.ExtractedFiles) > 0 {
		builder.WriteString("\nEXTRACTED FILES\n")
		for _, file := range result.ExtractedFiles {
			builder.WriteString(fmt.Sprintf("PATH: %s\n", file.RelativePath))
			builder.WriteString(fmt.Sprintf("EXTENSION: %s\n", file.Extension))
			builder.WriteString(fmt.Sprintf("TOTAL_LINES: %d\n", file.TotalLines))
			builder.WriteString(fmt.Sprintf("IS_CODE: %t\n", file.IsCode))
			builder.WriteString(fmt.Sprintf("IS_CONFIG: %t\n", file.IsConfig))
			if len(file.ExportedFuncs) > 0 {
				builder.WriteString(fmt.Sprintf("EXPORTED_FUNCTIONS: %s\n", strings.Join(file.ExportedFuncs, ", ")))
			}
			if file.First60Lines != "" {
				builder.WriteString("FIRST_60_LINES:\n")
				builder.WriteString(indentBlock(file.First60Lines, "  "))
				builder.WriteString("\n")
			}
			builder.WriteString("\n")
		}
	}
	return strings.TrimSpace(builder.String())
}

func indentBlock(input string, prefix string) string {
	lines := strings.Split(input, "\n")
	for index, line := range lines {
		lines[index] = prefix + line
	}
	return strings.Join(lines, "\n")
}
