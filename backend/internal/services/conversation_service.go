package services

import (
	"fmt"

	"github.com/franc/rateyourproject/internal/models"
	"github.com/franc/rateyourproject/internal/repository"
	"github.com/google/uuid"
)

const MaxConversationsPerUser = 2

type ConversationService struct {
	conversationRepo repository.ConversationRepository
}

func NewConversationService(conversationRepo repository.ConversationRepository) *ConversationService {
	return &ConversationService{
		conversationRepo: conversationRepo,
	}
}

func (s *ConversationService) GetRecentConversations(userID string, limit int) ([]models.Conversation, error) {
	conversations, err := s.conversationRepo.FindByUserID(userID, limit)
	if err != nil {
		return nil, fmt.Errorf("getting recent conversations: %w", err)
	}
	return conversations, nil
}

func (s *ConversationService) CreateConversation(userID string) (*models.Conversation, error) {
	count, err := s.conversationRepo.CountByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("counting conversations: %w", err)
	}

	if count >= MaxConversationsPerUser {
		return nil, fmt.Errorf("conversation limit reached: max %d conversations allowed", MaxConversationsPerUser)
	}

	conversation := &models.Conversation{
		ID:    uuid.New(),
		UserID: uuid.MustParse(userID),
		Title: "Nueva conversación",
	}

	if err := s.conversationRepo.Create(conversation); err != nil {
		return nil, fmt.Errorf("creating conversation: %w", err)
	}

	return conversation, nil
}
