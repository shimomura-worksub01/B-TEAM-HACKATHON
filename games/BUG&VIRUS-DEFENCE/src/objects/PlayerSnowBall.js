import { SNOWBALL } from '../config/constants.js';

export default class PlayerSnowBall extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, key, frame)
    {
        super(scene, x, y, key, frame);

        // 弾タイプ（後から設定）
        this.ballType = null;

        this.setScale(0.5);
    }

    fire (x, y, ballType)
    {
        this.ballType = ballType;
        
        this.body.enable = true;
        this.body.reset(x + 10, y - 44);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(SNOWBALL.SPEED_PLAYER);
        this.setAccelerationX(SNOWBALL.ACCELERATION_PLAYER);
    }

    stop ()
    {
        this.setActive(false);
        this.setVisible(false);

        this.setVelocityX(0);

        this.body.enable = false;
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.x <= -64)
        {
            this.stop();
        }
    }
}