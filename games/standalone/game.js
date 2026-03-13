class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    create() {
        this.scene.start("Preloader");
    }
}

class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("self", "self.png");
        this.load.image("enemy", "enemy.png");
        this.load.image("enemy2", "enemy2.png");
        this.load.image("enemy3", "enemy3.png");
    }

    create() {
        this.createTextures();
        this.scene.start("MainMenu");
    }

    createTextures() {
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        g.clear();
        g.fillStyle(0x3ef7ff, 1);
        g.fillRect(0, 0, 4, 12);
        g.generateTexture("playerBulletS", 4, 12);

        g.clear();
        g.fillStyle(0xfff25e, 1);
        g.fillRect(0, 0, 4, 12);
        g.generateTexture("playerBulletN", 4, 12);

        g.clear();
        g.fillStyle(0xffffff, 1);
        g.fillRect(0, 0, 4, 12);
        g.generateTexture("playerBulletCmd", 4, 12);

        g.clear();
        g.fillStyle(0xff6d6d, 1);
        g.fillRect(0, 0, 4, 12);
        g.generateTexture("enemyBullet", 4, 12);

        g.destroy();
    }
}

class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0x05070d);
        this.add.rectangle(width / 2, height / 2, width, height, 0x05070d);

        this.add.text(width / 2, height / 2 - 120, "SPACE INVADERS", {
            fontFamily: "monospace",
            fontSize: 72,
            color: "#9dff69",
            stroke: "#12210a",
            strokeThickness: 10,
            align: "center"
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 20, "Move: Arrow Keys / Shoot: type nul, sql, mem", {
            fontFamily: "monospace",
            fontSize: 28,
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        const prompt = this.add.text(width / 2, height / 2 + 110, "Click or press SPACE to start", {
            fontFamily: "monospace",
            fontSize: 32,
            color: "#2ff2ff",
            align: "center"
        }).setOrigin(0.5);

        this.tweens.add({
            targets: prompt,
            alpha: { from: 0.25, to: 1 },
            duration: 520,
            yoyo: true,
            repeat: -1
        });

        const startGame = () => {
            this.scene.start("Game");
        };

        this.input.once("pointerdown", startGame);
        const space = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        space?.once("down", startGame);
    }
}

class Game extends Phaser.Scene {
    constructor() {
        super("Game");
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.enemyDirection = 1;
        this.enemySpeed = 45;
        this.nextPlayerShotAt = 0;
        this.nextEnemyShotAt = 0;
        this.isGameOver = false;
        this.playerInvulnerableUntil = 0;
        this.inputBuffer = "";
        this.commandToEnemy = {
            nul: "enemy",
            sql: "enemy2",
            mem: "enemy3"
        };
        this.commandToBulletColor = {
            nul: 0xfff25e,
            sql: 0x3ef7ff,
            mem: 0xff91f8
        };
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor(0x05070d);
        this.createStarField();

        this.scoreText = this.add.text(20, 20, "SCORE: 0", {
            fontFamily: "monospace",
            fontSize: 30,
            color: "#ffffff"
        });

        this.livesText = this.add.text(width - 20, 20, "LIVES: 3", {
            fontFamily: "monospace",
            fontSize: 30,
            color: "#ffffff"
        }).setOrigin(1, 0);

        this.waveText = this.add.text(width / 2, 20, "WAVE: 1", {
            fontFamily: "monospace",
            fontSize: 30,
            color: "#9dff69"
        }).setOrigin(0.5, 0);

        this.ammoText = this.add.text(width / 2, 60, "SHOOT: Type nul / sql / mem", {
            fontFamily: "monospace",
            fontSize: 24,
            color: "#fff25e"
        }).setOrigin(0.5, 0);

        this.commandText = this.add.text(width / 2, 90, "TYPE: _  (nul/sql/mem to shoot typed bullet)", {
            fontFamily: "monospace",
            fontSize: 20,
            color: "#d0d0d0"
        }).setOrigin(0.5, 0);

        this.player = this.physics.add.sprite(width / 2, height - 70, "self");
        this.player.setCollideWorldBounds(true);

        this.playerBullets = this.physics.add.group({ maxSize: 60 });
        this.enemyBullets = this.physics.add.group({ maxSize: 60 });
        this.enemies = this.physics.add.group();

        const keyboard = this.input.keyboard;
        this.cursors = keyboard?.createCursorKeys() ?? {
            up: null,
            down: null,
            left: null,
            right: null,
            space: null,
            shift: null
        };

        keyboard?.on("keydown", this.onTypingKeyDown, this);
        this.events.once("shutdown", () => {
            keyboard?.off("keydown", this.onTypingKeyDown, this);
        });

        this.spawnWave();
        this.nextEnemyShotAt = this.time.now + 1500;

        this.input.on("pointermove", (pointer) => {
            if (this.isGameOver) {
                return;
            }
            this.player.x = Math.max(26, Math.min(width - 26, pointer.x));
        });

        this.physics.add.overlap(this.playerBullets, this.enemies, this.onPlayerBulletHitEnemy, undefined, this);
        this.physics.add.overlap(this.enemyBullets, this.player, this.onEnemyBulletHitPlayer, undefined, this);
    }

    update(time, delta) {
        if (this.isGameOver) {
            return;
        }

        this.updatePlayerMovement();
        this.moveEnemyFormation(delta);

        if (time >= this.nextEnemyShotAt) {
            this.fireEnemyBullet();
            const interval = Math.max(700, 1700 - (this.wave * 80));
            this.nextEnemyShotAt = time + interval;
        }

        this.cleanupBullets();
    }

    createStarField() {
        const { width, height } = this.scale;
        const stars = this.add.graphics();

        for (let i = 0; i < 170; i++) {
            const alpha = 0.35 + Math.random() * 0.65;
            const size = Math.random() > 0.93 ? 3 : 2;
            stars.fillStyle(0xffffff, alpha);
            stars.fillRect(Math.random() * width, Math.random() * height, size, size);
        }
    }

    updatePlayerMovement() {
        const speed = 350;
        if (this.cursors.left?.isDown) {
            this.player.setVelocityX(-speed);
            return;
        }
        if (this.cursors.right?.isDown) {
            this.player.setVelocityX(speed);
            return;
        }
        this.player.setVelocityX(0);
    }

    spawnWave() {
        this.enemies.clear(true, true);

        const { width } = this.scale;
        const columns = 5;
        const rows = 3;
        const spacingX = 120;
        const spacingY = 58;
        const startX = (width - ((columns - 1) * spacingX)) / 2;
        const startY = 120;
        const enemySpecs = [
            { textureKey: "enemy" },
            { textureKey: "enemy2" },
            { textureKey: "enemy3" }
        ];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const spec = enemySpecs[Math.floor(Math.random() * enemySpecs.length)];
                const enemy = this.enemies.create(startX + (col * spacingX), startY + (row * spacingY), spec.textureKey);
                enemy.setImmovable(true);
            }
        }

        this.enemyDirection = 1;
        this.enemySpeed = 24 + ((this.wave - 1) * 4);
        this.waveText.setText(`WAVE: ${this.wave}`);
    }

    moveEnemyFormation(delta) {
        const { width, height } = this.scale;
        const dx = (this.enemyDirection * this.enemySpeed * delta) / 1000;
        let reachedEdge = false;
        let crossedLine = false;

        this.enemies.children.each((enemyObj) => {
            const enemy = enemyObj;
            if (!enemy.active) {
                return;
            }
            enemy.x += dx;
            if (enemy.x <= 28 || enemy.x >= width - 28) {
                reachedEdge = true;
            }
            if (enemy.y >= height - 130) {
                crossedLine = true;
            }
        });

        if (crossedLine) {
            this.finishGame("Invaders reached your line.");
            return;
        }
        if (!reachedEdge) {
            return;
        }

        this.enemyDirection *= -1;
        this.enemies.children.each((enemyObj) => {
            const enemy = enemyObj;
            if (enemy.active) {
                enemy.y += 18;
            }
        });
    }

    fireEnemyBullet() {
        const livingEnemies = this.enemies.getChildren().filter((enemyObj) => enemyObj.active);
        if (livingEnemies.length === 0) {
            return;
        }

        const shooter = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
        const bullet = this.enemyBullets.get(shooter.x, shooter.y + 16, "enemyBullet");
        if (!bullet) {
            return;
        }

        bullet.enableBody(true, shooter.x, shooter.y + 16, true, true);
        bullet.setVelocity(0, 250 + (this.wave * 12));
    }

    cleanupBullets() {
        const { height } = this.scale;

        this.playerBullets.children.each((bulletObj) => {
            const bullet = bulletObj;
            if (bullet.active && bullet.y < -20) {
                bullet.disableBody(true, true);
            }
        });

        this.enemyBullets.children.each((bulletObj) => {
            const bullet = bulletObj;
            if (bullet.active && bullet.y > height + 20) {
                bullet.disableBody(true, true);
            }
        });
    }

    onPlayerBulletHitEnemy(bulletObj, enemyObj) {
        const bullet = bulletObj;
        const enemy = enemyObj;
        const targetTexture = bullet.getData("targetTexture") ?? "";
        bullet.disableBody(true, true);

        if (enemy.texture.key !== targetTexture) {
            enemy.setTintFill(0xffffff);
            this.time.delayedCall(70, () => {
                if (enemy.active) {
                    enemy.clearTint();
                }
            });
            return;
        }

        this.applyEnemyKill(enemy);
    }

    onEnemyBulletHitPlayer(obj1, obj2) {
        if (this.time.now < this.playerInvulnerableUntil) {
            return;
        }

        const candidate1 = obj1;
        const candidate2 = obj2;
        const bullet = candidate1.texture?.key === "enemyBullet" ? candidate1 : candidate2;

        if (!bullet || bullet.texture?.key !== "enemyBullet") {
            return;
        }

        bullet.disableBody(true, true);
        this.playerInvulnerableUntil = this.time.now + 500;

        this.lives -= 1;
        this.livesText.setText(`LIVES: ${this.lives}`);
        this.player.setVisible(true);
        this.player.clearTint();
        this.player.setTintFill(0xff9999);
        this.tweens.add({
            targets: this.player,
            alpha: { from: 0.35, to: 1 },
            duration: 90,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.player.setVisible(true);
                this.player.setAlpha(1);
                this.player.clearTint();
            }
        });

        if (this.lives <= 0) {
            this.finishGame("All ships lost.");
        }
    }

    finishGame(reason) {
        if (this.isGameOver) {
            return;
        }

        this.isGameOver = true;
        this.physics.pause();
        this.time.delayedCall(250, () => {
            this.scene.start("GameOver", {
                score: this.score,
                wave: this.wave,
                reason
            });
        });
    }

    onTypingKeyDown(event) {
        if (this.isGameOver) {
            return;
        }

        const key = event.key.toLowerCase();
        if (key === "backspace") {
            this.inputBuffer = this.inputBuffer.slice(0, -1);
            this.refreshInputBufferText();
            return;
        }
        if (!/^[a-z]$/.test(key)) {
            return;
        }

        this.inputBuffer = (this.inputBuffer + key).slice(-12);
        this.refreshInputBufferText();

        this.tryCommandKill("nul");
        this.tryCommandKill("sql");
        this.tryCommandKill("mem");
    }

    refreshInputBufferText() {
        const visible = this.inputBuffer.length > 0 ? this.inputBuffer : "_";
        this.commandText.setText(`TYPE: ${visible}  (nul/sql/mem to shoot typed bullet)`);
    }

    tryCommandKill(command) {
        if (!this.inputBuffer.endsWith(command)) {
            return;
        }

        this.inputBuffer = "";
        this.refreshInputBufferText();

        const targetTexture = this.commandToEnemy[command];
        const hasTarget = this.enemies.getChildren()
            .filter((enemyObj) => enemyObj.active)
            .some((enemy) => enemy.texture.key === targetTexture);

        this.fireTypedCommandBullet(command);

        if (!hasTarget) {
            this.commandText.setColor("#ff8f8f");
            this.time.delayedCall(140, () => {
                this.commandText.setColor("#d0d0d0");
            });
            return;
        }

        this.commandText.setColor("#8dffb0");
        this.time.delayedCall(140, () => {
            this.commandText.setColor("#d0d0d0");
        });
    }

    fireTypedCommandBullet(command) {
        if (this.time.now < this.nextPlayerShotAt) {
            return;
        }
        this.nextPlayerShotAt = this.time.now + 320;

        const bullet = this.playerBullets.get(this.player.x, this.player.y - 24, "playerBulletCmd");
        if (!bullet) {
            return;
        }

        bullet.enableBody(true, this.player.x, this.player.y - 24, true, true);
        bullet.setTexture("playerBulletCmd");
        bullet.setTint(this.commandToBulletColor[command]);
        bullet.setData("targetTexture", this.commandToEnemy[command]);
        bullet.setVelocity(0, -620);
    }

    applyEnemyKill(enemy) {
        enemy.disableBody(true, true);

        const hitFlash = this.add.circle(enemy.x, enemy.y, 16, 0xfff78a, 0.9);
        this.tweens.add({
            targets: hitFlash,
            alpha: 0,
            scale: 1.8,
            duration: 120,
            onComplete: () => {
                hitFlash.destroy();
            }
        });

        this.score += 10 * this.wave;
        this.scoreText.setText(`SCORE: ${this.score}`);

        if (this.enemies.countActive(true) > 0) {
            return;
        }

        this.wave += 1;
        this.spawnWave();
    }
}

class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    create(data) {
        const { width, height } = this.scale;
        const score = typeof data?.score === "number" ? data.score : 0;
        const wave = typeof data?.wave === "number" ? data.wave : 1;
        const reason = data?.reason ?? "The fleet got through.";
        this.cameras.main.setBackgroundColor(0x120b0b);

        this.add.text(width / 2, height / 2 - 140, "GAME OVER", {
            fontFamily: "monospace",
            fontSize: 84,
            color: "#ff7b7b",
            stroke: "#2b0f0f",
            strokeThickness: 10,
            align: "center"
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 10, reason, {
            fontFamily: "monospace",
            fontSize: 30,
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 70, `Score: ${score}  Wave: ${wave}`, {
            fontFamily: "monospace",
            fontSize: 34,
            color: "#2ff2ff",
            align: "center"
        }).setOrigin(0.5);

        const prompt = this.add.text(width / 2, height / 2 + 180, "Click or press SPACE to return", {
            fontFamily: "monospace",
            fontSize: 28,
            color: "#9dff69",
            align: "center"
        }).setOrigin(0.5);

        this.tweens.add({
            targets: prompt,
            alpha: { from: 0.25, to: 1 },
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        let restarting = false;
        const restart = () => {
            if (restarting) {
                return;
            }
            restarting = true;
            this.scene.start("MainMenu");
        };

        this.input.once("pointerdown", restart);
        const space = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        space?.once("down", restart);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#05070d",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [Boot, Preloader, MainMenu, Game, GameOver]
};

document.addEventListener("DOMContentLoaded", () => {
    new Phaser.Game(config);
});
