package auth

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// UserContextKey is the key used to store user claims in the Echo context.
const UserContextKey = "user"

// AuthMiddleware creates an Echo middleware function to validate JWT tokens.
func AuthMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Authorization header required"})
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid Authorization header format (Bearer token required)"})
			}

			tokenString := parts[1]
			claims, err := ValidateToken(tokenString)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid or expired token"})
			}

			// Token is valid, add user info (claims) to the Echo context
			c.Set(UserContextKey, claims) // Use local UserContextKey
			return next(c)
		}
	}
}
