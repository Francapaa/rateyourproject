package conversation

import (
	"fmt"
	"strings"

	"github.com/franc/rateyourproject/internal/models"
	"github.com/franc/rateyourproject/internal/services"
	"github.com/franc/rateyourproject/internal/utils"
	"github.com/gin-gonic/gin"
)

type ConversationHandler struct {
	conversationService *services.ConversationService
}

func NewConversationHandler(conversationService *services.ConversationService) *ConversationHandler {
	return &ConversationHandler{
		conversationService: conversationService,
	}
}

func (h *ConversationHandler) HandleGetRecentConversations(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not found in context")
		return
	}

	conversations, err := h.conversationService.GetRecentConversations(userID.(string), 5)
	if err != nil {
		utils.InternalError(c, "failed to fetch conversations")
		return
	}

	if conversations == nil {
		conversations = []models.Conversation{}
	}

	utils.Success(c, conversations)
}

func (h *ConversationHandler) HandleCreateConversation(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Unauthorized(c, "user not found in context")
		fmt.Println("USUARIO NO AUTORIZADO")
		return
	}

	conversation, err := h.conversationService.CreateConversation(userID.(string))
	if err != nil {
		if strings.Contains(err.Error(), "limit reached") {
			utils.Error(c, 400, "has reached the maximum of 2 conversations")
			fmt.Println("HAZ ALCANZADO EL MAXIMO NUMERO DE ")
			return
		}
		utils.InternalError(c, "failed to create conversation")
		return
	}

	utils.Success(c, conversation)
}
