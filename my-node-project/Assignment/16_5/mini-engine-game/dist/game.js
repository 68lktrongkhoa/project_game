import { Sprite, Button } from './engine.js';
const POINTS_PER_LEVEL = 200;
const INITIAL_PLAYER_BULLET_SPEED_MULTIPLIER = 1;
const INITIAL_PLAYER_BULLET_DAMAGE = 1;
const PLAYER_BULLET_SPEED_INCREASE_PER_LEVEL = 0.1;
const PLAYER_BULLET_DAMAGE_INCREASE_PER_LEVEL = 0.5;
class Player extends Sprite {
    constructor(x, y, engine) {
        super(x, y, 50, 50, 'assets/main_assets/ship.png');
        this.speed = 200;
        this.canShoot = true;
        this.shootCooldown = 0.5;
        this.timeSinceLastShot = 0;
        this.bulletSpeedMultiplier = INITIAL_PLAYER_BULLET_SPEED_MULTIPLIER;
        this.bulletDamage = INITIAL_PLAYER_BULLET_DAMAGE;
        this.engine = engine;
    }
    update(deltaTime) {
        const input = this.engine.getInputState();
        if (input['a'] || input['arrowleft']) {
            this.x -= this.speed * deltaTime;
        }
        if (input['d'] || input['arrowright']) {
            this.x += this.speed * deltaTime;
        }
        const canvasWidth = this.engine.getCanvas().width;
        if (this.x < 0)
            this.x = 0;
        if (this.x + this.width > canvasWidth)
            this.x = canvasWidth - this.width;
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
    shoot() {
        const bulletX = this.x + this.width / 2 - 2.5;
        const bulletY = this.y;
        const bullet = new Bullet(bulletX, bulletY, this.engine, this.bulletDamage, 400 * this.bulletSpeedMultiplier);
        this.engine.addGameObject(bullet);
    }
    resetStats() {
        this.bulletDamage = INITIAL_PLAYER_BULLET_DAMAGE;
        this.bulletSpeedMultiplier = INITIAL_PLAYER_BULLET_SPEED_MULTIPLIER;
        this.canShoot = true;
        this.timeSinceLastShot = 0;
    }
    levelUp() {
        this.bulletSpeedMultiplier += PLAYER_BULLET_SPEED_INCREASE_PER_LEVEL;
        this.bulletDamage += PLAYER_BULLET_DAMAGE_INCREASE_PER_LEVEL;
        console.log(`Player level up! Bullet Dmg: ${this.bulletDamage.toFixed(1)}, Bullet Speed Multi: ${this.bulletSpeedMultiplier.toFixed(1)}`);
    }
}
class Bullet extends Sprite {
    constructor(x, y, engine, damage, speed = 400) {
        super(x, y, 10, 20, 'assets/main_assets/bullet/a3.png');
        this.engine = engine;
        this.damage = damage;
        this.speed = speed;
    }
    update(deltaTime) {
        this.y -= this.speed * deltaTime;
        if (this.y + this.height < 0) {
            this.engine.removeGameObject(this);
        }
    }
}
class Chicken extends Sprite {
    constructor(x, y, engine) {
        super(x, y, 40, 40, 'assets/chicken.png');
        this.speed = 50;
        this.points = 10;
        this.engine = engine;
        this.speed = 50 + Math.random() * 50;
    }
    update(deltaTime) {
        this.y += this.speed * deltaTime;
        if (this.y > this.engine.getCanvas().height) {
            this.engine.removeGameObject(this);
            if (this.engine.gameState === 'PLAYING' && !this.engine.gameInstance.isBossFight) {
                this.engine.gameInstance.triggerGameOver("Chicken reached bottom");
            }
        }
    }
}
class BossBullet extends Sprite {
    constructor(x, y, engine, damage, speed) {
        super(x, y, 10, 20, 'assets/main_assets/Enemy/egg2.png');
        this.speed = 250;
        this.engine = engine;
        this.damage = damage;
        if (speed)
            this.speed = speed;
    }
    update(deltaTime) {
        this.y += this.speed * deltaTime;
        if (this.y > this.engine.getCanvas().height) {
            this.engine.removeGameObject(this);
        }
    }
}
class BossRed extends Sprite {
    constructor(x, y, engine, level) {
        super(x, y, 200, 200, 'assets/main_assets/Enemy/bossPurple.png');
        this.direction = 1;
        this.shootCooldownBase = 2;
        this.shootCooldownVariance = 1;
        this.timeSinceLastShot = 0;
        this.points = 100;
        this.engine = engine;
        this.maxHealth = 100 + (level - 1) * 50;
        this.health = this.maxHealth;
        this.speed = 60 + (level - 1) * 10;
        this.bulletDamage = 10 + (level - 1) * 5;
        this.bulletSpeed = 200 + (level - 1) * 20;
        this.shootCooldownBase = Math.max(0.5, 2 - (level - 1) * 0.2);
        this.currentShootCooldown = this.shootCooldownBase + (Math.random() * this.shootCooldownVariance) - (this.shootCooldownVariance / 2);
        console.log(`Boss spawned Lvl ${level}: HP ${this.health}, Speed ${this.speed}, BulletDmg ${this.bulletDamage}`);
    }
    update(deltaTime) {
        this.x += this.speed * this.direction * deltaTime;
        const canvasWidth = this.engine.getCanvas().width;
        if (this.x <= 0) {
            this.x = 0;
            this.direction = 1;
        }
        else if (this.x + this.width >= canvasWidth) {
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
    shoot() {
        const bulletX = this.x + this.width / 2 - 5;
        const bulletY = this.y + this.height;
        const bossBullet = new BossBullet(bulletX, bulletY, this.engine, this.bulletDamage, this.bulletSpeed);
        this.engine.addGameObject(bossBullet);
    }
    takeDamage(amount) {
        this.health -= amount;
        console.log(`Boss took ${amount} damage, HP left: ${this.health}`);
        if (this.health <= 0) {
            this.health = 0;
        }
    }
}
// --- MAIN GAME CLASS ---
export class ChickenShooterGame {
    constructor(engine) {
        this.chickens = [];
        this.bullets = [];
        this.score = 0;
        this.chickenSpawnTimer = 0;
        this.chickenSpawnInterval = 1.5; // Giảm thời gian spawn gà
        // Leveling and Boss
        this.currentLevel = 1;
        this.pointsToNextLevel = POINTS_PER_LEVEL;
        this.isBossFight = false;
        this.boss = null;
        this.engine = engine;
        this.engine.gameInstance = this;
        this.engine.onStateChange = this.handleGameStateChange.bind(this);
        this.createButtons();
        this.setupMenu();
    }
    createButtons() {
        const canvas = this.engine.getCanvas();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        this.startButton = new Button(centerX - 75, centerY - 25, 150, 50, 'Start Game', () => this.engine.setGameState('PLAYING'));
        this.engine.addGameObject(this.startButton);
        this.restartButton = new Button(centerX - 75, centerY + 50, 150, 50, 'Restart', () => this.engine.setGameState('PLAYING'));
        this.engine.addGameObject(this.restartButton);
        this.pauseButton = new Button(canvas.width - 110, 10, 100, 40, 'Pause (P)', () => this.engine.setGameState('PAUSED'));
        this.engine.addGameObject(this.pauseButton);
        this.continueButton = new Button(centerX - 75, centerY - 50, 150, 50, 'Continue (P)', () => this.engine.setGameState('PLAYING'));
        this.engine.addGameObject(this.continueButton);
        this.restartPausedButton = new Button(centerX - 75, centerY + 20, 150, 50, 'Restart Game', () => this.engine.setGameState('MENU'));
        this.engine.addGameObject(this.restartPausedButton);
        this.hideAllDialogButtons();
    }
    hideAllDialogButtons() {
        this.startButton.isVisible = false;
        this.restartButton.isVisible = false;
        this.pauseButton.isVisible = false;
        this.continueButton.isVisible = false;
        this.restartPausedButton.isVisible = false;
    }
    setupMenu() {
        this.engine.clearGameObjects();
        this.createButtons();
        this.hideAllDialogButtons();
        this.startButton.isVisible = true;
    }
    setupGame() {
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
    setupGameOver() {
        this.engine.clearGameObjects();
        this.createButtons();
        this.hideAllDialogButtons();
        this.restartButton.isVisible = true;
    }
    setupPauseScreen() {
        this.hideAllDialogButtons();
        this.continueButton.isVisible = true;
        this.restartPausedButton.isVisible = true;
    }
    handleGameStateChange(newState) {
        if (newState === 'MENU') {
            this.setupMenu();
        }
        else if (newState === 'PLAYING') {
            if (this.engine.gameState !== 'PAUSED') {
                this.setupGame();
            }
            else {
                this.hideAllDialogButtons();
                this.pauseButton.isVisible = true;
            }
        }
        else if (newState === 'GAME_OVER') {
            this.setupGameOver();
        }
        else if (newState === 'PAUSED') {
            this.setupPauseScreen();
        }
    }
    triggerGameOver(reason) {
        console.log("Game Over:", reason);
        this.engine.setGameState('GAME_OVER');
    }
    update(deltaTime) {
        if (this.engine.gameState !== 'PLAYING')
            return;
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
                            this.chickenSpawnInterval = Math.max(0.5, 1.5 - (this.currentLevel - 1) * 0.1);
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
    spawnChicken() {
        const canvasWidth = this.engine.getCanvas().width;
        const chickenWidth = 40;
        const x = Math.random() * (canvasWidth - chickenWidth);
        const y = -40;
        const chicken = new Chicken(x, y, this.engine);
        this.engine.addGameObject(chicken);
    }
    spawnBoss() {
        if (this.boss)
            return;
        const canvas = this.engine.getCanvas();
        this.boss = new BossRed(canvas.width / 2 - 40, 50, this.engine, this.currentLevel);
        this.engine.addGameObject(this.boss);
    }
    draw(ctx) {
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
        }
        else if (this.engine.gameState === 'MENU') {
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Chicken Shooter Deluxe', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 120);
        }
        else if (this.engine.gameState === 'PAUSED') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, this.engine.getCanvas().width, this.engine.getCanvas().height);
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 100);
        }
    }
}
