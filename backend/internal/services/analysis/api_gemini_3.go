package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/franc/rateyourproject/internal/config"
)

const geminiAPIURLTemplate = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent"

type GeminiService struct {
	apiKey     string
	model      string
	httpClient *http.Client
}

type GeminiEvaluation struct {
	Title        string             `json:"title"`
	Dimensions   map[string]float64 `json:"dimensions"`
	Improvements []string           `json:"improvements"`
}

type geminiRequest struct {
	Contents         []geminiContent        `json:"contents"`
	GenerationConfig geminiGenerationConfig `json:"generationConfig"`
}

type geminiContent struct {
	Role  string       `json:"role,omitempty"`
	Parts []geminiPart `json:"parts"`
}

type geminiPart struct {
	Text string `json:"text"`
}

type geminiGenerationConfig struct {
	ResponseMimeType   string         `json:"responseMimeType"`
	ResponseJSONSchema map[string]any `json:"responseJsonSchema"`
}

type geminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
		FinishReason string `json:"finishReason"`
	} `json:"candidates"`
}

func NewGeminiService(cfg *config.Config) *GeminiService {
	return &GeminiService{
		apiKey: cfg.GeminiAPIKey,
		model:  cfg.GeminiModel,
		httpClient: &http.Client{
			Timeout: 90 * time.Second,
		},
	}
}

func (s *GeminiService) Evaluate(ctx context.Context, analysisContext *AnalysisContext) (*GeminiEvaluation, error) {
	if analysisContext == nil {
		return nil, fmt.Errorf("analysis context is required")
	}
	if strings.TrimSpace(s.apiKey) == "" {
		return nil, fmt.Errorf("missing GEMINI_API_KEY")
	}
	if strings.TrimSpace(s.model) == "" {
		return nil, fmt.Errorf("missing Gemini model")
	}

	requestBody := geminiRequest{
		Contents: []geminiContent{
			{
				Role: "user",
				Parts: []geminiPart{
					{Text: buildGeminiPrompt(analysisContext)},
				},
			},
		},
		GenerationConfig: geminiGenerationConfig{
			ResponseMimeType:   "application/json",
			ResponseJSONSchema: buildGeminiResponseSchema(),
		},
	}

	payload, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("marshalling Gemini request: %w", err)
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, fmt.Sprintf(geminiAPIURLTemplate, s.model), bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("creating Gemini request: %w", err)
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("x-goog-api-key", s.apiKey)

	response, err := s.httpClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("calling Gemini API: %w", err)
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("reading Gemini response: %w", err)
	}

	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return nil, fmt.Errorf("Gemini API returned %d: %s", response.StatusCode, string(body))
	}

	var geminiResult geminiResponse
	if err := json.Unmarshal(body, &geminiResult); err != nil {
		return nil, fmt.Errorf("decoding Gemini response envelope: %w", err)
	}

	rawJSON, err := extractGeminiJSON(geminiResult)
	if err != nil {
		return nil, err
	}

	var evaluation GeminiEvaluation
	if err := json.Unmarshal([]byte(rawJSON), &evaluation); err != nil {
		return nil, fmt.Errorf("decoding Gemini structured output: %w", err)
	}

	if evaluation.Dimensions == nil {
		evaluation.Dimensions = map[string]float64{}
	}
	if evaluation.Improvements == nil {
		evaluation.Improvements = []string{}
	}

	return &evaluation, nil
}

func buildGeminiPrompt(analysisContext *AnalysisContext) string {
	return strings.TrimSpace(analysisContext.SystemInstruction + "\n\n" + analysisContext.UserPrompt)
}

func extractGeminiJSON(response geminiResponse) (string, error) {
	if len(response.Candidates) == 0 {
		return "", fmt.Errorf("Gemini returned no candidates")
	}

	parts := response.Candidates[0].Content.Parts
	if len(parts) == 0 {
		return "", fmt.Errorf("Gemini returned an empty candidate")
	}

	text := strings.TrimSpace(parts[0].Text)
	if text == "" {
		return "", fmt.Errorf("Gemini returned empty text")
	}

	return text, nil
}

func buildGeminiResponseSchema() map[string]any {
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"title": map[string]any{
				"type":        "string",
				"description": "Short project label for the result card.",
			},
			"dimensions": map[string]any{
				"type":        "object",
				"description": "Scores by evaluation dimension from 0 to 100.",
				"properties": map[string]any{
					"architecture":    map[string]any{"type": "number"},
					"code_quality":    map[string]any{"type": "number"},
					"maintainability": map[string]any{"type": "number"},
					"testing":         map[string]any{"type": "number"},
					"documentation":   map[string]any{"type": "number"},
					"product_idea":    map[string]any{"type": "number"},
				},
				"required": []string{
					"architecture",
					"code_quality",
					"maintainability",
					"testing",
					"documentation",
					"product_idea",
				},
			},
			"improvements": map[string]any{
				"type":        "array",
				"items":       map[string]any{"type": "string"},
				"description": "Short concrete list of the most important improvements.",
			},
		},
		"required": []string{
			"title",
			"dimensions",
			"improvements",
		},
	}
}
