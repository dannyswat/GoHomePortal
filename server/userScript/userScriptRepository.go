package userscript

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type UserScriptRepository interface {
	Init() error
	SaveUserScript(script *UserScript) error
	GetUserScript(user, uniqueID string) (*UserScript, error)
	GetAllUserScripts(user string) ([]*UserScript, error)
	DeleteUserScript(user, uniqueID string) error
}

type FileSystemUserScriptRepository struct {
	BasePath string
}

func (repo *FileSystemUserScriptRepository) Init() error {
	if repo.BasePath == "" {
		return nil
	}
	anonymousPath := filepath.FromSlash(repo.BasePath + "/anonymous")
	err := os.MkdirAll(anonymousPath, 0755)
	if err != nil {
		return err
	}
	return nil
}

func (repo *FileSystemUserScriptRepository) SaveUserScript(script *UserScript) error {
	jsonContent, err := json.Marshal(script)
	if err != nil {
		return err
	}
	fullPath := getFullPathByScript(repo.BasePath, script)
	err = os.MkdirAll(filepath.Dir(fullPath), 0755)
	if err != nil {
		return err
	}
	return os.WriteFile(fullPath, jsonContent, 0644)
}

func (repo *FileSystemUserScriptRepository) GetUserScript(user, uniqueID string) (*UserScript, error) {
	fullPath := getFullPath(repo.BasePath, user, uniqueID)
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		return nil, err
	}
	fileContent, err := os.ReadFile(fullPath)
	if err != nil {
		return nil, err
	}
	var script UserScript
	err = json.Unmarshal(fileContent, &script)
	if err != nil {
		return nil, err
	}
	return &script, nil
}

func (repo *FileSystemUserScriptRepository) GetAllUserScripts(user string) ([]*UserScript, error) {
	fullPath := filepath.FromSlash(repo.BasePath + "/" + user)
	files, err := os.ReadDir(fullPath)
	if err != nil {
		return nil, err
	}
	scripts := make([]*UserScript, 0, len(files))
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		filePath := filepath.Join(fullPath, file.Name())
		fileContent, err := os.ReadFile(filePath)
		if err != nil {
			return nil, err
		}
		var script UserScript
		err = json.Unmarshal(fileContent, &script)
		if err != nil {
			return nil, err
		}
		scripts = append(scripts, &script)
	}
	return scripts, nil
}

func (repo *FileSystemUserScriptRepository) DeleteUserScript(user, uniqueID string) error {
	fullPath := getFullPath(repo.BasePath, user, uniqueID)
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		return nil
	}
	return os.Remove(fullPath)
}

func getFullPathByScript(basePath string, script *UserScript) string {
	return filepath.FromSlash(basePath + "/" + script.CreatedBy + "/" + script.UniqueID + ".json")
}

func getFullPath(basePath string, user string, uniqueID string) string {
	return filepath.FromSlash(basePath + "/" + user + "/" + uniqueID + ".json")
}
