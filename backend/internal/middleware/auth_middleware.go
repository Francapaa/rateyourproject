package middleware

import (
	"log"
	"strings"

	"github.com/MicahParks/keyfunc/v2"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	jwksURL := "https://jgynbfqyxjllznnyernx.supabase.co/auth/v1/.well-known/jwks.json"

	jwks, err := keyfunc.Get(jwksURL, keyfunc.Options{
		RefreshInterval: 0, // opcional (podés poner 1h en prod)
	})
	if err != nil {
		log.Fatalf("Error cargando JWKS: %v", err)
	}

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "missing auth header"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, jwks.Keyfunc)

		if err != nil || !token.Valid {
			log.Printf("token inválido: %v", err)
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		c.Set("user_id", claims["sub"])
		c.Set("email", claims["email"])

		c.Next()
	}
}
