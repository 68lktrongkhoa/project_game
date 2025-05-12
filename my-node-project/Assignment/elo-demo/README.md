# ELO Ranking Demo

## Giới thiệu

ELO Ranking Demo là một ứng dụng web mô phỏng hệ thống xếp hạng ELO, quản lý người chơi, lịch sử trận đấu, và hiển thị thông tin chi tiết về tướng (champions) cũng như các số liệu thống kê liên quan. Ứng dụng bao gồm một backend Node.js/Express để quản lý dữ liệu và logic, và một frontend Angular để hiển thị và tương tác người dùng.

## Chức năng chính (Frontend)

Hệ thống bao gồm các chức năng cốt lõi sau:

1.  **Quản lý Người chơi (Player Roster):**
    *   Hiển thị danh sách tất cả người chơi.
    *   Thông tin hiển thị bao gồm: Thứ hạng trong danh sách, Tên người chơi, Rank trực quan (ví dụ: Silver III), và Điểm ELO hiện tại.
    *   Chức năng tìm kiếm người chơi theo tên.
    *   Cho phép xem chi tiết thống kê của từng người chơi khi nhấp vào nút "Stats".

2.  **Quản lý Tướng (Champion Roster):**
    *   Hiển thị danh sách tất cả các tướng có trong hệ thống.
    *   Mỗi tướng được hiển thị dưới dạng thẻ (card) bao gồm: Hình ảnh, Tên, Danh hiệu, và Loại tướng (Champion Class).
    *   Chức năng lọc tướng theo Loại tướng.
    *   Khi chọn một tướng, hiển thị thông tin chi tiết bao gồm: Hình ảnh lớn hơn, Tên, Danh hiệu, Loại tướng, Mô tả, và danh sách các Kỹ năng (Abilities) cùng mô tả.

3.  **Lịch sử Trận đấu (Match History):**
    *   Hiển thị danh sách các trận đấu gần nhất (ví dụ: 100 trận cuối).
    *   Thông tin mỗi trận đấu bao gồm: ID trận, Thông tin Người chơi 1 (tên, tướng sử dụng), Thông tin Người chơi 2 (tên, tướng sử dụng), Người chiến thắng, và Ngày diễn ra.
    *   Cho phép xem chi tiết của từng trận đấu.

4.  **Chi tiết Người chơi được chọn (Selected Player Details):**
    *   Khi một người chơi được chọn từ danh sách, mục này sẽ hiển thị:
        *   Tên người chơi.
        *   Rank trực quan và Điểm ELO.
        *   Số trận đã chơi, số trận thắng, số trận thua.
        *   Tỷ lệ thắng/thua.
        *   Biểu đồ radar trực quan hóa các chỉ số cơ bản của người chơi (ví dụ: Attack, Defense, Speed, Magic, Support - dựa trên dữ liệu mock ban đầu).
    *   Chức năng "Find Match": Tìm kiếm một đối thủ tiềm năng cho người chơi được chọn.

5.  **Chi tiết Trận đấu được chọn (Selected Match Details):**
    *   Khi một trận đấu được chọn từ lịch sử, mục này sẽ hiển thị:
        *   ID trận đấu.
        *   Thông tin chi tiết của cả hai người chơi tham gia: Tên, Tướng đã sử dụng, ELO trước trận, Thay đổi ELO sau trận, KDA (Kills/Deaths/Assists).
        *   Tên người chiến thắng.
        *   Ngày giờ diễn ra trận đấu.
        *   Biểu đồ so sánh chỉ số của hai người chơi trong trận đấu đó (ví dụ: radar chart so sánh chỉ số cơ bản của tướng họ sử dụng, hoặc biểu đồ đường/cột nếu có dữ liệu timeline như lượng vàng theo thời gian).
        *   Hiển thị tỷ lệ sát thương gây ra (Damage Dealt to Champions) giữa hai người chơi nếu có dữ liệu.

6.  **Tìm kiếm Đối thủ & Bắt đầu Trận đấu:**
    *   Người dùng có thể chọn một người chơi và nhấn "Find Match".
    *   Hệ thống sẽ tìm một đối thủ tiềm năng dựa trên một khoảng ELO nhất định.
    *   Nếu tìm thấy, thông tin đối thủ sẽ được hiển thị, và người dùng có thể chọn "Start Match" để mô phỏng trận đấu (hiện tại có thể là chọn ngẫu nhiên người thắng và cập nhật ELO).

7.  **Thống kê Tổng hợp (Aggregate Stats Chart):**
    *   Hiển thị biểu đồ radar thống kê tổng hợp, ví dụ: các chỉ số cơ bản trung bình của top 5 tướng được chơi nhiều nhất qua tất cả các trận đấu.

8.  **Giao diện Người dùng:**
    *   Sử dụng Bootstrap 5 cho layout và các thành phần UI cơ bản, đảm bảo tính responsive.
    *   Sử dụng Bootstrap Icons cho các biểu tượng.
    *   CSS tùy chỉnh để tinh chỉnh giao diện và đảm bảo tính nhất quán.
    *   Các bảng dữ liệu có thanh cuộn khi nội dung vượt quá chiều cao tối đa.
    *   Header và các nút điều hướng để chuyển đổi giữa các chế độ xem (Danh sách Tướng, Thống kê Tổng hợp).

## Cách hoạt động & Tính toán (Backend)

### 1. Khởi tạo Dữ liệu (Seed Data)

*   Khi backend khởi động và biến môi trường `SEED_DB=true`, hệ thống sẽ tự động điền dữ liệu mẫu vào database nếu database trống.
*   **Champions:** Dữ liệu tướng được lấy từ `data/champion.data.js`.
*   **Players:** Một số lượng người chơi mẫu (ví dụ: 100) sẽ được tạo với ELO ban đầu và tướng yêu thích ngẫu nhiên từ danh sách tướng đã seed.
*   **Matches:** Một số lượng trận đấu mẫu (ví dụ: 100) sẽ được tạo giữa các người chơi đã seed, với kết quả ngẫu nhiên và ELO được cập nhật sau mỗi trận.

### 2. Tính toán ELO (`eloCalculationService.js`)

*   Hệ thống sử dụng công thức tính ELO tiêu chuẩn.
*   **Hằng số K (K-Factor):** Được đặt là `32`.
*   **Công thức:**
    *   `Ea = 1 / (1 + 10^((Rb - Ra) / 400))` (Tỷ lệ thắng kỳ vọng của Người chơi A)
    *   `Eb = 1 / (1 + 10^((Ra - Rb) / 400))` (Tỷ lệ thắng kỳ vọng của Người chơi B)
    *   Nếu Người chơi A thắng:
        *   `NewRa = Ra + K * (1 - Ea)`
        *   `NewRb = Rb + K * (0 - Eb)`
    *   Nếu Người chơi B thắng:
        *   `NewRa = Ra + K * (0 - Ea)`
        *   `NewRb = Rb + K * (1 - Eb)`
*   Điểm ELO mới được làm tròn thành số nguyên.
*   ELO của người chơi được cập nhật trong database sau mỗi trận đấu.

### 3. Xác định Rank Trực quan (Frontend Logic)

*   Frontend (`EloService.getVisualRankFromElo`) nhận điểm ELO từ backend.
*   Dựa trên các ngưỡng ELO được định nghĩa trước, frontend xác định Bậc Rank (Iron, Bronze, ...) và Bậc Đoàn (IV, III, ...), cùng với LP.
*   Hàm này được gọi để cập nhật `visualRank` và `lp` của người chơi trên giao diện.

### 4. Hiển thị Icon Rank (Frontend Logic)

*   Frontend (`YourComponent.getPlayerRankIcon`) dựa trên `tier` (ví dụ: "Silver") để hiển thị icon rank tương ứng từ `src/assets/icons/`.

### 5. Lấy dữ liệu Tướng (Frontend Logic)

*   Frontend `ChampionService` có thể chứa dữ liệu tướng mẫu hoặc sẽ gọi API từ backend để lấy danh sách tướng.

### 6. Biểu đồ (`ng2-charts` / `Chart.js` - Frontend)

*   Frontend sử dụng `ng2-charts` để vẽ các biểu đồ radar, đường, cột dựa trên dữ liệu từ backend.

## Cấu trúc Dự án

### Backend (`elo_backend/`)

*   **`config/`**: Chứa file cấu hình kết nối database (`db.js`).
*   **`data/`**: Chứa dữ liệu mẫu (ví dụ: `champion.data.js`).
*   **`models/`**: Định nghĩa Mongoose Schemas cho Player, Champion, Match.
*   **`routes/`**: Định nghĩa các API endpoints (ví dụ: `playerRoutes.js`).
*   **`services/`**: Chứa logic nghiệp vụ (ví dụ: `eloCalculationService.js`).
*   **`index.js`**: File khởi động chính của server backend.
*   **`.env`**: File chứa các biến môi trường (PORT, MONGO_URI, SEED_DB).

### Frontend (Đề xuất)

*   **`src/app/core/`**: Services cốt lõi, guards, interceptors.
*   **`src/app/features/`**: Chứa các module/thư mục con cho từng chức năng chính:
    *   `champions/`
    *   `players/`
    *   `matches/`
    *   `ranking/`
*   **`src/app/shared/`**: Components, directives, pipes có thể tái sử dụng.
*   **`src/app/layouts/`**: Components layout chung (header, footer).
*   **`src/assets/`**: Chứa các file tĩnh như hình ảnh (bao gồm cả icons rank trong `src/assets/icons/`).

## Công nghệ sử dụng

### Backend

*   **Node.js:** Môi trường chạy JavaScript phía server.
*   **Express.js:** Framework web cho Node.js.
*   **MongoDB:** Cơ sở dữ liệu NoSQL.
*   **Mongoose:** ODM (Object Data Modeling) cho MongoDB và Node.js.
*   **dotenv:** Để quản lý biến môi trường.
*   **cors:** Middleware cho Cross-Origin Resource Sharing.

### Frontend

*   **Angular (v16+):** Framework chính cho frontend.
*   **TypeScript:** Ngôn ngữ lập trình chính.
*   **HTML5 & CSS3:** Cấu trúc và giao diện.
*   **Bootstrap 5:** Framework CSS cho UI components và responsive design.
*   **Bootstrap Icons:** Bộ icon SVG.
*   **ng2-charts (Chart.js):** Thư viện vẽ biểu đồ.
*   **Angular CLI:** Công cụ dòng lệnh để quản lý dự án Angular.

## Cài đặt và Chạy (Backend)

### Yêu cầu

*   **Node.js** (phiên bản 16.x trở lên được khuyến nghị).
*   **MongoDB Server** (phiên bản 5.x trở lên được khuyến nghị).
*   **MongoDB Shell (`mongosh`)** (để tương tác với database từ dòng lệnh).
*   **(macOS) Homebrew** (để cài đặt `mongosh` dễ dàng).

### Các bước cài đặt MongoDB trên macOS (Ví dụ cài đặt thủ công)

1.  **Tải MongoDB Community Server:**
    *   Truy cập [trang chủ MongoDB](https://www.mongodb.com/try/download/community) và tải file `.tgz` cho macOS (chọn đúng phiên bản cho chip Intel `x86_64` hoặc Apple Silicon `arm64`).
2.  **Giải nén:**
    ```bash
    cd ~/Downloads # Hoặc thư mục bạn tải về
    tar -zxvf mongodb-macos-ARCH-VERSION.tgz
    ```
    (Thay `mongodb-macos-ARCH-VERSION.tgz` bằng tên file thực tế).
3.  **Di chuyển thư mục đã giải nén:**
    ```bash
    sudo mv mongodb-macos-ARCH-VERSION /usr/local/mongodb
    ```
    (Thay `mongodb-macos-ARCH-VERSION` bằng tên thư mục đã giải nén).
4.  **Tạo thư mục lưu trữ dữ liệu:**
    ```bash
    mkdir -p ~/mongodb-data
    ```
5.  **Thêm MongoDB vào PATH (cho Zsh):**
    Mở file `~/.zshrc` (ví dụ: `open ~/.zshrc`) và thêm dòng sau:
    ```zsh
    # ~/.zshrc
    # ... (các cấu hình khác, đảm bảo compinit đã được gọi nếu cần)
    export PATH="/usr/local/mongodb/bin:$PATH"
    ```
    Sau đó, chạy `source ~/.zshrc` trong Terminal.
6.  **Cài đặt MongoDB Shell (`mongosh`):**
    *   Cài đặt Homebrew (nếu chưa có):
        ```bash
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        ```
        Làm theo hướng dẫn "Next steps" của Homebrew để thêm nó vào PATH.
    *   Cài đặt `mongosh`:
        ```bash
        brew install mongosh
        ```

### Chạy Backend

1.  **Clone repository (nếu có) hoặc đảm bảo bạn có thư mục `elo_backend`.**
2.  **Đi đến thư mục `elo_backend`:**
    ```bash
    cd path/to/elo_backend
    ```
3.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```
4.  **Tạo file `.env`** trong thư mục `elo_backend` với nội dung:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/elo_app_db
    SEED_DB=true # Đặt là 'true' để seed database khi khởi động lần đầu, sau đó có thể đặt 'false'
    ```
5.  **Khởi động MongoDB Server:**
    Mở một cửa sổ Terminal mới và chạy:
    ```bash
    # Nếu /usr/local/mongodb/bin đã có trong PATH
    mongod --dbpath ~/mongodb-data
    # Hoặc chạy bằng đường dẫn tuyệt đối
    # /usr/local/mongodb/bin/mongod --dbpath ~/mongodb-data
    ```
    Giữ cửa sổ Terminal này mở.
6.  **Khởi động Backend Server:**
    Trong cửa sổ Terminal của thư mục `elo_backend`, chạy:
    ```bash
    npm start
    # Hoặc
    # node index.js
    ```
    Bạn sẽ thấy log "MongoDB Connected..." và "Backend server running on port 5000". Nếu `SEED_DB=true`, bạn cũng sẽ thấy log về việc seed data.

### Chạy Frontend (Angular)

1.  **Đi đến thư mục frontend của bạn.**
2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```
3.  **Chạy ứng dụng Angular:**
    ```bash
    ng serve -o
    ```
    Ứng dụng sẽ mở trong trình duyệt của bạn, thường ở `http://localhost:4200/`.

## Hướng phát triển tiềm năng

*   Kết nối với backend thực sự để lưu trữ và truy xuất dữ liệu thay vì dữ liệu mock (đã thực hiện với backend Node.js).
*   Triển khai hệ thống xác thực người dùng.
*   Cho phép người dùng tự tạo trận đấu và nhập kết quả thông qua giao diện.
*   Thêm các loại biểu đồ và thống kê chi tiết hơn.
*   Cải thiện logic tìm kiếm đối thủ.
*   Hỗ trợ đa ngôn ngữ.
*   Tối ưu hóa hiệu năng.