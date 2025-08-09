// Report-related controllers for specific operations

package controllers

import (
	"mentee-story/config"
	"mentee-story/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetReportsByMentor gets all reports for a mentor
func GetReportsByMentor(c *gin.Context) {
	mentorID := c.GetUint("userID")
	var reports []models.Report

	db := config.GetDB()
	if err := db.Where("mentor_id = ?", mentorID).
		Preload("Mentee").
		Preload("ReportDetails").
		Preload("ReportDetails.Topic").
		Find(&reports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reports": reports})
}

// UpdateReport updates a report
func UpdateReport(c *gin.Context) {
	reportID := c.Param("id")
	var report models.Report

	db := config.GetDB()
	if err := db.First(&report, reportID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
		return
	}

	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&report).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report updated successfully", "report": report})
}
