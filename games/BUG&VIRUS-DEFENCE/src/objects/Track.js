import Snowman from './Snowman.js';
import PlayerSnowball from './PlayerSnowBall.js';
import EnemySnowball from './EnemySnowBall.js';
import { CRITICAL_MAP } from '../config/constants.js';

export default class Track
{
    constructor (scene, id, trackY)
    {
        this.scene = scene;
        this.id = id;
        this.y = trackY;

        this.nest = scene.physics.add.image(1024, trackY - 10, 'nest').setOrigin(1, 1);

        this.snowmanBig = new Snowman(scene, this, 'Big');
        this.snowmanSmall = new Snowman(scene, this, 'Small');

        this.playerSnowballs = scene.physics.add.group({
            frameQuantity: 8,
            key: 'snowball2',
            // frame: 'snowball2',
            active: false,
            visible: false,
            classType: PlayerSnowball
        });

        this.enemySnowballs = scene.physics.add.group({
            frameQuantity: 8,
            key: 'snowball3',
            // frame: 'snowball3',
            active: false,
            visible: false,
            classType: EnemySnowball
        });

        this.snowBallCollider = scene.physics.add.overlap(this.playerSnowballs, this.enemySnowballs, this.hitSnowball, null, this);
        this.snowmanSmallCollider = scene.physics.add.overlap(this.snowmanSmall, this.playerSnowballs, this.hitSnowman, null, this);
        this.snowmanBigCollider = scene.physics.add.overlap(this.snowmanBig, this.playerSnowballs, this.hitSnowman, null, this);

        this.releaseTimerSmall;
        this.releaseTimerBig;
    }

    start (minDelay, maxDelay)
    {
        const delay = Phaser.Math.Between(minDelay, maxDelay);

        this.releaseTimerSmall = this.scene.time.addEvent({

            delay: delay,

            callback: () => {
                this.snowmanSmall.start();
            }
        });

        this.releaseTimerBig = this.scene.time.addEvent({

            delay: delay * 3,

            callback: () => {
                this.snowmanBig.start();
            }
        });
    }

    stop ()
    {
        this.snowmanSmall.stop();
        this.snowmanBig.stop();

        for (let snowball of this.playerSnowballs.getChildren())
        {
            snowball.stop();
        }

        for (let snowball of this.enemySnowballs.getChildren())
        {
            snowball.stop();
        }

        this.releaseTimerSmall.remove();
        this.releaseTimerBig.remove();
    }

    hitSnowball (ball1, ball2)
    {
        ball1.stop();
        ball2.stop();
    }

    hitSnowman (snowman, ball)
    {
        // if (snowman.isAlive && snowman.x > 0)
        // {
        //     ball.stop();
        //     snowman.hit();
        // }

        if (!snowman.isAlive || snowman.x <= 0) {
            return;
        }
        
        // クリティカル判定
        const criticalBall = CRITICAL_MAP[snowman.enemyType].ball;
        
        if (ball.ballType === criticalBall) {
            // クリティカル → 即撃破
            ball.stop();
            snowman.hit();
        
            // TODO: ここにクリティカル演出追加可能
        } else {
            // 非クリティカル → 無効
            ball.stop();
        }
    }

    throwPlayerSnowball (x, ballType)
    {
        let snowball = this.playerSnowballs.getFirstDead(false);

        if (snowball)
        {
            snowball.fire(x, this.y, ballType);
        }
    }

    throwEnemySnowball (x)
    {
        let snowball = this.enemySnowballs.getFirstDead(false);

        if (snowball)
        {
            snowball.fire(x, this.y);
        }
    }
}