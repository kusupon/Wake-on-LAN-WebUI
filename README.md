# Wake on LAN WebUI
![Image](https://private-user-images.githubusercontent.com/73230110/408211604-9c780323-2e9f-456d-871c-e66063445141.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mzg2NDY4ODUsIm5iZiI6MTczODY0NjU4NSwicGF0aCI6Ii83MzIzMDExMC80MDgyMTE2MDQtOWM3ODAzMjMtMmU5Zi00NTZkLTg3MWMtZTY2MDYzNDQ1MTQxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMDQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjA0VDA1MjMwNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTdmM2JmOWI2ZjY4OGI1ODdkNzI3YTRlZjI4MjViNDEwNTU1MWQ4ODY3ZDAwNzE3ZGM0MjU1ODZhNjE3MDIyMDUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.9x8an28E2mmEO9C3wEFsbYU1Z3hgPMDxB2n6RSXYuus)
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