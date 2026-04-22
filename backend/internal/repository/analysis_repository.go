package repository

import (
	"fmt"

	"github.com/franc/rateyourproject/internal/models"
	"gorm.io/gorm"
)

type AnalysisRepository interface {
	Create(analysis *models.Analysis) error
	FindByConversationID(conversationID string) ([]models.Analysis, error)
	FindByID(id string) (*models.Analysis, error)
}

type analysisRepository struct {
	db *gorm.DB
}

func NewAnalysisRepository(db *gorm.DB) AnalysisRepository {
	return &analysisRepository{db: db}
}

func (r *analysisRepository) Create(analysis *models.Analysis) error {
	return r.db.Create(analysis).Error
}

func (r *analysisRepository) FindByConversationID(conversationID string) ([]models.Analysis, error) {
	var analyses []models.Analysis
	err := r.db.Where("conversation_id = ?", conversationID).Order("created_at DESC").Find(&analyses).Error
	if err != nil {
		return nil, fmt.Errorf("finding analyses for conversation %s: %w", conversationID, err)
	}
	return analyses, nil
}

func (r *analysisRepository) FindByID(id string) (*models.Analysis, error) {
	var analysis models.Analysis
	err := r.db.Where("id = ?", id).First(&analysis).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("finding analysis %s: %w", id, err)
	}
	return &analysis, nil
}