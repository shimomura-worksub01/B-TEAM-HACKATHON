import { BaseScene } from "./BaseScene.js";
import { GachaManager } from "../gacha/GachaManager.js";
import { GACHA_COUNT } from "../gacha/GachaTable.js";

/**
 * ガチャ結果画面
 */
export class GachaResultScene extends BaseScene
{
    constructor() {
        super("GachaResult")
    }

    preload() {
        this.load.image("menuBtn", "assets/images/menu_button.png"); // メニューボタン画像
    }

    build() {
        this.cards = [];
        this.index = 0;

        this.targetWidth = 98;
        this.targetHeight = 148;

        // 背景
        this.bg = this.add.image(0, 0, "bgGradient");
        // リング
        this.bgRing = this.add.image(0, 0, "magicRing");

        // スキップボタン
        this.skipButtonScale = 120 / 900;
        this.skipButton = this.add.image(0, 0, "skipBtn")
            .setInteractive({ useHandCursor: true });
        
        // メニューボタン
        this.menuButtonScale = 150 / 900;
        this.menuButton = this.add.image(0, 0, "menuBtn")
            .setInteractive({ useHandCursor: true });
        
        // ガチャボタン
        this.gachaButtonScale = 180 / 900;
        this.gachaButton = this.add.image(0, 0, "gachaBtn")
            .setInteractive({ useHandCursor: true });
        
        // パーティクル
        this.particles = this.add.particles(0, 0, "particle", {
            speed: { min: 100, max: 300 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 900,
            blendMode: Phaser.BlendModes.ADD,
            emitting: false
        });
    }

    relayout() {
        const { width, height, cx, cy } = this.layout.getSize();

        // 背景（位置, サイズ）
        this.bg
            .setPosition(cx, cy)
            .setDisplaySize(width, height);
        
        this.add.rectangle(cx, cy, width, height, 0xffffff, 0.25);

        // リング（位置, サイズ, 透過）
        this.bgRing
            .setPosition(cx, cy)
            .setAlpha(0.2)
            .setScale(1.5)
            .setBlendMode(Phaser.BlendModes.ADD);
        
        // カード裏面
        this.createCardBack(width, height, GachaManager.lastResults);
        // ボタン
        this.createButtons(width, height);
    }

    setMotion() {
        // 結果画像をまとめてプリロード（カクつき防止）
        const results = GachaManager.lastResults;
        for (let i = 0; i < GACHA_COUNT; i++) {
            this.load.image(`img${i}`, results[i].image);
        }

        this.load.once("complete", () => {
            // 結果表示タイマーはプリロード完了後に開始
            this.time.addEvent({
                delay: 600,
                repeat: 9,
                callback: () => this.reveal(),
            });
        });
        this.load.start();

        // リング（モーション）
        this.tweens.add({
            targets: this.bgRing,
            angle: 360,
            duration: 120000,
            repeat: -1
        });

        // フェードイン
        this.cameras.main.fadeIn(500);

        // ガチャボタン（モーション）
        this.tweens.add({
            targets: this.gachaButton,
            scale: { from: this.gachaButtonScale * 0.95, to: this.gachaButtonScale * 1.05 },
            duration: 1200,
            yoyo: true,
            repeat: -1
        });
    }

    /**
     * カード裏面作成
     * @param width 
     * @param height 
     * @param results ガチャ結果
     */
    createCardBack(width, height, results) {
        const cols = GACHA_COUNT / 2;

        const cardWidth = width * 0.075;
        const cardHeight = cardWidth * 1.3;

        const spacingX = width / (cols + 1);
        const spacingY = height / 4;

        const startX = spacingX;
        const startY = height * 0.35;

        results.forEach((r, i) => {

            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            const back = this.add.rectangle(x, y, cardWidth, cardHeight, 0x333333)
                .setStrokeStyle(2, 0xffffff)
                .setScale(0);

            this.tweens.add({
                targets: back,
                scale: 1,
                duration: 400,
                delay: i * 80,
                ease: "Back.out"
            });

            this.cards.push(back);
        });
    }

    /**
     * ボタン生成
     * @param width 
     * @param height 
     */
    createButtons(width, height) {
        // スキップボタン（位置, サイズ）
        this.skipButton
            .setPosition(width * 0.83, height * 0.87)
            .setScale(this.skipButtonScale);

        this.skipClickSound = this.sound.add("skipClickSound");
        this.skipButton.on("pointerdown", () => {
            // クリック音
            this.skipClickSound.play();
            // 結果全表示
            this.revealAll();
        });
        this.skipButton.on("pointerover", () => this.skipButton.setScale(this.skipButtonScale * 1.05));
        this.skipButton.on("pointerout", () => this.skipButton.setScale(this.skipButtonScale));

        // メニューへ戻るボタン（位置, サイズ, 非表示）
        this.menuButton
            .setPosition(width * 0.83, height * 0.87)
            .setScale(this.menuButtonScale)
            .setVisible(false);

        const menuClickAudio = new Audio('assets/sounds/menu_click_sound.mp3');
        this.menuButton.on("pointerdown", () => {
            // クリック音
            menuClickAudio.play();
            // メニュー画面へ遷移
            window.backToMenu(this.game);
        });
        this.menuButton.on("pointerover", () => this.menuButton.setScale(this.menuButtonScale * 1.05));
        this.menuButton.on("pointerout", () => this.menuButton.setScale(this.menuButtonScale));

        // ガチャボタン（位置, サイズ, 非表示）
        this.gachaButton
            .setPosition(width / 2, height * 0.87)
            .setScale(this.gachaButtonScale)
            .setVisible(false);

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

    /**
     * 結果表示
     */
    reveal() {
        if (this.index >= GACHA_COUNT) return;

        const currentIndex = this.index;

        const r = GachaManager.lastResults[currentIndex];
        const cardBack = this.cards[currentIndex];
        const x = cardBack.x;
        const y = cardBack.y;

        const explodeCount = r.rarity === "UR" ? 150 :
                             r.rarity === "SSR" ? 80 : 40;

        // パーティクル（モーション）
        this.particles.explode(explodeCount, x, y);

        if (r.rarity === "UR") {
            // URのみ追加演出
            this.cameras.main.flash(400, 255, 255, 255);
            this.cameras.main.shake(300, 0.015);
        }

        // カードめくりモーション
        this.tweens.add({
            targets: cardBack,
            scaleX: 0,
            duration: 200,
            ease: "Sine.in",
            onComplete: () => {

                if (this.index !== currentIndex) return;

                cardBack.destroy();

                const container = this.createCard(
                    x,
                    y,
                    `img${currentIndex}`,
                    r.rarity,
                    this.targetWidth,
                    this.targetHeight
                );

                container.scaleX = 0;

                this.tweens.add({
                    targets: container,
                    scaleX: 1,
                    duration: 250,
                    ease: "Back.out"
                });

                this.index++;

                if (this.index === GACHA_COUNT - 1) {
                    // スキップボタン非表示
                    this.skipButton.setVisible(false);
                } else if (this.index >= GACHA_COUNT) {
                    // メニューボタン表示
                    this.menuButton.setVisible(true);
                    // ガチャボタン表示
                    this.gachaButton.setVisible(true);
                }
            }
        });
    }

    /**
     * 結果表示カード作成
     * @param x 
     * @param y 
     * @param textureKey 
     * @param rarity 
     * @param targetWidth 
     * @param targetHeight 
     * @returns container
     */
    createCard(x, y, textureKey, rarity, targetWidth, targetHeight) {

        const container = this.add.container(x, y);
    
        // 基本色
        let topColor = 0xffffff;
        let bottomColor = 0xffffff;
        let glowColor = 0xffffff;
    
        // レアリティ毎に枠の色設定
        if (rarity === "UR") {
            topColor = 0xfff6c5;
            bottomColor = 0xffb700;
            glowColor = 0xffd54f;
        }
        else if (rarity === "SSR") {
            topColor = 0xf0d9ff;
            bottomColor = 0xaa66ff;
            glowColor = 0xbb88ff;
        }
        else if (rarity === "SR") {
            topColor = 0xd8ecff;
            bottomColor = 0x3399ff;
            glowColor = 0x66bbff;
        }
    
        const frameWidth = 120;
        const frameHeight = 170;
        const innerWidth = 118;
        const innerHeight = 168;
        const thickness = rarity === "UR" ? 5 : 3;
    
        if (rarity === "UR") {
            // URのみ演出追加
            const strongGlow = this.add.rectangle(
                0, 0,
                frameWidth + 28,
                frameHeight + 28,
                glowColor,
                0.08
            ).setBlendMode(Phaser.BlendModes.ADD);
    
            container.add(strongGlow);
    
            this.tweens.add({
                targets: strongGlow,
                alpha: { from: 0.08, to: 0.22 },
                duration: 900,
                yoyo: true,
                repeat: -1
            });
        }
    
        const outerGlow = this.add.rectangle(
            0, 0,
            frameWidth + 10,
            frameHeight + 10,
            glowColor,
            0.15
        ).setBlendMode(Phaser.BlendModes.ADD);
    
        container.add(outerGlow);
    
        this.tweens.add({
            targets: outerGlow,
            alpha: { from: 0.15, to: 0.28 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // カード下地
        const cardBase = this.add.rectangle(
            0,
            0,
            innerWidth,
            innerHeight,
            0x111111,
            0.85
        );

        container.add(cardBase);

        // 画像
        const img = this.add.image(0, 0, textureKey);
    
        const scaleX = targetWidth / img.width;
        const scaleY = targetHeight / img.height;
        const scale = Math.min(scaleX, scaleY);
    
        img.setScale(scale);
    
        container.add(img);

        const maskGraphics = this.add.graphics();
        maskGraphics.fillRect(
            -innerWidth / 2,
            -innerHeight / 2,
            innerWidth,
            innerHeight
        );

        const mask = maskGraphics.createGeometryMask();

        const shine = this.add.rectangle(
            -innerWidth,
            0,
            60,
            innerHeight * 1.4,
            0xffffff,
            0.35
        )
        .setAngle(25)
        .setBlendMode(Phaser.BlendModes.ADD);

        shine.setMask(mask);

        container.add(shine);

        this.tweens.add({
            targets: shine,
            x: innerWidth,
            duration: 1000,
            repeat: -1,
            repeatDelay: 2500,
            ease: "Sine.easeInOut"
        });
    
        // 枠
        const frame = this.add.graphics();

        frame.fillGradientStyle(
            topColor, topColor,
            bottomColor, bottomColor,
            1
        );

        frame.fillRect(-frameWidth/2, -frameHeight/2, frameWidth, thickness);
        frame.fillRect(-frameWidth/2, frameHeight/2 - thickness, frameWidth, thickness);
        frame.fillRect(-frameWidth/2, -frameHeight/2, thickness, frameHeight);
        frame.fillRect(frameWidth/2 - thickness, -frameHeight/2, thickness, frameHeight);

        container.add(frame);

        return container;
    }

    /**
     * 結果全表示
     * @returns
     */
    revealAll() {
        if (this.index >= GACHA_COUNT) return;

        const results = GachaManager.lastResults;

        // まだ表示していない分を登録
        for (let i = this.index; i < GACHA_COUNT; i++) {
            const r = results[i];
            const cardBack = this.cards[i];
            const x = cardBack.x;
            const y = cardBack.y;

            cardBack.destroy();

            const container = this.createCard(
                x,
                y,
                `img${i}`,
                r.rarity,
                this.targetWidth,
                this.targetHeight
            );

            container.scaleX = 1;
        }

        this.index = GACHA_COUNT;

        this.skipButton.setVisible(false);
        this.menuButton.setVisible(true);
        this.gachaButton.setVisible(true);
    }
}
