import Track from '../objects/Track.js';
import Player from '../objects/Player.js';
import { SCORE } from '../config/constants.js';
import { ENEMY_TYPES, CRITICAL_MAP } from '../config/constants.js';

export default class MainGame extends Phaser.Scene
{
    constructor ()
    {
        super('MainGame');

        this.player;
        this.tracks;

        this.score = 0;
        //this.startTime = 0;
        this.highscore = 0;
        this.infoPanel;

        this.scoreTimer;
        //this.elapsedTime = 0;
        this.scoreText;
        //this.timerText;
        this.highscoreText;
    }

    create ()
    {
        this.score = 0;
        this.highscore = this.registry.get('highscore');

        this.activeEnemyTypes = Phaser.Utils.Array.Shuffle(
            [...ENEMY_TYPES]
        ).slice(0, 3);

        this.activeBallTypes = this.activeEnemyTypes.map(
            type => CRITICAL_MAP[type].ball
        );

        this.isColorHintEnabled = true;
        this.isModalOpen = false;

        this.add.image(512, 384, 'background');

        this.tracks = [
            new Track(this, 0, 196),
            new Track(this, 1, 376),
            new Track(this, 2, 536),
            new Track(this, 3, 700)
        ];

        this.settingButton = this.add.text(
            680, 20, '⚙',
            { fontSize: 24 }
        ).setInteractive();

        this.settingButton.on('pointerdown', () => {
            this.isModalOpen = true;
            this.showSettingModal();
        });

        this.currentBallIndex = 0;
        this.currentBallType = this.activeBallTypes[0];

        this.ballSelectText = this.add.text(
            400, 720,
            'BALL: ' + this.currentBallType,
            { fontSize: 24, color: '#ffffff' }
        );

        // キー追加
        this.keyW = this.input.keyboard.addKey('W');
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.player = new Player(this, this.tracks[0]);

        this.add.image(0, 0, 'overlay').setOrigin(0);

        this.add.image(16, 0, 'panel-score').setOrigin(0);
        this.add.image(1024-16, 0, 'panel-best').setOrigin(1, 0);

        this.infoPanel = this.add.image(512, 384, 'controls');
        this.scoreText = this.add.text(140, 2, this.score, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        // this.timerText = this.add.text(140, 2, '0.0s', {
        //     fontFamily: 'Arial',
        //     fontSize: 32,
        //     color: '#ffffff'
        // });
        this.highscoreText = this.add.text(820, 2, this.highscore, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });

        this.input.keyboard.once('keydown-SPACE', this.start, this);
        this.input.keyboard.once('keydown-UP', this.start, this);
        this.input.keyboard.once('keydown-DOWN', this.start, this);
    }

    update ()
    {
        if (this.isModalOpen) return;

        if (Phaser.Input.Keyboard.JustDown(this.keyW)) {
            this.currentBallIndex = (this.currentBallIndex + 1) % this.activeBallTypes.length;
            this.currentBallType = this.activeBallTypes[this.currentBallIndex];
            this.updateBallText();
        }
    }

    updateBallText ()
    {
        const color = this.isColorHintEnabled
            ? CRITICAL_MAP[this.activeEnemyTypes[this.currentBallIndex]].color : null;

        this.ballSelectText.setText(
            'BALL: ' + this.currentBallType
        );

        if (color) {
            this.ballSelectText.setBackgroundColor(Phaser.Display.Color.IntegerToColor(color).rgba);
        } else {
            this.ballSelectText.setBackgroundColor(null);
        }
    }

    showSettingModal ()
    {
        // モーダル背景
        this.modalBg = this.add.rectangle(
            512, 384, 600, 400, 0x000000, 0.85
        );

        // タイトル
        this.modalTitle = this.add.text(
            512, 250, 'SETTINGS',
            { fontSize: 32, color: '#ffffff', fontStyle: 'bold' }
        ).setOrigin(0.5);

        // Color Hint ラベル
        this.colorHintLabel = this.add.text(
            512, 320, 'Color Hint',
            { fontSize: 24, color: '#ffffff' }
        ).setOrigin(0.5);

        // ONボタン
        this.onButtonBg = this.add.rectangle(
            420, 380, 100, 50,
            this.isColorHintEnabled ? 0x00cc00 : 0x444444
        ).setInteractive();

        this.onButtonText = this.add.text(
            420, 380, 'ON',
            { fontSize: 22, color: '#ffffff', fontStyle: 'bold' }
        ).setOrigin(0.5);

        this.onButtonBg.on('pointerover', () => {
            this.onButtonBg.setFillStyle(
                this.isColorHintEnabled ? 0x00ff00 : 0x555555
            );
            this.onButtonBg.setScale(1.05);
        });

        this.onButtonBg.on('pointerout', () => {
            this.onButtonBg.setFillStyle(
                this.isColorHintEnabled ? 0x00cc00 : 0x444444
            );
            this.onButtonBg.setScale(1.0);
        });

        this.onButtonBg.on('pointerdown', () => {
            if (!this.isColorHintEnabled) {
                this.isColorHintEnabled = true;
                this.updateSettingButtons();
                this.updateBallText();
            }
        });

        // OFFボタン
        this.offButtonBg = this.add.rectangle(
            604, 380, 100, 50,
            !this.isColorHintEnabled ? 0xcc0000 : 0x444444
        ).setInteractive();

        this.offButtonText = this.add.text(
            604, 380, 'OFF',
            { fontSize: 22, color: '#ffffff', fontStyle: 'bold' }
        ).setOrigin(0.5);

        this.offButtonBg.on('pointerover', () => {
            this.offButtonBg.setFillStyle(
                !this.isColorHintEnabled ? 0xff0000 : 0x555555
            );
            this.offButtonBg.setScale(1.05);
        });

        this.offButtonBg.on('pointerout', () => {
            this.offButtonBg.setFillStyle(
                !this.isColorHintEnabled ? 0xcc0000 : 0x444444
            );
            this.offButtonBg.setScale(1.0);
        });

        this.offButtonBg.on('pointerdown', () => {
            if (this.isColorHintEnabled) {
                this.isColorHintEnabled = false;
                this.updateSettingButtons();
                this.updateBallText();
            }
        });

        // CLOSEボタン
        this.closeButtonBg = this.add.rectangle(
            512, 480, 150, 60, 0x4466ff
        ).setInteractive();

        this.closeButtonText = this.add.text(
            512, 480, 'CLOSE',
            { fontSize: 26, color: '#ffffff', fontStyle: 'bold' }
        ).setOrigin(0.5);

        this.closeButtonBg.on('pointerover', () => {
            this.closeButtonBg.setFillStyle(0x6688ff);
            this.closeButtonBg.setScale(1.05);
        });

        this.closeButtonBg.on('pointerout', () => {
            this.closeButtonBg.setFillStyle(0x4466ff);
            this.closeButtonBg.setScale(1.0);
        });

        this.closeButtonBg.on('pointerdown', () => {
            this.modalBg.destroy();
            this.modalTitle.destroy();
            this.colorHintLabel.destroy();
            this.onButtonBg.destroy();
            this.onButtonText.destroy();
            this.offButtonBg.destroy();
            this.offButtonText.destroy();
            this.closeButtonBg.destroy();
            this.closeButtonText.destroy();
            this.isModalOpen = false;
        });
    }

    updateSettingButtons ()
    {
        // ONボタンの色を更新
        this.onButtonBg.setFillStyle(
            this.isColorHintEnabled ? 0x00cc00 : 0x444444
        );

        // OFFボタンの色を更新
        this.offButtonBg.setFillStyle(
            !this.isColorHintEnabled ? 0xcc0000 : 0x444444
        );
    }

    start ()
    {
        this.input.keyboard.removeAllListeners();

        this.tweens.add({
            targets: this.infoPanel,
            y: 700,
            alpha: 0,
            duration: 500,
            ease: 'Power2'
        });

        this.player.start();

        this.tracks[0].start(4000, 8000);
        this.tracks[1].start(500, 1000);
        this.tracks[2].start(5000, 9000);
        this.tracks[3].start(6000, 10000);

        // this.startTime = this.time.now;

        this.scoreTimer = this.time.addEvent({
            delay: SCORE.INCREMENT_INTERVAL,
            callback: () => {
                this.score++;
                this.scoreText.setText(this.score);
            },
            callbackScope: this,
            repeat: -1
        });
        // this.timerEvent = this.time.addEvent({
        //     delay: 100,
        //     loop: true,
        //     callback: () => {
        //         this.elapsedTime = (this.time.now - this.startTime) / 1000;
        //         this.timerText.setText(this.elapsedTime.toFixed(1) + 's');
        //     }
        // });
    }

    gameOver ()
    {
        this.infoPanel.setTexture('gameover');

        this.tweens.add({
            targets: this.infoPanel,
            y: 384,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        this.tracks.forEach((track) => {
            track.stop();
        });

        this.sound.stopAll();
        this.sound.play('gameover');

        this.player.stop();

        this.scoreTimer.destroy();
        //this.timerEvent.destroy();

        // ゲームオーバー表示に最終時間を反映
        // this.infoPanelText = this.add.text(
        //     512, 450,
        //     'TIME: ' + this.elapsedTime.toFixed(1) + 's',
        //     {
        //         fontSize: '32px',
        //         color: '#ffffff'
        //     }
        // ).setOrigin(0.5);

        if (this.score > this.highscore)
        {
            this.highscoreText.setText('NEW!');

            this.registry.set('highscore', this.score);
        }

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        }, this);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        }, this);
    }
}