# Chiến lược kiểm thử

## 1. Phạm vi và trạng thái

Kiểm thử theo rủi ro mất ảnh, ảnh xuất sai, chụp ngoài ý muốn, rò rỉ dữ liệu và lỗi trên điện thoại. Đã có test checker Node, unit test Vitest và E2E Playwright Chromium; phạm vi thực tế theo [trạng thái triển khai](implementation-status.md). Dùng [yêu cầu sản phẩm](product-requirements.md) làm nguồn tiêu chí, không xem danh sách mục tiêu dưới đây là mọi trường hợp đã đạt.

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

Home/Setup được kiểm thử qua route thật: `/`, `/setup`, `/setup/preview`. E2E tự mở server cổng riêng 5197 và không tái sử dụng server đang chạy, tránh trỏ nhầm dự án khác. Kiểm tra CTA, Home không có bộ chọn, điều hướng Back/Forward, preview guard và camera cleanup khi rời Setup.

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
2. Crop/zoom/xoay/mirror từng ô, đổi thứ tự, đổi layout nhiều/ít ô và đổi frame giữ crop, không mất ảnh gốc.
   Bộ chọn frame và layout phải độc lập; thumbnail frame không chứa ô ảnh, thumbnail layout không chứa trang trí. Kiểm tra nhóm 16–20 và dải cuộn không làm sidebar nở rộng hoặc che điều khiển trên mobile.
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

`tests/e2e/` và helpers là mã kiểm thử cần commit. Chỉ bỏ qua kết quả sinh tự động như `test-results/`, `playwright-report/`, `blob-report/`, `coverage/`; ảnh tham khảo `example/` giữ cục bộ và không commit. Helper Studio mở đúng mục Frame/Bố cục/Ảnh trước khi tương tác trên mobile; kiểm tra trạng thái của mục ẩn phải tách khỏi thao tác với mục đang hiển thị.

Lượt kiểm tra 08/11/2026: verify đạt (32 unit test, 5 checker test, lint/typecheck/CSS/i18n/build/budget). E2E toàn bộ ghi nhận 80 đạt, 1 bỏ qua vì chỉ dành desktop và 1 lỗi focus khi xóa ảnh cuối trên mobile; đã sửa để trả focus về nút tải ảnh, kiểm thử lại xác nhận desktop/mobile đều đạt. Không diễn giải thành một lượt chạy toàn bộ 82 ca đều xanh sau sửa. Còn 12 cảnh báo heuristic vòng đời tài nguyên/module dài; chưa nghiệm thu Safari/iPhone/Android thật.

Hiện chạy `npm run verify` cho lint/typecheck/CSS/format, unit test, test checker, checker nguồn/bản dịch, build và budget bundle; `npm run test:e2e` cho Chromium desktop/mobile giả lập. GitHub Actions đã được cấu hình chạy cả hai; chưa xác minh một lần chạy workflow trên GitHub. Visual diff baseline tự động và thử thiết bị thật vẫn là phần cần bổ sung.

Lỗi mất ảnh, render sai, tự chụp ngoài phiên, lộ dữ liệu hoặc crash luồng chính chặn phát hành. Báo cáo cần build/commit, môi trường, fixture, bước tái hiện, kết quả, lỗi còn mở và ngoại lệ có người phụ trách. Release chỉ ghi hỗ trợ những môi trường đã kiểm chứng; phần chưa đo phải được nêu rõ.
