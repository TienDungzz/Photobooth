# Khay ảnh không trùng nội dung

Khay lưu một ảnh cho mỗi nội dung ảnh đã chuẩn hóa. Một ảnh có thể được dùng ở nhiều ô; mỗi ô giữ `Transform` riêng. Không tạo thêm mục trong khay khi tái sử dụng ảnh.

- `importPhoto` tạo SHA-256 từ Blob JPEG đã chuẩn hóa, lưu vào `Photo.fingerprint`. Tất cả xử lý trên thiết bị; không gửi hash hoặc ảnh lên máy chủ.
- `mergePhotos` trả danh sách ảnh mới duy nhất, danh sách tham chiếu theo từng lần chọn, các bản dư cần giải phóng và cờ vượt giới hạn. ID dùng để tham chiếu; fingerprint dùng để nhận diện trùng nội dung.
- Chọn cùng ảnh hai lần trong cùng batch: chỉ lưu một ảnh, nhưng gán tham chiếu đó vào hai ô trống theo thứ tự.
- Tải lại ảnh hoặc đổi tên file: dùng lại mục có fingerprint trùng. Hai ảnh cùng tên nhưng nội dung khác vẫn có hai mục.
- Không so khớp gần giống bằng mắt/AI. Ảnh đổi pixel, sửa nội dung hoặc nén lại có thể có fingerprint khác; không tự gộp các ảnh chỉ trông gần giống nhau.
- Giới hạn 30 ảnh và 32 megapixel tính trên các ảnh duy nhất. Ảnh trùng không làm tăng bộ đếm hoặc chiếm thêm ngân sách pixel. Bản decode/URL dư được giải phóng ngay.
- Bỏ ảnh khỏi ô chỉ xóa assignment của ô đó. Xóa từ khay sau xác nhận bỏ mọi assignment dùng cùng ảnh, rồi giải phóng tài nguyên một lần. Không cho xóa mục khay trong khi upload đang xử lý để tránh giải phóng ảnh đang được tái sử dụng.

Kiểm chứng: `merge-photos.test.ts` kiểm tra trùng trong batch, trùng với thư viện, tham chiếu cùng đối tượng và giới hạn số lượng; `photo-deduplication.spec.ts` kiểm tra upload lặp/đổi tên, crop độc lập, bỏ ảnh khỏi một ô, dùng lại ảnh, ảnh cùng tên khác nội dung và xóa ảnh dùng chung. Các ca chạy Chromium desktop/mobile; camera chụp đơn/burst và xuất PNG cũng được kiểm tra hồi quy.
