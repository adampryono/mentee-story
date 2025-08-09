package models

// ReportDetail represents a report detail for each topic
type ReportDetail struct {
	ID             uint   `json:"id" gorm:"primaryKey"`
	ReportID       uint   `json:"report_id"`
	Report         Report `json:"report" gorm:"foreignKey:ReportID"`
	TopicID        uint   `json:"topic_id"`
	Topic          Topic  `json:"topic" gorm:"foreignKey:TopicID"`
	Challenge      string `json:"challenge" gorm:"type:text"`
	ProgressStatus string `json:"progress_status" gorm:"type:enum('on_track','need_attention','behind');default:'on_track'"`
}
