package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	DatabaseURL        string
	SupabaseURL        string
	SupabaseServiceKey string
	JWTSecret          string
	FrontendURL        string
	OpenAIAPIKey       string
	GeminiAPIKey       string
	GeminiModel        string
}

func Load() *Config {
	godotenv.Load()

	return &Config{
		Port:               getEnv("PORT", "8080"),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		SupabaseURL:        getEnv("SUPABASE_URL", ""),
		SupabaseServiceKey: getEnv("SUPABASE_SERVICE_ROLE_KEY", ""),
		JWTSecret:          getEnv("JWT_SECRET", ""),
		FrontendURL:        getEnv("FRONTEND_URL", "rateyourproject.vercel.app"),
		OpenAIAPIKey:       getEnv("OPEN_AI_API_KEY", ""),
		GeminiAPIKey:       getEnv("GEMINI_API_KEY", getEnv("GOOGLE_API_KEY", getEnv("OPEN_AI_API_KEY", ""))),
		GeminiModel:        getEnv("GEMINI_MODEL", "gemini-2.5-flash"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
