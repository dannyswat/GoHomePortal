package main

import (
	"net/http" // Import net/http

	"github.com/dannyswat/gohomeportal/server/auth" // Import auth package
	"github.com/dannyswat/gohomeportal/server/hello"
	"github.com/dannyswat/gohomeportal/server/ports" // Import ports package
	"github.com/dannyswat/gohomeportal/server/user"  // Import user package
	userscript "github.com/dannyswat/gohomeportal/server/userScript"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS()) // Ensure CORS is configured appropriately for your frontend
	e.Use(middleware.Gzip())
	// Consider if middleware.Secure() defaults are appropriate or need configuration
	e.Use(middleware.Secure())

	// --- Repository Initialization ---
	// Ensure userRepo implements ports.UserRepository
	var userRepo ports.UserRepository = &user.FileSystemUserRepository{
		BasePath: "data/users", // Use the path defined in userRepository.go
	}
	if err := userRepo.Init(); err != nil {
		e.Logger.Fatalf("Failed to initialize user repository: %v", err)
	}

	userScriptRepo := &userscript.FileSystemUserScriptRepository{
		BasePath: "data/userScripts",
	}
	if err := userScriptRepo.Init(); err != nil {
		e.Logger.Fatalf("Failed to initialize user script repository: %v", err)
	}

	// --- Public Routes ---
	helloHandler := &hello.HelloHandler{}
	e.GET("/hello", helloHandler.HelloWorld)

	// Login route (does not require auth middleware)
	// Pass userRepo (which is ports.UserRepository) to LoginHandler
	e.POST("/api/login", auth.LoginHandler(userRepo))

	// --- API Group with Auth Middleware ---
	apiGroup := e.Group("/api")
	apiGroup.Use(auth.AuthMiddleware()) // Apply auth middleware to this group

	// User Script routes (now protected)
	userScriptHandler := &userscript.UserScriptHandler{
		Repo: userScriptRepo,
	}
	// Note: Adjust paths if needed (e.g., /api/userscript/:id)
	apiGroup.GET("/userscript/:id", userScriptHandler.GetUserScript)
	apiGroup.GET("/userscripts", userScriptHandler.GetAllUserScripts)
	apiGroup.POST("/userscript", userScriptHandler.SaveUserScript)
	apiGroup.DELETE("/userscript/:id", userScriptHandler.DeleteUserScript)

	// Add route for changing password (protected)
	// Pass userRepo (which is ports.UserRepository) to ChangePasswordHandler
	apiGroup.POST("/user/password", user.ChangePasswordHandler(userRepo))

	// --- Serve Static Files (React Frontend) ---
	// Serve static files from the client's dist directory
	e.Static("/", "../client/dist")

	// Catch-all for client-side routing (serves index.html)
	e.File("/*", "../client/dist/index.html")

	// --- Start Server ---
	e.Logger.Info("Starting server on :8080")
	if err := e.Start(":8080"); err != nil && err != http.ErrServerClosed {
		e.Logger.Fatal(err)
	}
}
