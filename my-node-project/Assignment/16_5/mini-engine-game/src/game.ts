import { GameEngine, Sprite, Button, GameObject } from './engine.js';

// --- GAME SPECIFIC CLASSES ---

class Player extends Sprite {
    speed: number = 200;
    private engine: GameEngine;
    public canShoot: boolean = true;
    private shootCooldown: number = 0.5;
    private timeSinceLastShot: number = 0;

    constructor(x: number, y: number, engine: GameEngine) {
        super(x, y, 50, 50, 'assets/player.png');
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
        const bullet = new Bullet(this.x + this.width / 2 - 2.5, this.y, this.engine);
        this.engine.addGameObject(bullet);
    }

}

class Bullet extends Sprite {
    speed: number = 400;
    private engine: GameEngine;

    constructor(x: number, y: number, engine: GameEngine) {
        super(x, y, 5, 10, 'assets/bullet.png');
        this.engine = engine;
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
    private chickenSpawnInterval: number = 2;
    private startButton!: Button;
    private restartButton!: Button;


    constructor(engine: GameEngine) {
        this.engine = engine;
        this.engine.onStateChange = this.handleGameStateChange.bind(this);
        this.setupMenu();
    }

    private setupMenu(): void {
        this.engine.clearGameObjects();
        const canvas = this.engine.getCanvas();
        this.startButton = new Button(
            canvas.width / 2 - 75, canvas.height / 2 - 25, 150, 50,
            'Start Game',
            () => this.engine.setGameState('PLAYING')
        );
        this.engine.addGameObject(this.startButton);
    }

    private setupGame(): void {
        this.engine.clearGameObjects(); // Xóa các đối tượng của menu
        const canvas = this.engine.getCanvas();

        this.player = new Player(canvas.width / 2 - 25, canvas.height - 60, this.engine);
        this.engine.addGameObject(this.player);

        this.score = 0;
        this.chickens = [];
        this.bullets = [];
        this.chickenSpawnTimer = 0;

    }

    private setupGameOver(): void {
        this.engine.clearGameObjects();
        const canvas = this.engine.getCanvas();
        this.restartButton = new Button(
            canvas.width / 2 - 75, canvas.height / 2 + 50, 150, 50,
            'Restart',
            () => this.engine.setGameState('PLAYING')
        );
        this.engine.addGameObject(this.restartButton);
    }

    private handleGameStateChange(newState: GameEngine['gameState']): void {
        this.engine.clearGameObjects();

        if (newState === 'MENU') {
            this.setupMenu();
        } else if (newState === 'PLAYING') {
            this.setupGame();
        } else if (newState === 'GAME_OVER') {
            this.setupGameOver();
        }
    }

    public update(deltaTime: number): void {
        if (this.engine.gameState !== 'PLAYING') return;
        this.chickenSpawnTimer += deltaTime;
        if (this.chickenSpawnTimer >= this.chickenSpawnInterval) {
            this.spawnChicken();
            this.chickenSpawnTimer = 0;
        }
        this.bullets = this.engine['gameObjects'].filter(obj => obj instanceof Bullet) as Bullet[];
        this.chickens = this.engine['gameObjects'].filter(obj => obj instanceof Chicken) as Chicken[];

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
             if (chicken.y > this.engine.getCanvas().height - chicken.height - 10 ) {
                this.engine.setGameState('GAME_OVER');
                return;
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

    public draw(ctx: CanvasRenderingContext2D): void {

        if (this.engine.gameState === 'PLAYING') {
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${this.score}`, 10, 30);
        } else if (this.engine.gameState === 'GAME_OVER') {
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 40);
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${this.score}`, this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2);
        } else if (this.engine.gameState === 'MENU') {
             ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Chicken Shooter', this.engine.getCanvas().width / 2, this.engine.getCanvas().height / 2 - 80);
        }
    }
}