import { BookService } from '../services/book.service';
import { UserService } from '../services/user.service';
import { BorrowingService } from '../services/borrowing.service';
import { BorrowStatus } from '../models/borrowRecord';
import { getStringInput, getNumericInput } from './prompt.utils';

export function handleDisplayAllBooks(bookService: BookService): void {
  console.log("\n📚 Tất cả Sách:");
  const allBooks = bookService.getAllBooks();
  bookService.displayBooks(allBooks);
}

export function handleDisplayAllUsers(userService: UserService): void {
  console.log("\n👤 Tất cả Người dùng:");
  const allUsers = userService.getAllUsers();
  userService.displayUsers(allUsers);
}

export function handleSearchBooks(bookService: BookService): void {
  const keyword = getStringInput("🔍 Nhập từ khóa tìm kiếm (tiêu đề, tác giả, ISBN, thể loại): ");
  if (!keyword) {
    console.warn("⚠️ Từ khóa tìm kiếm không được để trống.");
    return;
  }
  const foundBooks = bookService.searchBooks(keyword);
  if (foundBooks.length > 0) {
    console.log("\n🔎 Kết quả Tìm kiếm:");
    bookService.displayBooks(foundBooks);
  } else {
    console.log("❌ Không tìm thấy sách nào khớp với từ khóa của bạn.");
  }
}

export function handleBorrowBook(
  borrowingService: BorrowingService,
  userService: UserService,
  bookService: BookService
): void {
  const memberIdBorrow = getStringInput("👤 Nhập Member ID của Người dùng để mượn: ");
  if (!memberIdBorrow) {
    console.warn("⚠️ Member ID không được để trống.");
    return;
  }
  const userToBorrow = userService.getUserById(memberIdBorrow);
  if (!userToBorrow) {
    console.log(`❌ Không tìm thấy người dùng với Member ID: ${memberIdBorrow}`);
    return;
  }

  const bookIdBorrow = getNumericInput("📕 Nhập ID Sách để mượn: ");
  if (bookIdBorrow === null) return;

  const bookToBorrow = bookService.getBookById(bookIdBorrow);
  if (!bookToBorrow) {
    console.log(`❌ Không tìm thấy sách với ID: ${bookIdBorrow}`);
    return;
  }

  if (!bookToBorrow.available || (bookToBorrow.totalCopies !== undefined && bookToBorrow.totalCopies <= 0)) {
      console.log(`❌ Sách "${bookToBorrow.title}" hiện không có sẵn hoặc đã hết bản sao để mượn.`);
      return;
  }

  borrowingService.borrowBook(userToBorrow.id, bookToBorrow.id);
}

export function handleReturnBook(borrowingService: BorrowingService): void {
  const recordIdReturn = getNumericInput("📄 Nhập ID Bản ghi Mượn để trả: ");
  if (recordIdReturn === null) return;
  borrowingService.returnBook(recordIdReturn);
}

export function handleDisplayAllBorrowingHistory(borrowingService: BorrowingService): void {
  console.log("\n📄 Tất cả Lịch sử Mượn:");
  const allRecords = borrowingService.getBorrowingHistory();
  borrowingService.displayBorrowingHistory(allRecords);
}

export function handleDisplayActiveBorrowingHistory(borrowingService: BorrowingService): void {
  console.log("\n⏳ Lịch sử Mượn Hiện tại (Đang mượn/Quá hạn):");
  const activeRecords = borrowingService.getBorrowingHistory().filter(
    r => r.status === BorrowStatus.BORROWED || r.status === BorrowStatus.OVERDUE
  );
  borrowingService.displayBorrowingHistory(activeRecords);
}