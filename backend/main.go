package main

import (
	"wakeonlan/handler"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/api/devices", handler.DeviceList)
	router.POST("/api/devices", handler.AddDevice)
	router.DELETE("/api/devices/:name", handler.Delete)
	router.POST("/api/devices/:name/wake", handler.WakeOnLan)
	router.Run(":8008")
}