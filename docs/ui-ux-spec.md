# Đặc tả UI/UX

## 1. Phạm vi

Đặc tả bố trí và tương tác cho phiên bản đầu. [Yêu cầu sản phẩm](product-requirements.md) quy định hành vi; [luồng trải nghiệm](user-flows.md) quy định chuyển bước. Đây là wireframe bằng nội dung, chưa phải thiết kế hình ảnh đã duyệt. Màu thương hiệu, font, logo và bộ icon cần chốt khi thiết kế UI.

## 2. Khung ứng dụng

- Header gồm tên sản phẩm, vị trí hiện tại và nút thiết lập ngôn ngữ/theme.
- Tiến trình: Chọn frame → Tạo ảnh → Thành phẩm. Camera là màn hình con của bước Tạo ảnh.
- Quay lại bước trước giữ ảnh và chỉnh sửa; không reload trang. Rời ứng dụng có dữ liệu chưa xuất dùng cảnh báo trình duyệt khi được hỗ trợ.
- Thiết lập mở bằng panel/dialog có nhãn; đóng trả focus về nút mở. Thay locale/theme áp dụng ngay theo [localization](localization.md) và [theme](theme.md).

## 3. Wireframe nội dung

| Màn hình | Desktop | Điện thoại |
| --- | --- | --- |
| Gallery | Header → tiêu đề → tìm kiếm/bộ lọc → grid frame → tải thêm nếu cần | Header gọn → tìm kiếm → mở bộ lọc → grid hai cột khi đủ chỗ, một cột trên màn hình hẹp |
| Editor | Header → vùng preview chính và panel nguồn ảnh/công cụ → khay ảnh → nút xem thành phẩm | Preview → công cụ ô đang chọn → nguồn ảnh/khay → thanh hành động dưới |
| Camera | Preview cạnh panel cấu hình, tiến độ và thumbnail | Preview trên, cấu hình dưới; khi chụp ưu tiên countdown và nút dừng |
| Thành phẩm | Preview cạnh định dạng/kích thước, tải về, quay lại chỉnh | Preview → định dạng/kích thước → tải về → quay lại chỉnh |

Ưu tiên nội dung theo không gian thực tế; mốc responsive ban đầu đề xuất 48rem và 75rem, cần kiểm tra trước khi chốt. Không coi tên thiết bị là điều kiện phân bố cục. Thanh cố định phải chừa chỗ nội dung, safe area và bàn phím ảo; không che ô ảnh hoặc nút đang focus.

## 4. Gallery

- Frame card hiển thị thumbnail, tên, số ảnh và tỷ lệ. Tên dài xuống dòng có kiểm soát; tên đầy đủ vẫn truy cập được.
- Toàn card là hành động chọn frame có tên rõ. Không lồng nút tương tác bên trong một nút khác.
- Bộ lọc nhiều chiều kết hợp với tìm kiếm; hiển thị số kết quả, bộ lọc đang bật và “Xóa bộ lọc”.
- Giữ tìm kiếm, filter và vị trí cuộn khi quay lại đổi frame. Frame đang dùng có trạng thái được chọn thể hiện cả bằng chữ/icon và màu.
- Thumbnail chờ tải giữ nguyên tỷ lệ; lỗi ảnh có placeholder và tên frame. Catalog lỗi có nút thử lại; không có kết quả có nút xóa bộ lọc.

## 5. Editor và thao tác ảnh

- Ô trống có số thứ tự và hành động thêm ảnh. Ô đang chọn có viền/focus rõ; không đưa viền này vào export.
- Chọn ô mở công cụ: thay ảnh, chụp lại, zoom, xoay, phản chiếu và khôi phục căn chỉnh. Chụp lại cần xác nhận dùng ảnh mới trước khi thay ảnh cũ.
- Kéo để dịch ảnh trong ô; pinch để zoom trên thiết bị hỗ trợ. Luôn có slider/nút thay thế cho thao tác gesture, và điều khiển bàn phím khi focus ở công cụ.
- Đổi thứ tự bằng chọn ảnh từ khay rồi gán ô hoặc hành động đổi vị trí có nhãn; kéo thả là tiện ích bổ sung, không phải cách duy nhất.
- Khay thể hiện ảnh đã dùng/chưa dùng. Xóa ảnh đang dùng phải nói rõ ảnh hưởng tới các ô liên quan và cho hủy trước khi xóa.
- Khi đổi frame, giữ ảnh theo luồng sản phẩm; báo ô thiếu/ảnh dư. Crop về cover mặc định cho tỷ lệ mới, không làm người dùng tưởng crop cũ còn nguyên.
- Thiếu ô bắt buộc: vẫn giữ nút xem thành phẩm trong bố cục, hiển thị lý do chưa thể tiếp tục và hành động tới ô trống đầu tiên.

## 6. Camera

- Trước quyền: mô tả cần camera và nút mở; không tự gọi quyền khi vừa vào trang.
- Ready: preview, chọn camera, phản chiếu, hẹn giờ trước ảnh đầu, số tấm, khoảng nghỉ và nút bắt đầu.
- Capturing: giữ preview, số giây, “Ảnh i/N”, thumbnail đã chụp và nút dừng. Khóa các cấu hình ảnh hưởng phiên; thông báo vì sao bị khóa.
- Paused: thông báo lý do, số ảnh đã chụp, nút tiếp tục và dừng. Tiếp tục đếm ngược lại, không chụp ngay ngoài ý muốn.
- Reviewing: chọn dùng ảnh, bỏ ảnh hoặc chụp lại. Nếu giữ stream để chụp lại, hiển thị camera còn bật và nút đóng.
- Camera lỗi/từ chối quyền: có thử lại khi phù hợp và chuyển sang tải ảnh. Không lặp hộp xin quyền tự động.
- Countdown cần nhìn rõ nhưng không flash bắt buộc. Screen reader thông báo bắt đầu, tấm đã chụp và kết thúc; tránh live region đọc liên tục mỗi tick gây nhiễu.

## 7. Thành phẩm và trạng thái chung

PNG/JPEG có giải thích về nền trong suốt; kích thước hiển thị bằng pixel. Export đang chạy khóa thao tác xuất trùng và có trạng thái chờ. Thành công nghĩa là đã tạo file và phát lệnh tải/chia sẻ; không khẳng định file đã lưu thành công trên hệ điều hành nếu không xác nhận được.

| Trạng thái | Yêu cầu UI |
| --- | --- |
| Chưa có ảnh | Hướng dẫn tải ảnh hoặc mở camera |
| File lỗi | Thông báo theo file, giữ file hợp lệ |
| Tác vụ lâu | Phản hồi bận ngay, không dùng phần trăm giả |
| Lỗi export | Giữ chỉnh sửa, thử lại hoặc giảm kích thước |
| Storage không khả dụng | Thiết lập vẫn áp dụng trong phiên; không chặn chụp |
| Không hỗ trợ tính năng | Giải thích và cung cấp phương án phù hợp, không chỉ vô hiệu hóa nút |

## 8. Khả năng truy cập và nghiệm thu

Mục tiêu nội bộ: vùng chạm tối thiểu 44×44 CSS px, chữ thường đạt tương phản ít nhất 4.5:1, chữ lớn và thành phần UI quan trọng ít nhất 3:1. Kiểm tra thực tế cả theme, không chỉ suy từ token. Có focus rõ, thứ tự tab theo luồng, nhãn cho input và thông báo lỗi gắn với trường tương ứng. Dialog giữ focus trong khi mở, Escape đóng nếu không gây mất dữ liệu và trả focus đúng nơi.

Nghiệm thu gallery/editor/camera/thành phẩm ở chiều rộng 320, 390, 768 và 1440 CSS px, zoom trình duyệt 200%, cả hai locale/theme, reduced motion và bàn phím. Không có cuộn ngang toàn trang, chữ bị cắt mất hành động hoặc điều khiển bị che. Kiểm tra thêm landscape, bàn phím ảo và safe area trên thiết bị thật. Ma trận đầy đủ nằm tại [testing strategy](testing-strategy.md).
