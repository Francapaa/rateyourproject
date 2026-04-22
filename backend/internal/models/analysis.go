package models

import (
	"time"

	"github.com/google/uuid"
)

type Analysis struct {
	ID             uuid.UUID        `json:"id" gorm:"type:uuid;primary_key"`
	ConversationID uuid.UUID       `json:"conversation_id" gorm:"type:uuid;not null;index"`
	Title          string          `json:"title" gorm:"not null"`
	Dimensions     map[string]int  `json:"dimensions" gorm:"type:jsonb;serializer:json"`
	Improvements   []string        `json:"improvements" gorm:"type:jsonb;serializer:json"`
	CreatedAt      time.Time       `json:"created_at"`
}

func (a *Analysis) BeforeCreate(tx interface{}) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}