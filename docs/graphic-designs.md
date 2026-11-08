# Bộ thiết kế Graphic

Đợt này bổ sung **3 frame và 4 layout**, nâng catalog lên **48 frame / 77 layout**. Đây là ba hệ thiết kế toàn trang bằng Canvas, không dùng atlas, không đổi màu các mẫu cũ để tăng số lượng.

| Frame | Thiết kế | Layout gợi ý |
| --- | --- | --- |
| Một ngày thành truyện / Comic day | Chấm halftone, nét viền đen dày, tiêu đề đỏ và nhãn chuyển cảnh | Một cảnh lớn, hai nhịp truyện: khung ngang 3 ảnh, panel nghiêng với kích thước khác nhau. Dải truyện dọc bốn nhịp: 4 ảnh phân cấp dọc, không chia đều |
| Đĩa nhạc của đôi mình / On the record | Bìa đĩa kem, gáy đỏ và các rãnh đĩa đồng tâm | Đĩa tròn và ảnh lời tựa: ảnh tròn 1040 × 1040 px bên trái, ảnh dọc nhỏ bên phải trên giấy 2200 × 1800 px |
| Bản vẽ những kỷ niệm / Memory blueprint | Lưới kỹ thuật, dấu tâm, đường nét đứt và bảng thông tin | Bốn góc nhìn bản vẽ: một ảnh chính lớn, hai ảnh tròn đúng tỷ lệ và một ảnh ngang dài |

Các frame/layout được ưu tiên đầu danh sách; tên Việt/Anh có thể tìm bằng ô tìm kiếm. Bộ lọc giữ nguyên số lượng điều khiển. Ba frame Canvas nằm trong bộ cơ bản; bộ artwork minh họa có atlas vẫn là 13 mẫu.

Frame và layout độc lập. Các chi tiết nằm trong khoảng trống riêng của layout (nhãn chuyển cảnh, rãnh đĩa, bảng thông tin) chỉ xuất hiện khi dùng layout tương ứng; header/footer điều chỉnh theo vùng ảnh khi kết hợp layout khác. Comic dựng viền panel theo kích thước và góc xoay của các slot đang chọn.

## Kiểm chứng

- `graphic.spec.ts`: render và giải mã PNG cả 4 layout; kiểm tra ảnh tròn không méo, ảnh xoay không vượt mép giấy; kết hợp mỗi frame mới với layout 20 ảnh và xuất JPEG.
- Đã xem trực quan bản render desktop, đồng thời chạy E2E trên Chromium desktop và mobile.
- `verify`: 29 unit test, 5 checker test, lint/typecheck/build và bundle budget đạt; vẫn còn 4 cảnh báo heuristic vòng đời tài nguyên đã biết.

[Xem bản render bốn bố cục](reviews/graphic-designs.webp).

Mã nguồn: `src/features/frame-catalog/graphic-catalog.ts`, `src/engine/graphic-decoration.ts`. Chưa nghiệm thu trên Safari/Firefox hoặc bản in vật lý.
