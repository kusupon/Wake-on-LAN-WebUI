package device

import "wakeonlan/model"

func FindDeviceMac(devices []model.Device, name string) (model.Device, bool) {
	for _, d := range devices {
			if d.Name == name {
					return d, true
			}
	}
	return model.Device{}, false
}