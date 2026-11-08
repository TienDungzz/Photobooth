# Đặc tả UI/UX

## 1. Phạm vi

Thiết kế hiện tại ưu tiên [Home và Setup](home-and-setup.md): Home quảng bá bằng banner, Setup riêng ba cột theo ảnh tham chiếu. Những mô tả gallery cũ được thay bằng panel chọn nằm trong Setup.

Đặc tả bố trí và tương tác cho phiên bản đầu. [Yêu cầu sản phẩm](product-requirements.md) quy định hành vi; [luồng trải nghiệm](user-flows.md) quy định chuyển bước. Đây là wireframe bằng nội dung, chưa phải thiết kế hình ảnh đã duyệt. Màu thương hiệu, font, logo và bộ icon cần chốt khi thiết kế UI.

## 2. Khung ứng dụng

- Header gồm logo về Home, điều hướng desktop, Kho ảnh kèm badge và Thiết lập. Mobile ẩn hàng Trang chủ/Studio, Kho ảnh chỉ hiện icon/badge. Ngôn ngữ/theme chỉ chọn trong popup Thiết lập.
- Tiến trình: Home → Setup (thiết kế và ảnh cùng một màn hình) → Thành phẩm. Camera là dialog của Setup.
- Quay lại bước trước giữ ảnh và chỉnh sửa; không reload trang. Rời ứng dụng có dữ liệu chưa xuất dùng cảnh báo trình duyệt khi được hỗ trợ.
- Thiết lập mở bằng panel/dialog có nhãn; đóng trả focus về nút mở. Thay locale/theme áp dụng ngay theo [localization](localization.md) và [theme](theme.md).

## 3. Wireframe nội dung

| Màn hình | Desktop | Điện thoại |
| --- | --- | --- |
| Home | Banner hai cột, minh họa bản in, điểm nổi bật, hướng dẫn, CTA Setup | Banner xếp dọc, CTA rõ; không có bộ chọn |
| Setup | Bộ chọn trái, preview giữa, nguồn ảnh/khay/công cụ phải; thanh hành động đáy | Preview → bộ chọn → nguồn ảnh/khay/công cụ; có vùng chừa cho thanh đáy |
| Camera | Preview cạnh panel cấu hình, tiến độ và thumbnail | Preview trên, cấu hình dưới; khi chụp ưu tiên countdown và nút dừng |
| Thành phẩm | Preview cạnh định dạng/kích thước, tải về, quay lại chỉnh | Preview → định dạng/kích thước → tải về → quay lại chỉnh |

Ưu tiên nội dung theo không gian thực tế; mốc responsive ban đầu đề xuất 48rem và 75rem, cần kiểm tra trước khi chốt. Không coi tên thiết bị là điều kiện phân bố cục. Thanh cố định phải chừa chỗ nội dung, safe area và bàn phím ảo; không che ô ảnh hoặc nút đang focus.

## 4. Bộ chọn frame và layout

Hai panel thu gọn độc lập theo [ảnh tham chiếu và đặc tả](frame-layout-selection.md). Frame card là trang giấy trang trí không có ô; layout card là sơ đồ ô trung tính không có họa tiết frame. Mỗi panel có tên lựa chọn hiện tại và trạng thái được chọn.

Desktop dùng grid cuộn dọc, tablet/mobile dùng dải card cuộn ngang. Layout lọc số ảnh chính xác 1–20 và phong cách; frame lọc Bộ sưu tập. Không có nút xóa lọc/hiện mục đang chọn. Chọn một mục không tự chuyển bước; preview kết hợp cập nhật ngay. Trên mobile, chọn Frame/Bố cục/Ảnh mở một vùng công cụ cố định phía dưới và cuộn preview vào vùng nhìn thấy; thanh chọn ba mục không sticky.

## 5. Editor và thao tác ảnh

- Ô trống có số thứ tự và hành động thêm ảnh. Ô đang chọn có viền/focus rõ; không đưa viền này vào export.
- Bấm ô có ảnh mở popup crop trực tiếp, gồm zoom, xoay, phản chiếu, khôi phục căn chỉnh và bỏ ảnh; Hủy không áp dụng bản nháp. Không có nút chụp lại ô hoặc đổi với ô khác. Bấm ô trống trên mobile chuyển sang mục Ảnh để chọn từ khay/tải/chụp.
- Kéo để dịch ảnh trong ô; pinch để zoom trên thiết bị hỗ trợ. Luôn có slider/nút thay thế cho thao tác gesture, và điều khiển bàn phím khi focus ở công cụ.
- Chọn ô rồi chọn ảnh trong khay để gán hoặc thay ảnh; mỗi ô có transform riêng dù dùng cùng một ảnh. Không có nút đổi vị trí hai ô.
- Khay thể hiện ảnh đã dùng/chưa dùng. Xóa ảnh đang dùng phải nói rõ ảnh hưởng tới các ô liên quan và cho hủy trước khi xóa.
- Đổi frame giữ nguyên layout/crop; đổi layout giữ frame và ảnh, reset crop theo tỷ lệ mới và báo ô thiếu/ảnh dư.
- Thiếu ô bắt buộc: vẫn giữ nút “Hoàn tất ảnh” trong bố cục, hiển thị lý do chưa thể tiếp tục và hành động tới ô trống đầu tiên.

## 6. Camera

- Trước quyền: mô tả cần camera và nút mở; không tự gọi quyền khi vừa vào trang.
- Ready: preview, chọn camera, phản chiếu, hẹn giờ trước ảnh đầu, số tấm, khoảng nghỉ và nút bắt đầu.
- Capturing: giữ preview, số giây, “Ảnh i/N”, thumbnail đã chụp và nút dừng. Khóa các cấu hình ảnh hưởng phiên; thông báo vì sao bị khóa.
- Paused: thông báo lý do, số ảnh đã chụp, nút tiếp tục và dừng. Tiếp tục đếm ngược lại, không chụp ngay ngoài ý muốn.
- Reviewing: chọn dùng ảnh, bỏ ảnh hoặc chụp lại. Nếu giữ stream để chụp lại, hiển thị camera còn bật và nút đóng.
- Camera lỗi/từ chối quyền: có thử lại khi phù hợp và chuyển sang tải ảnh. Không lặp hộp xin quyền tự động.
- Nút “Hoàn tất ảnh” mở trang kết quả, không tải ngay. Trang kết quả khóa nút tải trong lúc chuẩn bị file; sau 15 giây báo lỗi và cho thử lại. Khi chuyển file sang trình duyệt/iOS, không giữ trạng thái đang xử lý. Thông báo bắt đầu tải tự ẩn sau 4 giây, không thông báo đã lưu vào Photos khi website không thể xác nhận.
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
