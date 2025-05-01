package auth

import (
	"net/http"

	"fmt"

	"github.com/dannyswat/gohomeportal/server/ports" // Import ports package
	"github.com/labstack/echo/v4"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken string `json:"accessToken"`
}

// LoginHandler creates an Echo handler function for user login.
func LoginHandler(userRepo ports.UserRepository) echo.HandlerFunc { // Use ports.UserRepository
	return func(c echo.Context) error {
		var req LoginRequest
		if err := c.Bind(&req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}

		if req.Username == "" || req.Password == "" {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Username and password are required"})
		}

		// Validate password using the repository
		valid, err := userRepo.ValidatePassword(req.Username, req.Password)
		if err != nil {
			// Log the internal error for debugging, but return a generic message
			fmt.Printf("Error validating password for user %s: %v\n", req.Username, err)
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid username or password"})
		}

		if !valid {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid username or password"})
		}

		// Generate JWT token
		tokenString, err := GenerateToken(req.Username)
		if err != nil {
			// Log the internal error
			fmt.Printf("Error generating token for user %s: %v\n", req.Username, err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to generate token"})
		}

		// Send successful response with token
		return c.JSON(http.StatusOK, LoginResponse{AccessToken: tokenString})
	}
}
