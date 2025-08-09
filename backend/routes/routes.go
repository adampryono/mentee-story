package routes

import (
    "mentee-story/controllers"
    "mentee-story/middleware"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()
    
    // CORS configuration
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:5173", "http://localhost:5174"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
    r.Use(cors.New(config))
    
    // Public routes
    r.POST("/api/login", controllers.Login)
    
    // Protected routes
    protected := r.Group("/api")
    protected.Use(middleware.AuthMiddleware())
    {
        // Common routes
        protected.GET("/me", controllers.GetCurrentUser)
        protected.GET("/topics", controllers.GetTopicsForMentor)
        
        // Mentor routes
        mentor := protected.Group("/mentor")
        {
            mentor.GET("/mentees", controllers.GetMentorMentees)
            mentor.POST("/reports", controllers.CreateReport)
            mentor.GET("/reports", controllers.GetMentorReports)
            mentor.GET("/reports/:id", controllers.GetReportDetail)
        }
        
        // Admin routes
        admin := protected.Group("/admin")
        admin.Use(middleware.AdminOnly())
        {
            admin.GET("/mentors", controllers.GetAllMentors)
            admin.POST("/mentors", controllers.CreateMentor)
            
            admin.GET("/mentees", controllers.GetAllMentees)
            admin.POST("/mentees", controllers.CreateMentee)
            
            admin.GET("/topics", controllers.GetAllTopics)
            admin.POST("/topics", controllers.CreateTopic)
            admin.PUT("/topics/:id", controllers.UpdateTopic)
            admin.DELETE("/topics/:id", controllers.DeleteTopic)
            
            admin.GET("/reports", controllers.GetAllReports)
        }
    }
    
    return r
}
