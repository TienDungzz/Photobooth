# Viền trang trí thuộc layout

Bổ sung **5 layout có viền trang trí** và **4 frame nền**, dựa trên đặc điểm thị giác trong `example/027ab501ac0987fa9d34dc41cd3a58cb.jpg` và `example/81d6ada98d56ddd9b81f9a41e414b248.jpg`. Không nhúng screenshot, giao diện điện thoại, nhân vật, watermark hay mã Canva vào thành phẩm. Không thêm bản đổi màu của mẫu bướm phát sáng đã có.

| Layout | Nội dung | Frame phối hợp |
| --- | --- | --- |
| Chân dung vòng ren / Lace cameo | 1 ảnh tròn, viền ren nhiều vòng và mắt chỉ nhỏ | Ren ngà trong đêm / Ivory after dark |
| Hai ô hoa văn uốn / Filigree keepsakes | 2 ảnh nghiêng khác kích thước, góc uốn hoa văn và viền nét đứt | Ren ngà trong đêm |
| Ba cảnh dưới rèm sao / Hanging star scenes | 3 ảnh lệch nhịp, sao treo ở đầu từng ô ảnh | Rèm sao trên mây / Stars above the clouds |
| Bốn ô tim phát sáng / Glowing heart quartet | 4 ảnh bo góc xoay nhẹ, viền tim sáng có lõi trắng và quầng mềm | Ánh hồng mơ màng / Rose haze |
| Cửa sổ hoa phát quang / Firefly flower window | 1 ảnh lớn, các hoa viền phát quang màu pastel quanh ảnh | Hoa đom đóm / Firefly bloom |

## Cách hoạt động

Đây là `Slot.treatment` của layout, không phải bộ sticker gắn cố định vào bốn góc frame. Khi đổi frame, viền vẫn giữ nguyên cấu trúc, vị trí và màu; khi đổi layout, bố cục và viền mới thay đổi cùng nhau. Frame nền có thể kết hợp với mọi layout khác. Thumbnail layout cũng dựng viền, giúp thấy đúng lựa chọn trước khi thêm ảnh.

Renderer vẽ phần nền viền trước ảnh, phần chi tiết sau khi bỏ clip ảnh. Crop ảnh vẫn dùng mask và transform cũ. Viền chỉ nằm quanh mép, không che tâm ảnh. Kích thước viền tính theo cạnh ngắn của ô; layout đã chừa khoảng cho cả quầng sáng và góc xoay. Preview, PNG/JPEG, thumbnail và PNG trong suốt dùng cùng hàm `paintOrnament`.

Không có dropdown mới. Tìm bằng các từ “ren”, “hoa văn”, “sao treo”, “tim phát sáng”, “hoa phát quang”. Bốn frame Canvas nằm trong bộ cơ bản, bộ artwork atlas vẫn giữ 13 mẫu. Tổng catalog hiện **62 frame / 93 layout**.

## Kiểm chứng

- `ornament.spec.ts` so sánh viền cùng layout trên hai frame bằng nền trong suốt, kiểm tra tâm ảnh không đổi và toàn bộ footprint sau xoay nằm trong giấy.
- Render/giải mã PNG năm layout; ảnh tròn không méo; thumbnail và JPEG khi phối mỗi frame mới với layout 20 ảnh.
- Hồi quy bộ lọc/tìm tim và tải PNG, catalog trên desktop/mobile. Các ca đã chạy bằng Chromium; chưa nghiệm thu Safari/Firefox hoặc in vật lý.
- `verify` đạt: type/lint/format, 29 unit, 5 checker, asset/i18n, build/budget. Vẫn có 4 cảnh báo heuristic vòng đời tài nguyên đã biết.

[Bản render năm layout](reviews/ornament-layouts.webp).

Nguồn chính: `ornament-catalog.ts`, `ornament-treatment.ts`, `ornament-paper.ts`, hook trong `renderer.ts` và `slot-treatment.ts`.
