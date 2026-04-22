package auth

import (
	"fmt"

	"github.com/franc/rateyourproject/internal/config"
	"github.com/franc/rateyourproject/internal/services"
	"github.com/franc/rateyourproject/internal/utils"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *services.AuthService
	cfg         *config.Config
}

func NewAuthHandler(authService *services.AuthService, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		cfg:         cfg,
	}
}

type CallbackRequest struct {
	AccessToken string `json:"access_token" binding:"required"`
}

func (h *AuthHandler) HandleGoogleCallback(c *gin.Context) {
	var req CallbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "access_token is required")
		return
	}

	supabaseUser, err := h.authService.VerifySupabaseToken(req.AccessToken)
	if err != nil {
		utils.Unauthorized(c, "invalid access token")
		return
	}

	result, err := h.authService.ProcessAuth(supabaseUser)
	if err != nil {
		utils.InternalError(c, "failed to process authentication")
		return
	}
	fmt.Println("ENTRO ACA")
	utils.Success(c, result)
}

func (h *AuthHandler) HandleMe(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not found in context")
		return
	}

	user, err := h.authService.GetUserByID(userID.(string))
	if err != nil {
		utils.InternalError(c, "failed to fetch user")
		return
	}
	if user == nil {
		utils.Unauthorized(c, "user not found")
		return
	}

	utils.Success(c, user)
}

func (h *AuthHandler) HandleLogout(c *gin.Context) {
	utils.Success(c, gin.H{"message": "logged out"})
}

type UpdateProfileRequest struct {
	Role      string `json:"role" binding:"required"`
	Seniority string `json:"seniority" binding:"required"`
}

func (h *AuthHandler) HandleUpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not found in context")
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.BadRequest(c, "invalid request body")
		return
	}

	if err := h.authService.UpdateProfile(userID.(string), req.Role, req.Seniority); err != nil {
		utils.InternalError(c, "failed to update profile")
		return
	}

	user, err := h.authService.GetUserByID(userID.(string))
	if err != nil {
		utils.InternalError(c, "failed to fetch updated user")
		return
	}

	utils.Success(c, user)
}
