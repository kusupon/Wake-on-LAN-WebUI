package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"wakeonlan/model"

	"github.com/gin-gonic/gin"
)

func Delete(c *gin.Context) {
	name := c.Param("name")

	data, _ := os.ReadFile("./devices.json")
	var deviceList []model.Device
	if err := json.Unmarshal(data, &deviceList); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "JSONのデコードに失敗しました",
		})
		return
	}

	var newList []model.Device

	for _, d := range deviceList {
		if d.Name != name {
			newList = append(newList, d)
		}
	}

	out, err := json.MarshalIndent(newList, "", " ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "JSONエンコードに失敗しました",
		})
		return
	}

	// devices.jsonを上書き
	if err := os.WriteFile("./devices.json", out, 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "ファイルの書き込みに失敗しました",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Device deleted successfully!",
	})
}