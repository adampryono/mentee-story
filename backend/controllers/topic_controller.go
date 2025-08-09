// Topic-related controllers for specific operations

package controllers

import (
	"mentee-story/config"
	"mentee-story/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetTopicsForMentor gets all topics for mentor use (simpler response)
func GetTopicsForMentor(c *gin.Context) {
	var topics []models.Topic

	db := config.GetDB()
	if err := db.Find(&topics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"topics": topics})
}
