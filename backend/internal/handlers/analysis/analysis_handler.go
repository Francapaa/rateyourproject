package analysis

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"reflect"
	"time"

	"github.com/franc/rateyourproject/internal/models"
	"github.com/franc/rateyourproject/internal/repository"
	analysisservices "github.com/franc/rateyourproject/internal/services/analysis"
	"github.com/franc/rateyourproject/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

/*
result := &AnalysisResultResponse{
		ID:             uuid.New().String(),
		Filename:       filename,
		Title:          "Project evaluation pending",
		Dimensions:     map[string]float64{},
		Analysis:       "Análisis en progreso...",
		Improvements:   []string{},
		CreatedAt:      time.Now().Format(time.RFC3339),
		ExtractedFiles: files,
		Tree:           tree,
		Summary:        summary,
		FileTree:       fileTree,
		KeyFiles:       keyFiles,
		Metrics:        metrics,
	}
*/

const maxFileSize = 100 * 1024 * 1024 // 100MB

type AnalysisHandler struct {
	extractor      *analysisservices.ExtractorService
	contextBuilder *analysisservices.ContextBuilderService
	gemini         *analysisservices.GeminiService
	analysisRepo   repository.AnalysisRepository
}

func NewAnalysisHandler(
	extractor *analysisservices.ExtractorService,
	contextBuilder *analysisservices.ContextBuilderService,
	gemini *analysisservices.GeminiService,
	analysisRepo repository.AnalysisRepository,
) *AnalysisHandler {
	return &AnalysisHandler{
		extractor:      extractor,
		contextBuilder: contextBuilder,
		gemini:         gemini,
		analysisRepo:   analysisRepo,
	}
}

func (h *AnalysisHandler) HandleCreateAnalysis(c *gin.Context) {
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Writer.Header().Set("X-Accel-Buffering", "no")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")

	file, header, err := c.Request.FormFile("project")
	if err != nil {
		sendSSEEvent(c, "error", map[string]string{"message": "No se encontró ningún archivo"})
		return
	}
	defer file.Close()

	if header.Size > maxFileSize {
		sendSSEEvent(c, "error", map[string]string{"message": "El archivo no puede superar los 100MB"})
		return
	}

	if !isValidFileType(header.Filename) {
		sendSSEEvent(c, "error", map[string]string{"message": "Solo se permiten archivos .zip"})
		return
	}

	conversationIDStr := c.PostForm("conversation_id")
	conversationID := uuid.Nil
	if conversationIDStr != "" {
		conversationID, _ = uuid.Parse(conversationIDStr)
	}

	tempDir, err := os.MkdirTemp("", "analysis-*")
	if err != nil {
		sendSSEEvent(c, "error", map[string]string{"message": "Error al crear directorio temporal"})
		return
	}
	defer os.RemoveAll(tempDir)

	zipPath := filepath.Join(tempDir, header.Filename)
	out, err := os.Create(zipPath)
	if err != nil {
		sendSSEEvent(c, "error", map[string]string{"message": "Error al guardar archivo"})
		return
	}
	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		sendSSEEvent(c, "error", map[string]string{"message": "Error al guardar archivo"})
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		userID = uuid.New().String()
	}

	progressChan := make(chan analysisservices.ProgressEvent, 100)

	go func() {

		progressChan <- analysisservices.NewProgressEvent(0, "Iniciando análisis...")
		fmt.Println("Iniciando analisis")
		defer close(progressChan)
		ticker := time.NewTicker(5 * time.Second)
		defer ticker.Stop()
		result := h.extractor.ExtractAndAnalyze(zipPath, header.Filename, userID, func(event analysisservices.ProgressEvent) {
			if event.Type == "done" {
				return
			}
			progressChan <- event

		})

		progressChan <- analysisservices.NewProgressEvent(50, "Construyendo contexto, pronto verá los resultados...")
		analysisContext, err := h.contextBuilder.BuildAnalysisContext(userID, result)
		if err != nil {
			fmt.Println("Error construyendo contexto: ", err)
			progressChan <- analysisservices.NewErrorEvent(fmt.Sprintf("error construyendo contexto: %v", err))

			return
		}

		result.Context = analysisContext
		progressChan <- analysisservices.NewProgressEvent(75, "Evaluando proyecto...")
		evaluation, err := h.gemini.Evaluate(context.Background(), analysisContext)
		if err != nil {
			fmt.Println("Error evaluando el proyecto: ", err)
			progressChan <- analysisservices.NewErrorEvent(fmt.Sprintf("error evaluando con Gemini: %v", err))

			return
		}

		result.Title = evaluation.Title
		result.Dimensions = evaluation.Dimensions
		result.Improvements = evaluation.Improvements

		analysis := &models.Analysis{
			ID:             uuid.New(),
			ConversationID: conversationID,
			Title:          evaluation.Title,
			Dimensions:     floatMapToInt(evaluation.Dimensions),
			Improvements:   evaluation.Improvements,
		}
		if err := h.analysisRepo.Create(analysis); err != nil {
			fmt.Printf("Error guardando análisis: %v\n", err)
		}

		progressChan <- analysisservices.NewDoneEvent(result)

		fmt.Println("Resultado de la evaluacion: ", result)
		fmt.Println("TIPO DE DATO RESULTADO: ", reflect.TypeOf(result))
	}()

	for event := range progressChan {
		switch event.Type {
		case "progress":
			sendSSEEvent(c, "progress", map[string]interface{}{
				"progress": event.Progress,
				"message":  event.Message,
			})
		case "done":
			sendSSEEvent(c, "done", event.Result)
		case "error":
			sendSSEEvent(c, "error", map[string]string{"message": event.Error})
		}
		c.Writer.Flush()
	}

}

func sendSSEEvent(c *gin.Context, eventType string, data interface{}) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return
	}
	fmt.Fprintf(c.Writer, "event: %s\ndata: %s\n\n", eventType, jsonData)
	c.Writer.Flush()
}

func isValidFileType(filename string) bool {
	ext := filepath.Ext(filename)
	return ext == ".zip"
}

func floatMapToInt(m map[string]float64) map[string]int {
	result := make(map[string]int)
	for k, v := range m {
		result[k] = int(v)
	}
	return result
}

func (h *AnalysisHandler) HandleGetLatestAnalysis(c *gin.Context) {
	conversationIDStr := c.Param("conversationId")
	conversationID, err := uuid.Parse(conversationIDStr)
	if err != nil {
		utils.BadRequest(c, "invalid conversation id")
		return
	}

	analyses, err := h.analysisRepo.FindByConversationID(conversationID.String())
	if err != nil {
		utils.InternalError(c, "failed to fetch analysis")
		return
	}

	fmt.Println("ANALISIS ENCONTRADO: ", analyses)

	if len(analyses) == 0 {
		utils.Success(c, nil)
		return
	}

	latest := analyses[0]
	result := map[string]interface{}{
		"id":           latest.ID.String(),
		"filename":     "proyecto.zip",
		"title":        latest.Title,
		"dimensions":   latest.Dimensions,
		"improvements": latest.Improvements,
		"created_at":   latest.CreatedAt.Format(time.RFC3339),
	}

	utils.Success(c, result)
}
