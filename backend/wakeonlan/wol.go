package wakeonlan

import (
	"net"
	"time"
)

func Wol(macAdrr string) error {
	// 取得したmacアドレスをバイナリに変換
	hw, err := net.ParseMAC(macAdrr)
	if err != nil {
		return err
	}
	// マジックパケットの作成(まず先頭6バイトを0xFFで埋める)
	packet := make([]byte, 6+16*len(hw))
	for i := 0; i < 6; i++ {
		packet[i] = 0xFF
	}

	// 次にMacアドレスを16回連結する
	for i := 0; i < 16; i++ {
		copy(packet[6+i*len(hw):], hw)
	}

	//UDP ブロードキャスト (ポート 9) 
	conn, err := net.DialUDP("udp", nil, &net.UDPAddr{
		IP: net.IPv4bcast,
		Port: 9,
	})

	if err != nil {
		return err
	}
	defer conn.Close()

	// タイムアウトを2秒に設定して送信！
	conn.SetWriteDeadline(time.Now().Add(2 * time.Second))
	if _, err := conn.Write(packet); err != nil {
		return err
	}
	return nil
}