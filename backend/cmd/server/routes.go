package main

import (
	"github.com/franc/rateyourproject/internal/config"
	"github.com/franc/rateyourproject/internal/handlers/analysis"
	"github.com/franc/rateyourproject/internal/handlers/auth"
	"github.com/franc/rateyourproject/internal/handlers/conversation"
	"github.com/franc/rateyourproject/internal/middleware"
	"github.com/gin-gonic/gin"
)

func setupRoutes(r *gin.Engine, cfg *config.Config, authHandler *auth.AuthHandler, conversationHandler *conversation.ConversationHandler, analysisHandler *analysis.AnalysisHandler, analysisLimiter *middleware.RateLimiter, authLimiter *middleware.RateLimiter, apiLimiter *middleware.RateLimiter) {
	r.Use(corsMiddleware(cfg))

	r.POST("/api/auth/callback", middleware.RateLimitByIP(authLimiter), authHandler.HandleGoogleCallback)

	protected := r.Group("/api/auth")
	protected.Use(middleware.AuthMiddleware())
	protected.Use(middleware.RateLimitByUser(apiLimiter))
	{
		protected.GET("/me", authHandler.HandleMe)
		protected.POST("/logout", authHandler.HandleLogout)
		protected.PATCH("/profile", authHandler.HandleUpdateProfile)
	}

	conversations := r.Group("/api/conversations")
	conversations.Use(middleware.AuthMiddleware())
	conversations.Use(middleware.RateLimitByUser(apiLimiter))
	{
		conversations.GET("", conversationHandler.HandleGetRecentConversations)
		conversations.POST("", conversationHandler.HandleCreateConversation)
	}

	analysis := r.Group("/api/analysis")
	analysis.Use(middleware.AuthMiddleware())
	analysis.Use(middleware.RateLimitByUser(analysisLimiter))
	{
		analysis.POST("/upload", analysisHandler.HandleCreateAnalysis)
		analysis.GET("/:conversationId", analysisHandler.HandleGetLatestAnalysis)
	}
}

func corsMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", cfg.FrontendURL)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
