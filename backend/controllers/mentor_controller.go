package controllers

import (
    "fmt"
    "net/http"
    "strconv"
    "mentee-story/config"
    "mentee-story/models"
    "github.com/gin-gonic/gin"
)

func GetMentorMentees(c *gin.Context) {
    mentorID := c.GetUint("user_id")
    db := config.GetDB()
    
    var mentees []models.Mentee
    if err := db.Where("mentor_id = ?", mentorID).Find(&mentees).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch mentees"})
        return
    }
    
    c.JSON(http.StatusOK, mentees)
}

func CreateReport(c *gin.Context) {
    mentorID := c.GetUint("user_id")
    
    var req struct {
        MenteeID      uint                   `json:"mentee_id" binding:"required"`
        Week          int                    `json:"week" binding:"required"`
        IsDraft       bool                   `json:"is_draft"`
        Status        string                 `json:"status"` // Optional field untuk kompatibilitas
        ReportDetails []models.ReportDetail  `json:"report_details"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    // Debug logging
    fmt.Printf("Received request: %+v\n", req)
    fmt.Printf("IsDraft: %v\n", req.IsDraft)
    fmt.Printf("Status from request: %s\n", req.Status)
    
    db := config.GetDB()
    
    // Verify mentee belongs to mentor
    var mentee models.Mentee
    if err := db.Where("id = ? AND mentor_id = ?", req.MenteeID, mentorID).First(&mentee).Error; err != nil {
        c.JSON(http.StatusForbidden, gin.H{"error": "Mentee not found or unauthorized"})
        return
    }
    
    // Determine status based on is_draft
    status := "draft"
    if !req.IsDraft {
        status = "submitted"
    }
    
    fmt.Printf("Calculated status: %s\n", status)
    
    // Create report
    report := models.Report{
        MentorID: mentorID,
        MenteeID: req.MenteeID,
        Week:     req.Week,
        IsDraft:  req.IsDraft,
        Status:   status,
    }
    
    fmt.Printf("Report before save: %+v\n", report)
    
    if err := db.Create(&report).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create report"})
        return
    }
    
    // Create report details with proper validation
    for _, detail := range req.ReportDetails {
        // Validate progress status
        validStatuses := []string{"on_track", "need_attention", "behind"}
        isValidStatus := false
        for _, validStatus := range validStatuses {
            if detail.ProgressStatus == validStatus {
                isValidStatus = true
                break
            }
        }
        
        // Set default if invalid
        if !isValidStatus {
            detail.ProgressStatus = "on_track"
        }
        
        detail.ReportID = report.ID
        if err := db.Create(&detail).Error; err != nil {
            // If detail creation fails, log but continue
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create report detail"})
            return
        }
    }
    
    // Reload report with relations to return complete data
    if err := db.Preload("Mentee").Preload("ReportDetails.Topic").First(&report, report.ID).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load created report"})
        return
    }
    
    c.JSON(http.StatusCreated, report)
}

func GetMentorReports(c *gin.Context) {
    mentorID := c.GetUint("user_id")
    db := config.GetDB()
    
    var reports []models.Report
    if err := db.Where("mentor_id = ?", mentorID).
        Preload("Mentee").
        Preload("ReportDetails.Topic").
        Find(&reports).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
        return
    }
    
    c.JSON(http.StatusOK, reports)
}

func GetReportDetail(c *gin.Context) {
    reportID, _ := strconv.Atoi(c.Param("id"))
    mentorID := c.GetUint("user_id")
    db := config.GetDB()
    
    var report models.Report
    if err := db.Where("id = ? AND mentor_id = ?", reportID, mentorID).
        Preload("Mentee").
        Preload("ReportDetails.Topic").
        First(&report).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
        return
    }
    
    c.JSON(http.StatusOK, report)
}
