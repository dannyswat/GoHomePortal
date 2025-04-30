package userscript

import "time"

type UserScript struct {
	UniqueID    string    `json:"uniqueId"`
	Title       string    `json:"title"`
	Script      string    `json:"script"`
	InputSchema string    `json:"inputSchema"`
	CreatedBy   string    `json:"createdBy"`
	CreatedAt   time.Time `json:"createdAt"`
}
