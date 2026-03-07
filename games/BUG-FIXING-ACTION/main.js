
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }
    preload() {
        // Load assets
        this.load.image('sky', 'assets/Noisy-code1.jpg');
        this.load.image('platform', 'assets/platform1.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('roopbug', 'assets/roopbug.png', {
            frameWidth: 720,
            frameHeight: 720
        });
        // Load spritesheets with correct config
        this.load.spritesheet('suitman', 'assets/suitman.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('nullbug', 'assets/nullbug.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('pc', 'assets/pc.png');
        // Load audio
        this.load.audio('se_keyboard', 'assets/キーボードの早打ち1.mp3');
        this.load.audio('se_register', 'assets/レジスターで精算.mp3');
    }
    create() {
        // Global Error Handler for on-screen debugging
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            const errText = `Error: ${msg}\nLine: ${lineNo}`;
            console.error(errText);
            // Try to show on current scene
            const game = this.sys.game;
            if (game) {
                const scene = game.scene.getScenes(true)[0]; // Get active scene
                if (scene) {
                    scene.add.text(10, 10, errText, {
                        fontSize: '16px',
                        fill: '#ff0000',
                        backgroundColor: '#000000'
                    }).setDepth(9999).setScrollFactor(0);
                }
            }
            return false;
        };
        // Define animations
        // Front (Down) / Turn? User said "0,1,2 is Front". "1" is used for Turn in example.
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('suitman', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        // Left 3-5
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('suitman', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        // Right 6-8
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('suitman', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        // Turn (Frame 1)
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'suitman', frame: 1 }],
            frameRate: 20
        });
        // Back 9-11 (For Fixing)
        this.anims.create({
            key: 'back',
            frames: this.anims.generateFrameNumbers('suitman', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        // Bug Animation? 
        // Let's create a default one
        this.anims.create({
            key: 'bug_idle',
            frames: this.anims.generateFrameNumbers('nullbug', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });
        // Reuse bug_idle for roopbug for now strictly speaking roopbug needs its own anim if we had different frames
        // But since we use placeholder nullbug.png, we can reuse 'bug_idle' or make a new one 'roop_idle' pointing to roopbug texture
        this.anims.create({
            key: 'roop_idle',
            frames: this.anims.generateFrameNumbers('roopbug', { start: 0, end: 0 }), // Assuming same layout
            frameRate: 5,
            repeat: -1
        });
        this.scene.start('StartScene');
    }
}
class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }
    create() {
        this.add.image(400, 300, 'sky').setDisplaySize(800, 600);
        this.add.text(400, 200, 'BUG FIXING ACTION', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(400, 350, 'Press SPACE to Start', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(400, 450, 'Arrows: Move  |  Hold E: Fix Bugs', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        const menuBtn = this.add.text(400, 520, '← メニューに戻る', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#333333'
        })
            .setOrigin(0.5)
            .setPadding(16, 8)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);
        
        menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#00ffc3' }));
        menuBtn.on('pointerout', () => menuBtn.setStyle({ fill: '#ffffff' }));
        menuBtn.on('pointerdown', () => {
            location.href = '../../index.html';
        });
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    init() {
        this.score = 0;
        this.gameTime = 0;
        this.difficultyLevel = 1;
        this.isGameOver = false;
        this.fixingTarget = null;
        this.fixingProgress = 0;
        this.isFixing = false;
        // Audio
        this.seKeyboard = null;
        this.seRegister = null;
        // Reset dynamic groups
        this.roopChildren = null;
    }
    create() {
        // Ensure physics is running
        this.physics.resume();
        // --- Background & Platforms ---
        this.add.image(400, 300, 'sky').setDisplaySize(800, 600);
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'platform').setDisplaySize(800, 64).refreshBody();
        this.platforms.create(600, 400, 'platform').setDisplaySize(300, 32).refreshBody();
        this.platforms.create(100, 350, 'platform').setDisplaySize(300, 32).refreshBody();
        this.platforms.create(750, 250, 'platform').setDisplaySize(300, 32).refreshBody();
        this.platforms.create(400, 300, 'platform').setDisplaySize(200, 32).refreshBody(); // New center platform
        // --- Player ---
        this.player = this.physics.add.sprite(100, 450, 'suitman');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        // Size: The frame is 32x32. We can leave it, or scale slightly.
        // Let's keep it native 32x32 for crisp pixel art, or scaling x1.5?
        // User didn't request resizing, just "use these assets".
        // The previous code had setDisplaySize(48, 48). I'll keep it native or let user decide?
        // User complaint was about "giant images". 32x32 is small. 
        // I will NOT use setDisplaySize on player to respect the sprite frame.
        // But maybe x1.5 to make it visible?
        // Let's stick to default scale (1.0) which is 32px.
        // Or maybe 1.5?
        // I'll set scale to 1.5 to make it look nice but pixelated (setNearest not available easily in simple config? default is usually linear).
        // I'll leave at 1.0 (32px).
        this.player.setDepth(1); // Ensure player is in front
        this.physics.add.collider(this.player, this.platforms);
        // --- PC Sprite (Hidden) ---
        this.pcSprite = this.add.image(0, 0, 'pc');
        this.pcSprite.setVisible(false);
        this.pcSprite.setDisplaySize(56, 56); // Force small size for pixel art look
        this.pcSprite.setDepth(0); // Behind player
        // --- Inputs ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        // --- Enemies (Bugs) ---
        this.bugs = this.physics.add.group({
            runChildUpdate: true,
            allowGravity: true,
            collideWorldBounds: true
        });
        // Only Nullbugs should collide with platforms. Roopbugs (ghosts) should not.
        this.physics.add.collider(this.bugs, this.platforms, null, (bug, platform) => {
            // Process Callback: Return true to collide, false to ignore
            return bug.bugType === 'nullbug';
        }, this);
        // --- Null Areas ---
        // Group for Null Areas
        this.nullAreas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        // Collision with player -> Game Over
        this.physics.add.overlap(this.player, this.nullAreas, this.hitNullArea, null, this);
        // --- Spikes (Bombs) ---
        this.spikes = this.physics.add.group();
        this.physics.add.collider(this.spikes, this.platforms);
        this.physics.add.collider(this.player, this.spikes, this.hitSpike, null, this);
        // --- UI ---
        this.scoreText = this.add.text(16, 16, '給料: ¥0', {
            fontSize: '24px',
            fill: '#000',
            backgroundColor: '#ffffff88'
        });
        this.scoreText.setPadding(8, 4);
        this.levelText = this.add.text(600, 16, 'Lv: 1', {
            fontSize: '24px',
            fill: '#fcfcfc'
        });
        this.hintText = this.add.text(0, 0, 'Hold E', {
            fontSize: '16px',
            fill: '#000',
            backgroundColor: '#fff'
        }).setVisible(false).setOrigin(0.5);
        this.progressGraphics = this.add.graphics();
        this.progressGraphics = this.add.graphics();
        // --- Audio ---
        this.seKeyboard = this.sound.add('se_keyboard', { loop: true, volume: 0.5 });
        this.seRegister = this.sound.add('se_register', { loop: false, volume: 0.6 });
        // --- Game Loop Timer ---
        this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });
        this.updateDifficulty();
    }
    updateGameTime() {
        if (this.isGameOver) return;
        this.gameTime++;
        if (this.gameTime % 20 === 0 && this.difficultyLevel < 20) { // Changed 30 to 28
            this.difficultyLevel++;
            if (this.difficultyLevel > 20) this.difficultyLevel = 20;
        }
        this.updateDifficulty();
        this.levelText.setText(`Lv: ${this.difficultyLevel}`);
    }
    updateDifficulty() {
        let maxBugs = 1;
        if (this.difficultyLevel >= 10) maxBugs = 4;
        else if (this.difficultyLevel >= 5) maxBugs = 3;
        else if (this.difficultyLevel >= 2) maxBugs = 2;
        let spikeInterval = 12000;
        if (this.difficultyLevel >= 20) spikeInterval = 5000;
        else if (this.difficultyLevel >= 10) spikeInterval = 6000;
        else if (this.difficultyLevel >= 5) spikeInterval = 8000;
        else spikeInterval = 12000 - (this.difficultyLevel - 1) * 500;
        this.currentMaxBugs = maxBugs;
        this.currentSpikeInterval = spikeInterval;
        const currentCount = this.bugs.countActive(true);
        if (currentCount < this.currentMaxBugs) {
            const needed = this.currentMaxBugs - currentCount;
            for (let i = 0; i < needed; i++) {
                this.spawnBug();
            }
        }
    }
    spawnBug() {
        const x = Phaser.Math.Between(50, 750);
        const y = 100;
        // Randomly decide type: Nullbug (0) or Roopbug (1)
        const type = Phaser.Math.Between(0, 1) === 0 ? 'nullbug' : 'roopbug';
        let bug;
        if (type === 'nullbug') {
            bug = this.bugs.create(x, y, 'nullbug');
            bug.anims.play('bug_idle', true);
            bug.bugType = 'nullbug';
            // Generate Null Area
            // Random position on screen, radius ~1x player (32px).
            // Position: > 4 * 32px (128px) from player.
            let areaX, areaY;
            let attempts = 0;
            let validPosition = false;
            while (!validPosition && attempts < 20) {
                areaX = Phaser.Math.Between(50, 750);
                areaY = Phaser.Math.Between(50, 550);
                const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, areaX, areaY);
                if (dist > 128) { // 4 * 32 = 128
                    validPosition = true;
                }
                attempts++;
            }
            if (!validPosition) {
                areaX = Phaser.Math.Between(50, 750);
                areaY = Phaser.Math.Between(50, 550);
            }
            const radius = 32; // Reduced from 64
            const nullArea = this.add.circle(areaX, areaY, radius, 0x000000, 0.5); // Black transparent circle
            this.physics.add.existing(nullArea);
            nullArea.body.setCircle(radius);
            nullArea.body.setAllowGravity(false);
            nullArea.body.setImmovable(true);
            // Add text "null"
            const nullText = this.add.text(areaX, areaY, 'null', {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5);
            // Link to bug so we can destroy it later
            bug.linkedNullArea = nullArea;
            bug.linkedNullText = nullText;
            this.nullAreas.add(nullArea); // Add to group for collision
        } else {
            // Roopbug
            bug = this.bugs.create(x, y, 'roopbug');
            bug.anims.play('roop_idle', true);
            bug.bugType = 'roopbug';
            bug.lastChildSpawnTime = this.time.now;
            bug.childrenBugs = []; // Track children
            // Figure-8 Movement Properties
            bug.body.allowGravity = false; // Disable gravity for floating movement
            bug.setVelocity(0, 0); // Manual control
            // bug.body.moves = false; // REMOVED: This causes rendering to freeze in some versions/browsers
            bug.originX = x;
            bug.originY = y;
            bug.t = 0; // Time/Angle
            // Speed adjustments: previously 0.02 per frame. 
            // 60fps -> 1.2 per second. 
            bug.speed = 1.5; // Radians per second approximately
            bug.radiusX = 100; // Width of loop
            bug.radiusY = 50;  // Height of loop
            // Explicitly set position again
            bug.setPosition(x, y);
            // User requested to hide the parent bug and only show children
            bug.setVisible(false);
            bug.setCollideWorldBounds(false);
        }
        bug.setBounce(0.2);
        if (bug.bugType !== 'roopbug') {
            bug.setCollideWorldBounds(true);
            bug.setVelocityX(Phaser.Math.Between(-50, 50));
        }
        bug.nextAttackTime = this.time.now + this.currentSpikeInterval + Phaser.Math.Between(0, 2000);
    }
    update(time, delta) {
        if (this.isGameOver) return;
        // --- Player Control ---
        if (this.isFixing) {
            this.player.setVelocityX(0);
            this.player.anims.play('back', true);
            // Show PC
            this.pcSprite.setVisible(true);
            this.pcSprite.setPosition(this.player.x, this.player.y - 12); // Slightly "North" (behind in 2.5D view)
            // "Adding a PC... fixing..." 
            // Position it slightly in front z-index wise (done via setDepth).
            // Position xy: maybe slighly lower?
        } else {
            this.pcSprite.setVisible(false);
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            }
            else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn', true);
            }
            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-450);
            }
        }
        // --- Bug Logic ---
        this.bugs.children.iterate((bug) => {
            if (!bug || !bug.active) return;
            // If this bug is being fixed, freeze it and do nothing
            if (bug === this.fixingTarget) {
                bug.setVelocity(0, 0);
                return;
            }
            if (bug.body.touching.down && Math.random() < 0.02) {
                bug.setVelocityX(Phaser.Math.Between(-30, 30));
                if (Math.random() < 0.3) bug.setVelocityY(-200);
            }
            if (time > bug.nextAttackTime) {
                // Nullbug does NOT shoot spikes anymore
                if (bug.bugType !== 'nullbug') {
                    this.spawnSpike(bug.x, bug.y);
                }
                bug.nextAttackTime = time + this.currentSpikeInterval;
            }
            // Roopbug logic: Spawn child & Movement
            if (bug.bugType === 'roopbug') {
                // Figure-8 Movement (Lemniscate of Bernoulli or Lissajous)
                // x = A * cos(t), y = B * sin(2t) / 2
                // Use delta for smooth movement frame-rate independence
                bug.t += (delta * 0.001) * bug.speed;
                const offsetX = bug.radiusX * Math.cos(bug.t);
                const offsetY = bug.radiusY * Math.sin(2 * bug.t) / 2;
                bug.setPosition(bug.originX + offsetX, bug.originY + offsetY);
                // DEBUG: Log state occasionally to debug visibility
                if (Math.random() < 0.01) {
                    console.log(`Roopbug: visible=${bug.visible}, alpha=${bug.alpha}, active=${bug.active}, x=${bug.x}, y=${bug.y}, frame=${bug.frame.name}`);
                }
                // Spawn children logic
                if (time > bug.lastChildSpawnTime + 5000) { // Every 5 seconds
                    if (bug.childrenBugs.length < 8) {
                        this.spawnRoopChild(bug);
                    }
                    bug.lastChildSpawnTime = time;
                }
            }
        });
        // Update Roopbug Children (Follow logic)
        if (this.roopChildren) {
            this.roopChildren.children.iterate((child) => {
                if (!child || !child.active) return;
                // Attack
                if (time > child.nextAttackTime) {
                    this.spawnSpike(child.x, child.y);
                    child.nextAttackTime = time + this.currentSpikeInterval;
                }
                // Movement: Follow Parent
                const parent = child.parentBug;
                if (parent && parent.active) {
                    // child.t ensures they are spaced out or follow in line
                    // We need to store 't' offset on child
                    const followDelay = (parent.childrenBugs.indexOf(child) + 1) * 0.5; // Spacing
                    const currentT = parent.t - followDelay;
                    const offsetX = parent.radiusX * Math.cos(currentT);
                    const offsetY = parent.radiusY * Math.sin(2 * currentT) / 2;
                    child.setPosition(parent.originX + offsetX, parent.originY + offsetY);
                } else {
                    // If parent is dead, destroy child
                    child.destroy();
                }
            });
        }
        // Debug info update
        let roopCount = 0;
        let lastRoopPos = '';
        this.bugs.children.iterate(b => {
            if (b.bugType === 'roopbug') {
                roopCount++;
                lastRoopPos = `(${Math.floor(b.x)}, ${Math.floor(b.y)})`;
            }
        });
        if (this.debugText) {
            this.debugText.setText(`Roopbugs: ${roopCount} Last: ${lastRoopPos}\nScore: ${this.score}`);
        }
        this.handleFixing(time, delta);
    }
    spawnRoopChild(parentBug) {
        if (!this.roopChildren) {
            this.roopChildren = this.physics.add.group({
                allowGravity: false, // Updated to false for path following
                collideWorldBounds: true
            });
            // We might not need platform collision if they follow path strictly
            // this.physics.add.collider(this.roopChildren, this.platforms);
        }
        // Initial position (will be updated in update loop immediately)
        const child = this.roopChildren.create(parentBug.x, parentBug.y, 'roopbug');
        child.setScale(0.07); // Made larger (was 0.6)
        // Softer/Subtle color change (Pastel-ish)
        // HSL: Random Hue, Low Saturation (0.5), High Lightness (0.8)
        const hsv = Phaser.Display.Color.HSVToRGB(Math.random(), 0.5, 0.9);
        // child.setTint(hsv.color);
        child.setDepth(10); // Ensure visible
        child.body.allowGravity = false;
        child.setVelocity(0, 0);
        // child.body.moves = false; // REMOVED
        child.setCollideWorldBounds(false); // Let it ghost
        child.nextAttackTime = this.time.now + this.currentSpikeInterval + Phaser.Math.Between(0, 2000);
        child.parentBug = parentBug;
        parentBug.childrenBugs.push(child);
    }
    spawnSpike(x, y) {
        if (this.spikes.countActive(true) >= 20) return;
        const spike = this.spikes.create(x, y, 'bomb');
        spike.setDisplaySize(16, 16);
        spike.setCircle(6); // 32x32 -> ~16 radius
        spike.setBounce(1);
        spike.setCollideWorldBounds(true);
        spike.body.allowGravity = false; // No gravity for bombs
        spike.setVelocity(Phaser.Math.Between(-200, 200), -200);
        this.time.delayedCall(20000, () => {
            if (spike && spike.active) spike.destroy();
        });
    }
    hitNullArea(player, nullArea) {
        this.hitSpike(player, null); // Re-use hitSpike logic for Game Over
    }
    handleFixing(time, delta) {
        const FIX_RANGE = 50;
        if (this.isFixing) {
            if (!this.keyE.isDown) {
                this.cancelFixing();
                return;
            }
            if (!this.fixingTarget || !this.fixingTarget.active) {
                this.cancelFixing();
                return;
            }
            this.fixingProgress += delta;
            this.drawProgress(this.player.x, this.player.y - 30, this.fixingProgress / 3000);
            if (this.fixingProgress >= 3000) {
                this.completeFixing();
            }
        } else {
            let closestBug = null;
            let closestDist = Infinity;
            this.bugs.children.iterate((bug) => {
                if (!bug.active) return;
                const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, bug.x, bug.y);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestBug = bug;
                }
            });
            if (closestBug && closestDist <= FIX_RANGE) {
                this.hintText.setPosition(closestBug.x, closestBug.y - 30);
                this.hintText.setVisible(true);
                if (this.keyE.isDown) {
                    this.startFixing(closestBug);
                }
            } else {
                this.hintText.setVisible(false);
            }
        }
    }
    startFixing(bug) {
        this.isFixing = true;
        this.fixingTarget = bug;
        // Freeze logic is handled in the update loop, but we ensure gravity doesn't mess it up? 
        // Actually update loop setVelocity(0,0) is enough if we do it every frame, 
        // but let's disable gravity temporarily to be safe so they don't slide.
        this.fixingTarget.body.allowGravity = false;
        this.fixingProgress = 0;
        this.hintText.setVisible(false);
        if (this.seKeyboard && !this.seKeyboard.isPlaying) {
            this.seKeyboard.play();
        }
    }
    cancelFixing() {
        if (this.fixingTarget && this.fixingTarget.active) {
            // Restore gravity
            this.fixingTarget.body.allowGravity = true;
        }
        this.isFixing = false;
        this.fixingTarget = null;
        this.fixingProgress = 0;
        this.progressGraphics.clear();
        this.pcSprite.setVisible(false);
        if (this.seKeyboard && this.seKeyboard.isPlaying) {
            this.seKeyboard.stop();
        }
    }
    completeFixing() {
        if (this.fixingTarget) {
            // Cleanup based on type
            if (this.fixingTarget.bugType === 'nullbug') {
                if (this.fixingTarget.linkedNullArea) this.fixingTarget.linkedNullArea.destroy();
                if (this.fixingTarget.linkedNullText) this.fixingTarget.linkedNullText.destroy();
            } else if (this.fixingTarget.bugType === 'roopbug') {
                // Destroy children
                if (this.fixingTarget.childrenBugs) {
                    this.fixingTarget.childrenBugs.forEach(child => {
                        if (child && child.active) child.destroy();
                    });
                }
            }
            this.fixingTarget.destroy(); // This makes active=false
        }
        this.score += 1000;
        this.scoreText.setText(`給料: ¥${this.score.toLocaleString()}`);
        if (this.seKeyboard) this.seKeyboard.stop();
        if (this.seRegister) this.seRegister.play();
        this.cancelFixing(); // This will reset target and flags
        this.updateDifficulty();
    }
    drawProgress(x, y, percentage) {
        this.progressGraphics.clear();
        this.progressGraphics.lineStyle(4, 0x00ff00);
        this.progressGraphics.beginPath();
        this.progressGraphics.arc(x, y, 20, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-90 + 360 * percentage), false);
        this.progressGraphics.strokePath();
    }
    hitSpike(player, spike) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.isGameOver = true;
        this.progressGraphics.clear();
        this.hintText.setVisible(false);
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { score: this.score });
        });
    }
}
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }
    init(data) {
        this.finalScore = data.score || 0;
    }
    create() {
        this.add.image(400, 300, 'sky').setDisplaySize(800, 600);
        this.add.text(400, 200, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(400, 300, `今月の給料: ¥${this.finalScore.toLocaleString()}`, {
            fontSize: '48px',
            fill: '#228B22', // ForestGreen or suitable "Money" color
            fontStyle: 'bold'
        }).setOrigin(0.5);
        // Stop any looping sounds if they are playing (edge case)
        // Since we switch scenes, sounds *should* stop if they are scene-bound, 
        // but SoundManager is global. We need to be careful? 
        // Phaser 3 sounds are usually scene-bound if added via this.sound.add? 
        // Actually no, sound manager is global.
        this.sound.stopAll();
        const retryText = this.add.text(400, 450, '▶ Retry', {
            fontSize: '32px',
            fill: '#000',
            padding: { x: 20, y: 10 },
            backgroundColor: '#cccccc' // Add background to make it look like a button
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true }) // Hand cursor
            .setDepth(100); // Ensure high depth
        retryText.on('pointerdown', () => {
            console.log('Retry clicked');
            retryText.setTint(0x00ff00); // Feedback
            this.scene.start('GameScene');
        });
        const titleText = this.add.text(400, 550, '▶ Title', { // Increased spacing
            fontSize: '32px',
            fill: '#000',
            padding: { x: 20, y: 10 },
            backgroundColor: '#cccccc'
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(100);
        titleText.on('pointerdown', () => {
            console.log('Title clicked');
            titleText.setTint(0x00ff00); // Feedback
            this.scene.start('StartScene');
        });
    }
}
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: document.body,
    pixelArt: true, // Enable for crisp sprites
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: [BootScene, StartScene, GameScene, GameOverScene]
};
const game = new Phaser.Game(config);