package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"wakeonlan/model"

	"github.com/gin-gonic/gin"
)

func AddDevice(c *gin.Context) {
	var newDevice model.Device

	// リクエストボディに含まれるJSONをnewDeviceにパース。構造が不正だったらエラーを返す
	if err := c.ShouldBindJSON(&newDevice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "JSONの解析に失敗しました",
		})
		return
	}

	data, err := os.ReadFile("./devices.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "データの読み込みに失敗しました",
		})
		return
	}
	var deviceList []model.Device
	// 受け取ったJSONを[]Device型に変換
	if err := json.Unmarshal(data, &deviceList); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "JSONのデコードに失敗しました",
		})
		return
	}

	// 新しいデバイスをdeviceListオブジェクトに追加
	deviceList = append(deviceList, newDevice)

	//JSONに変換して整形(json.MarshalIndent)
	out, err := json.MarshalIndent(deviceList, "", " ")
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
		"message": "Device added successfully!",
	})
}
