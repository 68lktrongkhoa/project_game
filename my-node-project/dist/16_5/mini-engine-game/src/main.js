"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/main.ts
const engine_js_1 = require("./engine.js");
const game_js_1 = require("./game.js");
const CANVAS_ID = 'gameCanvas';
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
// Asset paths (quan trọng: tạo thư mục assets và đặt ảnh vào đó)
// Ví dụ: assets/player.png, assets/bullet.png, assets/chicken.png
// Nếu không có ảnh, Sprite sẽ không hiển thị. Bạn có thể tạm thời vẽ hình chữ nhật thay thế.
window.onload = () => {
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas) {
        console.error(`Canvas with id ${CANVAS_ID} not found.`);
        return;
    }
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const engine = new engine_js_1.GameEngine(CANVAS_ID);
    const game = new game_js_1.ChickenShooterGame(engine);
    // Mở rộng game loop của engine để gọi update và draw của game
    const originalUpdate = engine['update'].bind(engine); // Lưu lại hàm update gốc của engine
    engine['update'] = (deltaTime) => {
        originalUpdate(deltaTime); // Gọi update của engine (cho các GameObject)
        game.update(deltaTime); // Gọi update của game (logic game, spawn, collision)
    };
    const originalDraw = engine['draw'].bind(engine); // Lưu lại hàm draw gốc
    engine['draw'] = () => {
        originalDraw(); // Gọi draw của engine (cho các GameObject)
        game.draw(engine.getContext()); // Gọi draw của game (UI, score)
    };
    engine.start();
};
