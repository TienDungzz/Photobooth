# Photobooth

Ứng dụng photobooth trên web cho phép người dùng tải ảnh từ thiết bị hoặc chụp bằng camera, ghép ảnh vào nhiều kiểu frame và tải thành phẩm về máy.

Đây là một sản phẩm độc lập, có mục đích và kho frame riêng. Ý tưởng trải nghiệm tương tự phần photobooth của dự án Vietnamese Women’s Day; không mặc định kế thừa giao diện, tài nguyên, mã nguồn hoặc ràng buộc chủ đề của dự án đó.

## Tài liệu

- [Yêu cầu sản phẩm](docs/product-requirements.md): phạm vi, tính năng, tiêu chí nghiệm thu và thứ tự triển khai.
- [Luồng trải nghiệm](docs/user-flows.md): chọn frame, tải ảnh, chụp hẹn giờ, chụp liên tiếp và xuất ảnh.
- [Thiết kế kỹ thuật](docs/technical-design.md): mô hình dữ liệu frame, camera, xử lý ảnh và chiến lược kiểm thử.
- [Quy chuẩn code và BEM](docs/coding-standards.md): đặt tên, tổ chức logic, CSS và điều kiện hoàn thành thay đổi.
- [Performance standards](docs/performance-standards.md): budget, tải tài nguyên, xử lý ảnh, bộ nhớ và cách đo hiệu năng.
- [Security standards](docs/security-standards.md): quyền riêng tư, kiểm tra file, camera, DOM, dependency và deploy.
- [Cấu trúc thư mục](docs/folder-structure.md): trách nhiệm từng thư mục, chiều phụ thuộc và cách thêm tính năng/frame.
- [Cơ chế kiểm tra chất lượng](docs/quality-checks.md): checker `.mjs`, tài nguyên thừa/trùng và tín hiệu hiệu năng.
- [Đa ngôn ngữ](docs/localization.md): bản dịch, fallback và lưu thiết lập.
- [Giao diện sáng/tối](docs/theme.md): theme hệ thống, token màu và tiêu chí nghiệm thu.
- [Đặc tả UI/UX](docs/ui-ux-spec.md): wireframe nội dung, responsive, tương tác và khả năng truy cập.
- [Hướng dẫn tạo frame](docs/frame-authoring-guide.md): hình học, asset, bản quyền và QA từng frame.
- [Kế hoạch triển khai](docs/implementation-plan.md): mốc công việc, phụ thuộc và điều kiện hoàn thành.
- [Quyết định kiến trúc](docs/architecture-decisions.md): hướng đã chốt, đề xuất và trade-off.
- [Chiến lược kiểm thử](docs/testing-strategy.md): fixture, ma trận thiết bị và cổng phát hành.
- [Hướng dẫn deploy](docs/deployment-guide.md): build, staging, cache, security headers và rollback.

## Định hướng chính

- Kho frame và bố cục phong phú là tính năng cốt lõi, có thể mở rộng bằng dữ liệu mà không cần viết lại luồng chụp.
- Hỗ trợ ảnh tải lên, ảnh chụp trực tiếp và kết hợp cả hai nguồn trong cùng một bố cục.
- Người dùng điều chỉnh thời gian đếm ngược và số ảnh chụp liên tiếp.
- Cho phép căn chỉnh từng ảnh, chụp lại hoặc thay ảnh mà không mất các ảnh đã chọn.
- Ưu tiên xử lý ảnh trên thiết bị và sử dụng tốt trên điện thoại lẫn máy tính.
- Hỗ trợ đa ngôn ngữ (ban đầu tiếng Việt/tiếng Anh) và giao diện sáng, tối hoặc theo hệ thống.

## Trạng thái

Bộ checker chạy bằng `npm run check`; chế độ chặn cả cảnh báo: `npm run check -- --strict`. Không cần cài thư viện cho các checker này. Kiểm thử checker: `npm run test:checkers`.

Repository hiện chứa tài liệu đặc tả và bộ checker trong `script/`, chưa có mã nguồn ứng dụng. Các giá trị mặc định, số lượng frame và công nghệ trong docs là đề xuất ban đầu để triển khai; không phải tính năng đã hoàn thành.
