package models

import (
	"time"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Password  string    `json:"password,omitempty" gorm:"not null"`
	Role      string    `json:"role" gorm:"type:enum('admin','mentor');default:'mentor'"`
	Mentees   []Mentee  `json:"mentees,omitempty" gorm:"foreignKey:MentorID"`
	Reports   []Report  `json:"reports,omitempty" gorm:"foreignKey:MentorID"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
