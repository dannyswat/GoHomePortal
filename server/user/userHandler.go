package user

import (
	"net/http"

	"github.com/dannyswat/gohomeportal/server/api"   // Import api package
	"github.com/dannyswat/gohomeportal/server/ports" // Import ports package

	"github.com/labstack/echo/v4" // Import Echo
)

// ChangePasswordRequest defines the structure for the change password request body.
type ChangePasswordRequest struct {
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword"`
}

// ChangePasswordHandler creates an Echo handler function for changing a user's password.
func ChangePasswordHandler(userRepo ports.UserRepository) echo.HandlerFunc { // Use ports.UserRepository
	return func(c echo.Context) error { // Accept echo.Context, return error
		// 1. Get username from context (set by auth middleware)
		// Use the moved GetUserNameFromContext from the api package
		username := api.GetUserNameFromContext(c)
		if username == "anonymous" { // Check if user is authenticated
			// This case should ideally be prevented by the AuthMiddleware,
			// but it's good practice to double-check.
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "User not authenticated"})
		}

		// 2. Decode request body
		var req ChangePasswordRequest
		if err := c.Bind(&req); err != nil { // Use c.Bind()
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}

		// Basic validation
		if req.OldPassword == "" || req.NewPassword == "" {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Old and new passwords are required"})
		}
		if req.OldPassword == req.NewPassword {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "New password cannot be the same as the old password"})

		}
		// Add more robust password complexity checks if needed

		// 3. Call repository to change password
		err := userRepo.ChangePassword(username, req.OldPassword, req.NewPassword)
		if err != nil {
			// Handle specific errors from the repository
			if err.Error() == "invalid old password" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid old password"})
			} else if err.Error() == "user not found" { // Should ideally not happen if auth middleware works
				return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
			} else {
				// Log the detailed error server-side
				c.Logger().Errorf("Error changing password for user %s: %v", username, err)
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to change password"})
			}
		}

		// 4. Send success response
		return c.JSON(http.StatusOK, map[string]string{"message": "Password changed successfully"}) // Use c.JSON
	}
}
