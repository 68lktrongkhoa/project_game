import { GameEngine } from './engine.js';
import { ChickenShooterGame } from './game.js';

const CANVAS_ID = 'gameCanvas';
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
window.onload = () => {
    const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
    if (!canvas) {
        console.error(`Canvas with id ${CANVAS_ID} not found.`);
        return;
    }
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const engine = new GameEngine(CANVAS_ID);
    const game = new ChickenShooterGame(engine);

    const originalUpdate = engine['update'].bind(engine);
    engine['update'] = (deltaTime: number) => {
        originalUpdate(deltaTime); 
        game.update(deltaTime);
    };

    const originalDraw = engine['draw'].bind(engine);
    engine['draw'] = () => {
        originalDraw();
        game.draw(engine.getContext());
    };

    engine.start();
};