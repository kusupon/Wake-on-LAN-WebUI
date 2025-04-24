package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func deviceList(c *gin.Context) {
	// devices.jsonが存在するか確認する
	if _, err := os.Stat("devices.json"); os.IsNotExist(err) {
		// 無かったら作成する
		if err := os.WriteFile("devices.json", []byte("[]"), 0644); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "ファイル生成に失敗しました",
			})
			return
		}
	}
	//デバイスリストを読み込む
	data, err := os.ReadFile("./devices.json")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "デバイスリストの読み込みに失敗しました。",
		})
		return
	}
	// jsonをそのまま返却
	c.Data(http.StatusOK, "application/json", data)
}

func addDevice(c *gin.Context) {
	var newDevice Device

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
	var deviceList []Device
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
