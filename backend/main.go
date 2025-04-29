package main

import (
	"wakeonlan/handler"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/api/devices/list", handler.DeviceList)
	router.POST("/api/devices/add", handler.AddDevice)
	router.DELETE("/api/devices/delete/:name", handler.Delete)
	router.POST("/api/wake", handler.WakeOnLan)
	router.Run(":8008")
}