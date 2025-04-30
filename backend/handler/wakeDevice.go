package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"wakeonlan/model"
	"wakeonlan/wakeonlan"
	"wakeonlan/device"

	"github.com/gin-gonic/gin"
)

func WakeOnLan(c *gin.Context) {
	deviceName := c.Param("name")

	data, err := os.ReadFile("./devices.json")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "デバイスリストの読み込みに失敗しました。",
		})
		return
	}

	var list []model.Device
	json.Unmarshal(data, &list)

	device, ok := device.FindDeviceMac(list, deviceName)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "デバイスが見つかりません",
		})
		return
	}

	if err := wakeonlan.Wol(device.MacAddress); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to send Wake-on-LAN packet.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Wake-on-LAN packet sent to \"" + deviceName + "\" successfully.", 
	})
}