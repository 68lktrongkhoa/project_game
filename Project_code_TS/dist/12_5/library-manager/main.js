"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const repository_1 = require("./src/repository/repository");
const book_service_1 = require("./src/services/book.service");
const user_service_1 = require("./src/services/user.service");
const borrowing_service_1 = require("./src/services/borrowing.service");
const seeder_1 = require("./src/core/seeder");
const menu_actions_1 = require("./src/core/menu.actions");
function main() {
    const bookRepository = new repository_1.Repository();
    const userRepository = new repository_1.Repository();
    const borrowRecordRepository = new repository_1.Repository();
    const bookServiceInstance = new book_service_1.BookService(bookRepository);
    const userServiceInstance = new user_service_1.UserService(userRepository);
    const borrowingServiceInstance = new borrowing_service_1.BorrowingService(borrowRecordRepository, bookServiceInstance, userServiceInstance);
    (0, seeder_1.loadInitialData)(bookServiceInstance, userServiceInstance);
    interactiveMenu(bookServiceInstance, userServiceInstance, borrowingServiceInstance);
}
function interactiveMenu(bookService, userService, borrowingService) {
    console.log("\n🧭 HỆ THỐNG QUẢN LÝ THƯ VIỆN!");
    const menuOptions = {
        "1": { description: "📚 Hiển thị Tất cả Sách", handler: () => (0, menu_actions_1.handleDisplayAllBooks)(bookService) },
        "2": { description: "👤 Hiển thị Tất cả Người dùng", handler: () => (0, menu_actions_1.handleDisplayAllUsers)(userService) },
        "3": { description: "🔎 Tìm kiếm Sách", handler: () => (0, menu_actions_1.handleSearchBooks)(bookService) },
        "4": { description: "➕ Mượn Sách", handler: () => (0, menu_actions_1.handleBorrowBook)(borrowingService, userService, bookService) },
        "5": { description: "🔄 Trả Sách", handler: () => (0, menu_actions_1.handleReturnBook)(borrowingService) },
        "6": { description: "📄 Hiển thị Lịch sử Mượn (Tất cả)", handler: () => (0, menu_actions_1.handleDisplayAllBorrowingHistory)(borrowingService) },
        "7": { description: "⏳ Hiển thị Lịch sử Mượn (Đang mượn/Quá hạn)", handler: () => (0, menu_actions_1.handleDisplayActiveBorrowingHistory)(borrowingService) },
        "8": {
            description: "🚪 Thoát",
            handler: () => {
                console.log("\n👋 Tạm biệt!");
                return true;
            },
        },
    };
    let running = true;
    while (running) {
        for (const key in menuOptions) {
            const desc = menuOptions[key].description.padEnd(35, ' ');
            console.log(`${key}. ${desc} `);
        }
        const option = readline_sync_1.default.question("  ▶️  Chọn một tùy chọn: ").trim();
        const selectedMenuOption = menuOptions[option];
        if (selectedMenuOption) {
            const result = selectedMenuOption.handler();
            if (result === true) {
                running = false;
            }
        }
        else {
            console.log("  ⚠️  Lựa chọn không hợp lệ. Vui lòng thử lại.");
        }
        if (running) {
            readline_sync_1.default.keyInPause("\n  Nhấn phím 0 để tiếp tục...");
        }
    }
}
main();
