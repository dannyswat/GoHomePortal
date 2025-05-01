package api

import (
	"github.com/dannyswat/gohomeportal/server/auth" // Import auth package

	"github.com/labstack/echo/v4"
)

// GetUserClaimsFromContext retrieves the raw user claims value from the Echo context.
// It returns an interface{} to avoid api depending on the concrete auth.CustomClaims type.
func GetUserClaimsFromContext(c echo.Context) (interface{}, bool) {
	user := c.Get(auth.UserContextKey) // Use UserContextKey from auth package
	return user, user != nil
}

// GetUserNameFromContext retrieves the username from the Echo context.
// If the user is not logged in or claims are invalid, it returns "anonymous".
func GetUserNameFromContext(c echo.Context) string {
	claimsData, ok := GetUserClaimsFromContext(c)
	if !ok {
		return "anonymous"
	}
	// Type assertion happens here, keeping the dependency on auth.CustomClaims localized.
	claims, ok := claimsData.(*auth.CustomClaims)
	if !ok || claims == nil {
		// Log error if type assertion fails unexpectedly?
		// c.Logger().Warnf("GetUserClaimsFromContext returned non-nil value of unexpected type: %T", claimsData)
		return "anonymous"
	}
	return claims.Username
}
