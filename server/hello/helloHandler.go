package hello

import (
	"github.com/dannyswat/gohomeportal/server/api"
	"github.com/labstack/echo/v4"
)

type HelloHandler struct {
}

func (h *HelloHandler) HelloWorld(e echo.Context) error {
	return e.JSON(200, api.MessageResponse{Message: "Hello, World!"})
}
