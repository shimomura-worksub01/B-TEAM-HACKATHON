# Standalone (CDN) Build

`standalone/` は Node.js や `node_modules` なしで動く最小構成です。

## Files

- `index.html`
- `game.js`
- `assets/` (`self.png`, `enemy.png`, `enemy2.png`, `enemy3.png`)

## Run

ブラウザで `file://` 直開きだと環境によってはアセット読込が失敗するため、ローカル HTTP サーバーで実行してください。

```powershell
cd c:\phaser-work\my-phaser-game\standalone
python -m http.server 8080
```

その後 `http://localhost:8080` を開きます。
