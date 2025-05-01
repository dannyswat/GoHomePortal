package api

import (
	"encoding/json"
	"net/http"
)

// MessageResponse defines a standard structure for simple JSON responses.
type MessageResponse struct {
	Message string `json:"message"`
}

// SendJSONResponse sends a JSON response with a given message and status code.
func SendJSONResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(MessageResponse{Message: message})
}

// ErrorResponse defines a standard structure for JSON error responses.
type ErrorResponse struct {
	Error string `json:"error"`
}

// SendJSONError sends a JSON error response with a given message and status code.
func SendJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	// Best effort to encode the error. If this fails, there's not much more we can do.
	json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}
