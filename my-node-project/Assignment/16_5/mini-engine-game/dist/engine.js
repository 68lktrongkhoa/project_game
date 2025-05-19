const GameStates = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER',
    PAUSED: 'PAUSED',
};
const DefaultButtonStyles = {
    TEXT_COLOR: 'white',
    BACKGROUND_COLOR: 'blue',
    HOVER_BACKGROUND_COLOR: 'darkblue',
    FONT: '16px Arial',
};
const SpriteDefaults = {
    FALLBACK_COLOR: 'gray',
};
const InputKeys = {
    PAUSE: 'p',
};
export class GameObject {
    constructor(x, y, width, height) {
        this.type = 'GameObject'; // Or consider using this.constructor.name if appropriate
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
export class Sprite extends GameObject {
    constructor(x, y, width, height, imageSrc) {
        super(x, y, width, height);
        this.type = 'Sprite';
        this.image = new Image();
        this.image.src = imageSrc;
    }
    draw(ctx) {
        if (this.image && this.image.complete && this.image.naturalHeight !== 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else if (this.image) {
            ctx.fillStyle = SpriteDefaults.FALLBACK_COLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    update(deltaTime) {
    }
}
export class Button extends GameObject {
    constructor(x, y, width, height, text, onClickCallback, textColor = DefaultButtonStyles.TEXT_COLOR, backgroundColor = DefaultButtonStyles.BACKGROUND_COLOR, hoverBackgroundColor = DefaultButtonStyles.HOVER_BACKGROUND_COLOR) {
        super(x, y, width, height);
        this.isHovering = false;
        this.isVisible = true;
        this.type = 'Button';
        this.text = text;
        this._onClick = onClickCallback;
        this.textColor = textColor;
        this.backgroundColor = backgroundColor;
        this.hoverBackgroundColor = hoverBackgroundColor;
    }
    draw(ctx) {
        if (!this.isVisible)
            return;
        ctx.fillStyle = this.isHovering ? this.hoverBackgroundColor : this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.textColor;
        ctx.font = DefaultButtonStyles.FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }
    update(deltaTime) {
    }
    isHover(mouseX, mouseY) {
        if (!this.isVisible) {
            this.isHovering = false;
            return;
        }
        this.isHovering = (mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height);
    }
    isClicked(mouseX, mouseY) {
        if (!this.isVisible)
            return false;
        return (mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height);
    }
    onClick() {
        if (!this.isVisible)
            return;
        this._onClick();
    }
}
export class GameEngine {
    constructor(canvasId) {
        this.gameObjects = [];
        this.lastTime = 0;
        this.inputState = {};
        this.gameState = GameStates.MENU;
        this.onStateChange = () => { };
        const canvasElement = document.getElementById(canvasId);
        if (!(canvasElement instanceof HTMLCanvasElement)) {
            throw new Error(`Element with ID '${canvasId}' not found or is not a canvas.`);
        }
        this.canvas = canvasElement;
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error("Could not get 2D rendering context from canvas.");
        }
        this.ctx = context;
        this.setupInputListeners();
        this.canvas.addEventListener('click', this.handleMouseClick.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }
    getContext() { return this.ctx; }
    getCanvas() { return this.canvas; }
    getInputState() { return this.inputState; }
    setGameState(newState) {
        if (this.gameState === newState)
            return;
        this.gameState = newState;
        this.onStateChange(newState);
    }
    setupInputListeners() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.inputState[key] = true;
            if (key === InputKeys.PAUSE) {
                if (this.gameState === GameStates.PLAYING) {
                    this.setGameState(GameStates.PAUSED);
                }
                else if (this.gameState === GameStates.PAUSED) {
                    this.setGameState(GameStates.PLAYING);
                }
            }
        });
        window.addEventListener('keyup', (e) => {
            this.inputState[e.key.toLowerCase()] = false;
        });
    }
    handleMouseClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            const obj = this.gameObjects[i];
            if ('isClicked' in obj && 'onClick' in obj) {
                const clickableObj = obj;
                if (clickableObj.isClicked(mouseX, mouseY)) {
                    clickableObj.onClick();
                    break;
                }
            }
        }
    }
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        for (const obj of this.gameObjects) {
            if ('isHover' in obj && typeof obj.isHover === 'function') {
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
    getGameObjectsOfType(typeConstructor) {
        return this.gameObjects.filter(obj => obj instanceof typeConstructor);
    }
    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    update(deltaTime) {
        if (this.gameState === GameStates.PLAYING) {
            this.gameObjects.forEach(obj => obj.update(deltaTime));
        }
        else {
            this.gameObjects.forEach(obj => {
                if (obj instanceof Button) {
                    obj.update(deltaTime);
                }
            });
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameObjects.forEach(obj => obj.draw(this.ctx));
    }
    start() {
        this.lastTime = performance.now();
        if (this.gameState === GameStates.MENU) {
            this.onStateChange(this.gameState);
        }
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}
