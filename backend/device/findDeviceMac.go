package device

import "wakeonlan/model"

func FindDeviceMac(devices []model.Device, name string) (*model.Device, bool) {
	for i := range devices {
		if devices[i].Name == name {
			return &devices[i], true
		}
	}
	return nil, false
}