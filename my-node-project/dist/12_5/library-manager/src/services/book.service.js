"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
class BookService {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    addBook(bookData) {
        return this.bookRepository.add(bookData);
    }
    getAllBooks() {
        return this.bookRepository.getAll();
    }
    getBookById(id) {
        return this.bookRepository.findById(id);
    }
    searchBooks(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return this.bookRepository.getAll().filter(book => book.title.toLowerCase().includes(lowerKeyword) ||
            book.author.toLowerCase().includes(lowerKeyword) ||
            (book.isbn && book.isbn.toLowerCase().includes(lowerKeyword)) ||
            (book.genre && book.genre.toLowerCase().includes(lowerKeyword)));
    }
    updateBookAvailability(bookId, isAvailable) {
        const book = this.getBookById(bookId);
        if (!book) {
            console.error(`❌ Không thể cập nhật trạng thái: Không tìm thấy Sách ID ${bookId}.`);
            return null;
        }
        return this.bookRepository.update(bookId, { available: isAvailable });
    }
    displayBooks(books) {
        if (!books || books.length === 0) {
            console.log("Không có sách nào để hiển thị.");
            return;
        }
        const table = new cli_table3_1.default({
            head: ['ID', 'Tiêu đề', 'Tác giả', 'Thể loại', 'Có sẵn', 'Mã Sách', 'Số bản'],
            colWidths: [5, 30, 25, 15, 10, 20, 8],
            wordWrap: true
        });
        books.forEach(book => {
            table.push([
                book.id,
                book.title,
                book.author,
                book.genre,
                book.available ? '✅ Có' : '❌ Không',
                book.isbn ?? 'N/A',
                book.totalCopies
            ]);
        });
        console.log(table.toString());
    }
}
exports.BookService = BookService;
