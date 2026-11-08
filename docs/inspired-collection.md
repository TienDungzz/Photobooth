# Bộ thiết kế từ năm ảnh tham khảo

Đợt này có **5 frame và 5 layout riêng**, tổng catalog **58 frame / 88 layout**. Dựng bằng Canvas và các hình học nguyên bản; không cắt bộ sáu sticker hoặc nhúng ảnh poster vào thành phẩm.

| Ảnh trong example/ | Frame | Layout đi kèm |
| --- | --- | --- |
| `02e4964cf26ece2ebab3552e0183ad6b.jpg` | Mây kẹo và gấu nhỏ / Candy sky club: gradient hồng–xanh, caro, mây và sao treo | Sáu ô mây, tim và gấu: 6 ảnh với mask chữ nhật, gấu và tim |
| `5f88d48b50edd3d7bb264e292db27b20.jpg` | Sổ hoa giấy xé / Wildflower field notes: giấy xé, hoa dại và băng dán | Bốn trang hoa nghiêng: 4 ảnh xoay nhẹ, viền Polaroid và giấy xé |
| `81d6ada98d56ddd9b81f9a41e414b248.jpg` | Vườn bướm phát sáng / Luminous garden: nét cánh bướm phát quang, hạt sáng và sao | Cửa sổ ánh sáng: 1 ảnh lớn có biên sóng mềm |
| `5523f03a9a73e3f302aabe9292544563.jpg` | Thỏ nhỏ, denim và ren / Denim bunny keepsakes: nền navy, sợi denim, nơ, ren và thỏ | Ba vòm ngang đan xen: 3 ảnh bo một phía, trái–phải–trái |
| `6137075e842bc6e025e12e25dca8e7cb.jpg` | Đêm công chiếu / Opening night: bảng đèn, khung đỏ/vàng, sao, đĩa cầu, dải phim và clapper | Ba cảnh công chiếu: 3 ảnh ngang trong dải dọc, dành khoảng riêng cho bảng đèn và vé |

Ảnh thứ hai là một bảng gồm nhiều hướng thiết kế. Đợt này chọn hướng giấy xé/hoa dại để có một thiết kế rõ ràng, không tạo hàng loạt bản đổi palette. Ảnh thứ ba lấy hướng bướm và ánh sáng; không coi từ khóa Canva là tài nguyên được cấp sẵn.

## Nguyên tắc dựng

- Đây là bản diễn giải theo đặc điểm thị giác, không phải bản sao từng pixel. Không đưa tên, watermark, ảnh người hay nhân vật có sẵn vào file xuất. Hình thỏ và mây được vẽ lại bằng các đường Canvas.
- Frame/layout vẫn độc lập. Các chi tiết nằm giữa ảnh chỉ hiện khi dùng layout đi kèm; thumbnail có minh họa riêng. Các mẫu mới đứng đầu danh sách. Bộ lọc không tăng thêm; 5 frame Canvas nằm trong bộ cơ bản.
- Mask `bear`, `wavy`, `side-left`, `side-right` dùng cùng `slotPath` cho cắt ảnh, viền và đường chọn. Hai mask bo một phía dùng bán kính theo kích thước vật lý, không bóp ảnh theo đường bo. Crop vẫn dùng coverGeometry chung.
- Chữ ở bảng đèn thu gọn khi đổi sang layout có ảnh sát mép trên. Độ phân giải xuất vẫn theo lựa chọn 1200/2400, không phụ thuộc kích thước preview.

## Kiểm chứng

`tests/e2e/inspired.spec.ts` kiểm tra render/giải mã PNG cả 5 thiết kế, biên ảnh xoay, thumbnail và kết hợp mỗi frame với layout 20 ảnh để xuất JPEG. Kiểm tra Path2D xác nhận đầu gấu, viền sóng và hai vòm trái/phải cắt đúng vùng. Unit test kiểm tra catalog không trùng ID/hình học, có đủ số ảnh 1–20 và giới hạn kích thước.

Đã xem [bản render](reviews/inspired-collection.webp) trên Chromium desktop; E2E chạy Chromium desktop/mobile. Chưa nghiệm thu Safari/Firefox hoặc in vật lý.

Mã nguồn: `inspired-catalog.ts`, `inspired-decoration.ts`, `inspired-motifs.ts`, `slot-path.ts`.
