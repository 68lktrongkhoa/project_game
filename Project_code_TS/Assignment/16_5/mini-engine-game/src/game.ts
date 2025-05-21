import { GameEngine, Sprite, Button, GameObject } from './engine.js';

const POINTS_PER_LEVEL = 200;
const INITIAL_PLAYER_BULLET_SPEED_MULTIPLIER = 1;
const INITIAL_PLAYER_BULLET_DAMAGE = 1;
const PLAYER_BULLET_SPEED_INCREASE_PER_LEVEL = 0.1;
const PLAYER_BULLET_DAMAGE_INCREASE_PER_LEVEL = 0.5;
class Player extends Sprite {
    speed: number = 200;
    private engine: GameEngine;
    public canShoot: boolean = true;
    private shootCooldown: number = 0.5;
    private timeSinceLastShot: number = 0;

    public bulletSpeedMultiplier: number = INITIAL_PLAYER_BULLET_SPEED_MULTIPLIER;
    public bulletDamage: number = INITIAL_PLAYER_BULLET_DAMAGE;

    constructor(x: number, y: number, engine: GameEngine) {
        super(x, y, 50, 50, 'assets/main_assets/ship.png');
        this.engine = engine;
    }

    update(deltaTime: number): void {
        const input = this.engine.getInputState();
        if (input['a'] || input['arrowleft']) {
            this.x -= this.speed * deltaTime;
        }
        if (input['d'] || input['arrowright']) {
            this.x += this.speed * deltaTime;
        }

        const canvasWidth = this.engine.getCanvas().width;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;

        this.timeSinceLastShot += deltaTime;
        if (this.timeSinceLastShot >= this.shootCooldown) {
            this.canShoot = true;
        }

        if (input[' '] && this.canShoot) {
            this.shoot();
            this.canShoot = false;
            this.timeSinceLastShot = 0;
        }
    }

    shoot(): void {
        const bulletX = this.x + this.width / 2 - 2.5; 
        const bulletY = this.y;
        const bullet = new Bullet(
            bulletX, bulletY, this.engine,
            this.bulletDamage,
            400 * this.bulletSpeedMultiplier
        );
        this.engine.addGameObject(bullet);
    }

    resetStats(): void {
        this.bulletDamage = INITIAL_PLAYER_BULLET_DAMAGE;
        this.bulletSpeedMultiplier = INITIAL_PLAYER_BULLET_SPEED_MULTIPLIER;
        this.canShoot = true;
        this.timeSinceLastShot = 0;
    }

    levelUp(): void {
        this.bulletSpeedMultiplier += PLAYER_BULLET_SPEED_INCREASE_PER_LEVEL;
        this.bulletDamage += PLAYER_BULLET_DAMAGE_INCREASE_PER_LEVEL;
        console.log(`Player level up! Bullet Dmg: ${this.bulletDamage.toFixed(1)}, Bullet Speed Multi: ${this.bulletSpeedMultiplier.toFixed(1)}`);
    }
}

class Bullet extends Sprite {
    speed: number; 
    private engine: GameEngine;
    public damage: number;

    constructor(x: number, y: number, engine: GameEngine, damage: number, speed: number = 400) {
        super(x, y, 10, 20, 'assets/main_assets/bullet/a3.png');
        this.engine = engine;
        this.damage = damage;
        this.speed = speed;
    }

    update(deltaTime: number): void {
        this.y -= this.speed * deltaTime;
        if (this.y + this.height < 0) {
            this.engine.removeGameObject(this);
        }
    }
}

class Chicken extends Sprite {
    speed: number = 50;
    private engine: GameEngine;
    public points: number = 10;

    constructor(x: number, y: number, engine: GameEngine) {
        super(x, y, 40, 40, 'assets/chicken.png');
        this.engine = engine;
        this.speed = 50 + Math.random() * 50;
    }

    update(deltaTime: number): void {
        this.y += this.speed * deltaTime;
        if (this.y > this.engine.getCanvas().height) {
            this.engine.removeGameObject(this);
            if (this.engine.gameState === 'PLAYING' && !(this.engine as any).gameInstance.isBossFight) { // Cần cách truy cập isBossFight tốt hơn
                 (this.engine as any).gameInstance.triggerGameOver("Chicken reached bottom");
            }
        }
    }
}

class BossBullet extends Sprite {
    speed: number = 250;
    private engine: GameEngine;
    public damage: number;

    constructor(x: number, y: number, engine: GameEngine, damage: number, speed?: number) {
        super(x, y, 10, 20, 'assets/main_assets/Enemy/egg2.png');
        this.engine = engine;
        this.damage = damage;
        if (speed) this.speed = speed;
    }

    update(deltaTime: number): void {
        this.y += this.speed * deltaTime;
        if (this.y > this.engine.getCanvas().height) {
            this.engine.removeGameObject(this);
        }
    }
}

class BossRed extends Sprite {
    private engine: GameEngine;
    public health: number;
    public maxHealth: number;
    private speed: number;
    private direction: number = 1;
    private shootCooldownBase: number = 2; 
    private shootCooldownVariance: number = 1;
    private currentShootCooldown: number;
    private timeSinceLastShot: number = 0;
    private bulletDamage: number;
    private bulletSpeed: number;
    public points: number = 100;

    constructor(x: number, y: number, engine: GameEngine, level: number) {
        super(x, y, 200, 200, 'assets/main_assets/Enemy/bossPurple.png');
        this.engine = engine;

        this.maxHealth = 100 + (level -1) * 50; 
        this.health = this.maxHealth;
        this.speed = 60 + (level-1) * 10;
        this.bulletDamage = 10 + (level-1) * 5;
        this.bulletSpeed = 200 + (level-1) * 20;
        this.shootCooldownBase = Math.max(0.5, 2 - (level-1) * 0.2);
        this.currentShootCooldown = this.shootCooldownBase + (Math.random() * this.shootCooldownVariance) - (this.shootCooldownVariance / 2);

        console.log(`Boss spawned Lvl ${level}: HP ${this.health}, Speed ${this.speed}, BulletDmg ${this.bulletDamage}`);
    }

    update(deltaTime: number): void {
        this.x += this.speed * this.direction * deltaTime;
        const canvasWidth = this.engine.getCanvas().width;
        if (this.x <= 0) {
            this.x = 0;
            this.direction = 1;
        } else if (this.x + this.width >= canvasWidth) {
            this.x = canvasWidth - this.width;
            this.direction = -1;
        }

        this.timeSinceLastShot += deltaTime;
        if (this.timeSinceLastShot >= this.currentShootCooldown) {
            this.shoot();
            this.timeSinceLastShot = 0;
            this.currentShootCooldown = this.shootCooldownBase + (Math.random() * this.shootCooldownVariance) - (this.shootCooldownVariance / 2);
        }
    }

    shoot(): void {
        const bulletX = this.x + this.width / 2 - 5;
        const bulletY = this.y + this.height;
        const bossBullet = new BossBullet(bulletX, bulletY, this.engine, this.bulletDamage, this.bulletSpeed);
        this.engine.addGameObject(bossBullet);
    }

    takeDamage(amount: number): void {
        this.health -= amount;
        console.log(`Boss took ${amount} damage, HP left: ${this.health}`);
        if (this.health <= 0) {
            this.health = 0;
        }
    }
}


// --- MAIN GAME CLASS ---
export class ChickenShooterGame {
    private engine: GameEngine;
    private player!: Player;
    private chickens: Chicken[] = [];
    private bullets: Bullet[] = [];
    private score: number = 0;
    private chickenSpawnTimer: number = 0;
    private chickenSpawnInterval: number = 1.5; // Giảm thời gian spawn gà

    // Leveling and Boss
    private currentLevel: number = 1;
    private pointsToNextLevel: number = POINTS_PER_LEVEL;
    public isBossFight: boolean = false;
    private boss: BossRed | null = null;

    // UI Buttons
    private startButton!: Button;
    private restartButton!: Button;
    private pauseButton!: Button;
    private continueButton!: Button;
    private restartPausedButton!: Button;


    constructor(engine: GameEngine) {
        this.engine = engine;
        (this.engine as any).gameInstance = this;
        this.engine.onStateChange = this.handleGameStateChange.bind(this);
        this.createButtons();
        this.setupMenu(); 
    }

    private createButtons(): void {
        const canvas = this.engine.getCanvas();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        this.startButton = new Button(
            centerX - 75, centerY - 25, 150, 50, 'Start Game',
            () => this.engine.setGameState('PLAYING')
        );
        this.engine.addGameObject(this.startButton);

        this.restartButton = new Button(
            centerX - 75, centerY + 50, 150, 50, 'Restart',
            () => this.engine.setGameState('PLAYING') 
        );
        this.engine.addGameObject(this.restartButton);

        this.pauseButton = new Button(
            canvas.width - 110, 10, 100, 40, 'Pause (P)',
            () => this.engine.setGameState('PAUSED')
        );
        this.engine.addGameObject(this.pauseButton);

        this.continueButton = new Button(
            centerX - 75, centerY - 50, 150, 50, 'Continue (P)',
            () => this.engine.setGameState('PLAYING')
        );
        this.engine.addGameObject(this.continueButton);

        this.restartPausedButton = new Button(
            centerX - 75, centerY + 20, 150, 50, 'Restart Game',
            () => this.engine.setGameState('MENU')
        );
        this.engine.addGameObject(this.restartPausedButton);
        this.hideAllDialogButtons();
    }

    private hideAllDialogButtons(): void {
        this.startButton.isVisible = false;
        this.restartButton.isVisible = false;
        this.pauseButton.isVisible = false;
        this.continueButton.isVisible = false;
        this.restartPausedButton.isVisible = false;
    }


    private setupMenu(): void {
        this.engine.clearGameObjects();
        this.createButtons();

        this.hideAllDialogButtons();
        this.startButton.isVisible = true;
    }

    private setupGame(): void {
        this.engine.clearGameObjects();
        this.createButtons();

        this.hideAllDialogButtons();
        this.pauseButton.isVisible = true;

        const canvas = this.engine.getCanvas();
        this.player = new Player(canvas.width / 2 - 25, canvas.height - 60, this.engine);
        this.player.resetStats();
        this.engine.addGameObject(this.player);

        this.score = 0;
        this.currentLevel = 1;
        this.pointsToNextLevel = POINTS_PER_LEVEL;
        this.isBossFight = false;
        this.boss = null;
        this.chickenSpawnTimer = 0;
        this.chickenSpawnInterval = 1.5;
    }

    private setupGameOver(): void {
        this.engine.clearGameObjects();
        this.createButtons();

        this.hideAllDialogButtons();
        this.restartButton.isVisible = true;
    }

    private setupPauseScreen(): void {
        this.hideAllDialogButtons();
        this.continueButton.isVisible = true;
        this.restartPausedButton.isVisible = true;
    }


    private handleGameStateChange(newState: GameEngine['gameState']): void {
        if (newState === 'MENU') {
            this.setupMenu();
        } else if (newState === 'PLAYING') {
            if (this.engine.gameState !== 'PAUSED') {
                 this.setupGame();
            } else {
                this.hideAllDialogButtons();
                this.pauseButton.isVisible = true;
            }
        } else if (newState === 'GAME_OVER') {
            this.setupGameOver();
        } else if (newState === 'PAUSED') {
            this.setupPauseScreen();
        }
    }

    public triggerGameOver(reason: string): void {
        console.log("Game Over:", reason);
        this.engine.setGameState('GAME_OVER');
    }


    public update(deltaTime: number): void {
        if (this.engine.gameState !== 'PLAYING') return;
        const bullets = this.engine.getGameObjectsOfType(Bullet);
        const chickens = this.engine.getGameObjectsOfType(Chicken);
        const bossBullets = this.engine.getGameObjectsOfType(BossBullet);

        // --- Boss Fight Logic ---
        if (this.isBossFight) {
            if (this.boss && this.boss.health > 0) {
                for (let i = bullets.length - 1; i >= 0; i--) {
                    const bullet = bullets[i];
                    if (this.boss.isCollidingWith(bullet)) {
                        this.boss.takeDamage(bullet.damage);
                        this.engine.removeGameObject(bullet);
                        if (this.boss.health <= 0) {
                            this.score += this.boss.points;
                            this.engine.removeGameObject(this.boss);
                            this.boss = null;
                            this.isBossFight = false;
                            this.currentLevel++;
                            this.pointsToNextLevel = this.score + POINTS_PER_LEVEL; 
                            this.player.levelUp(); 
                            this.chickenSpawnInterval = Math.max(0.5, 1.5 - (this.currentLevel-1) * 0.1);
                            console.log(`Boss defeated! Next level: ${this.currentLevel}. Points for next boss: ${this.pointsToNextLevel}`);
                            break;
                        }
                    }
                }
                // Boss bullets vs Player
                for (let i = bossBullets.length - 1; i >= 0; i--) {
                    const bossBullet = bossBullets[i];
                    if (this.player.isCollidingWith(bossBullet)) {
                        this.engine.removeGameObject(bossBullet);
                        bossBullets.splice(i, 1);
                        this.triggerGameOver("Hit by boss bullet");
                        return;
                    }
                }
            }
        }
        // --- Regular Gameplay Logic (Not Boss Fight) ---
        else {
            this.chickenSpawnTimer += deltaTime;
            if (this.chickenSpawnTimer >= this.chickenSpawnInterval) {
                this.spawnChicken();
                this.chickenSpawnTimer = 0;
            }

            for (let i = bullets.length - 1; i >= 0; i--) {
                const bullet = bullets[i];
                for (let j = chickens.length - 1; j >= 0; j--) {
                    const chicken = chickens[j];
                    if (bullet.isCollidingWith(chicken)) {
                        this.engine.removeGameObject(bullet);
                        this.engine.removeGameObject(chicken);
                        bullets.splice(i, 1);
                        this.score += chicken.points;
                        if (!this.isBossFight && this.score >= this.pointsToNextLevel) {
                            this.isBossFight = true;
                            this.spawnBoss();
                            this.engine.getGameObjectsOfType(Chicken).forEach(c => this.engine.removeGameObject(c));
                            console.log(`Score ${this.score} reached! Boss fight starting!`);
                        }
                        break;
                    }
                }
            }

            // Chickens vs Player
            for (const chicken of chickens) { 
                if (chicken.isCollidingWith(this.player)) {
                    this.triggerGameOver("Collided with chicken");
                    return;
                }
            }
        }
    }

    private spawnChicken(): void {
        const canvasWidth = this.engine.getCanvas().width;
        const chickenWidth = 40;
        const x = Math.random() * (canvasWidth - chickenWidth);
        const y = -40;
        const chicken = new Chicken(x, y, this.engine);
        this.engine.addGameObject(chicken);
    }

    private spawnBoss(): void {
        if (this.boss) return;
        const canvas = this.engine.getCanvas();
        this.boss = new BossRed(canvas.width / 2 - 40, 50, this.engine, this.currentLevel);
        this.engine.addGameObject(this.boss);
    }


    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.engine.gameState === 'PLAYING' || this.engine.gameState === 'PAUSED') {
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${this.score}`, 10, 30);
            ctx.fillText(`Level: ${this.currentLevel}`, 10, 60);
            if (!this.isBossFight) {
                 ctx.fillText(`Next Boss: ${this.pointsToNextLevel}`, 10, 90);
            }


            if (this.isBossFight && this.boss) {
                const bossHealthBarWidth = 200;
                const bossHealthBarHeight = 20;
                const bossHealthBarX = this.engine.getCanvas().width / 2 - bossHealthBarWidth / 2;
                const bossHealthBarY = 10;

                ctx.fillStyle = 'grey';
                ctx.fillRect(bossHealthBarX, bossHealthBarY, bossHealthBarWidth, bossHealthBarHeight);

                const currentHealthWidth = (this.boss.health / this.boss.maxHealth) * bossHealthBarWidth;
                ctx.fillStyle = 'red';
                ctx.fillRect(bossHealthBarX, bossHealthBarY, currentHealthWidth, bossHealthBarHeight);

                ctx.fillStyle = 'white';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`BOSS HP: ${this.boss.health}/${this.boss.maxHealth}`, this.engine.getCanvas().width / 2, bossHealthBarY + 15);
            }
        }

        if (this.engine.gameState === 'GAME_OVER') {
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 60);
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${this.score}`, this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 20);
            ctx.fillText(`Reached Level: ${this.currentLevel}`, this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 + 10);
        } else if (this.engine.gameState === 'MENU') {
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Chicken Shooter Deluxe', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 120);
        } else if (this.engine.gameState === 'PAUSED') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
            ctx.fillRect(0,0, this.engine.getCanvas().width, this.engine.getCanvas().height);

            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 100);

        }
    }
}