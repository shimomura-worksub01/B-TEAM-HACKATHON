import { GachaPerformScene } from "./scenes/GachaPerformScene.js";
import { GachaResultScene } from "./scenes/GachaResultScene.js";
import { GachaWaittingScene } from "./scenes/GachaWaittingScene.js";

export class GameApp extends Phaser.Game {
    constructor() 
    {
        super({
            type: Phaser.AUTO,
            backgroundColor: "#000000",
            scale: {
                // フルスクリーン対応
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
