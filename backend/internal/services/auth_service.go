package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/franc/rateyourproject/internal/config"
	"github.com/franc/rateyourproject/internal/models"
	"github.com/franc/rateyourproject/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type AuthService struct {
	cfg      *config.Config
	userRepo repository.UserRepository
}

func NewAuthService(cfg *config.Config, userRepo repository.UserRepository) *AuthService {
	return &AuthService{
		cfg:      cfg,
		userRepo: userRepo,
	}
}

type SupabaseUserMetadata struct {
	Name      string `json:"name"`
	AvatarURL string `json:"avatar_url"`
}

type SupabaseUserResponse struct {
	ID           string                 `json:"id"`
	Email        string                 `json:"email"`
	UserMetadata map[string]interface{} `json:"user_metadata"`
}

func (s *AuthService) VerifySupabaseToken(accessToken string) (*SupabaseUserResponse, error) {
	url := fmt.Sprintf("%s/auth/v1/user", s.cfg.SupabaseURL)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("apikey", s.cfg.SupabaseServiceKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("verifying token: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("supabase auth error %d: %s", resp.StatusCode, string(body))
	}

	var userResp SupabaseUserResponse
	if err := json.NewDecoder(resp.Body).Decode(&userResp); err != nil {
		return nil, fmt.Errorf("decoding response: %w", err)
	}

	return &userResp, nil
}

type LoginResult struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

func (s *AuthService) ProcessAuth(supabaseUser *SupabaseUserResponse) (*LoginResult, error) {
	user, err := s.userRepo.FindBySupabaseUserID(supabaseUser.ID)
	if err != nil {
		return nil, fmt.Errorf("finding user: %w", err)
	}

	name := ""
	avatarURL := ""
	if meta, ok := supabaseUser.UserMetadata["name"].(string); ok {
		name = meta
	}
	if avatar, ok := supabaseUser.UserMetadata["avatar_url"].(string); ok {
		avatarURL = avatar
	}

	if user == nil {
		user = &models.User{
			ID:             uuid.New(),
			SupabaseUserID: supabaseUser.ID,
			Email:          supabaseUser.Email,
			Name:           name,
			AvatarURL:      avatarURL,
			LastLoginAt:    time.Now().UTC(),
		}
		if err := s.userRepo.Create(user); err != nil {
			return nil, fmt.Errorf("creating user: %w", err)
		}
	} else {
		user.LastLoginAt = time.Now().UTC()
		user.Name = name
		user.Email = supabaseUser.Email
		user.AvatarURL = avatarURL
		if err := s.userRepo.Update(user); err != nil {
			return nil, fmt.Errorf("updating user: %w", err)
		}
	}

	token, err := s.generateJWT(user)
	if err != nil {
		return nil, fmt.Errorf("generating jwt: %w", err)
	}

	return &LoginResult{
		Token: token,
		User:  user,
	}, nil
}

func (s *AuthService) GetUserByID(id string) (*models.User, error) {
	user, err := s.userRepo.FindBySupabaseUserID(id)
	if err != nil {
		return nil, fmt.Errorf("finding user: %w", err)
	}
	return user, nil
}

func (s *AuthService) generateJWT(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":   user.SupabaseUserID,
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().UTC().Add(24 * time.Hour).Unix(),
		"iat":   time.Now().UTC().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.cfg.JWTSecret))
}

func (s *AuthService) UpdateProfile(userID string, role string, seniority string) error {
	if err := s.userRepo.UpdateProfile(userID, role, seniority); err != nil {
		return fmt.Errorf("updating profile: %w", err)
	}
	return nil
}
