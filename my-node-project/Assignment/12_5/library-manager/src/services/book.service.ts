import { Book } from '../models/book';
import { Repository } from '../repository/repository';
import Table from 'cli-table3';

export class BookService {
  constructor(private bookRepository: Repository<Book>) {}

  addBook(bookData: Omit<Book, 'id'>): Book {
    return this.bookRepository.add(bookData);
  }

  getAllBooks(): Book[] {
    return this.bookRepository.getAll();
  }

  getBookById(id: number): Book | null {
    return this.bookRepository.findById(id);
  }

  searchBooks(keyword: string): Book[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.bookRepository.getAll().filter(book =>
      book.title.toLowerCase().includes(lowerKeyword) ||
      book.author.toLowerCase().includes(lowerKeyword) ||
      (book.isbn && book.isbn.toLowerCase().includes(lowerKeyword)) ||
      (book.genre && book.genre.toLowerCase().includes(lowerKeyword))
    );
  }

  updateBookAvailability(bookId: number, isAvailable: boolean): Book | null {
    const book = this.getBookById(bookId);
    if (!book) {
      console.error(`❌ Không thể cập nhật trạng thái: Không tìm thấy Sách ID ${bookId}.`);
      return null;
    }
    return this.bookRepository.update(bookId, { available: isAvailable });
  }

  displayBooks(books: Book[]): void {
    if (!books || books.length === 0) {
      console.log("Không có sách nào để hiển thị.");
      return;
    }
    const table = new Table({
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