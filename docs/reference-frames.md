# Hai frame theo ảnh tham khảo

## Hổ con picnic / Picnic tiger

Tham khảo `example/a75b3eb0fe37c6acf6980d12b30ce72f.jpg`: giấy caro xanh dương, xanh lá và hồng, mặt hổ bao ô ảnh oval ngang, mái sọc pastel, ô chữ nhật nghiêng, ô táo xanh, kiwi, kẹp giấy và tim.

Layout `picnic-tiger-strip` có 4 ảnh trên giấy 900 × 2400 px: mặt hổ oval ngang 670 × 430 px, ảnh chữ nhật, ảnh nghiêng 6° và ảnh hình táo. Oval ngang là tỷ lệ chủ ý theo ảnh tham khảo, có kiểm tra riêng trong unit test; không áp dụng ngoại lệ này cho các layout hình tròn.

## Ngôi sao nổi loạn / Rebel star

Tham khảo `example/b61a8e4c1074291e73a7634fb05908c3.jpg`: nền đen xước, viền hồng đậm, sao nét chéo, tim vẽ tay, sét và băng dán caro. Chân trang dùng chữ nghiêng lớn.

Layout `punk-three-strip` có 3 ảnh trên giấy 900 × 2400 px, chừa khoảng chân trang cho typography. Frame tạo viền theo các slot đang chọn; typography lớn chỉ xuất hiện khi có vùng trống của layout tương ứng.

## Triển khai và kiểm chứng

Hai frame được dựng lại bằng Canvas từ các đặc điểm thị giác của ảnh tham khảo. Không nhúng poster JPG, ảnh người, watermark, tên hoặc ngày sinh có sẵn vào bản tải xuống. Đây là bản dựng theo phong cách, không phải bản sao từng pixel. Không dùng atlas sáu ô hay thêm tài nguyên bitmap vào gói ứng dụng.

- Mã catalog: `src/features/frame-catalog/reference-catalog.ts`.
- Render: `src/engine/reference-decoration.ts`; mask táo dùng chung `slotPath` với ảnh và đường chọn.
- Frame/layout vẫn chọn độc lập, ưu tiên đầu danh sách. Tìm bằng tên Việt/Anh; hai frame Canvas nằm trong bộ cơ bản.
- `reference.spec.ts` kiểm tra render, biên ảnh xoay, PNG/JPEG, thumbnail và kết hợp frame mới với layout 20 ảnh trên Chromium desktop/mobile.
- Catalog hiện **53 frame / 83 layout**. `verify` đạt, 6 ca E2E catalog/gallery/reference đạt; 2 ca reference chạy lại sau hoàn thiện nét sét cũng đạt. Vẫn có 4 cảnh báo heuristic vòng đời tài nguyên đã biết.

[Xem bản render hai mẫu](reviews/reference-frames.webp).
