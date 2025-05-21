"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowingService = void 0;
const borrowRecord_1 = require("../models/borrowRecord");
const cli_table3_1 = __importDefault(require("cli-table3"));
class BorrowingService {
    constructor(borrowRecordRepository, bookService, userService) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookService = bookService;
        this.userService = userService;
    }
    borrowBook(userId, bookId) {
        const user = this.userService.getUserById(userId);
        const book = this.bookService.getBookById(bookId);
        if (!user) {
            console.error(`❌ Mượn thất bại: Không tìm thấy Người dùng ID ${userId}.`);
            return null;
        }
        if (!book) {
            console.error(`❌ Mượn thất bại: Không tìm thấy Sách ID ${bookId}.`);
            return null;
        }
        if (!book.available) {
            console.error(`❌ Mượn thất bại: Sách "${book.title}" không có sẵn.`);
            return null;
        }
        const updatedBook = this.bookService.updateBookAvailability(bookId, false);
        if (!updatedBook) {
            console.error(`❌ Mượn thất bại: Không thể cập nhật trạng thái sách cho ID ${bookId}.`);
            return null;
        }
        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + 14);
        const newRecordData = {
            bookId,
            userId,
            borrowDate,
            dueDate,
            status: borrowRecord_1.BorrowStatus.BORROWED
        };
        const savedRecord = this.borrowRecordRepository.add(newRecordData);
        console.log(`✅ ${user.name} đã mượn sách "${book.title}". Hạn trả: ${dueDate.toLocaleDateString()}`);
        return savedRecord;
    }
    returnBook(borrowRecordId) {
        const record = this.borrowRecordRepository.findById(borrowRecordId);
        if (!record) {
            console.error(`❌ Trả sách thất bại: Không tìm thấy bản ghi mượn ID ${borrowRecordId}.`);
            return null;
        }
        if (record.status === borrowRecord_1.BorrowStatus.RETURNED) {
            console.warn(`⚠️ Sách cho bản ghi ${borrowRecordId} đã được trả trước đó.`);
            return record;
        }
        const book = this.bookService.getBookById(record.bookId);
        if (book) {
            this.bookService.updateBookAvailability(book.id, true);
        }
        else {
            console.warn(`⚠️ Không tìm thấy Sách ID ${record.bookId} liên kết với bản ghi ${borrowRecordId} để cập nhật trạng thái.`);
        }
        const updatedRecord = this.borrowRecordRepository.update(borrowRecordId, {
            returnDate: new Date(),
            status: borrowRecord_1.BorrowStatus.RETURNED
        });
        if (!updatedRecord) {
            console.error(`❌ Trả sách thất bại: Không thể cập nhật bản ghi mượn ID ${borrowRecordId}.`);
            return null;
        }
        const user = this.userService.getUserById(record.userId);
        console.log(`✅ ${user?.name || 'Người dùng'} đã trả sách "${book?.title || 'Sách ID ' + record.bookId}" (Bản ghi ID: ${borrowRecordId})`);
        return updatedRecord;
    }
    getBorrowingHistory(status) {
        let records = this.borrowRecordRepository.getAll();
        if (status) {
            records = records.filter(r => r.status === status);
        }
        return records.sort((a, b) => b.id - a.id);
    }
    displayBorrowingHistory(records) {
        if (!records || records.length === 0) {
            console.log("  Không có bản ghi mượn nào để hiển thị.");
            return;
        }
        const table = new cli_table3_1.default({
            head: ['ID BG', 'Người mượn', 'Sách', 'Ngày mượn', 'Hạn trả', 'Trạng thái', 'Ngày trả'],
            colWidths: [8, 20, 25, 15, 15, 12, 15],
            wordWrap: true
        });
        records.forEach(record => {
            const user = this.userService.getUserById(record.userId);
            const book = this.bookService.getBookById(record.bookId);
            table.push([
                record.id,
                user?.name || `User ID ${record.userId}`,
                book?.title || `Book ID ${record.bookId}`,
                record.borrowDate.toLocaleDateString(),
                record.dueDate.toLocaleDateString(),
                record.status,
                record.returnDate ? record.returnDate.toLocaleDateString() : '—'
            ]);
        });
        console.log(table.toString());
    }
}
exports.BorrowingService = BorrowingService;
