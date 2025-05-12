import { Book, Genre } from './models/book';
import { User } from './models/user';
import { BorrowRecord, BorrowStatus } from './models/borrow';
import readlineSync from 'readline-sync';
import Table from 'cli-table3';


class Library<T extends { id: number }> {
  private items: T[] = [];
  private nextId: number = 1;

  add(item: Omit<T, 'id'> & { id?: number }): T {
    const newItem = { ...item, id: item.id || this.nextId++ } as T;
    this.items.push(newItem);
    return newItem;
  }

  getAll(): T[] {
    return [...this.items];
  }

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  update(id: number, updatedItemData: Partial<Omit<T, 'id'>>): T | undefined {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      this.items[itemIndex] = { ...this.items[itemIndex], ...updatedItemData };
      return this.items[itemIndex];
    }
    return undefined;
  }
}

const bookList = new Library<Book>();
const userList = new Library<User>();
const borrowRecordList = new Library<BorrowRecord>();

bookList.add({ title: '1984', author: 'George Orwell', available: true, genre: Genre.Fiction, isbn: '978-0451524935', totalCopies: 5 });
bookList.add({ title: 'Clean Code', author: 'Robert C. Martin', available: true, genre: Genre.Code, isbn: '978-0132350884', totalCopies: 3 });
bookList.add({ title: 'The Hobbit', author: 'J.R.R. Tolkien', available: false, genre: Genre.Fantasy, isbn: '978-0547928227', totalCopies: 2 });
bookList.add({ title: 'Sapiens', author: 'Yuval Noah Harari', available: true, genre: Genre.History, isbn: '978-0062316097', totalCopies: 4 });
bookList.add({ title: 'Cosmos', author: 'Carl Sagan', available: true, genre: Genre.Science, isbn: '978-0345539434', totalCopies: 3 });

userList.add({ name: 'Alice Wonderland', memberId: 'MEM001' });
userList.add({ name: 'Bob The Builder', memberId: 'MEM002' });
userList.add({ name: 'Charlie Brown', memberId: 'MEM003' });



const searchBooks = (keyword: string): Book[] => {
  const lowerKeyword = keyword.toLowerCase();
  return bookList.getAll().filter(book =>
    book.title.toLowerCase().includes(lowerKeyword) ||
    book.author.toLowerCase().includes(lowerKeyword) ||
    (book.isbn && book.isbn.toLowerCase().includes(lowerKeyword)) ||
    (book.genre && Genre[book.genre].toLowerCase().includes(lowerKeyword))
  );
};

const isBook = (item: any): item is Book => item && typeof item === 'object' && 'author' in item && 'title' in item;
const isUser = (item: any): item is User => item && typeof item === 'object' && 'name' in item && !('author' in item);

function printInfo(data: Book | User | BorrowRecord) {
  if (isBook(data)) {
    console.log(`Book: ${data.title} by ${data.author} (Genre: ${data.genre}, Available: ${data.available})`);
  } else if (isUser(data)) {
    console.log(`User: ${data.name} (ID: ${data.id}, MemberID: ${data.memberId || 'N/A'})`);
  } else {
    const record = data as BorrowRecord;
    const book = bookList.findById(record.bookId);
    const user = userList.findById(record.userId);
    console.log(
      `Borrow Record (ID: ${record.id}): ` +
      `User '${user?.name || 'Unknown'}' borrowed Book '${book?.title || 'Unknown'}' ` +
      `on ${record.borrowDate.toLocaleDateString()}. Due: ${record.dueDate.toLocaleDateString()}. Status: ${record.status}` +
      `${record.returnDate ? '. Returned on: ' + record.returnDate.toLocaleDateString() : ''}`
    );
  }
}


function borrowBook(userId: number, bookId: number): BorrowRecord | null {
  const user = userList.findById(userId);
  const book = bookList.findById(bookId);

  if (!user) return console.error(`❌ User ID ${userId} not found.`), null;
  if (!book) return console.error(`❌ Book ID ${bookId} not found.`), null;
  if (!book.available) return console.error(`❌ Book "${book.title}" is not available.`), null;

  bookList.update(bookId, { available: false });

  const borrowDate = new Date();
  const dueDate = new Date(borrowDate);
  dueDate.setDate(borrowDate.getDate() + 14);

  const newRecord: Omit<BorrowRecord, 'id'> = {
    bookId,
    userId,
    borrowDate,
    dueDate,
    status: BorrowStatus.BORROWED
  };

  const savedRecord = borrowRecordList.add(newRecord);
  console.log(`✅ ${user.name} borrowed "${book.title}". Due: ${dueDate.toLocaleDateString()}`);
  return savedRecord;
}

function returnBook(borrowRecordId: number): BorrowRecord | null {
  const record = borrowRecordList.findById(borrowRecordId);
  if (!record) return console.error(`❌ Borrow record ${borrowRecordId} not found.`), null;
  if (record.status === BorrowStatus.RETURNED) return console.warn(`⚠️ Already returned.`), record;

  const book = bookList.findById(record.bookId);
  if (book) bookList.update(book.id, { available: true });

  const updatedRecord = borrowRecordList.update(borrowRecordId, {
    returnDate: new Date(),
    status: BorrowStatus.RETURNED
  });

  const user = userList.findById(record.userId);
  console.log(`✅ ${user?.name || 'User'} returned "${book?.title || 'Unknown'}"`);
  return updatedRecord!;
}

function showBorrowRecords(status?: BorrowStatus) {
  console.log(`\n📋 Borrow Records ${status ? `(Status: ${status})` : '(All)'}`);
  let records = borrowRecordList.getAll();
  if (status) records = records.filter(r => r.status === status);
  if (records.length === 0) {
    console.log("  No records found.");
    return;
  }
  const table = new Table({
    head: ['ID', 'User', 'Book', 'Borrow Date', 'Due Date', 'Status', 'Return Date'],
    colWidths: [5, 20, 25, 15, 15, 10, 15],
    wordWrap: true
  });

  records.forEach(record => {
    const user = userList.findById(record.userId);
    const book = bookList.findById(record.bookId);
    table.push([
      record.id,
      user?.name || 'Unknown',
      book?.title || 'Unknown',
      record.borrowDate.toLocaleDateString(),
      record.dueDate.toLocaleDateString(),
      record.status,
      record.returnDate ? record.returnDate.toLocaleDateString() : '—'
    ]);
  });

  console.log(table.toString());
}


// ========== Interactive Menu ==========
function interactiveMenu() {
  console.log("\n🧭 Library System - Interactive Mode");
  while (true) {
    const option = readlineSync.question(`
Chọn chức năng:
1. 📚 Hiển thị sách
2. 🔎 Tìm kiếm sách
3. ➕ Mượn sách
4. 🔄 Trả sách
5. 📄 Xem phiếu mượn
6. 🚪 Thoát
> `);

    switch (option) {
      case "1":
        console.log("\n📚 Danh sách sách:");
        const table = new Table({
          head: ['ID', 'Title', 'Author', 'Genre', 'Available'],
          colWidths: [5, 30, 25, 15, 10],
          wordWrap: true
        });
      
        bookList.getAll().forEach(book => {
          table.push([
            book.id,
            book.title,
            book.author,
            book.genre,
            book.available ? '✅' : '❌'
          ]);
        });
        console.log(table.toString());
        break;

      case "2":
        const keyword = readlineSync.question("🔍 Nhập từ khóa: ");
        const found = searchBooks(keyword);
        if (found.length) {
          const foundTable = new Table({
            head: ['ID', 'Title', 'Author', 'Genre', 'Available'],
            colWidths: [5, 30, 25, 15, 10],
            wordWrap: true
          });
          found.forEach(book => {
            foundTable.push([
              book.id,
              book.title,
              book.author,
              book.genre,
              book.available ? '✅' : '❌'
            ]);
          });
          console.log(foundTable.toString());
        } else {
          console.log("❌ Không tìm thấy sách.");
        }
        break;

      case "3":
        const userId = readlineSync.questionInt("👤 Nhập ID người mượn: ");
        const bookId = readlineSync.questionInt("📕 Nhập ID sách: ");
        borrowBook(userId, bookId);
        break;

      case "4":
        const recordId = readlineSync.questionInt("📄 Nhập ID phiếu mượn: ");
        returnBook(recordId);
        break;

      case "5":
        showBorrowRecords();
        break;

      case "6":
        console.log("👋 Tạm biệt! Cook");
        return;

      default:
        console.log("⚠️ Lựa chọn không hợp lệ.");
    }
  }
}

interactiveMenu();
