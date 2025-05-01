package user

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/dannyswat/gohomeportal/server/ports" // Import ports package
	"golang.org/x/crypto/argon2"
)

// UserData holds the stored user information including the hashed password and salt.
type UserData struct {
	Username     string `json:"username"`
	PasswordHash string `json:"passwordHash"`
	Salt         string `json:"salt"`
}

// FileSystemUserRepository implements ports.UserRepository using the file system.
var _ ports.UserRepository = (*FileSystemUserRepository)(nil) // Compile-time check

type FileSystemUserRepository struct {
	BasePath string
}

// Argon2id parameters - adjust these as needed for your security requirements
const (
	argonTime    = 1
	argonMemory  = 64 * 1024 // 64MB
	argonThreads = 4
	saltLength   = 16
	keyLength    = 32
)

// Init creates the base directory for storing user data if it doesn't exist.
func (repo *FileSystemUserRepository) Init() error {
	if repo.BasePath == "" {
		repo.BasePath = "data/users" // Default path if not set
	}
	err := os.MkdirAll(repo.BasePath, 0750) // Use 0750 for better security
	if err != nil {
		return fmt.Errorf("failed to create user data directory %s: %w", repo.BasePath, err)
	}

	// Create admin user if it does not exist
	adminUsername := "admin"
	adminPassword := "PleaseChange"
	if _, err := os.Stat(repo.getUserFilePath(adminUsername)); os.IsNotExist(err) {
		err = repo.CreateUser(adminUsername, adminPassword)
		if err != nil {
			return fmt.Errorf("failed to create admin user: %w", err)
		}
	}

	return nil
}

// CreateUser creates a new user, hashes their password, and saves it.
func (repo *FileSystemUserRepository) CreateUser(username, password string) error {
	userPath := repo.getUserFilePath(username)

	// Check if user already exists
	if _, err := os.Stat(userPath); !os.IsNotExist(err) {
		return errors.New("user already exists")
	}

	salt, err := generateSalt(saltLength)
	if err != nil {
		return fmt.Errorf("failed to generate salt: %w", err)
	}

	hash := hashPassword(password, salt)

	userData := UserData{
		Username:     username,
		PasswordHash: base64.RawStdEncoding.EncodeToString(hash),
		Salt:         base64.RawStdEncoding.EncodeToString(salt),
	}

	jsonData, err := json.MarshalIndent(userData, "", "  ") // Use MarshalIndent for readability
	if err != nil {
		return fmt.Errorf("failed to marshal user data: %w", err)
	}

	err = os.WriteFile(userPath, jsonData, 0600) // Use 0600 for file permissions
	if err != nil {
		return fmt.Errorf("failed to write user file: %w", err)
	}

	return nil
}

// ValidatePassword checks if the provided password matches the stored hash for the user.
func (repo *FileSystemUserRepository) ValidatePassword(username, password string) (bool, error) {
	userData, err := repo.readUserData(username)
	if err != nil {
		if os.IsNotExist(err) {
			return false, errors.New("user not found")
		}
		return false, err // Return the original error for other issues
	}

	salt, err := base64.RawStdEncoding.DecodeString(userData.Salt)
	if err != nil {
		return false, fmt.Errorf("failed to decode salt for user %s: %w", username, err)
	}

	storedHash, err := base64.RawStdEncoding.DecodeString(userData.PasswordHash)
	if err != nil {
		return false, fmt.Errorf("failed to decode hash for user %s: %w", username, err)
	}

	hash := hashPassword(password, salt)

	// Constant-time comparison is important for security, but Argon2id output length is fixed.
	// A simple comparison is generally acceptable here. For utmost security, use subtle.ConstantTimeCompare.
	if string(hash) == string(storedHash) {
		return true, nil
	}

	return false, nil // Password mismatch
}

// ChangePassword validates the old password and updates it to the new password.
func (repo *FileSystemUserRepository) ChangePassword(username, oldPassword, newPassword string) error {
	valid, err := repo.ValidatePassword(username, oldPassword)
	if err != nil {
		return err // Propagate errors from ValidatePassword (e.g., user not found)
	}
	if !valid {
		return errors.New("invalid old password")
	}

	// Generate new salt and hash for the new password
	newSalt, err := generateSalt(saltLength)
	if err != nil {
		return fmt.Errorf("failed to generate new salt: %w", err)
	}
	newHash := hashPassword(newPassword, newSalt)

	// Read existing data to update (or create new UserData struct)
	userData, err := repo.readUserData(username) // Reuse readUserData
	if err != nil {
		return err // Should not happen if ValidatePassword succeeded, but check anyway
	}

	// Update fields
	userData.PasswordHash = base64.RawStdEncoding.EncodeToString(newHash)
	userData.Salt = base64.RawStdEncoding.EncodeToString(newSalt)

	// Marshal and write back to file
	jsonData, err := json.MarshalIndent(userData, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated user data: %w", err)
	}

	userPath := repo.getUserFilePath(username)
	err = os.WriteFile(userPath, jsonData, 0600) // Overwrite with new data
	if err != nil {
		return fmt.Errorf("failed to write updated user file: %w", err)
	}

	return nil
}

// --- Helper Functions ---

func (repo *FileSystemUserRepository) getUserFilePath(username string) string {
	// Basic sanitization: replace potentially problematic characters.
	// A more robust solution might involve stricter validation or encoding.
	safeUsername := filepath.Base(username) // Avoid directory traversal
	return filepath.Join(repo.BasePath, safeUsername+".json")
}

func (repo *FileSystemUserRepository) readUserData(username string) (*UserData, error) {
	userPath := repo.getUserFilePath(username)
	fileContent, err := os.ReadFile(userPath)
	if err != nil {
		return nil, err // Return error directly (includes os.IsNotExist)
	}

	var userData UserData
	err = json.Unmarshal(fileContent, &userData)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal user data for %s: %w", username, err)
	}
	return &userData, nil
}

func generateSalt(length uint32) ([]byte, error) {
	salt := make([]byte, length)
	_, err := rand.Read(salt)
	if err != nil {
		return nil, err
	}
	return salt, nil
}

func hashPassword(password string, salt []byte) []byte {
	return argon2.IDKey([]byte(password), salt, argonTime, argonMemory, argonThreads, keyLength)
}
