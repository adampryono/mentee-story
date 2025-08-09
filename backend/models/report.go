package models

import (
	"time"
)

type Report struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	MentorID      uint           `json:"mentor_id"`
	Mentor        User           `json:"mentor" gorm:"foreignKey:MentorID"`
	MenteeID      uint           `json:"mentee_id"`
	Mentee        Mentee         `json:"mentee" gorm:"foreignKey:MenteeID"`
	Week          int            `json:"week" gorm:"not null"`
	Status        string         `json:"status" gorm:"type:enum('draft','submitted');default:'draft'"`
	IsDraft       bool           `json:"is_draft" gorm:"default:true"`
	ReportDetails []ReportDetail `json:"report_details" gorm:"foreignKey:ReportID"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
}
