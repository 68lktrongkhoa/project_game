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

export const GameStates = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER',
    PAUSED: 'PAUSED',
};
export type GameState = typeof GameStates[keyof typeof GameStates];

export interface IDrawable {
    draw(ctx: CanvasRenderingContext2D): void;
}

export interface IUpdateable {
    update(deltaTime: number): void;
}

export interface IClickable {
    isClicked(mouseX: number, mouseY: number): boolean;
    onClick(): void;
    isHover?(mouseX: number, mouseY: number): void;
}

export abstract class GameObject implements IDrawable, IUpdateable {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    protected image?: HTMLImageElement;
    public type: string = 'GameObject'; // Or consider using this.constructor.name if appropriate

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract update(deltaTime: number): void;

    public isCollidingWith(other: GameObject): boolean {
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
        this.type = 'Sprite';
        this.image = new Image();
        this.image.src = imageSrc;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.image && this.image.complete && this.image.naturalHeight !== 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (this.image) {
            ctx.fillStyle = SpriteDefaults.FALLBACK_COLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    public update(deltaTime: number): void {
    }
}

export class Button extends GameObject implements IClickable {
    public text: string;
    private _onClick: () => void;
    private textColor: string;
    private backgroundColor: string;
    private hoverBackgroundColor: string;
    private isHovering: boolean = false;
    public isVisible: boolean = true;

    constructor(
        x: number, y: number, width: number, height: number,
        text: string, onClickCallback: () => void,
        textColor: string = DefaultButtonStyles.TEXT_COLOR,
        backgroundColor: string = DefaultButtonStyles.BACKGROUND_COLOR,
        hoverBackgroundColor: string = DefaultButtonStyles.HOVER_BACKGROUND_COLOR
    ) {
        super(x, y, width, height);
        this.type = 'Button';
        this.text = text;
        this._onClick = onClickCallback;
        this.textColor = textColor;
        this.backgroundColor = backgroundColor;
        this.hoverBackgroundColor = hoverBackgroundColor;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isVisible) return;

        ctx.fillStyle = this.isHovering ? this.hoverBackgroundColor : this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = this.textColor;
        ctx.font = DefaultButtonStyles.FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }

    public update(deltaTime: number): void {
    }

    public isHover(mouseX: number, mouseY: number): void {
        if (!this.isVisible) {
            this.isHovering = false;
            return;
        }
        this.isHovering = (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    public isClicked(mouseX: number, mouseY: number): boolean {
        if (!this.isVisible) return false;
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    public onClick(): void {
        if (!this.isVisible) return;
        this._onClick();
    }
}

type InteractiveGameObject = GameObject & IClickable;
type GameEngineObject = GameObject | InteractiveGameObject;

export class GameEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private gameObjects: GameEngineObject[] = [];
    private lastTime: number = 0;
    private inputState: { [key: string]: boolean } = {};

    public gameState: GameState = GameStates.MENU;
    public onStateChange: (newState: GameState) => void = () => {};

    constructor(canvasId: string) {
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

    public getContext(): CanvasRenderingContext2D { return this.ctx; }
    public getCanvas(): HTMLCanvasElement { return this.canvas; }
    public getInputState(): { [key: string]: boolean } { return this.inputState; }

    public setGameState(newState: GameState): void {
        if (this.gameState === newState) return;
        this.gameState = newState;
        this.onStateChange(newState);
    }

    private setupInputListeners(): void {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.inputState[key] = true;

            if (key === InputKeys.PAUSE) {
                if (this.gameState === GameStates.PLAYING) {
                    this.setGameState(GameStates.PAUSED);
                } else if (this.gameState === GameStates.PAUSED) {
                    this.setGameState(GameStates.PLAYING);
                }
            }
        });
        window.addEventListener('keyup', (e) => {
            this.inputState[e.key.toLowerCase()] = false;
        });
    }

    private handleMouseClick(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            const obj = this.gameObjects[i];
            if ('isClicked' in obj && 'onClick' in obj) { 
                const clickableObj = obj as InteractiveGameObject;
                if (clickableObj.isClicked(mouseX, mouseY)) {
                    clickableObj.onClick();
                    break;
                }
            }
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (const obj of this.gameObjects) {
            if ('isHover' in obj && typeof (obj as IClickable).isHover === 'function') {
                (obj as IClickable).isHover!(mouseX, mouseY);
            }
        }
    }

    public addGameObject(obj: GameEngineObject): void {
        this.gameObjects.push(obj);
    }

    public removeGameObject(objToRemove: GameObject): void {
        this.gameObjects = this.gameObjects.filter(obj => obj !== objToRemove);
    }

    public clearGameObjects(): void {
        this.gameObjects = [];
    }

    public getGameObjectsOfType<T extends GameObject>(typeConstructor: new (...args: any[]) => T): T[] {
        return this.gameObjects.filter(obj => obj instanceof typeConstructor) as T[];
    }

    private gameLoop(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(deltaTime: number): void {
        if (this.gameState === GameStates.PLAYING) {
            this.gameObjects.forEach(obj => obj.update(deltaTime));
        } else {
            this.gameObjects.forEach(obj => {
                if (obj instanceof Button) {
                    obj.update(deltaTime);
                }
            });
        }
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameObjects.forEach(obj => obj.draw(this.ctx));
    }

    public start(): void {
        this.lastTime = performance.now();
        if (this.gameState === GameStates.MENU) {
             this.onStateChange(this.gameState);
        }
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}