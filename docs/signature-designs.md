# Thiết kế toàn trang không dùng atlas

Ba frame được vẽ trực tiếp bằng Canvas, không cắt sáu ô sticker từ atlas và không dùng công thức trang trí bốn góc chung:

| Frame | Ngôn ngữ thiết kế | Layout gợi ý |
| --- | --- | --- |
| Hộ chiếu những chuyến đi | Vân giấy bảo an, khung trang, dấu nhập cảnh, dòng mã ở chân trang | Ảnh thẻ và trang hành trình: ảnh dọc chính, ảnh nhỏ nghiêng và ảnh ngang dài |
| Cuộn băng ngày ấy | Vỏ cassette tối, nhãn cam, đường phân đoạn, vít và hai trục cuộn | Bìa album và hai cảnh phụ: ảnh lớn phía trên, hai ảnh phụ nghiêng bên dưới |
| Trang bìa của chúng mình | Tiêu đề lớn xanh cobalt, mảng vàng chanh, số phát hành và mã vạch | Ảnh bìa và ô chú thích: ảnh dọc lớn lệch trái, ảnh nhỏ bên phải |

Frame và layout vẫn độc lập. Chữ ở khoảng trống giữa các ảnh chỉ xuất hiện khi dùng layout tương ứng; tiêu đề thu gọn khi layout khác có ảnh sát mép trên. Không thêm các biến thể chỉ đổi màu hoặc thay số ô vào cùng một công thức.

Nguồn: `src/features/frame-catalog/signature-catalog.ts`, renderer `src/engine/signature-decoration.ts`. Các frame mới được ưu tiên đầu danh sách. Bộ lọc artwork hiện vẫn chỉ dành cho 13 atlas minh họa; ba frame Canvas này nằm trong bộ cơ bản, có thể tìm bằng tên hoặc bộ sưu tập retro/geometric.

Tổng catalog hiện tại: **45 frame, 73 layout**. Kiểm tra `tests/e2e/signature.spec.ts` render ba thiết kế và giải mã PNG đầu ra trên desktop/mobile. Bản render đã kiểm tra trực quan: [ba thiết kế](reviews/signature-designs.webp).
