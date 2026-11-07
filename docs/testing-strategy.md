# Chiến lược kiểm thử

## 1. Phạm vi và trạng thái

Kiểm thử theo rủi ro mất ảnh, ảnh xuất sai, chụp ngoài ý muốn, rò rỉ dữ liệu và lỗi trên điện thoại. Hiện chỉ có 5 bài kiểm thử bộ checker trong `script/tests/checkers.test.mjs`; chưa có test ứng dụng. Dùng [yêu cầu sản phẩm](product-requirements.md) làm nguồn tiêu chí, không xem danh sách dưới đây là kết quả đã đạt.

## 2. Các lớp kiểm thử

| Lớp | Nội dung | Vị trí mục tiêu |
| --- | --- | --- |
| Unit | Schema, crop/cover/rotation/mirror, thứ tự layer, timer/state transition, locale/theme và storage | Cạnh module tương ứng |
| Integration | Nhập ảnh → photo library → gán slot; camera controller → capture session; renderer → exporter | tests/integration |
| UI/E2E | Hành trình người dùng qua gallery/editor/camera/thành phẩm, bàn phím, locale/theme | tests/e2e |
| Visual | So sánh render với ảnh mẫu, mask, slot xoay/chồng và PNG/JPEG | Fixture/baseline theo test runner đã chọn |
| Thiết bị thật | Quyền camera, camera trước/sau, tab ẩn/khóa màn hình, tải/chia sẻ file, bộ nhớ | Báo cáo QA gắn build |

Không đặt mục tiêu coverage phần trăm thay cho hành vi. Ưu tiên test logic và các trạng thái hỏng; tránh test chỉ xác nhận tên hàm/class hoặc chi tiết triển khai có thể thay đổi.

## 3. Ma trận môi trường

| Nhóm | Phạm vi kiểm tra |
| --- | --- |
| Desktop | Chrome và Edge trên Windows; Safari trên macOS để kiểm chứng engine tương ứng |
| Điện thoại | Safari trên iPhone thật, Chrome trên Android thật; cả portrait/landscape |
| Responsive | 320, 390, 768, 1440 CSS px; zoom 200%; bàn phím ảo và safe area |
| Thiết lập | Việt/Anh × sáng/tối; system theme thay đổi; storage bị chặn/hỏng |
| Mạng/cache | Cache lạnh/ấm, tải asset chậm/thất bại, offline sau khi đã mở ứng dụng |

Đây là phạm vi QA mục tiêu, chưa phải cam kết mọi phiên bản trình duyệt được hỗ trợ. Trước phát hành phải ghi model/OS/phiên bản đã kiểm tra và chọn phiên bản tối thiểu dựa trên kết quả. Camera giả lập trong automation không thay thiết bị thật.

## 4. Fixture

Tạo ảnh tổng hợp/có quyền sử dụng: ngang/dọc/vuông, lưới màu đánh dấu góc để nhận biết xoay/mirror, alpha, ảnh nhỏ, ảnh gần giới hạn, orientation từ điện thoại, file hỏng và dữ liệu giả extension/MIME. Có catalog thử cho slot vuông/tròn/bo góc, xoay/chồng lớp và frame thiếu asset.

Fixture lớn được tạo khi chạy hoặc lưu nơi quản lý phù hợp; không nhét file nặng không cần thiết vào repository. Không dùng ảnh cá nhân trong fixture/baseline. Test file có thể gây cạn bộ nhớ chạy trong môi trường giới hạn, không cố tình crash máy người dùng.

## 5. Kịch bản bắt buộc

1. Chọn/lọc frame, upload nhiều ảnh có một file lỗi, điền ô trống và giữ ảnh dư.
2. Crop/zoom/xoay/mirror từng ô, đổi thứ tự, đổi frame nhiều/ít ô, không mất ảnh gốc.
3. Xuất PNG/JPEG đúng kích thước/nền/layer; thiếu ô hoặc asset không được xuất âm thầm.
4. Camera quyền cho phép/từ chối, thiết bị không có hoặc đang bận, thay camera và track bị ngắt.
5. Hẹn giờ 0 và 5 giây, N=1 và N=9, khoảng nghỉ, hủy giữa phiên, bấm bắt đầu nhiều lần và callback cũ.
6. Tab ẩn/khóa màn hình → pause; tiếp tục có đếm ngược mới, không chụp bù. Chụp lại chỉ thay ô khi chọn dùng ảnh mới.
7. Đổi locale/theme trong editor/countdown, giữ dữ liệu, không nhân đôi timer/stream; kiểm tra fallback storage.
8. Export lỗi/tải file không được hỗ trợ: giữ phiên, có hướng thử lại phù hợp; camera/timer/URL cleanup đúng.
9. Đầu vào độc hại hiển thị như text hoặc bị từ chối; network không gửi ảnh/metadata cá nhân.
10. Thao tác bằng bàn phím, nhãn truy cập, focus dialog, câu dài và cả hai theme.

Timer test dùng đồng hồ điều khiển được và hàm chụp giả lập, xác nhận số lần chụp cùng dữ liệu được giữ. Thêm tình huống decode/chụp chậm, hủy khi Promise chưa xong và hoàn tất sau unmount.

## 6. Visual, performance và security

So sánh renderer bằng fixture cố định, khóa font/kích thước/môi trường. Tách kiểm tra hình học chính xác khỏi sai khác anti-aliasing giữa engine; chỉ cho tolerance có lý do. Không tự ghi đè baseline khi test fail; kiểm tra ảnh diff trước khi duyệt thay đổi.

Đo production build, warm-up/lượt đo và thiết bị theo [performance standards](performance-standards.md). Test file/DOM/network/header/dependency theo [security standards](security-standards.md). UI test tự động và quét tĩnh không đủ chứng minh hết lỗi hiệu năng/bảo mật.

## 7. CI và điều kiện phát hành

Hiện chạy được `npm run test:checkers` và `npm run check`. Khi khởi tạo ứng dụng, thêm các bước thật: lint/typecheck/CSS/format → unit/integration → build → kiểm tra bundle/catalog/bản dịch → E2E/visual. Chốt công cụ/phiên bản trước khi viết cấu hình CI.

Lỗi mất ảnh, render sai, tự chụp ngoài phiên, lộ dữ liệu hoặc crash luồng chính chặn phát hành. Báo cáo cần build/commit, môi trường, fixture, bước tái hiện, kết quả, lỗi còn mở và ngoại lệ có người phụ trách. Release chỉ ghi hỗ trợ những môi trường đã kiểm chứng; phần chưa đo phải được nêu rõ.
