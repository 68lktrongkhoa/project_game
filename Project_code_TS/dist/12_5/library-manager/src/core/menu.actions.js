"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDisplayAllBooks = handleDisplayAllBooks;
exports.handleDisplayAllUsers = handleDisplayAllUsers;
exports.handleSearchBooks = handleSearchBooks;
exports.handleBorrowBook = handleBorrowBook;
exports.handleReturnBook = handleReturnBook;
exports.handleDisplayAllBorrowingHistory = handleDisplayAllBorrowingHistory;
exports.handleDisplayActiveBorrowingHistory = handleDisplayActiveBorrowingHistory;
const borrowRecord_1 = require("../models/borrowRecord");
const prompt_utils_1 = require("./prompt.utils");
function handleDisplayAllBooks(bookService) {
    console.log("\n📚 Tất cả Sách:");
    const allBooks = bookService.getAllBooks();
    bookService.displayBooks(allBooks);
}
function handleDisplayAllUsers(userService) {
    console.log("\n👤 Tất cả Người dùng:");
    const allUsers = userService.getAllUsers();
    userService.displayUsers(allUsers);
}
function handleSearchBooks(bookService) {
    const keyword = (0, prompt_utils_1.getStringInput)("🔍 Nhập từ khóa tìm kiếm (tiêu đề, tác giả, ISBN, thể loại): ");
    if (!keyword) {
        console.warn("⚠️ Từ khóa tìm kiếm không được để trống.");
        return;
    }
    const foundBooks = bookService.searchBooks(keyword);
    if (foundBooks.length > 0) {
        console.log("\n🔎 Kết quả Tìm kiếm:");
        bookService.displayBooks(foundBooks);
    }
    else {
        console.log("❌ Không tìm thấy sách nào khớp với từ khóa của bạn.");
    }
}
function handleBorrowBook(borrowingService, userService, bookService) {
    const memberIdBorrow = (0, prompt_utils_1.getStringInput)("👤 Nhập Member ID của Người dùng để mượn: ");
    if (!memberIdBorrow) {
        console.warn("⚠️ Member ID không được để trống.");
        return;
    }
    const userToBorrow = userService.getUserById(memberIdBorrow);
    if (!userToBorrow) {
        console.log(`❌ Không tìm thấy người dùng với Member ID: ${memberIdBorrow}`);
        return;
    }
    const bookIdBorrow = (0, prompt_utils_1.getNumericInput)("📕 Nhập ID Sách để mượn: ");
    if (bookIdBorrow === null)
        return;
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
function handleReturnBook(borrowingService) {
    const recordIdReturn = (0, prompt_utils_1.getNumericInput)("📄 Nhập ID Bản ghi Mượn để trả: ");
    if (recordIdReturn === null)
        return;
    borrowingService.returnBook(recordIdReturn);
}
function handleDisplayAllBorrowingHistory(borrowingService) {
    console.log("\n📄 Tất cả Lịch sử Mượn:");
    const allRecords = borrowingService.getBorrowingHistory();
    borrowingService.displayBorrowingHistory(allRecords);
}
function handleDisplayActiveBorrowingHistory(borrowingService) {
    console.log("\n⏳ Lịch sử Mượn Hiện tại (Đang mượn/Quá hạn):");
    const activeRecords = borrowingService.getBorrowingHistory().filter(r => r.status === borrowRecord_1.BorrowStatus.BORROWED || r.status === borrowRecord_1.BorrowStatus.OVERDUE);
    borrowingService.displayBorrowingHistory(activeRecords);
}
