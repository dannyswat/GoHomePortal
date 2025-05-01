package ports

// UserRepository defines the interface for user data operations.
// It's placed in a separate 'ports' package to avoid import cycles.
type UserRepository interface {
	Init() error
	CreateUser(username, password string) error
	ValidatePassword(username, password string) (bool, error)
	ChangePassword(username, oldPassword, newPassword string) error
	// Consider adding GetUser(username string) (*UserData, error) if needed elsewhere
	// Note: If GetUser is added, the return type might need to be defined
	// in 'ports' as well, or use a more generic map/struct if UserData
	// remains in the 'user' package to avoid pulling 'user' into 'ports'.
}
