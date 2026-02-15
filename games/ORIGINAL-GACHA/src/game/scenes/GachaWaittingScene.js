import { BaseScene } from "./BaseScene.js";
import { GachaManager } from "../gacha/GachaManager.js";
import { UITheme } from "../ui/UITheme.js";

/**
 * ガチャ待機画面
 */
export class GachaWaittingScene extends BaseScene
{
    constructor() {
        super("GachaWaitting");
    }

    preload() {
        this.load.image("bgGradient", "assets/images/bgGradient.png"); // 背景画像
        this.load.image("gachaBtn", "assets/images/gacha_button.png"); // ガチャボタン画損
        this.load.audio("gachaClickSound", "assets/sounds/gacha_click_sound.mp3"); // ガチャボタンクリック音
    }

    build() {
        // 背景
        this.bg = this.add.image(0, 0, "bgGradient");
        // タイトル
        this.title = this.add.text(0, 0, "オリジナル10連ガチャ", UITheme.textStyles.title);
        
        // ガチャボタン
        this.gachaButtonScale = 180 / 900;
        this.gachaButton = this.add.image(0, 0, "gachaBtn")
            .setInteractive({ useHandCursor: true });

        this.gachaClickSound = this.sound.add("gachaClickSound");
        this.gachaButton.on("pointerdown", () => {
            // クリック音
            this.gachaClickSound.play();
            // ガチャ実施
            GachaManager.gacha();
            // ガチャ演出画面へ遷移
            this.scene.start("GachaPerform");
        });
        this.gachaButton.on("pointerover", () => this.gachaButton.setScale(this.gachaButtonScale * 1.05));
        this.gachaButton.on("pointerout", () => this.gachaButton.setScale(this.gachaButtonScale));
    }

    relayout() {
        const { width, height, cx, cy } = this.layout.getSize();

        // 背景（位置, サイズ）
        this.bg
            .setPosition(cx, cy)
            .setDisplaySize(width, height);

        // タイトル（位置, サイズ）
        this.title
            .setPosition(cx, height * 0.28)
            .setFontSize(this.layout.getFontSize())
            .setOrigin(0.5);

        // ガチャボタン（位置, サイズ）
        this.gachaButton
            .setPosition(cx, height * 0.65)
            .setScale(this.gachaButtonScale);
    }

    setMotion() {
        if (!GachaManager.canGacha()) {
            // 有効なレアリティと画像が設定されていない場合、ボタンを非活性化
            this.gachaButton.setAlpha(0.5);
            this.gachaButton.disableInteractive();
        }
        
        // ガチャボタン（モーション）
        this.tweens.add({
            targets: this.gachaButton,
            scale: { from: this.gachaButtonScale * 0.95, to: this.gachaButtonScale * 1.05 },
            duration: 1200,
            yoyo: true,
            repeat: -1
        });
    }
}
