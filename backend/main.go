package main

import (
    "log"
    "mentee-story/config"
    "mentee-story/routes"
    "mentee-story/models"
)

func main() {
    // Initialize database
    config.InitDB()
    
    // Auto migrate models
    db := config.GetDB()
    err := db.AutoMigrate(
        &models.User{},
        &models.Mentee{},
        &models.Topic{},
        &models.Report{},
        &models.ReportDetail{},
    )
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }
    
    // Seed initial data
    models.SeedData(db)
    
    // Setup routes
    r := routes.SetupRouter()
    
    // Start server
    log.Println("Server starting on port 8080...")
    r.Run(":8080")
}
