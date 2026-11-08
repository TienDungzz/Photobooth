# Kho ảnh lưu 7 ngày

Header có nút **Kho ảnh** dẫn tới `/gallery`; mobile chỉ hiển thị icon với tên truy cập bằng trình đọc màn hình. Không yêu cầu đăng nhập và không gửi ảnh lên máy chủ.

Nút header có badge đếm bản chưa hết hạn, hiển thị 0 khi kho trống và 99+ khi vượt 99. Cập nhật sau khi lưu/xóa, khi bản hết hạn, khi tab trở lại và giữa các tab cùng origin bằng BroadcastChannel nếu được hỗ trợ. Nếu không đọc được bộ nhớ, ẩn badge thay vì hiển thị số 0 sai. Badge mobile nằm trên icon, tên Kho ảnh vẫn có cho trình đọc màn hình.

## Khi nào lưu

Khi bấm **Tải ảnh về** trên trang kết quả với file đã chuẩn bị, ứng dụng lưu bản chỉnh sửa vào IndexedDB `photobooth-gallery`, store `projects`, schema v1. Tác vụ lưu chạy độc lập, không chờ trước khi mở bảng chia sẻ iOS để giữ user activation. Nếu bộ nhớ đầy, không khả dụng hoặc bị chặn, báo không lưu được Kho ảnh nhưng vẫn cho tải/chia sẻ file. Bấm tải nhưng hủy bảng chia sẻ vẫn lưu bản chỉnh sửa vì thao tác kích hoạt là nút tải, không phải xác nhận hệ điều hành đã lưu.

Cookie không dùng để chứa ảnh hay project vì dung lượng nhỏ và bị gửi kèm request. IndexedDB lưu Blob nhị phân và metadata ngay trên thiết bị; không có cookie ảnh, base64 lớn trong localStorage hoặc dịch vụ lưu trữ ngoài.

Mỗi bản xuất có ID tính từ SHA-256 của file thành phẩm và trạng thái chỉnh sửa (frame, layout, composition, danh sách ảnh). Đổi ảnh, crop, frame/layout hoặc định dạng/kích thước khiến file thay đổi sẽ tạo bản riêng, không ghi đè bản trước trong cùng phiên. Bấm tải lại chính xác cùng bản cập nhật thời hạn 7 ngày mà không nhân đôi mục. Xem Kho ảnh không gia hạn dữ liệu. Các bản cũ dùng ID phiên vẫn đọc được; dữ liệu đã bị ghi đè trước khi sửa không thể khôi phục.

## Dữ liệu và khôi phục

- File thành phẩm đã tối ưu, gồm loại file và tên file.
- Frame ID, layout ID và composition với zoom/vị trí/xoay/phản chiếu độc lập từng ô.
- Blob ảnh làm việc đã chuẩn hóa ở cạnh dài tối đa 2400 px, photo ID và fingerprint; không lưu bản gốc đầy đủ hay object URL tạm thời.
- `savedAt`, `expiresAt = savedAt + 604800000` mili giây.

Kho ảnh cho xem bản dựng, tải lại, mở chỉnh sửa và xóa từng bản. Khôi phục giải mã Blob thành ảnh, tạo URL tạm mới và giữ liên kết giữa các ô dùng cùng ảnh. Nếu đang có phiên chỉnh sửa, hỏi bằng custom dialog trước khi thay thế; không tự xóa bản đã lưu khi bắt đầu phiên mới. Xóa bản lưu không xóa file người dùng đã tải về máy.

Thẻ Kho ảnh không có lớp nền phụ phía sau thành phẩm. Nút Tiếp tục chỉnh sửa giữ một dòng; icon tải lại và xóa giữ vùng bấm riêng. Header không có nút đổi ngôn ngữ; chọn ngôn ngữ trong Thiết lập.

Bản hết hạn không được hiển thị/khôi phục và được dọn khi mở ứng dụng, đọc kho hoặc lưu bản mới. Khi đang mở Kho ảnh, kiểm tra tối đa mỗi phút và khi tab trở lại. Website không thể chạy tác vụ xóa trong lúc trình duyệt đóng; dữ liệu hết hạn sẽ bị dọn ở lần chạy tiếp theo.

## Giới hạn

Chỉ cùng origin (giao thức, tên miền, cổng), cùng trình duyệt và hồ sơ người dùng mới đọc được kho. Đổi địa chỉ ngrok không mang theo dữ liệu; không đồng bộ giữa thiết bị. Chế độ riêng tư, xóa dữ liệu website, hạn mức và việc trình duyệt tự dọn bộ nhớ có thể khiến dữ liệu mất trước 7 ngày. Không cam kết thay thế bản sao lưu trên máy. Tham khảo [chính sách lưu trữ WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/).

Kiểm thử tại `tests/e2e/saved-gallery.spec.ts`: lưu khi tải, khôi phục sau reload, giữ crop và dedup ảnh, cập nhật cùng ID, TTL 7 ngày, xóa có xác nhận, dọn hết hạn, lỗi storage không chặn tải và icon mobile. Safari/iPhone thật vẫn cần nghiệm thu.
