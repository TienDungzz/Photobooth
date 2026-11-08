# Hóa đơn, vải chần và quỹ đạo

Bổ sung **3 frame / 4 layout** nguyên bản bằng Canvas, không dùng atlas hoặc nhân các biến thể đổi màu. Catalog hiện có **51 frame / 81 layout**.

| Frame | Ngôn ngữ thiết kế | Layout mới |
| --- | --- | --- |
| Hóa đơn ngày vui / Joy receipt | Chữ monospace, số đơn, đường xé nét đứt, dòng tổng và mã vạch trang trí | Hóa đơn năm khoảnh khắc: giấy dọc tỷ lệ 1:2, ảnh lớn xen ảnh nhỏ với nhịp không đều. Ảnh chính và biên nhận: ảnh lớn bên trái, ảnh nhỏ và thông tin bên phải |
| Chăn chắp những ngày êm / Days stitched together | Viền vải nhiều mảng, vân sợi và đường chỉ khâu quanh ảnh | Năm mảnh chăn chắp: một ảnh dọc, hai ảnh ngang và hai ảnh dọc nhỏ ghép thành mảng bất đối xứng |
| Quỹ đạo của chúng mình / Our little orbit | Bản đồ trời, đường quỹ đạo nghiêng, viền hành tinh và nhãn tọa độ | Ba hành tinh kỷ niệm: ba ảnh tròn khác kích thước, bố trí chéo và không kéo méo |

Frame vẫn chọn độc lập với layout. Nội dung dành cho khoảng trống đặc thù (dòng hóa đơn, nhãn hành tinh, cột biên nhận) chỉ hiện với layout tương ứng. Header/footer co theo vùng trống khi đổi layout. Thumbnail có hình nhận diện riêng: hóa đơn chữ, trái tim vải và hành tinh. Ba frame Canvas nằm trong bộ cơ bản; bộ artwork atlas vẫn có 13 mẫu. Không thêm bộ lọc.

Kích thước tham chiếu luôn có cạnh dài tối đa 2400 px, kể cả giấy hóa đơn dài. PNG/JPEG dùng chung renderer và bước tối ưu ảnh đã có. Mã vạch và số đơn là chi tiết trang trí, không mang dữ liệu giao dịch thực.

## Kiểm chứng

`tests/e2e/craft.spec.ts` kiểm tra bốn layout xuất PNG, ảnh tròn đúng tỷ lệ vật lý, ảnh xoay nằm trong giấy, thumbnail và khả năng kết hợp cả ba frame với layout 20 ảnh để xuất JPEG. Các ca catalog/gallery kiểm tra số lượng, tìm kiếm, locale/theme và mobile. Unit test catalog kiểm tra ID và hình học duy nhất, giới hạn kích thước.

Đã xem [bản render desktop](reviews/craft-designs.webp). Kiểm tra trình duyệt dùng Chromium desktop/mobile; chưa nghiệm thu trên Safari/Firefox hoặc bản in vật lý.

Nguồn: `src/features/frame-catalog/craft-catalog.ts`, `src/engine/craft-decoration.ts`.
