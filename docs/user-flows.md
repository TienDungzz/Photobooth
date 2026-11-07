# Luồng trải nghiệm

## 1. Cấu trúc màn hình

Bố trí theo kích thước màn hình, wireframe nội dung, gesture và focus được quy định tại [đặc tả UI/UX](ui-ux-spec.md).

Mỗi bước có đường truy cập thiết lập ngôn ngữ và giao diện: Tiếng Việt/English; sáng/tối/theo hệ thống. Đổi thiết lập áp dụng ngay, giữ ảnh và trạng thái chỉnh sửa/chụp; chi tiết tại [Đa ngôn ngữ](localization.md) và [Giao diện sáng/tối](theme.md).

| Màn hình | Nội dung chính | Hành động chính |
| --- | --- | --- |
| Chọn frame | Gallery, tìm kiếm, bộ lọc, thumbnail và số ô | Chọn frame |
| Tạo ảnh | Preview frame, khay ảnh, nguồn ảnh, công cụ căn chỉnh | Tải ảnh hoặc mở camera |
| Chụp ảnh | Camera preview, thiết lập thời gian/số tấm, tiến độ | Chụp, hủy, dùng ảnh |
| Xem thành phẩm | Bản dựng cuối, định dạng và kích thước | Tải về hoặc quay lại chỉnh |

Trên điện thoại, ưu tiên một vùng thao tác chính mỗi bước. Trên desktop có thể đặt khay ảnh và công cụ bên cạnh preview. Camera preview phải thể hiện vùng crop của ô sẽ nhận ảnh khi có thể.

## 2. Tải ảnh và ghép frame

1. Người dùng chọn frame; hiển thị số ảnh cần thêm.
2. Chọn “Tải ảnh” và chọn một hoặc nhiều file.
3. Ứng dụng kiểm tra từng file; hiển thị ảnh hợp lệ và lỗi riêng cho file không đọc được.
4. Ảnh được gán lần lượt vào ô trống. Ảnh dư nằm trong khay.
5. Người dùng chọn từng ô để di chuyển, zoom, xoay hoặc thay ảnh.
6. Khi đủ ô, chọn “Xem thành phẩm”, chọn PNG/JPEG và tải xuống.

Nếu chưa đủ ảnh, hiển thị “Còn thiếu N ảnh” cùng đường dẫn tới ô trống. Nếu không có kết quả lọc frame, cho phép xóa bộ lọc ngay tại gallery.

## 3. Chụp bằng camera

1. Từ màn hình tạo ảnh, chọn “Mở camera”.
2. Trình duyệt yêu cầu quyền; khi được cấp quyền, mở preview và chờ video sẵn sàng.
3. Người dùng chọn camera, hẹn giờ, số tấm và khoảng nghỉ.
4. Chọn “Bắt đầu chụp”; khóa cấu hình phiên và hiện đếm ngược.
5. Chụp từng tấm, cập nhật “Ảnh i/N” và thumbnail; giữa các tấm hiển thị thời gian tới tấm tiếp theo.
6. Khi đủ số tấm, mở vùng duyệt kết quả. Người dùng chọn dùng ảnh, bỏ ảnh hoặc chụp lại.
7. Ảnh được chọn điền vào ô trống theo thứ tự; ảnh dư vào khay. Đóng camera và tiếp tục căn chỉnh.

Ảnh đã chụp là tài nguyên tạm của phiên ngay cả khi chưa xác nhận dùng ảnh. Hủy lượt chụp giữ các ảnh này trong vùng duyệt kết quả; chỉ thao tác bỏ ảnh rõ ràng mới loại bỏ chúng.

## 4. Chụp lại một ô

1. Chọn ô đã có ảnh → “Chụp lại”.
2. Mở camera với số tấm bằng 1 và hẹn giờ đang chọn.
3. Chụp thành công → xem ảnh mới → “Dùng ảnh này” hoặc “Chụp lại”.
4. Xác nhận dùng ảnh mới thay nội dung ô; ảnh cũ vẫn còn trong khay để khôi phục.

Hủy hoặc lỗi camera không làm thay đổi ô đang có ảnh.

## 5. Đổi frame giữa phiên

1. Chọn “Đổi frame” và chọn frame khác.
2. Giữ toàn bộ ảnh trong khay; ánh xạ ảnh đang dùng theo thứ tự ô.
3. Căn chỉnh lại cho tỷ lệ ô mới bằng chế độ phủ kín mặc định; giữ crop cũ riêng cho frame cũ trong phiên nếu triển khai bộ nhớ chỉnh sửa.
4. Thông báo số ô còn thiếu hoặc số ảnh dư. Không tự chụp thêm và không xóa ảnh dư.

## 6. Các tình huống gián đoạn

| Tình huống | Hành vi |
| --- | --- |
| Không có camera/quyền bị từ chối | Giải thích ngắn, cho thử lại hoặc tải ảnh; hướng dẫn mở quyền nếu cần |
| Camera đang bị ứng dụng khác dùng | Báo camera chưa khả dụng, cho thử lại hoặc chọn camera khác |
| Camera bị ngắt giữa phiên | Dừng lịch chụp, giữ ảnh đã có, cho kết nối lại |
| Chuyển tab/khóa màn hình | Hủy timer và tạm dừng; không chụp ngầm hoặc chụp dồn khi quay lại |
| Tiếp tục phiên đã tạm dừng | Kiểm tra camera, đếm ngược lại theo hẹn giờ, chụp số ảnh còn thiếu |
| Bấm chụp nhiều lần | Chỉ khởi tạo một phiên; vô hiệu hóa nút bắt đầu khi phiên đang chạy |
| Chọn file không hỗ trợ | Báo lỗi theo file, giữ các file hợp lệ |
| Frame tải thất bại | Giữ ảnh, cho tải lại tài nguyên hoặc chọn frame khác |
| Tạo/tải ảnh thất bại | Giữ phiên chỉnh sửa, cho thử lại hoặc giảm kích thước xuất |

## 7. Nội dung giao diện đề xuất

- Nguồn ảnh: “Tải ảnh”, “Mở camera”.
- Cấu hình: “Hẹn giờ trước ảnh đầu”, “Số ảnh”, “Khoảng nghỉ giữa các ảnh”.
- Đang chụp: “Ảnh 2/4”, “Ảnh tiếp theo sau 3 giây”, “Dừng chụp”.
- Kết quả: “Dùng ảnh”, “Chụp lại”, “Thay ảnh”, “Tải ảnh về”.
- Quyền riêng tư: “Ảnh được xử lý trên thiết bị của bạn.” Chỉ hiển thị khi triển khai thực tế đáp ứng đúng cam kết.
