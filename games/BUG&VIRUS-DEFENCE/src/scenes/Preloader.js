export default class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');
        this.loadText;
    }

    preload ()
    {
        this.load.setBaseURL('');
        this.loadText = this.add.text(512, 360, 'Loading ...', { fontFamily: 'Arial', fontSize: 74, color: '#e3f2ed' });
        this.loadText.setOrigin(0.5);
        this.loadText.setStroke('#203c5b', 6);
        this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);

        // this.load.setPath('assets/');
        // this.load.image([ 'background', 'overlay', 'gameover', 'title' ]);
        // this.load.atlas('sprites', 'sprites.png', 'sprites.json');

        // ==============================
        // 画像は assets/images 配下から読み込む
        // ==============================
        this.load.image('background', 'assets/images/background.png');
        this.load.image('overlay', 'assets/images/overlay.png');
        this.load.image('gameover', 'assets/images/gameover.png');
        this.load.image('title', 'assets/images/title.png');

        this.load.image('controls', 'assets/images/controls.png');
        this.load.image('die000', 'assets/images/die000.png');
        this.load.image('idle000', 'assets/images/idle000.png');
        this.load.image('idle001', 'assets/images/idle001.png');
        this.load.image('idle002', 'assets/images/idle002.png');
        this.load.image('idle003', 'assets/images/idle003.png');
        this.load.image('nest', 'assets/images/nest.png');
        this.load.image('panel-best', 'assets/images/panel-best.png');
        this.load.image('panel-score', 'assets/images/panel-score.png');
        this.load.image('snowball1', 'assets/images/snowball1.png');
        this.load.image('snowball2', 'assets/images/snowball2.png');
        this.load.image('snowball3', 'assets/images/snowball3.png');
        this.load.image('snowman-big-die0', 'assets/images/snowman-big-die0.png');
        this.load.image('snowman-big-die1', 'assets/images/snowman-big-die1.png');
        this.load.image('snowman-big-die2', 'assets/images/snowman-big-die2.png');
        this.load.image('snowman-big-die3', 'assets/images/snowman-big-die3.png');
        this.load.image('snowman-big-die4', 'assets/images/snowman-big-die4.png');
        this.load.image('snowman-big-idle0', 'assets/images/snowman-big-idle0.png');
        this.load.image('snowman-big-idle1', 'assets/images/snowman-big-idle1.png');
        this.load.image('snowman-big-idle2', 'assets/images/snowman-big-idle2.png');
        this.load.image('snowman-big-idle3', 'assets/images/snowman-big-idle3.png');
        this.load.image('snowman-big-throw0', 'assets/images/snowman-big-throw0.png');
        this.load.image('snowman-big-throw1', 'assets/images/snowman-big-throw1.png');
        this.load.image('snowman-big-throw2', 'assets/images/snowman-big-throw2.png');
        this.load.image('snowman-big-throw3', 'assets/images/snowman-big-throw3.png');
        this.load.image('snowman-big-throw4', 'assets/images/snowman-big-throw4.png');
        this.load.image('snowman-big-throw5', 'assets/images/snowman-big-throw5.png');
        this.load.image('snowman-big-throw6', 'assets/images/snowman-big-throw6.png');
        this.load.image('snowman-big-throw7', 'assets/images/snowman-big-throw7.png');
        this.load.image('snowman-big-throw8', 'assets/images/snowman-big-throw8.png');
        this.load.image('snowman-big-walk0', 'assets/images/snowman-big-walk0.png');
        this.load.image('snowman-big-walk1', 'assets/images/snowman-big-walk1.png');
        this.load.image('snowman-big-walk2', 'assets/images/snowman-big-walk2.png');
        this.load.image('snowman-big-walk3', 'assets/images/snowman-big-walk3.png');
        this.load.image('snowman-big-walk4', 'assets/images/snowman-big-walk4.png');
        this.load.image('snowman-big-walk5', 'assets/images/snowman-big-walk5.png');
        this.load.image('snowman-big-walk6', 'assets/images/snowman-big-walk6.png');
        this.load.image('snowman-big-walk7', 'assets/images/snowman-big-walk7.png');
        this.load.image('snowman-small-die0', 'assets/images/snowman-small-die0.png');
        this.load.image('snowman-small-die1', 'assets/images/snowman-small-die1.png');
        this.load.image('snowman-small-die2', 'assets/images/snowman-small-die2.png');
        this.load.image('snowman-small-die3', 'assets/images/snowman-small-die3.png');
        this.load.image('snowman-small-die4', 'assets/images/snowman-small-die4.png');
        this.load.image('snowman-small-idle0', 'assets/images/snowman-small-idle0.png');
        this.load.image('snowman-small-idle1', 'assets/images/snowman-small-idle1.png');
        this.load.image('snowman-small-idle2', 'assets/images/snowman-small-idle2.png');
        this.load.image('snowman-small-idle3', 'assets/images/snowman-small-idle3.png');
        this.load.image('snowman-small-throw0', 'assets/images/snowman-small-throw0.png');
        this.load.image('snowman-small-throw1', 'assets/images/snowman-small-throw1.png');
        this.load.image('snowman-small-throw2', 'assets/images/snowman-small-throw2.png');
        this.load.image('snowman-small-throw3', 'assets/images/snowman-small-throw3.png');
        this.load.image('snowman-small-throw4', 'assets/images/snowman-small-throw4.png');
        this.load.image('snowman-small-throw5', 'assets/images/snowman-small-throw5.png');
        this.load.image('snowman-small-throw6', 'assets/images/snowman-small-throw6.png');
        this.load.image('snowman-small-throw7', 'assets/images/snowman-small-throw7.png');
        this.load.image('snowman-small-throw8', 'assets/images/snowman-small-throw8.png');
        this.load.image('snowman-small-walk0', 'assets/images/snowman-small-walk0.png');
        this.load.image('snowman-small-walk1', 'assets/images/snowman-small-walk1.png');
        this.load.image('snowman-small-walk2', 'assets/images/snowman-small-walk2.png');
        this.load.image('snowman-small-walk3', 'assets/images/snowman-small-walk3.png');
        this.load.image('snowman-small-walk4', 'assets/images/snowman-small-walk4.png');
        this.load.image('snowman-small-walk5', 'assets/images/snowman-small-walk5.png');
        this.load.image('snowman-small-walk6', 'assets/images/snowman-small-walk6.png');
        this.load.image('snowman-small-walk7', 'assets/images/snowman-small-walk7.png');
        this.load.image('throw000', 'assets/images/throw000.png');
        this.load.image('throw001', 'assets/images/throw001.png');
        this.load.image('throw002', 'assets/images/throw002.png');
        this.load.image('throw003', 'assets/images/throw003.png');
        this.load.image('throw004', 'assets/images/throw004.png');
        this.load.image('throw005', 'assets/images/throw005.png');
        this.load.image('throw006', 'assets/images/throw006.png');
        this.load.image('throw007', 'assets/images/throw007.png');
        this.load.image('throw008', 'assets/images/throw008.png');
        this.load.image('throw009', 'assets/images/throw009.png');
        this.load.image('throw010', 'assets/images/throw010.png');
        this.load.image('throw011', 'assets/images/throw011.png');

        // this.load.glsl('snow', 'assets/snow.glsl.js');
        this.load.glsl('glitch', 'assets/glitch.glsl.js');

        //  Audio ...
        this.load.setPath('assets/sounds/');

        this.load.audio('music', [ 'music.ogg']);
        this.load.audio('throw', [ 'throw.ogg']);
        this.load.audio('move', [ 'move.ogg']);
        this.load.audio('hit-snowman', [ 'hit-snowman.ogg']);
        this.load.audio('gameover', [ 'gameover.ogg']);
    }

    create ()
    {
        //  Create our global animations

        // this.anims.create({
        //     key: 'die',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'die', start: 0, end: 0, zeroPad: 3 })
        // });
        this.anims.create({
            key: 'die',
            frames: [{ key: 'die000' }]
        });

        // this.anims.create({
        //     key: 'idle',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'idle', start: 0, end: 3, zeroPad: 3 }),
        //     yoyo: true,
        //     frameRate: 8,
        //     repeat: -1
        // });
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'idle000' },
                { key: 'idle001' },
                { key: 'idle002' },
                { key: 'idle003' }
            ],
            yoyo: true,
            frameRate: 8,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'throwStart',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'throw', start: 0, end: 8, zeroPad: 3 }),
        //     frameRate: 26
        // });
        this.anims.create({
            key: 'throwStart',
            frames: [
                { key: 'throw000' },
                { key: 'throw001' },
                { key: 'throw002' },
                { key: 'throw003' },
                { key: 'throw004' },
                { key: 'throw005' },
                { key: 'throw006' },
                { key: 'throw007' },
                { key: 'throw008' }
            ],
            frameRate: 26
        });

        // this.anims.create({
        //     key: 'throwEnd',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'throw', start: 9, end: 11, zeroPad: 3 }),
        //     frameRate: 26
        // });
        this.anims.create({
            key: 'throwEnd',
            frames: [
                { key: 'throw009' },
                { key: 'throw010' },
                { key: 'throw011' }
            ],
            frameRate: 26
        });

        // this.anims.create({
        //     key: 'snowmanIdleBig',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-big-idle', start: 0, end: 3 }),
        //     yoyo: true,
        //     frameRate: 8,
        //     repeat: -1
        // });
        this.anims.create({
            key: 'snowmanIdleBig',
            frames: [
                { key: 'snowman-big-idle0' },
                { key: 'snowman-big-idle1' },
                { key: 'snowman-big-idle2' },
                { key: 'snowman-big-idle3' }
            ],
            yoyo: true,
            frameRate: 8,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'snowmanWalkBig',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-big-walk', start: 0, end: 7 }),
        //     frameRate: 8,
        //     repeat: -1
        // });
        this.anims.create({
            key: 'snowmanWalkBig',
            frames: [
                { key: 'snowman-big-walk0' },
                { key: 'snowman-big-walk1' },
                { key: 'snowman-big-walk2' },
                { key: 'snowman-big-walk3' },
                { key: 'snowman-big-walk4' },
                { key: 'snowman-big-walk5' },
                { key: 'snowman-big-walk6' },
                { key: 'snowman-big-walk7' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        // this.anims.create({
        //     key: 'snowmanThrowStartBig',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-big-throw', start: 0, end: 5 }),
        //     frameRate: 20
        // });
        this.anims.create({
            key: 'snowmanThrowStartBig',
            frames: [
                { key: 'snowman-big-throw0' },
                { key: 'snowman-big-throw1' },
                { key: 'snowman-big-throw2' },
                { key: 'snowman-big-throw3' },
                { key: 'snowman-big-throw4' },
                { key: 'snowman-big-throw5' }
            ],
            frameRate: 20
        });

        // this.anims.create({
        //     key: 'snowmanThrowEndBig',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-big-throw', start: 6, end: 8 }),
        //     frameRate: 20
        // });
        this.anims.create({
            key: 'snowmanThrowEndBig',
            frames: [
                { key: 'snowman-big-throw6' },
                { key: 'snowman-big-throw7' },
                { key: 'snowman-big-throw8' }
            ],
            frameRate: 20
        });

        // this.anims.create({
        //     key: 'snowmanDieBig',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-big-die', start: 0, end: 4 }),
        //     frameRate: 14
        // });
        this.anims.create({
            key: 'snowmanDieBig',
            frames: [
                { key: 'snowman-big-die0' },
                { key: 'snowman-big-die1' },
                { key: 'snowman-big-die2' },
                { key: 'snowman-big-die3' },
                { key: 'snowman-big-die4' },
            ],
            frameRate: 14
        });

        // this.anims.create({
        //     key: 'snowmanIdleSmall',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-small-idle', start: 0, end: 3 }),
        //     yoyo: true,
        //     frameRate: 8,
        //     repeat: -1
        // });
        this.anims.create({
            key: 'snowmanIdleSmall',
            frames: [
                { key: 'snowman-small-idle0' },
                { key: 'snowman-small-idle1' },
                { key: 'snowman-small-idle2' },
                { key: 'snowman-small-idle3' }
            ],
            yoyo: true,
            frameRate: 8,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'snowmanWalkSmall',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-small-walk', start: 0, end: 7 }),
        //     frameRate: 8,
        //     repeat: -1
        // });
        this.anims.create({
            key: 'snowmanWalkSmall',
            frames: [
                { key: 'snowman-small-walk0' },
                { key: 'snowman-small-walk1' },
                { key: 'snowman-small-walk2' },
                { key: 'snowman-small-walk3' },
                { key: 'snowman-small-walk4' },
                { key: 'snowman-small-walk5' },
                { key: 'snowman-small-walk6' },
                { key: 'snowman-small-walk7' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'snowmanThrowStartSmall',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-small-throw', start: 0, end: 5 }),
        //     frameRate: 20
        // });
        this.anims.create({
            key: 'snowmanThrowStartSmall',
            frames: [
                { key: 'snowman-small-throw0' },
                { key: 'snowman-small-throw1' },
                { key: 'snowman-small-throw2' },
                { key: 'snowman-small-throw3' },
                { key: 'snowman-small-throw4' },
                { key: 'snowman-small-throw5' }
            ],
            frameRate: 20
        });

        // this.anims.create({
        //     key: 'snowmanThrowEndSmall',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-small-throw', start: 6, end: 8 }),
        //     frameRate: 20
        // });
        this.anims.create({
            key: 'snowmanThrowEndSmall',
            frames: [
                { key: 'snowman-small-throw6' },
                { key: 'snowman-small-throw7' },
                { key: 'snowman-small-throw8' }
            ],
            frameRate: 20
        });

        // this.anims.create({
        //     key: 'snowmanDieSmall',
        //     frames: this.anims.generateFrameNames('sprites', { prefix: 'snowman-small-die', start: 0, end: 4 }),
        //     frameRate: 14
        // });
        this.anims.create({
            key: 'snowmanDieSmall',
            frames: [
                { key: 'snowman-small-die0' },
                { key: 'snowman-small-die1' },
                { key: 'snowman-small-die2' },
                { key: 'snowman-small-die3' },
                { key: 'snowman-small-die4' }
            ],
            frameRate: 14
        });

        if (this.sound.locked)
        {
            this.loadText.setText('Click to Start');

            this.input.once('pointerdown', () => {

                this.scene.start('MainMenu');

            });
        }
        else
        {
            this.scene.start('MainMenu');
        }
    }
}