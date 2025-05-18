export interface IDrawable {
    draw(ctx: CanvasRenderingContext2D): void;
}

export interface IUpdateable {
    update(deltaTime: number): void;
}

export interface IClickable {
    isClicked(mouseX: number, mouseY: number): boolean;
    onClick(): void;
}

export abstract class GameObject implements IDrawable, IUpdateable {
    x: number;
    y: number;
    width: number;
    height: number;
    protected image?: HTMLImageElement; 

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract update(deltaTime: number): void;

    isCollidingWith(other: GameObject): boolean {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

export class Sprite extends GameObject {
    constructor(x: number, y: number, width: number, height: number, imageSrc: string) {
        super(x, y, width, height);
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    update(deltaTime: number): void {
    }
}

export class Button extends GameObject implements IClickable {
    text: string;
    private _onClick: () => void;
    private textColor: string;
    private backgroundColor: string;
    private hoverBackgroundColor: string;
    private isHovering: boolean = false;

    constructor(
        x: number, y: number, width: number, height: number,
        text: string, onClickCallback: () => void,
        textColor: string = 'white', backgroundColor: string = 'blue', hoverBackgroundColor: string = 'darkblue'
    ) {
        super(x, y, width, height);
        this.text = text;
        this._onClick = onClickCallback;
        this.textColor = textColor;
        this.backgroundColor = backgroundColor;
        this.hoverBackgroundColor = hoverBackgroundColor;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.isHovering ? this.hoverBackgroundColor : this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = this.textColor;
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    update(deltaTime: number): void {
    }

    isHover(mouseX: number, mouseY: number): void {
        this.isHovering = (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    isClicked(mouseX: number, mouseY: number): boolean {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    onClick(): void {
        this._onClick();
    }
}


export class GameEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private gameObjects: (GameObject | (GameObject & IClickable))[] = [];
    private lastTime: number = 0;
    private inputState: { [key: string]: boolean } = {};

    public gameState: 'MENU' | 'PLAYING' | 'GAME_OVER' = 'MENU';
    public onStateChange: (newState: GameEngine['gameState']) => void = () => {};


    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        if (!this.ctx) {
            throw new Error("Could not get 2D rendering context");
        }
        this.setupInput();
        this.canvas.addEventListener('click', this.handleMouseClick.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

    }

    public getContext(): CanvasRenderingContext2D { return this.ctx; }
    public getCanvas(): HTMLCanvasElement { return this.canvas; }
    public getInputState(): { [key: string]: boolean } { return this.inputState; }


    public setGameState(newState: GameEngine['gameState']): void {
        this.gameState = newState;
        this.onStateChange(newState);
    }

    private setupInput(): void {
        window.addEventListener('keydown', (e) => this.inputState[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.inputState[e.key.toLowerCase()] = false);
    }

    private handleMouseClick(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (const obj of this.gameObjects) {
            if ('isClicked' in obj && (obj as unknown as IClickable).isClicked(mouseX, mouseY)) {
                 (obj as unknown as IClickable).onClick();
                 break; 
            }
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (const obj of this.gameObjects) {
            if (obj instanceof Button) {
                obj.isHover(mouseX, mouseY);
            }
        }
    }


    addGameObject(obj: GameObject | (GameObject & IClickable)): void {
        this.gameObjects.push(obj);
    }

    removeGameObject(objToRemove: GameObject): void {
        this.gameObjects = this.gameObjects.filter(obj => obj !== objToRemove);
    }

    clearGameObjects(): void {
        this.gameObjects = [];
    }

    private gameLoop(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(deltaTime: number): void {
        this.gameObjects.forEach(obj => {
            if (this.gameState === 'PLAYING' || obj instanceof Button) {
                 obj.update(deltaTime);
            }
        });
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameObjects.forEach(obj => {
            if (this.gameState === 'PLAYING' || obj instanceof Button) {
                obj.draw(this.ctx);
            } else if (this.gameState === 'MENU' && obj instanceof Button) {
                obj.draw(this.ctx);
            } else if (this.gameState === 'GAME_OVER' && obj instanceof Button) {
                obj.draw(this.ctx);
            }
        });
    }

    start(): void {
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}