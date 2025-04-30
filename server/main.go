package main

import (
	"github.com/dannyswat/gohomeportal/server/hello"
	userscript "github.com/dannyswat/gohomeportal/server/userScript"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	e.Use(middleware.Gzip())
	e.Use(middleware.Secure())
	helloHandler := &hello.HelloHandler{}
	e.GET("/hello", helloHandler.HelloWorld)
	userScriptRepo := &userscript.FileSystemUserScriptRepository{
		BasePath: "./data/userScripts",
	}
	userScriptRepo.Init()
	userScriptHandler := &userscript.UserScriptHandler{
		Repo: userScriptRepo,
	}
	e.GET("/userscript/:id", userScriptHandler.GetUserScript)
	e.GET("/userscripts", userScriptHandler.GetAllUserScripts)
	e.POST("/userscript", userScriptHandler.SaveUserScript)
	e.DELETE("/userscript/:id", userScriptHandler.DeleteUserScript)

	e.GET("/", func(c echo.Context) error {
		return c.String(404, "")
	})
	e.Logger.Fatal(e.Start(":8080"))
}
