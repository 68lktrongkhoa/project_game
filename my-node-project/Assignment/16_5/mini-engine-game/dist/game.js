import { Sprite, Button } from './engine.js';
class Player extends Sprite {
    constructor(x, y, engine) {
        super(x, y, 50, 50, 'assets/player.png'); 
        this.speed = 200;
        this.canShoot = true;
        this.shootCooldown = 0.5;
        this.timeSinceLastShot = 0;
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
        const bullet = new Bullet(this.x + this.width / 2 - 2.5, this.y, this.engine);
        this.engine.addGameObject(bullet);
    }
}
class Bullet extends Sprite {
    constructor(x, y, engine) {
        super(x, y, 5, 10, 'assets/bullet.png');
        this.speed = 400;
        this.engine = engine;
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
        }
    }
}
export class ChickenShooterGame {
    constructor(engine) {
        this.chickens = [];
        this.bullets = [];
        this.score = 0;
        this.chickenSpawnTimer = 0;
        this.chickenSpawnInterval = 2;
        this.engine = engine;
        this.engine.onStateChange = this.handleGameStateChange.bind(this);
        this.setupMenu();
    }
    setupMenu() {
        this.engine.clearGameObjects();
        const canvas = this.engine.getCanvas();
        this.startButton = new Button(canvas.width / 2 - 75, canvas.height / 2 - 25, 150, 50, 'Start Game', () => this.engine.setGameState('PLAYING'));
        this.engine.addGameObject(this.startButton);
    }
    setupGame() {
        this.engine.clearGameObjects();
        const canvas = this.engine.getCanvas();
        this.player = new Player(canvas.width / 2 - 25, canvas.height - 60, this.engine);
        this.engine.addGameObject(this.player);
        this.score = 0;
        this.chickens = [];
        this.bullets = [];
        this.chickenSpawnTimer = 0;
    }
    setupGameOver() {
        this.engine.clearGameObjects();
        const canvas = this.engine.getCanvas();
        this.restartButton = new Button(canvas.width / 2 - 75, canvas.height / 2 + 50, 150, 50, 'Restart', () => this.engine.setGameState('PLAYING'));
        this.engine.addGameObject(this.restartButton);
    }
    handleGameStateChange(newState) {
        this.engine.clearGameObjects();
        if (newState === 'MENU') {
            this.setupMenu();
        }
        else if (newState === 'PLAYING') {
            this.setupGame();
        }
        else if (newState === 'GAME_OVER') {
            this.setupGameOver();
        }
    }
    update(deltaTime) {
        if (this.engine.gameState !== 'PLAYING')
            return;
        this.chickenSpawnTimer += deltaTime;
        if (this.chickenSpawnTimer >= this.chickenSpawnInterval) {
            this.spawnChicken();
            this.chickenSpawnTimer = 0;
        }
        this.bullets = this.engine['gameObjects'].filter(obj => obj instanceof Bullet);
        this.chickens = this.engine['gameObjects'].filter(obj => obj instanceof Chicken);
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            for (let j = this.chickens.length - 1; j >= 0; j--) {
                const chicken = this.chickens[j];
                if (bullet.isCollidingWith(chicken)) {
                    this.engine.removeGameObject(bullet);
                    this.engine.removeGameObject(chicken);
                    this.bullets.splice(i, 1);
                    this.chickens.splice(j, 1);
                    this.score += chicken.points;
                    break;
                }
            }
        }
        for (const chicken of this.chickens) {
            if (chicken.isCollidingWith(this.player)) {
                this.engine.setGameState('GAME_OVER');
                return;
            }
            if (chicken.y > this.engine.getCanvas().height - chicken.height - 10) {
                this.engine.setGameState('GAME_OVER');
                return;
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
    draw(ctx) {
        if (this.engine.gameState === 'PLAYING') {
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${this.score}`, 10, 30);
        }
        else if (this.engine.gameState === 'GAME_OVER') {
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 40);
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${this.score}`, this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2);
        }
        else if (this.engine.gameState === 'MENU') {
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Chicken Shooter', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 80);
        }
    }
}
