import { BaseScene } from "./BaseScene.js";
import { GACHA_COUNT } from "../gacha/GachaTable.js";

/**
 * ガチャ演出画面
 */
export class GachaPerformScene extends BaseScene
{
    constructor() {
        super("GachaPerform");
    }

    preload() {
        this.load.image("magicRing", "assets/images/magicRing.png"); // リング画像
        this.load.image("coreAura", "assets/images/coreAura.png"); // 中心コア画像
        this.load.image("cardFrame", "assets/images/cardFrame.png"); // カード画像
        this.load.image("particle", "assets/images/particle.png"); // パーティクル画像
        this.load.image("skipBtn", "assets/images/skip_button.png"); // スキップボタン画像
        this.load.audio("skipClickSound", "assets/sounds/skip_click_sound.mp3"); // スキップクリック音
    }

    build() {
        // 背景
        this.bg = this.add.image(0, 0, "bgGradient");
        // リング
        this.bgRing = this.add.image(0, 0, "magicRing");
        // 中央コア
        this.core = this.add.image(0, 0, "coreAura");

        this.cards = [];
        this.frames = [];

        // ガチャ回数分のカード画像をセット
        for (let i = 0; i < GACHA_COUNT; i++) {
            const frame = this.add.image(0, 0, "cardFrame")
                .setScale(0.55)
                .setBlendMode(Phaser.BlendModes.ADD);
            
            const card = this.add.rectangle(0, 0, 80, 120, 0xffffff);

            this.cards.push(card);
            this.frames.push(frame);
        }

        // パーティクル
        this.particle = this.add.particles(0, 0, "particle", {
            speedY: { min: -60, max: -140 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            tint: [0xffffff, 0x99ddff],
            lifespan: 1000,
            frequency: 80,
            blendMode: Phaser.BlendModes.ADD
        });

        // スキップボタン
        this.skipButtonScale = 120 / 900;
        this.skipButton = this.add.image(0, 0, "skipBtn")
            .setInteractive({ useHandCursor: true });
        
        this.skipClickSound = this.sound.add("skipClickSound");
        this.skipButton.on("pointerdown", () => {
            // クリック音
            this.skipClickSound.play();
            // ガチャ結果画面へ遷移
            this.scene.start("GachaResult");
        });
        this.skipButton.on("pointerover", () => this.skipButton.setScale(this.skipButtonScale * 1.05));
        this.skipButton.on("pointerout", () => this.skipButton.setScale(this.skipButtonScale));
    }

    relayout() {
        const { width, height, cx, cy } = this.layout.getSize();

        // 背景（位置, サイズ）
        this.bg
            .setPosition(cx, cy)
            .setDisplaySize(width, height);

        // リング（位置, サイズ, 透過）
        this.bgRing
            .setPosition(cx, cy)
            .setScale(1.6)
            .setAlpha(0.25)
            .setBlendMode(Phaser.BlendModes.ADD);

        // 中央コア（位置, サイズ）
        this.core
            .setPosition(cx, cy)
            .setScale(0.9)
            .setBlendMode(Phaser.BlendModes.ADD);

        // カード（位置）
        for (let i = 0; i < GACHA_COUNT; i++) {
            const angle = Phaser.Math.DegToRad(i * 36);
            const x = cx + Math.cos(angle) * (width * 0.35);
            const y = cy + Math.sin(angle) * (height * 0.25);

            this.frames[i].setPosition(x, y);
            this.cards[i].setPosition(x, y);
        }

        // パーティクル（位置）
        this.particle
            .setPosition(cx, cy + 80);

        // スキップボタン（位置, サイズ）
        this.skipButton
            .setPosition(width * 0.83, height * 0.87)
            .setScale(this.skipButtonScale);
    }

    setMotion() {
        // フェードイン
        this.cameras.main.fadeIn(600, 0, 0, 0);

        // リング（モーション）
        this.tweens.add({
            targets: this.bgRing,
            angle: 360,
            duration: 90000,
            repeat: -1
        });

        // 中央コア（モーション）
        this.tweens.add({
            targets: this.core,
            scale: { from: 0.9, to: 1.15 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut"
        });

        // カード（モーション）
        for (let i = 0; i < GACHA_COUNT; i++) {
            this.tweens.add({
                targets: this.frames[i],
                alpha: { from: 0.4, to: 0.8 },
                duration: 1200 + i * 50,
                yoyo: true,
                repeat: -1
            });
        }

        // パーティクル（モーション）
        this.time.delayedCall(1400, () => {
            const { cx, cy } = this.layout.getSize();
            this.tweens.add({
                targets: [...this.cards, ...this.frames],
                x: cx,
                y: cy,
                scale: 0,
                angle: 720,
                duration: 1600,
                ease: "Power4",
                stagger: 60,
                onUpdate: () => {
                    this.particle.setPosition(cx, cy + 80);
                },
                onComplete: () => {
                    this.cameras.main.flash(450, 255, 255, 255);
                    this.cameras.main.shake(500, 0.025);
                    this.particle.explode(200, cx, cy);
                }
            });
        });

        // 時間経過後、ガチャ結果画面へ遷移
        this.time.delayedCall(7600, () => {
            this.scene.start("GachaResult");
        });
    }
}
