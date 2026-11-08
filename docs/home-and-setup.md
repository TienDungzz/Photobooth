# Home và Setup

## Bố cục Studio trên desktop

Ở chiều rộng trên 1050 px, Studio chia 3 cột: bộ chọn thiết kế, preview, nguồn ảnh/công cụ. Cả ba dùng `position: sticky` với `top: 24px`. Hai sidebar có chiều cao tự nhiên, không `max-height` hoặc `overflow-y: auto`; nội dung dài cuộn cùng trang. Cột ngắn bám theo trang trong phạm vi grid, cột cao vẫn xem được hết nội dung. Chỉ vùng preview co theo viewport để chừa thanh hành động đáy; grid frame/layout và khay ảnh vẫn có vùng cuộn riêng theo chức năng.

Danh sách frame và layout trên desktop hiển thị grid tự chia cột, ô tối thiểu 90 px, chiều cao tối đa khoảng 2,5 hàng và cuộn dọc trong từng danh sách. Hàng frame cao 144 px, hàng layout cao 116 px. Hiển thị toàn bộ kết quả phù hợp trong một lượt; bỏ dòng đếm và nút xem thêm, giữ bộ lọc bên ngoài grid. Tablet 701–1050 px dùng dải cuộn ngang.

Trên mobile, thanh **Frame / Bố cục / Ảnh** cuộn cùng trang, không sticky. Mục Ảnh mở mặc định; khay ảnh cố định phía dưới, chỉ hiển thị ảnh và ô thao tác tải ảnh/camera ở cuối dải cuộn ngang. Hai icon xếp dọc trong ô có cùng kích thước ảnh, khung chứa không có border/padding; bỏ tiêu đề, mô tả và số đếm của khay. Chọn mục sẽ đổi nội dung vùng công cụ cố định phía dưới, ngay trên thanh hoàn tất ảnh. Chỉ một mục hiển thị mỗi lần; danh sách frame, layout và ảnh đều cuộn ngang. Nút Xem trước trong thanh chọn đã bỏ. Nút “Hoàn tất ảnh” mở trang kết quả để chọn cách xuất; không tải file ngay. Chạm ô trống mở mục Ảnh; chạm ô có ảnh mở popup chỉnh sửa. Khi đổi mục/thiết kế/ảnh, preview được cuộn vào vùng nhìn thấy. Desktop giữ bố cục ba cột và grid.

## Mục đích hai trang

- **Home — `/`:** giới thiệu Photobooth bằng banner lớn, minh họa bộ frame, điểm nổi bật và lời mời tạo ảnh. Nút bắt đầu/khám phá dẫn tới `/setup`. Không có bộ lọc, file input, khay ảnh hoặc yêu cầu quyền camera trên Home. Header chỉ có Trang chủ và Studio; đã bỏ mục Cách sử dụng, modal hướng dẫn, liên kết trong banner và phần hướng dẫn ba bước.
- **Setup — `/setup`:** không gian tạo ảnh duy nhất, cùng chọn frame, layout và nguồn ảnh; không có bước gallery riêng trước editor.
- **Hoàn tất ảnh — `/setup/preview`:** chọn PNG/JPEG, kích thước, tải ảnh hoặc quay lại Setup. Nếu mở trực tiếp mà phiên không có đủ ảnh, tự trở về `/setup`.

Trang thành phẩm dùng khung preview co theo tỷ lệ layout và chiều cao viewport, tối đa 1240 px cho cả hai cột. Không còn min-height 620 px, giới hạn ngang 430 px hoặc dòng chữ trang trí bên dưới ảnh. Padding đều 24 px desktop / 16 px mobile, tránh khoảng trắng lớn dưới ảnh ngang. Các điều khiển xuất ảnh nằm cạnh preview trên desktop và bên dưới trên mobile.

## Bố cục và hình ảnh

Home dùng nền hồng giấy nhẹ, màu nhấn rose, tiêu đề serif, các bản in xoay và sticker. Minh họa dùng renderer của dự án, gồm artwork nguyên bản và mẫu cơ bản; không lấy ảnh người dùng để quảng bá. Bộ số liệu 62 frame/93 layout lấy theo kho đã triển khai, trong đó có 13 bộ artwork minh họa và 49 frame Canvas/cơ bản. Các thẻ minh họa nhỏ dùng thumbnail, không tải atlas đầy đủ cho từng thẻ.

Setup desktop theo bố cục ba cột của ảnh tham chiếu:

1. Trái: hai panel chọn frame/layout, bộ lọc và dải thumbnail; không có ô tìm kiếm. Có vùng cuộn riêng và có thể thu gọn panel.

   Bộ lọc gồm Bộ sưu tập cho frame, Số ảnh và Phong cách cho layout. Dùng custom dropdown có bàn phím và popup không bị cắt trong sidebar. Đã bỏ tìm kiếm catalog và xử lý từ khóa. Xem [bộ lọc gọn](catalog-filters.md).
2. Giữa: canvas thành phẩm trực tiếp, selected slot và hướng dẫn căn chỉnh. Desktop dùng chiều cao viewport trừ sticky top 24 px và 110 px dành cho thanh hành động/khoảng hở; frame chừa thêm 100 px cho caption và hướng dẫn. Bỏ giới hạn cũ 510 px ngang/620 px dọc: ảnh mở rộng theo cột giữa và tỷ lệ layout, không kéo méo. Khi cuộn qua header, preview tận dụng gần hết chiều cao còn lại. Mobile vẫn giữ giới hạn riêng để phù hợp màn hình nhỏ.
3. Phải: tải ảnh/mở camera, khay ảnh dạng grid và công cụ crop/zoom/xoay/mirror cho ô đang chọn.

Thanh hành động ở đáy hiển thị số ô đã có ảnh, lý do chưa thể tiếp tục và nút “Hoàn tất ảnh”; có chừa vùng nội dung/safe area. Khi chưa đủ ô, nút bị khóa. Tablet thu gọn cột; điện thoại xếp preview, bộ chọn và nguồn ảnh thành một cột, không làm tràn ngang toàn trang.

Header/main/footer tiếp tục có chung max-width 1800px. Header Setup gọn hơn Home để dành không gian làm việc. Theme sáng/tối và Việt/Anh áp dụng cả hai trang; màu frame/ảnh xuất không phụ thuộc theme UI.

## Điều hướng và dữ liệu phiên

Đường dẫn dùng History API, hỗ trợ Back/Forward. Chuyển Home ↔ Setup trong cùng ứng dụng giữ frame, layout, ảnh và crop tại state gốc; không yêu cầu upload lại. Bắt đầu phiên mới vẫn cần xác nhận vì xóa ảnh hiện tại khỏi phiên.

Rời Setup đóng camera và giải phóng stream đang dùng; không tự bật lại khi quay về Studio. Reload/đóng tab vẫn mất ảnh như chính sách phiên bản đầu, chỉ locale/theme được lưu. Vào trang preview thiếu ảnh được thay thế bằng route Setup, không tạo vòng Back.

## Font và deploy

Noto Serif Variable được đóng gói cục bộ với subset Latin/Vietnamese, normal/italic; không gọi Google Fonts khi chạy. Giấy phép font tại public/licenses/noto-serif.txt. Font chỉ ảnh hưởng giao diện, không thay font renderer thành phẩm hiện tại.

Vite xử lý route local. Hosting static phải rewrite `/setup`, `/setup/` và `/setup/preview` về index.html; public/_redirects là mẫu cho hosting hỗ trợ cú pháp này. Asset thiếu vẫn phải trả 404. Xem [deployment guide](deployment-guide.md).

E2E dùng cổng riêng 5197 và không tái sử dụng server có sẵn, tránh kiểm tra nhầm một dự án khác đang chạy trên cổng dev phổ biến. Test camera vẫn dùng thiết bị giả lập, chưa thay kiểm chứng webcam/Safari iOS thật.
