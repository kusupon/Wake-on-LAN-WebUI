package handler

import (
	"net/http"
	"os"
	"github.com/gin-gonic/gin"
)

func DeviceList(c *gin.Context) {
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
