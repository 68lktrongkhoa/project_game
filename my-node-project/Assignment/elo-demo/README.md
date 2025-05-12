# ELO Ranking Demo

## Giới thiệu

ELO Ranking Demo là một ứng dụng web mô phỏng hệ thống xếp hạng ELO, quản lý người chơi, lịch sử trận đấu, và hiển thị thông tin chi tiết về tướng (champions) cũng như các số liệu thống kê liên quan. Ứng dụng được xây dựng bằng Angular, sử dụng TypeScript cho logic, HTML cho cấu trúc và CSS (cùng với Bootstrap) cho giao diện người dùng.

## Chức năng chính

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

## Cách hoạt động & Tính toán

### 1. Khởi tạo Dữ liệu (`EloService`)

*   **Người chơi:** Khi service khởi tạo, một danh sách người chơi (ví dụ: 20 người) được tạo ra với:
    *   ID, Tên (`Player X`).
    *   Điểm ELO ban đầu (ví dụ: 1200).
    *   Các chỉ số cơ bản (Attack, Defense, Speed, Magic, Support) được gán ngẫu nhiên trong một khoảng nhất định.
    *   Tướng yêu thích (Favorite Champion) được chọn ngẫu nhiên từ danh sách tướng.
    *   `visualRank` (bao gồm `tier` và `division`) và `lp` (League Points) được gán ngẫu nhiên hoặc dựa trên ELO ban đầu thông qua hàm `getVisualRankFromElo`.
*   **Trận đấu ban đầu:** Một số lượng trận đấu ngẫu nhiên (ví dụ: 100 trận) được tạo ra giữa các người chơi đã khởi tạo:
    *   Hai người chơi được chọn ngẫu nhiên.
    *   Mỗi người chơi chọn một tướng ngẫu nhiên.
    *   Người chiến thắng được xác định ngẫu nhiên.
    *   Điểm ELO của hai người chơi được cập nhật dựa trên kết quả trận đấu.
    *   Thông tin trận đấu (người chơi, tướng, ELO trước/sau, người thắng, ngày) được lưu lại.
    *   Sau khi tạo các trận đấu ban đầu, `visualRank` và `lp` của người chơi được cập nhật lại dựa trên điểm ELO cuối cùng của họ.

### 2. Tính toán ELO (`EloService.calculateNewElo` và `EloService.updateElo`)

*   Hệ thống sử dụng công thức tính ELO tiêu chuẩn.
*   **Hằng số K (K-Factor):** Được đặt là `32` (một giá trị phổ biến).
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
*   Sau mỗi trận đấu (kể cả trận đấu được tạo khi "Start Match"), ELO của người chơi liên quan sẽ được cập nhật.

### 3. Xác định Rank Trực quan (`EloService.getVisualRankFromElo`)

*   Hàm này nhận đầu vào là điểm ELO của một người chơi.
*   Dựa trên các ngưỡng ELO được định nghĩa trước cho từng Bậc Rank (Iron, Bronze, Silver, Gold, Platinum, Emerald, Diamond, Master, Grandmaster, Challenger) và các Bậc Đoàn (Division IV, III, II, I) trong mỗi rank đó.
*   Trả về một object chứa `tier` (ví dụ: "Silver"), `division` (ví dụ: "III"), và `lp`.
*   **Logic tính LP (ví dụ):**
    *   Với các rank có division: LP được tính bằng `(elo - mốc_đầu_division) % 100` (giả sử mỗi division có 100 LP).
    *   Với các rank không có division (Master, GM, Challenger): LP được tính bằng `elo - mốc_đầu_rank`.
*   Hàm này được gọi để cập nhật `visualRank` và `lp` của người chơi sau khi ELO của họ thay đổi hoặc khi khởi tạo.

### 4. Hiển thị Icon Rank (`YourComponent.getPlayerRankIcon`)

*   Hàm này nhận `tier` (ví dụ: "Silver") làm đầu vào.
*   Chuyển `tier` thành chữ thường.
*   Tra cứu trong một đối tượng `TIER_ICONS` (map giữa tên rank chữ thường và đường dẫn đến file icon tương ứng, ví dụ: `{'silver': 'assets/icons/silver.png'}`).
*   Trả về đường dẫn đến file icon. Nếu không tìm thấy, trả về icon "unranked" mặc định.
*   Các file icon được lưu trữ trong thư mục `src/assets/icons/` của dự án.

### 5. Lấy dữ liệu Tướng (`ChampionService`)

*   `ChampionService` chịu trách nhiệm cung cấp danh sách các tướng.
*   Dữ liệu tướng (tên, danh hiệu, loại, mô tả, kỹ năng, đường dẫn ảnh) có thể được định nghĩa sẵn trong một file (ví dụ: `champion.data.ts`) hoặc lấy từ một API bên ngoài (trong tương lai).
*   Hàm `getChampionImageUrl` tạo đường dẫn đến ảnh của tướng (ví dụ: dựa trên tên tướng).

### 6. Biểu đồ (`ng2-charts` / `Chart.js`)

*   Ứng dụng sử dụng thư viện `ng2-charts` (một wrapper của Chart.js cho Angular) để vẽ các biểu đồ.
*   **Biểu đồ Radar:**
    *   Được sử dụng để hiển thị các chỉ số cơ bản của người chơi (trong Chi tiết Người chơi) hoặc so sánh chỉ số của hai người chơi trong một trận đấu (trong Chi tiết Trận đấu).
    *   Cũng được sử dụng cho Thống kê Tổng hợp.
*   **Biểu đồ Đường/Cột (Tùy chọn):** Có thể được sử dụng trong Chi tiết Trận đấu để hiển thị dữ liệu theo thời gian (ví dụ: lượng vàng) nếu có `timelineData`.
*   Dữ liệu và tùy chọn cho mỗi biểu đồ được định nghĩa trong các thuộc tính của component tương ứng (ví dụ: `playerRadarChartData`, `matchRadarChartOptions`).

## Cấu trúc Dự án (Đề xuất)

Dự án được tổ chức theo cấu trúc feature-based để dễ quản lý và mở rộng:

*   **`src/app/core/`**: Services cốt lõi, guards, interceptors.
*   **`src/app/features/`**: Chứa các module/thư mục con cho từng chức năng chính:
    *   `champions/`
    *   `players/`
    *   `matches/`
    *   `ranking/`
    *   Mỗi feature sẽ có các thư mục con cho `components`, `services`, `models`, `data`, và `routes`.
*   **`src/app/shared/`**: Components, directives, pipes có thể tái sử dụng.
*   **`src/app/layouts/`**: Components layout chung (header, footer).
*   **`src/assets/`**: Chứa các file tĩnh như hình ảnh (bao gồm cả icons rank trong `src/assets/icons/`).

## Công nghệ sử dụng

*   **Angular (v16+):** Framework chính cho frontend.
*   **TypeScript:** Ngôn ngữ lập trình chính.
*   **HTML5 & CSS3:** Cấu trúc và giao diện.
*   **Bootstrap 5:** Framework CSS cho UI components và responsive design.
*   **Bootstrap Icons:** Bộ icon SVG.
*   **ng2-charts (Chart.js):** Thư viện vẽ biểu đồ.
*   **Angular CLI:** Công cụ dòng lệnh để quản lý dự án Angular.

## Hướng phát triển tiềm năng

*   Kết nối với backend thực sự để lưu trữ và truy xuất dữ liệu thay vì dữ liệu mock.
*   Triển khai hệ thống xác thực người dùng.
*   Cho phép người dùng tự tạo trận đấu và nhập kết quả.
*   Thêm các loại biểu đồ và thống kê chi tiết hơn.
*   Cải thiện logic tìm kiếm đối thủ.
*   Hỗ trợ đa ngôn ngữ.
*   Tối ưu hóa hiệu năng.
    