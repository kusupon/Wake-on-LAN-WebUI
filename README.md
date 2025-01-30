# Wake on LAN WebUI
![Image](https://github.com/user-attachments/assets/9c780323-2e9f-456d-871c-e66063445141)
ブラウザから気軽にWOLすることが出来るwebアプリです


## 環境構築
⚠️自宅にあるサーバーやラズパイ等にホスティングすることを想定しています

Node.jsとPM2が必要です
```
# リポジトリのクローン
$ git clone https://github.com/kusupon/Wake-on-LAN-WebUI.git
$ cd Wake-on-LAN-WebUI

# インストールとビルド
$ npm install
$ npm run build

# サーバー起動
$ pm2 start npm --name "wol-webui" -- start
```
http://(サーバーのip):3005 でアクセス出来ます。

外出先からアクセスする場合はTailscale等を使用してください

## devices.json
```
[
  {
    "name": "PC-1", 
    "macAddress": "xx:xx:xx:xx:xx:xx"
  },
  {
    "name": "PC-2",
    "macAddress": "xx:xx:xx:xx:xx:xx"
  }
]
```