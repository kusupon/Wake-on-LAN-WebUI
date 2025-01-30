# Wake on LAN WebUI

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

# 念の為動くか確認
$ npm run start

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