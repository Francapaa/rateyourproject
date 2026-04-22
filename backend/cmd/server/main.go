package main

import (
	"log"

	"github.com/franc/rateyourproject/internal/config"
	"github.com/franc/rateyourproject/internal/handlers/analysis"
	"github.com/franc/rateyourproject/internal/handlers/auth"
	"github.com/franc/rateyourproject/internal/handlers/conversation"
	"github.com/franc/rateyourproject/internal/repository"
	services "github.com/franc/rateyourproject/internal/services"
	extractor "github.com/franc/rateyourproject/internal/services/analysis"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()

	gin.SetMode(gin.ReleaseMode)

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  cfg.DatabaseURL,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		log.Fatal("FAILED TO CONNECT WITH DATABASE:", err)
	}

	//if err := db.AutoMigrate(&models.User{}, &models.Conversation{}); err != nil {
	//	log.Fatalf("failed to migrate database: %v", err)
	//}

	userRepo := repository.NewUserRepository(db)
	authService := services.NewAuthService(cfg, userRepo)
	authHandler := auth.NewAuthHandler(authService, cfg)

	conversationRepo := repository.NewConversationRepository(db)
	conversationService := services.NewConversationService(conversationRepo)
	conversationHandler := conversation.NewConversationHandler(conversationService)

	extractorService := extractor.NewExtractorService()
	contextBuilderService := extractor.NewContextBuilderService(userRepo)
	geminiService := extractor.NewGeminiService(cfg)
	analysisRepo := repository.NewAnalysisRepository(db)
	analysisHandler := analysis.NewAnalysisHandler(extractorService, contextBuilderService, geminiService, analysisRepo)

	r := gin.Default()
	r.Use(corsMiddleware(cfg))
	setupRoutes(r, cfg, authHandler, conversationHandler, analysisHandler)

	log.Printf("server starting on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
