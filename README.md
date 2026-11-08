# Photobooth

Ứng dụng photobooth trên web cho phép người dùng tải ảnh từ thiết bị hoặc chụp bằng camera, ghép ảnh vào nhiều kiểu frame và tải thành phẩm về máy.

Đây là một sản phẩm độc lập, có mục đích và kho frame riêng. Ý tưởng trải nghiệm tương tự phần photobooth của dự án Vietnamese Women’s Day; không mặc định kế thừa giao diện, tài nguyên, mã nguồn hoặc ràng buộc chủ đề của dự án đó.

## Tài liệu

- [Đánh giá ảnh tham khảo](docs/reference-design-review.md): khoảng cách chất lượng giữa catalog basic hiện tại và thiết kế trong thư mục example.

- [Home và Setup](docs/home-and-setup.md): trang giới thiệu riêng, Studio ba cột và điều hướng phiên.

- [Kho frame/layout và bộ lọc](docs/catalog-browsing.md): số lượng, họa tiết, cách duyệt và khử trùng bố cục.

- [Frame và layout độc lập](docs/frame-layout-selection.md): định nghĩa đúng theo ảnh tham chiếu, giao diện chọn và quy tắc giữ ảnh/crop.
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

Đã có ứng dụng React + TypeScript + Vite: 62 frame (13 bộ artwork minh họa, 28 mẫu procedural và 21 thiết kế Canvas trong bộ cơ bản), 93 bố cục chọn độc lập (1–20 ảnh), mask tim/sao/vòm/tem thư, tải ảnh, crop/zoom/xoay/mirror, khay ảnh, camera hẹn giờ/burst, xuất PNG/JPEG, Việt/Anh và sáng/tối/theo hệ thống. Ảnh xử lý cục bộ, không có backend lưu ảnh. Xem [trạng thái triển khai](docs/implementation-status.md) và [nguồn artwork/pipeline](docs/artwork-provenance.md). Chạy `npm run artwork:prepare` khi cần tạo lại WebP từ PNG nguồn.

## Chạy local

Yêu cầu Node >=22.12 và npm. Tại thư mục dự án:

```sh
npm ci
npm run dev
```

Mở `http://127.0.0.1:5175` theo lệnh dev trong package.json. Camera cần localhost hoặc HTTPS; truy cập từ điện thoại qua HTTP IP nội bộ có thể không mở được camera. Chỉnh sửa chưa bấm tải sẽ mất khi reload/đóng trang. Bản đã bấm tải được lưu trong [Kho ảnh](docs/saved-gallery.md) 7 ngày trên cùng trình duyệt/origin bằng IndexedDB, không gửi lên máy chủ.

```sh
npm run verify
npx playwright install chromium
npm run test:e2e
npm run preview
```

`verify` chạy typecheck, ESLint, Stylelint/BEM, formatter, unit test, test checker, checker dự án, build và budget bundle. E2E dùng Chromium riêng với camera giả lập, không sử dụng camera/hồ sơ Chrome thật. `preview` phục vụ bản `dist/` sau build.

`npm run check -- --strict` chặn cả cảnh báo heuristic; các điểm camera/timer/object URL hiện vẫn được cảnh báo để review, nên strict không phải cổng mặc định. Không coi build/test đạt là đã kiểm chứng Safari iOS, webcam thật hoặc budget bộ nhớ thiết bị.

Ba frame Canvas v? ba b? c?c m?i: [thi?t k? to?n trang](docs/signature-designs.md).
