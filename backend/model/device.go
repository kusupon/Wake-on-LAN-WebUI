package model

type Device struct {
	Name       string `json:"name"`
	MacAddress string `json:"macAddress"`
}

type WakeDevice struct {
	DeviceName string `json:"deviceName"`
}
