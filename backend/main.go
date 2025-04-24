package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/api/test", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "test" ,
		})
	})
	router.Run(":8008")
}