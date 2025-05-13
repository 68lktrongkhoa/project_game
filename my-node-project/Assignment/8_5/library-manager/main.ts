import readlineSync from 'readline-sync';
import { Repository } from './src/repository/repository';
import { BorrowRecord } from './src/models/borrowRecord';
import { Book } from './src/models/book';
import { User } from './src/models/user';
import { BookService } from './src/services/book.service';
import { UserService } from './src/services/user.service';
import { BorrowingService } from './src/services/borrowing.service';
import { loadInitialData } from './src/core/seeder';
import {
  handleDisplayAllBooks,
  handleDisplayAllUsers,
  handleSearchBooks,
  handleBorrowBook,
  handleReturnBook,
  handleDisplayAllBorrowingHistory,
  handleDisplayActiveBorrowingHistory,
} from './src/core/menu.actions';

function main(): void {
  const bookRepository = new Repository<Book>();
  const userRepository = new Repository<User>();
  const borrowRecordRepository = new Repository<BorrowRecord>();

  const bookServiceInstance = new BookService(bookRepository);
  const userServiceInstance = new UserService(userRepository);
  const borrowingServiceInstance = new BorrowingService(
    borrowRecordRepository,
    bookServiceInstance,
    userServiceInstance
  );

  loadInitialData(bookServiceInstance, userServiceInstance);
  interactiveMenu(bookServiceInstance, userServiceInstance, borrowingServiceInstance);
}

interface MenuItem {
  description: string;
  handler: () => void | boolean;
}

function interactiveMenu(
  bookService: BookService,
  userService: UserService,
  borrowingService: BorrowingService
): void {
  console.log("\n🧭 HỆ THỐNG QUẢN LÝ THƯ VIỆN!");

  const menuOptions: Record<string, MenuItem> = {
    "1": { description: "📚 Hiển thị Tất cả Sách", handler: () => handleDisplayAllBooks(bookService) },
    "2": { description: "👤 Hiển thị Tất cả Người dùng", handler: () => handleDisplayAllUsers(userService) },
    "3": { description: "🔎 Tìm kiếm Sách", handler: () => handleSearchBooks(bookService) },
    "4": { description: "➕ Mượn Sách", handler: () => handleBorrowBook(borrowingService, userService, bookService) },
    "5": { description: "🔄 Trả Sách", handler: () => handleReturnBook(borrowingService) },
    "6": { description: "📄 Hiển thị Lịch sử Mượn (Tất cả)", handler: () => handleDisplayAllBorrowingHistory(borrowingService) },
    "7": { description: "⏳ Hiển thị Lịch sử Mượn (Đang mượn/Quá hạn)", handler: () => handleDisplayActiveBorrowingHistory(borrowingService) },
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

    const option = readlineSync.question("  ▶️  Chọn một tùy chọn: ").trim();
    const selectedMenuOption = menuOptions[option];

    if (selectedMenuOption) {
      const result = selectedMenuOption.handler();
      if (result === true) {
        running = false;
      }
    } else {
      console.log("  ⚠️  Lựa chọn không hợp lệ. Vui lòng thử lại.");
    }

    if (running) {
      readlineSync.keyInPause("\n  Nhấn phím 0 để tiếp tục...");
    }
  }
}
main();