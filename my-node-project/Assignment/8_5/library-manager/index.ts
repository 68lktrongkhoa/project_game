import readlineSync from 'readline-sync';
import { Repository } from './src/repository/repository';
import { BorrowRecord, BorrowStatus } from './src/models/borrowRecord'; 
import { Book, GenreValues, BookGenre } from './src/models/book';
import { User } from './src/models/user'; 
import { BookService } from './src/services/book.service';
import { UserService } from './src/services/user.service';
import { BorrowingService } from './src/services/borrowing.service';
import fs from 'fs';
import path from 'path';


const bookRepository = new Repository<Book>();
const userRepository = new Repository<User>();
const borrowRecordRepository = new Repository<BorrowRecord>();

const bookService = new BookService(bookRepository);
const userService = new UserService(userRepository);
const borrowingService = new BorrowingService(borrowRecordRepository, bookService, userService);


function loadInitialData() {
  try {
    console.log("--- Adding initial books from JSON ---");
    const booksFilePath = path.join(__dirname, 'initial-books.json');
    const booksRawData = fs.readFileSync(booksFilePath, 'utf-8');
    const booksData: Omit<Book, 'id'>[] = JSON.parse(booksRawData);
    booksData.forEach(bookData => {
        bookService.addBook(bookData as Omit<Book, 'id'> & { genre?: BookGenre });
    });

    console.log("\n--- Adding initial users from JSON ---");
    const usersFilePath = path.join(__dirname, 'initial-users.json');
    const usersRawData = fs.readFileSync(usersFilePath, 'utf-8');
    const usersData: Omit<User, 'id'>[] = JSON.parse(usersRawData);
    usersData.forEach(userData => userService.addUser(userData));

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu khởi tạo:", error);
  }
}

loadInitialData();

function interactiveMenu() {
  console.log("\n🧭 Hệ thống Thư viện - Chế độ Tương tác");
  while (true) {
    const option = readlineSync.question(`
  -------------------------------------
  Chọn một tùy chọn:
  1. 📚 Hiển thị Tất cả Sách
  2. 👤 Hiển thị Tất cả Người dùng
  3. 🔎 Tìm kiếm Sách (theo tiêu đề, tác giả, ISBN, thể loại)
  4. ➕ Mượn Sách
  5. 🔄 Trả Sách
  6. 📄 Hiển thị Lịch sử Mượn (Tất cả)
  7. ⏳ Hiển thị Lịch sử Mượn (Đang mượn/Quá hạn)
  8. 🚪 Thoát
  -------------------------------------
  > `);

    switch (option) {
      case "1":
        console.log("\n📚 Tất cả Sách:");
        const allBooks = bookService.getAllBooks();
        bookService.displayBooks(allBooks);
        break;

     case "2":
         console.log("\n👤 Tất cả Người dùng:");
         const allUsers = userService.getAllUsers();
         userService.displayUsers(allUsers); 
         break;

      case "3":
        const keyword = readlineSync.question("🔍 Nhập từ khóa tìm kiếm: ");
        const foundBooks = bookService.searchBooks(keyword);
        if (foundBooks.length) {
            console.log("\n🔎 Kết quả Tìm kiếm:");
            bookService.displayBooks(foundBooks);
        } else {
          console.log("❌ Không tìm thấy sách nào khớp với từ khóa của bạn.");
        }
        break;

      case "4":
        const memberIdBorrow = readlineSync.question("👤 Nhập Member ID của Người dùng để mượn: ");
        const userToBorrow = userService.findUserById(memberIdBorrow);
        if (!userToBorrow) {
            console.log(`❌ Không tìm thấy người dùng với Member ID: ${memberIdBorrow}`);
            break;
        }

        const bookIdBorrowInput = readlineSync.question("📕 Nhập ID Sách để mượn: ");
        const bookIdBorrow = parseInt(bookIdBorrowInput, 10);
        if (isNaN(bookIdBorrow)) {
            console.log("❌ ID sách không hợp lệ.");
            break;
        }
        const bookToBorrow = bookService.findBookById(bookIdBorrow);
        if (!bookToBorrow) {
            console.log(`❌ Không tìm thấy sách với ID: ${bookIdBorrow}`);
            break;
        }

        borrowingService.borrowBook(userToBorrow.id, bookToBorrow.id);
        break;

      case "5":
        const recordIdReturnInput = readlineSync.question("📄 Nhập ID Bản ghi Mượn để trả: ");
        const recordIdReturn = parseInt(recordIdReturnInput, 10);
        if (isNaN(recordIdReturn)) {
            console.log("❌ ID bản ghi mượn không hợp lệ.");
            break;
        }
        borrowingService.returnBook(recordIdReturn);
        break;

      case "6":
        console.log("\n📄 Tất cả Lịch sử Mượn:");
        const allRecords = borrowingService.getBorrowingHistory();
        borrowingService.displayBorrowingHistory(allRecords);
        break;

      case "7":
          console.log("\n⏳ Lịch sử Mượn Hiện tại (Đang mượn/Quá hạn):");
          const activeRecords = borrowingService.getBorrowingHistory().filter(
              r => r.status === BorrowStatus.BORROWED || r.status === BorrowStatus.OVERDUE
          );
          borrowingService.displayBorrowingHistory(activeRecords); 
          break;

      case "8":
        console.log("👋 Tạm biệt! Chúc bạn đọc sách vui vẻ!");
        return;

      default:
        console.log("⚠️ Tùy chọn không hợp lệ. Vui lòng thử lại.");
    }
    readlineSync.keyInPause("\nNhấn phím bất kỳ để tiếp tục...");
  }
}

interactiveMenu();