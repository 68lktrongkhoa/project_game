"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChickenShooterGame = void 0;
// src/game.ts
const engine_js_1 = require("./engine.js");
// --- GAME SPECIFIC CLASSES ---
class Player extends engine_js_1.Sprite {
    constructor(x, y, engine) {
        // Thay "path/to/player.png" bằng đường dẫn thực tế hoặc màu sắc nếu không có ảnh
        super(x, y, 50, 50, 'assets/player.png'); // Giả sử có ảnh player.png trong thư mục assets
        this.speed = 200; // pixels per second
        this.canShoot = true;
        this.shootCooldown = 0.5; // seconds
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
        // Giữ player trong màn hình
        const canvasWidth = this.engine.getCanvas().width;
        if (this.x < 0)
            this.x = 0;
        if (this.x + this.width > canvasWidth)
            this.x = canvasWidth - this.width;
        // Xử lý bắn
        this.timeSinceLastShot += deltaTime;
        if (this.timeSinceLastShot >= this.shootCooldown) {
            this.canShoot = true;
        }
        if (input[' '] && this.canShoot) { // Phím space để bắn
            this.shoot();
            this.canShoot = false;
            this.timeSinceLastShot = 0;
        }
    }
    shoot() {
        // Tạo viên đạn ngay phía trên player
        const bullet = new Bullet(this.x + this.width / 2 - 2.5, this.y, this.engine);
        this.engine.addGameObject(bullet);
    }
}
class Bullet extends engine_js_1.Sprite {
    constructor(x, y, engine) {
        super(x, y, 5, 10, 'assets/bullet.png'); // Giả sử có ảnh bullet.png
        this.speed = 400; // pixels per second
        this.engine = engine;
    }
    update(deltaTime) {
        this.y -= this.speed * deltaTime;
        // Xóa đạn nếu ra khỏi màn hình
        if (this.y + this.height < 0) {
            this.engine.removeGameObject(this);
        }
    }
}
class Chicken extends engine_js_1.Sprite {
    constructor(x, y, engine) {
        super(x, y, 40, 40, 'assets/chicken.png'); // Giả sử có ảnh chicken.png
        this.speed = 50; // pixels per second
        this.points = 10; // Điểm khi bắn trúng
        this.engine = engine;
        this.speed = 50 + Math.random() * 50; // Tốc độ ngẫu nhiên
    }
    update(deltaTime) {
        this.y += this.speed * deltaTime;
        // Xóa gà nếu ra khỏi màn hình (hoặc game over)
        if (this.y > this.engine.getCanvas().height) {
            this.engine.removeGameObject(this);
            // Có thể trừ điểm hoặc kết thúc game ở đây
            // For simplicity, let's assume game over is handled elsewhere
        }
    }
}
// --- MAIN GAME CLASS ---
class ChickenShooterGame {
    constructor(engine) {
        this.chickens = [];
        this.bullets = [];
        this.score = 0;
        this.chickenSpawnTimer = 0;
        this.chickenSpawnInterval = 2; // seconds
        this.engine = engine;
        this.engine.onStateChange = this.handleGameStateChange.bind(this);
        this.setupMenu(); // Bắt đầu với Menu
    }
    setupMenu() {
        this.engine.clearGameObjects();
        const canvas = this.engine.getCanvas();
        this.startButton = new engine_js_1.Button(canvas.width / 2 - 75, canvas.height / 2 - 25, 150, 50, 'Start Game', () => this.engine.setGameState('PLAYING'));
        this.engine.addGameObject(this.startButton);
    }
    setupGame() {
        this.engine.clearGameObjects(); // Xóa các đối tượng của menu
        const canvas = this.engine.getCanvas();
        this.player = new Player(canvas.width / 2 - 25, canvas.height - 60, this.engine);
        this.engine.addGameObject(this.player);
        this.score = 0;
        this.chickens = [];
        this.bullets = [];
        this.chickenSpawnTimer = 0;
        // Thêm các GameObject khác vào engine nếu cần (ví dụ: background)
    }
    setupGameOver() {
        this.engine.clearGameObjects();
        const canvas = this.engine.getCanvas();
        this.restartButton = new engine_js_1.Button(canvas.width / 2 - 75, canvas.height / 2 + 50, 150, 50, 'Restart', () => this.engine.setGameState('PLAYING'));
        this.engine.addGameObject(this.restartButton);
        // Có thể thêm nút "Main Menu"
    }
    handleGameStateChange(newState) {
        this.engine.clearGameObjects(); // Luôn xóa các đối tượng cũ khi chuyển state
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
    // This update method will be called by main.ts or directly in game loop if preferred
    update(deltaTime) {
        if (this.engine.gameState !== 'PLAYING')
            return;
        // Spawn chickens
        this.chickenSpawnTimer += deltaTime;
        if (this.chickenSpawnTimer >= this.chickenSpawnInterval) {
            this.spawnChicken();
            this.chickenSpawnTimer = 0;
        }
        // Update all game objects (engine already does this, but we might need specific logic)
        // Collect bullets and chickens for collision detection
        this.bullets = this.engine['gameObjects'].filter(obj => obj instanceof Bullet);
        this.chickens = this.engine['gameObjects'].filter(obj => obj instanceof Chicken);
        // Collision detection: bullets vs chickens
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            for (let j = this.chickens.length - 1; j >= 0; j--) {
                const chicken = this.chickens[j];
                if (bullet.isCollidingWith(chicken)) {
                    this.engine.removeGameObject(bullet);
                    this.engine.removeGameObject(chicken);
                    this.bullets.splice(i, 1); // Remove from local array too
                    this.chickens.splice(j, 1); // Remove from local array
                    this.score += chicken.points;
                    break; // Bullet can only hit one chicken
                }
            }
        }
        // Collision detection: chickens vs player
        for (const chicken of this.chickens) {
            if (chicken.isCollidingWith(this.player)) {
                this.engine.setGameState('GAME_OVER');
                return; // Game over, stop further processing
            }
            // Check if chicken reaches bottom
            if (chicken.y > this.engine.getCanvas().height - chicken.height - 10) { // Gà chạm đáy
                this.engine.setGameState('GAME_OVER');
                return;
            }
        }
    }
    spawnChicken() {
        const canvasWidth = this.engine.getCanvas().width;
        const chickenWidth = 40;
        const x = Math.random() * (canvasWidth - chickenWidth);
        const y = -40; // Spawn just above the screen
        const chicken = new Chicken(x, y, this.engine);
        this.engine.addGameObject(chicken);
    }
    // This draw method will be called by main.ts or directly in game loop
    draw(ctx) {
        // Engine handles drawing game objects.
        // We only need to draw UI elements specific to the game state here.
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
exports.ChickenShooterGame = ChickenShooterGame;
