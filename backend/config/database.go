package config

import (
    "log"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

var db *gorm.DB

func InitDB() {
    dsn := "root:@tcp(127.0.0.1:3306)/mentee_story?charset=utf8mb4&parseTime=True&loc=Local"
    var err error
    db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    log.Println("Database connected successfully")
}

func GetDB() *gorm.DB {
    return db
}
