# Hệ Thống Quản Lý Thư Viện Đơn Giản

 hệ thống quản lý thư viện đơn giản được xây dựng bằng TypeScript.

## Chức Năng

Hệ thống cung cấp các chức năng cơ bản sau thông qua một menu tương tác trên Command Line:

* **Hiển thị danh sách sách:** Liệt kê tất cả sách có trong thư viện cùng thông tin chi tiết và trạng thái khả dụng.
* **Tìm kiếm sách:** Tìm kiếm sách dựa trên từ khóa (tiêu đề, tác giả, ISBN, thể loại).
* **Mượn sách:** Cho phép một người dùng mượn một cuốn sách cụ thể nếu sách đó đang khả dụng. Tạo một phiếu mượn mới.
* **Trả sách:** Ghi nhận việc trả sách dựa trên ID phiếu mượn. Cập nhật trạng thái sách và phiếu mượn.
* **Xem phiếu mượn:** Hiển thị danh sách tất cả các phiếu mượn hiện có.

## Các Khái Niệm TypeScript Đã Áp Dụng

Trong quá trình xây dựng hệ thống này, e đã áp dụng nhiều khái niệm quan trọng từ bài học TypeScript được cung cấp, bao gồm:

1.  **Type Annotations (Chú thích kiểu):**
    * Được sử dụng rộng rãi để chỉ định kiểu dữ liệu cho biến, tham số hàm và giá trị trả về của hàm (ví dụ: `keyword: string`, `userId: number`, `searchBooks(...): Book[]`, `available: true`, `items: T[]`).
    * Giúp tăng tính rõ ràng của mã nguồn và cho phép TypeScript kiểm tra lỗi kiểu ngay từ giai đoạn phát triển. (Tham khảo trang 4, 6-7 trong PDF).

2.  **Basic Types (Các kiểu dữ liệu cơ bản):**
    * Sử dụng các kiểu như `string` (cho tiêu đề, tác giả, tên người dùng, ISBN), `number` (cho ID, totalCopies), `boolean` (cho `available`), `Date` (cho ngày mượn/trả/đến hạn). (Tham khảo trang 5-6 trong PDF).

3.  **Enums (Kiểu liệt kê):**
    * Đã sử dụng `Genre` để định nghĩa các thể loại sách cố định và `BorrowStatus` để định nghĩa trạng thái của phiếu mượn (`BORROWED`, `RETURNED`).
    * Giúp làm cho mã nguồn dễ đọc và quản lý hơn với các tập hợp giá trị có ý nghĩa. (Tham khảo trang 5-6 trong PDF).

4.  **Arrays (Mảng):**
    * Sử dụng mảng (`T[]`) trong lớp `Library` để lưu trữ danh sách các mục (sách, người dùng, phiếu mượn). (Tham khảo trang 5-6 trong PDF).

5.  **Interfaces (Giao diện):**
    * Mặc dù các định nghĩa `Book`, `User`, `BorrowRecord` được import từ các file models, chúng được định nghĩa dưới dạng `interface` (hoặc các kiểu tương đương) để xác định cấu trúc của dữ liệu.
    * Giúp định nghĩa "hình dạng" của các đối tượng, đảm bảo tính nhất quán của dữ liệu trong hệ thống. (Tham khảo trang 20 trong PDF).

6.  **Union Types (Kiểu hợp nhất):**
    * Được sử dụng trong hàm `printInfo(data: Book | User | BorrowRecord)` để cho phép hàm chấp nhận các đối tượng có kiểu khác nhau (`Book`, `User` hoặc `BorrowRecord`).
    * Giúp xử lý các giá trị có thể thuộc một trong nhiều kiểu dữ liệu. (Tham khảo trang 7 trong PDF).

7.  **Utility Types (Các kiểu tiện ích):**
    * Đã áp dụng `Omit<T, 'id'>` trong tham số của phương thức `add` trong lớp `Library` để cho phép thêm một mục mà không cần cung cấp `id` (vì ID sẽ được tự động tạo). Cũng sử dụng `Omit` cho `newRecord` trong `borrowBook`.
    * Đã áp dụng `Partial<Omit<T, 'id'>>` trong tham số `updatedItemData` của phương thức `update` để cho phép cập nhật một hoặc nhiều thuộc tính của một mục (trừ ID).
    * Các Utility Types giúp tạo ra các kiểu dữ liệu mới dựa trên các kiểu hiện có một cách linh hoạt. (Tham khảo trang 10 trong PDF).

8.  **Generics (Kiểu tổng quát):**
    * Lớp `Library<T>` là một ví dụ điển hình của Generics, cho phép lớp này hoạt động với bất kỳ kiểu dữ liệu nào (`T`) miễn là kiểu đó có thuộc tính `id: number`.
    * Generics giúp xây dựng các thành phần có thể tái sử dụng mà vẫn đảm bảo an toàn kiểu. (Tham khảo trang 8-9 trong PDF).

9.  **Type Guards (Bộ bảo vệ kiểu):**
    * Đã tạo các hàm `isBook` và `isUser` sử dụng Type Predicates (`item is Book`, `item is User`) để kiểm tra kiểu của đối tượng trong hàm `printInfo`.
    * Sử dụng kiểm tra thuộc tính (`'author' in item`, `'name' in item`) và kiểm tra kiểu (`typeof item === 'object'`) để phân biệt các kiểu dữ liệu khác nhau.
    * Type Guards giúp TypeScript thu hẹp kiểu dữ liệu trong các khối mã có điều kiện, cho phép truy cập các thuộc tính và phương thức cụ thể của kiểu đó. (Tham khảo trang 11-15 trong PDF, đặc biệt là User-Defined Type Guards và In Type Guards).

10. **Type Assertion (Khẳng định kiểu):**
    * Được sử dụng trong phương thức `add` (`as T`) và trong hàm `printInfo` (`data as BorrowRecord`) để "báo" cho TypeScript rằng em biết kiểu dữ liệu chính xác của một biến trong ngữ cảnh đó.
    * Sử dụng khi lập trình viên có thông tin về kiểu mà trình biên dịch TypeScript không thể tự suy luận. (Tham khảo trang 18-19 trong PDF).

11. **Function Types (Kiểu hàm):**
    * Mặc dù không khai báo tường minh bằng `type` hoặc `interface` cho các hàm, nhưng việc định nghĩa rõ ràng kiểu tham số và kiểu trả về trong các chữ ký hàm (ví dụ: `searchBooks = (keyword: string): Book[] => { ... }`, `borrowBook(userId: number, bookId: number): BorrowRecord | null`) chính là ứng dụng của khái niệm Kiểu hàm.
    * Việc này giúp đảm bảo rằng các hàm được gọi với đúng kiểu đối số và giá trị trả về có kiểu mong muốn. (Tham khảo trang 16-17 trong PDF).

## Cách Chạy

Để chạy ứng dụng này, bạn cần cài đặt Node.js. Sau đó, thực hiện các bước sau:

1.  Cài đặt TypeScript và các dependencies:
    ```bash
    npm install typescript ts-node readline-sync cli-table3 @types/readline-sync @types/cli-table3
    
2.  Chạy file TypeScript bằng `ts-node`:
    ```bash
    npx tsx index.ts
    ```
3.  Tương tác với hệ thống thông qua menu hiển thị trên terminal.
