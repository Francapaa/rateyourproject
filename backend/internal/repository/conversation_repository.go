package repository

import (
	"fmt"

	"github.com/franc/rateyourproject/internal/models"
	"gorm.io/gorm"
)

type ConversationRepository interface {
	FindByUserID(userID string, limit int) ([]models.Conversation, error)
	FindByID(id string) (*models.Conversation, error)
	CountByUserID(userID string) (int64, error)
	Create(conversation *models.Conversation) error
	Update(conversation *models.Conversation) error
	Delete(id string) error
}

type conversationRepository struct {
	db *gorm.DB
}

func NewConversationRepository(db *gorm.DB) ConversationRepository {
	return &conversationRepository{db: db}
}

func (r *conversationRepository) FindByUserID(userID string, limit int) ([]models.Conversation, error) {
	var conversations []models.Conversation
	err := r.db.
		Where("user_id = ?", userID).
		Order("updated_at DESC").
		Limit(limit).
		Find(&conversations).Error
	if err != nil {
		return nil, fmt.Errorf("finding conversations for user %s: %w", userID, err)
	}
	return conversations, nil
}

func (r *conversationRepository) CountByUserID(userID string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Conversation{}).Where("user_id = ?", userID).Count(&count).Error
	if err != nil { // count the quantity of conversations by userID (COUNT)
		return 0, fmt.Errorf("counting conversations for user %s: %w", userID, err)
	}
	return count, nil
}

func (r *conversationRepository) FindByID(id string) (*models.Conversation, error) {
	var conversation models.Conversation
	err := r.db.Where("id = ?", id).First(&conversation).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("finding conversation %s: %w", id, err)
	}
	return &conversation, nil
}

func (r *conversationRepository) Create(conversation *models.Conversation) error {
	return r.db.Create(conversation).Error
}

func (r *conversationRepository) Update(conversation *models.Conversation) error {
	return r.db.Save(conversation).Error
}

func (r *conversationRepository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&models.Conversation{}).Error
}
