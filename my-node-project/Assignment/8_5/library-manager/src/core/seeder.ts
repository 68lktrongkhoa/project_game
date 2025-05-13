import fs from 'fs';
import path from 'path';
import { Book, BookGenre, GenreValues } from '../models/book'; 
import { User } from '../models/user';
import { BookService } from '../services/book.service';
import { UserService } from '../services/user.service';
const DATA_DIRECTORY = path.join(__dirname, '../data');

type RawBookDataFromJSON = {
  title?: unknown;
  author?: unknown;
  available?: unknown;
  genre?: unknown;
  isbn?: unknown;
  totalCopies?: unknown;
};

type RawUserDataFromJSON = {
  name?: unknown;
  memberId?: unknown;
};

interface SeederConfig<TRaw, TModel> {
  entityName: string;
  fileName: string;
  transformAndValidate: (rawData: TRaw, index: number, fileName: string) => TModel | null;
  addToService: (modelData: TModel) => any;
}

function seedData<TRaw, TModel>(config: SeederConfig<TRaw, TModel>): void {
  const { entityName, fileName, transformAndValidate, addToService } = config;
  const filePath = path.join(DATA_DIRECTORY, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Cảnh báo: File dữ liệu '${fileName}' không tồn tại tại ${filePath}. Bỏ qua nạp '${entityName}'.`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const rawItems: unknown[] = JSON.parse(fileContent);

    if (!Array.isArray(rawItems)) {
      console.error(`❌ Lỗi: Dữ liệu từ '${fileName}' không phải là một mảng.`);
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    rawItems.forEach((rawItem, index) => {
      try {
        const modelData = transformAndValidate(rawItem as TRaw, index, fileName);

        if (modelData) {
          addToService(modelData);
          successCount++;
        } else {
          errorCount++;
        }
      } catch (processingError) {
        const errorMessage = processingError instanceof Error ? processingError.message : String(processingError);
        console.error(`❌ Lỗi khi xử lý mục ${index + 1} cho '${entityName}' từ '${fileName}': ${errorMessage}`);
        errorCount++;
      }
    });

    if (successCount > 0) {
      console.log(`✅ Đã nạp thành công ${successCount} '${entityName}'.`);
    }
    if (errorCount > 0) {
      console.warn(`⚠️  Có ${errorCount} lỗi/cảnh báo trong quá trình nạp '${entityName}'.`);
    }
    if (rawItems.length === 0) {
        console.log(`ℹ️  File '${fileName}' không chứa dữ liệu nào cho '${entityName}'.`);
    } else if (successCount === 0 && errorCount === rawItems.length) {
        console.error(`❌ Không nạp được '${entityName}' nào từ '${fileName}' do tất cả dữ liệu không hợp lệ.`);
    }


  } catch (fileError) {
    const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
    console.error(`❌ Lỗi nghiêm trọng khi đọc hoặc parse file '${fileName}' cho '${entityName}': ${errorMessage}`);
  }
}

function transformAndValidateBook(rawData: RawBookDataFromJSON, index: number, fileName: string): Omit<Book, 'id'> | null {
  const { title, author, available, genre, isbn, totalCopies } = rawData;
  if (typeof title !== 'string' || title.trim() === '') {
    console.warn(`⚠️  Mục sách ${index + 1} trong '${fileName}' thiếu 'title' hoặc 'title' không hợp lệ.`);
    return null;
  }
  if (typeof author !== 'string' || author.trim() === '') {
    console.warn(`⚠️  Mục sách ${index + 1} trong '${fileName}' thiếu 'author' hoặc 'author' không hợp lệ.`);
    return null;
  }
  if (typeof available !== 'boolean') {
    console.warn(`⚠️  Mục sách ${index + 1} trong '${fileName}' thiếu 'available' hoặc 'available' không phải boolean.`);
    return null;
  }
  let validatedGenre: BookGenre | undefined = undefined;
  if (genre !== undefined) {
    if (typeof genre === 'string' && (Object.values(GenreValues) as string[]).includes(genre)) {
      validatedGenre = genre as BookGenre;
    } else {
      console.warn(`⚠️  Mục sách ${index + 1} trong '${fileName}' có 'genre' không hợp lệ: '${genre}'. Bỏ qua genre.`);
    }
  }
  const validatedIsbn = (typeof isbn === 'string' && isbn.trim() !== '') ? isbn.trim() : undefined;

  let validatedTotalCopies: number | undefined = undefined;
  if (totalCopies !== undefined) {
    if (typeof totalCopies === 'number' && Number.isInteger(totalCopies) && totalCopies >= 0) {
      validatedTotalCopies = totalCopies;
    } else {
      console.warn(`⚠️  Mục sách ${index + 1} trong '${fileName}' có 'totalCopies' không hợp lệ: '${totalCopies}'. Bỏ qua totalCopies.`);
    }
  }

  return {
    title: title.trim(),
    author: author.trim(),
    available,
    genre: validatedGenre,
    isbn: validatedIsbn,
    totalCopies: validatedTotalCopies,
  };
}

function transformAndValidateUser(rawData: RawUserDataFromJSON, index: number, fileName: string): Omit<User, 'id'> | null {
  const { name, memberId: rawMemberId } = rawData; 
  if (typeof name !== 'string' || name.trim() === '') {
    console.warn(`⚠️  Mục người dùng ${index + 1} trong '${fileName}' thiếu 'name' hoặc 'name' không hợp lệ. Dữ liệu: ${JSON.stringify(rawData)}`);
    return null;
  }

  let validatedMemberId: string;

  if (rawMemberId === undefined || rawMemberId === null) {
    console.warn(`⚠️  Mục người dùng ${index + 1} (Tên: ${name}) trong '${fileName}' thiếu 'memberId'. Dữ liệu: ${JSON.stringify(rawData)}`);
    return null;
  }

  if (typeof rawMemberId === 'number') {
    if (Number.isInteger(rawMemberId) && rawMemberId > 0) {
      validatedMemberId = String(rawMemberId);
    } else {
      console.warn(`⚠️  Mục người dùng ${index + 1} (Tên: ${name}) trong '${fileName}' có 'memberId' dạng số không hợp lệ: ${rawMemberId}. Dữ liệu: ${JSON.stringify(rawData)}`);
      return null;
    }
  } else if (typeof rawMemberId === 'string') {
    if (rawMemberId.trim() === '') {
      console.warn(`⚠️  Mục người dùng ${index + 1} (Tên: ${name}) trong '${fileName}' có 'memberId' dạng chuỗi rỗng. Dữ liệu: ${JSON.stringify(rawData)}`);
      return null;
    }
    validatedMemberId = rawMemberId.trim();
  } else {
    console.warn(`⚠️  Mục người dùng ${index + 1} (Tên: ${name}) trong '${fileName}' có 'memberId' với kiểu không hợp lệ: ${typeof rawMemberId}. Dữ liệu: ${JSON.stringify(rawData)}`);
    return null;
  }

  return {
    name: name.trim(),
    memberId: validatedMemberId,
  };
}
export function loadInitialData(bookService: BookService, userService: UserService): void {
  seedData<RawBookDataFromJSON, Omit<Book, 'id'>>({
    entityName: 'Sách',
    fileName: 'booksdata.json',
    transformAndValidate: transformAndValidateBook,
    addToService: (bookData) => bookService.addBook(bookData),
  });

  seedData<RawUserDataFromJSON, Omit<User, 'id'>>({
    entityName: 'Người dùng',
    fileName: 'usersdata.json',
    transformAndValidate: transformAndValidateUser,
    addToService: (userData) => userService.addUser(userData),
  });
}