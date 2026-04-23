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

PRODUCT IDEA Evaluator Context & Few-Shot Examples
What is a product idea
A product idea is an early-stage concept for a digital or physical product, described in one or two sentences. It has no validated market research, no user interviews, and no financial projections yet. The goal is to evaluate whether it is worth pursuing based on market, differentiation, monetization potential, and execution feasibility.
What makes an idea bad
A product idea is weak when it targets a problem that is too broad, already dominated by well-funded incumbents, lacks a clear revenue model, or solves something people tolerate but would never pay to fix. Sounding interesting is not enough — the idea needs a real angle.

Few-Shot Examples
Idea: "An e-commerce store selling clothes online."
Evaluation: Bad. This is one of the most saturated markets in the world. Competing against Amazon, Zara, SHEIN, and thousands of Shopify stores without a specific niche, unique supplier, or strong brand identity is nearly impossible. Margins are thin, customer acquisition costs are high, and there is no differentiation. To make this viable it would need a very specific angle — for example, sustainable workwear for women in Latin America, or custom embroidery for local sports teams.

Idea: "A to-do list app with a clean design."
Evaluation: Bad. The to-do app market is completely saturated with free, polished, and well-funded products like Todoist, Notion, and Apple Reminders. A cleaner design is not a competitive advantage — it is a table stake. There is no moat, no clear audience, and no reason for users to switch. Unless it solves a very specific workflow problem for a niche (e.g., task management for construction site supervisors), this idea has no path to traction.

Idea: "A marketplace connecting local farmers with urban buyers in Argentina."
Evaluation: Promising, but hard to execute. There is a real problem — urban consumers want fresh, local food and farmers lack direct distribution channels. The market is fragmented enough that big players have not dominated it. Monetization is plausible via commission per transaction or subscription for farmers. The main risk is the classic marketplace chicken-and-egg problem: you need supply to attract demand and demand to attract supply. Success depends heavily on starting in one city with a tight geographic focus before scaling.

Idea: "A SaaS tool that automates invoice generation for freelancers in Latin America."
Evaluation: Good. Freelancers in LATAM deal with complex, country-specific tax and billing requirements that generic tools like QuickBooks or FreshBooks do not handle well. There is a clear pain point, a defined audience, and willingness to pay because the problem has a direct financial cost. The market is large enough to build a real business but specific enough to avoid direct competition with global incumbents. The key risk is whether regulation varies too much country by country to build a scalable product without heavy localization costs.

Idea: "An AI chatbot for customer service."
Evaluation: Bad as stated. This is not an idea — it is a category. Hundreds of well-funded companies (Intercom, Zendesk, Drift) already offer this, and foundation model providers are building it natively. Without a specific industry (e.g., AI support for veterinary clinics), a specific region, or a unique data advantage, there is no reason this product would win. The more specific the framing, the more evaluable the idea becomes.

How to use these examples
When evaluating a new idea, follow the same structure: restate the idea, identify the core weakness or strength, name the specific competitors or market dynamics at play, and conclude with what would need to be true for the idea to work. Avoid generic praise — push for the specific reason something is good or bad.


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
