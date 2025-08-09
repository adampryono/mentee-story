package models

import (
    "log"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
)

func SeedData(db *gorm.DB) {
    // Check if data already exists
    var userCount int64
    db.Model(&User{}).Count(&userCount)
    if userCount > 0 {
        return
    }
    
    // Hash password
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
    
    // Create admin
    admin := User{
        Name:     "Admin",
        Email:    "admin@mentee.com",
        Password: string(hashedPassword),
        Role:     "admin",
    }
    db.Create(&admin)
    
    // Create mentors
    mentor1 := User{
        Name:     "Mentor 1",
        Email:    "mentor1@mentee.com",
        Password: string(hashedPassword),
        Role:     "mentor",
    }
    db.Create(&mentor1)
    
    // Create mentees
    mentees := []Mentee{
        {Name: "Mentee 1", MentorID: mentor1.ID},
        {Name: "Mentee 2", MentorID: mentor1.ID},
        {Name: "Mentee 3", MentorID: mentor1.ID},
    }
    db.Create(&mentees)
    
    // Create topics
    topics := []Topic{
        {Title: "Matematika Dasar", Description: "Pembelajaran matematika tingkat dasar"},
        {Title: "Bahasa Indonesia", Description: "Pembelajaran bahasa Indonesia"},
        {Title: "IPA", Description: "Ilmu Pengetahuan Alam"},
        {Title: "Bahasa Inggris", Description: "English learning"},
    }
    db.Create(&topics)
    
    log.Println("Seed data created successfully")
}
