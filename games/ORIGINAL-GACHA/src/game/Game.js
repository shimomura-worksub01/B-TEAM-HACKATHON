import { GachaPerformScene } from "./scenes/GachaPerformScene.js";
import { GachaResultScene } from "./scenes/GachaResultScene.js";
import { GachaWaittingScene } from "./scenes/GachaWaittingScene.js";

export class GameApp extends Phaser.Game {
    constructor() 
    {
        // スマホ表示時のみ論理サイズを固定して安定化（ブラウザ表示は従来どおり）
        const isMobile = window.innerWidth <= 768;
        const isLandscape = window.innerWidth > window.innerHeight;
        const gameWidth  = isLandscape ? 1280 : 720;
        const gameHeight = isLandscape ? 720 : 1280;

        super({
            type: Phaser.AUTO,
            backgroundColor: "#000000",
            scale: isMobile
                ? {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: gameWidth,
                    height: gameHeight,
                }
                : {
                    mode: Phaser.Scale.RESIZE,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
            parent: "game-container",
            scene: [
                // 使用シーン（表示遷移順）
                GachaWaittingScene,
                GachaPerformScene,
                GachaResultScene,
            ]
        });
    }
}
