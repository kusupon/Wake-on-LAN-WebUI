package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"wakeonlan/device"
	"wakeonlan/model"
	"wakeonlan/wakeonlan"

	"github.com/gin-gonic/gin"
)

func WakeOnLan(c *gin.Context) {
	var wakeDevice model.WakeDevice
	if err := c.ShouldBindJSON(&wakeDevice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "JSONの解析に失敗しました",
		})
		return
	}

	data, _ := os.ReadFile("./devices.json")
	var list []model.Device
	json.Unmarshal(data, &list)

	device, ok := device.FindDevice(list, wakeDevice.DeviceName)
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
		"message": "Wake-on-LAN packet sent to  successfully.",
	})
}
