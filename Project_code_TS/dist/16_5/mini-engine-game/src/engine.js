"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEngine = exports.Button = exports.Sprite = exports.GameObject = void 0;
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    isCollidingWith(other) {
        return (this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y);
    }
}
exports.GameObject = GameObject;
class Sprite extends GameObject {
    constructor(x, y, width, height, imageSrc) {
        super(x, y, width, height);
        this.image = new Image();
        this.image.src = imageSrc;
    }
    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    update(deltaTime) {
        // Sprite tĩnh không cần update gì đặc biệt ở đây
        // Các lớp kế thừa (Player, Enemy) sẽ override
    }
}
exports.Sprite = Sprite;
class Button extends GameObject {
    constructor(x, y, width, height, text, onClickCallback, textColor = 'white', backgroundColor = 'blue', hoverBackgroundColor = 'darkblue') {
        super(x, y, width, height);
        this.isHovering = false;
        this.text = text;
        this._onClick = onClickCallback;
        this.textColor = textColor;
        this.backgroundColor = backgroundColor;
        this.hoverBackgroundColor = hoverBackgroundColor;
    }
    draw(ctx) {
        ctx.fillStyle = this.isHovering ? this.hoverBackgroundColor : this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.textColor;
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }
    update(deltaTime) {
        // Button không cần update logic theo thời gian ở đây
    }
    // Kiểm tra xem chuột có đang trỏ vào nút không
    isHover(mouseX, mouseY) {
        this.isHovering = (mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height);
    }
    isClicked(mouseX, mouseY) {
        return (mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height);
    }
    onClick() {
        this._onClick();
    }
}
exports.Button = Button;
class GameEngine {
    constructor(canvasId) {
        this.gameObjects = [];
        this.lastTime = 0;
        this.inputState = {};
        this.gameState = 'MENU';
        this.onStateChange = () => { };
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error("Could not get 2D rendering context");
        }
        this.setupInput();
        this.canvas.addEventListener('click', this.handleMouseClick.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }
    getContext() { return this.ctx; }
    getCanvas() { return this.canvas; }
    getInputState() { return this.inputState; }
    setGameState(newState) {
        this.gameState = newState;
        this.onStateChange(newState);
    }
    setupInput() {
        window.addEventListener('keydown', (e) => this.inputState[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.inputState[e.key.toLowerCase()] = false);
    }
    handleMouseClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        for (const obj of this.gameObjects) {
            if ('isClicked' in obj && obj.isClicked(mouseX, mouseY)) {
                obj.onClick();
                break;
            }
        }
    }
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        for (const obj of this.gameObjects) {
            if (obj instanceof Button) {
                obj.isHover(mouseX, mouseY);
            }
        }
    }
    addGameObject(obj) {
        this.gameObjects.push(obj);
    }
    removeGameObject(objToRemove) {
        this.gameObjects = this.gameObjects.filter(obj => obj !== objToRemove);
    }
    clearGameObjects() {
        this.gameObjects = [];
    }
    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    update(deltaTime) {
        this.gameObjects.forEach(obj => {
            if (this.gameState === 'PLAYING' || obj instanceof Button) {
                obj.update(deltaTime);
            }
        });
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameObjects.forEach(obj => {
            if (this.gameState === 'PLAYING' || obj instanceof Button) {
                obj.draw(this.ctx);
            }
            else if (this.gameState === 'MENU' && obj instanceof Button) {
                obj.draw(this.ctx);
            }
            else if (this.gameState === 'GAME_OVER' && obj instanceof Button) {
                obj.draw(this.ctx);
            }
        });
    }
    start() {
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}
exports.GameEngine = GameEngine;
