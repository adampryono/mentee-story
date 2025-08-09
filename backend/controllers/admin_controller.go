package controllers

import (
    "net/http"
    "strconv"
    "mentee-story/config"
    "mentee-story/models"
    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
)

// Mentor CRUD
func GetAllMentors(c *gin.Context) {
    db := config.GetDB()
    var mentors []models.User
    
    if err := db.Where("role = ?", "mentor").Find(&mentors).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch mentors"})
        return
    }
    
    c.JSON(http.StatusOK, mentors)
}

func CreateMentor(c *gin.Context) {
    var req struct {
        Name     string `json:"name" binding:"required"`
        Email    string `json:"email" binding:"required"`
        Password string `json:"password" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    
    mentor := models.User{
        Name:     req.Name,
        Email:    req.Email,
        Password: string(hashedPassword),
        Role:     "mentor",
    }
    
    db := config.GetDB()
    if err := db.Create(&mentor).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create mentor"})
        return
    }
    
    c.JSON(http.StatusCreated, mentor)
}

// Mentee CRUD
func GetAllMentees(c *gin.Context) {
    db := config.GetDB()
    var mentees []models.Mentee
    
    if err := db.Preload("Mentor").Find(&mentees).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch mentees"})
        return
    }
    
    c.JSON(http.StatusOK, mentees)
}

func CreateMentee(c *gin.Context) {
    var req struct {
        Name     string `json:"name" binding:"required"`
        MentorID uint   `json:"mentor_id" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    mentee := models.Mentee{
        Name:     req.Name,
        MentorID: req.MentorID,
    }
    
    db := config.GetDB()
    if err := db.Create(&mentee).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create mentee"})
        return
    }
    
    c.JSON(http.StatusCreated, mentee)
}

// Topic CRUD
func GetAllTopics(c *gin.Context) {
    db := config.GetDB()
    var topics []models.Topic
    
    if err := db.Find(&topics).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics"})
        return
    }
    
    c.JSON(http.StatusOK, topics)
}

func CreateTopic(c *gin.Context) {
    var topic models.Topic
    
    if err := c.ShouldBindJSON(&topic); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    db := config.GetDB()
    if err := db.Create(&topic).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create topic"})
        return
    }
    
    c.JSON(http.StatusCreated, topic)
}

func UpdateTopic(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    db := config.GetDB()
    
    var topic models.Topic
    if err := db.First(&topic, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
        return
    }
    
    if err := c.ShouldBindJSON(&topic); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    if err := db.Save(&topic).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update topic"})
        return
    }
    
    c.JSON(http.StatusOK, topic)
}

func DeleteTopic(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    db := config.GetDB()
    
    if err := db.Delete(&models.Topic{}, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete topic"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "Topic deleted successfully"})
}

// Get all reports
func GetAllReports(c *gin.Context) {
    db := config.GetDB()
    var reports []models.Report
    
    if err := db.Preload("Mentor").Preload("Mentee").Preload("ReportDetails.Topic").Find(&reports).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
        return
    }
    
    c.JSON(http.StatusOK, reports)
}
