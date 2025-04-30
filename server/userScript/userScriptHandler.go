package userscript

import (
	"time"

	"github.com/labstack/echo/v4"
)

type UserScriptHandler struct {
	Repo UserScriptRepository
}

func (h *UserScriptHandler) SaveUserScript(e echo.Context) error {
	script := new(UserScript)
	if err := e.Bind(script); err != nil {
		return err
	}
	script.CreatedBy = "anonymous"
	script.CreatedAt = time.Now()
	if err := h.Repo.SaveUserScript(script); err != nil {
		return err
	}
	return e.JSON(200, script)
}

func (h *UserScriptHandler) GetUserScript(e echo.Context) error {
	user := "anonymous"
	uniqueID := e.Param("id")
	script, err := h.Repo.GetUserScript(user, uniqueID)
	if err != nil {
		return err
	}
	return e.JSON(200, script)
}

func (h *UserScriptHandler) GetAllUserScripts(e echo.Context) error {
	user := "anonymous"
	scripts, err := h.Repo.GetAllUserScripts(user)
	if err != nil {
		return err
	}
	return e.JSON(200, scripts)
}

func (h *UserScriptHandler) DeleteUserScript(e echo.Context) error {
	user := "anonymous"
	uniqueID := e.Param("id")
	if err := h.Repo.DeleteUserScript(user, uniqueID); err != nil {
		return err
	}
	return e.NoContent(204)
}
