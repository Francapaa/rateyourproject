package repository

import (
	"fmt"

	"github.com/franc/rateyourproject/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *models.User) error
	FindBySupabaseUserID(supabaseUserID string) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
	FindByID(id string) (*models.User, error)
	Update(user *models.User) error
	UpdateProfile(supabaseUserID string, role string, seniority string) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) FindBySupabaseUserID(supabaseUserID string) (*models.User, error) {
	var user models.User
	supabaseUserIDUUID := uuid.MustParse(supabaseUserID)
	err := r.db.Where("supabase_user_id = ?", supabaseUserIDUUID).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("finding user by supabase id %s: %w", supabaseUserID, err)
	}
	return &user, nil
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("finding user by email %s: %w", email, err)
	}
	return &user, nil
}

func (r *userRepository) FindByID(id string) (*models.User, error) {
	var user models.User
	err := r.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("finding user by id %s: %w", id, err)
	}
	return &user, nil
}

func (r *userRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) UpdateProfile(supabaseUserID string, role string, seniority string) error {
	return r.db.Model(&models.User{}).Where("supabase_user_id = ?", supabaseUserID).Updates(map[string]interface{}{
		"role":      role,
		"seniority": seniority,
	}).Error
}
