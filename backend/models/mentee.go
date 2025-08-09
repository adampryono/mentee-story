package models

import "time"

type Mentee struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"not null"`
	MentorID  uint      `json:"mentor_id"`
	Mentor    User      `json:"mentor" gorm:"foreignKey:MentorID"`
	Reports   []Report  `json:"reports,omitempty" gorm:"foreignKey:MenteeID"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

