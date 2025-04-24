package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/api/devices/list", deviceList)
	router.POST("/api/devices/add", addDevice)
	router.Run(":8008")
}