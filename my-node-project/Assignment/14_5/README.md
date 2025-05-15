# Task Manager CLI (Trình Quản Lý Công Việc Dòng Lệnh)

Một công cụ dòng lệnh đơn giản để quản lý các dự án và công việc của bạn.

## Tính năng chính

*   **Quản lý Dự án:** Tạo, xem, cập nhật, xóa dự án.
*   **Quản lý Công việc:** Tạo, xem, cập nhật, xóa công việc cho từng dự án.
*   **Bảng điều khiển:** Xem tổng quan nhanh về trạng thái dự án và công việc.
*   **Giao diện tương tác:** Menu dễ sử dụng trên dòng lệnh.
*   **Lưu trữ dữ liệu:** Dữ liệu được lưu vào file `task-manager-data.json` trong thư mục dự án.

## Yêu cầu

*   [Node.js](https://nodejs.org/) (phiên bản 16.x trở lên)
*   npm (thường đi kèm với Node.js)

## Cài đặt

1.  **Tải mã nguồn:**
    ```bash
    git clone https://github.com/68lktrongkhoa/project_game/tree/main/my-node-project/Assignment/14_5/task-manager-cli
    ```

2.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```

3.  **Biên dịch (Build):**
    ```bash
    npm run build
    ```

## Sử dụng

*   **Chạy ứng dụng (sau khi build):**
    ```bash
    npm start
    ```

*   **Chạy trong quá trình phát triển (không cần build mỗi lần):**
    ```bash
    npm run start:dev
    ```

## Cấu trúc thư mục mã nguồn (`src`)

*   `commands/`: Chứa logic cho từng hành động (tạo dự án, xem công việc, v.v.).
*   `constants/`: Các giá trị không đổi (ví dụ: màu sắc cho giao diện).
*   `decorators/`: Các decorator (ví dụ: `@LogMethodCalls` để ghi log).
*   `flows/`: Logic điều khiển các menu và luồng tương tác.
*   `models/`: Định nghĩa cấu trúc dữ liệu cho `Project` và `Task` bằng Class.
*   `services/`: Xử lý logic nghiệp vụ và lưu trữ dữ liệu (`ProjectService`, `TaskService`, `StorageService`, `DisplayService`).
*   `types/`: Định nghĩa các kiểu dữ liệu và `enum`.
*   `utils/`: Các hàm tiện ích nhỏ.
*   `index.ts`: Điểm bắt đầu của ứng dụng.

## Công nghệ

*   TypeScript
*   Node.js
*   Inquirer.js (Tạo menu)
*   Chalk (Màu sắc cho terminal)
*   Ora (Hiển thị spinner)
*   cli-table3 (Hiển thị bảng)
*   date-fns (Xử lý ngày tháng)
*   UUID (Tạo ID)