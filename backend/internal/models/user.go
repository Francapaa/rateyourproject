package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID             uuid.UUID      `json:"id" gorm:"type:uuid;primary_key"`
	SupabaseUserID string         `json:"-" gorm:"uniqueIndex;not null"`
	Email          string         `json:"email" gorm:"uniqueIndex;not null"`
	Name           string         `json:"name"`
	AvatarURL      string         `json:"avatar_url"`
	Role           string         `json:"role"`
	Seniority      string         `json:"seniority"`
	IsPremium      bool           `json:"is_premium" gorm:"default:false"`
	LastLoginAt    time.Time      `json:"last_login_at"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
