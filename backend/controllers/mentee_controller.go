// Mentee-related controllers for specific mentor operations

package controllers

import (
	"mentee-story/config"
	"mentee-story/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetMenteesByMentor gets all mentees for a specific mentor
func GetMenteesByMentor(c *gin.Context) {
	mentorID := c.GetUint("userID")
	var mentees []models.Mentee

	db := config.GetDB()
	if err := db.Where("mentor_id = ?", mentorID).Find(&mentees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch mentees"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mentees": mentees})
}

