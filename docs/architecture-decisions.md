# Quyết định kiến trúc

## 1. Cách quản lý

Tài liệu này ghi quyết định và lý do, không thay [thiết kế kỹ thuật](technical-design.md). Trạng thái dùng: Đề xuất → Đã chốt → Được thay thế. “Đã chốt” là hướng triển khai được đặc tả, không có nghĩa code đã tồn tại. Thay quyết định phải ghi tác động và cập nhật docs liên quan; không xóa lý do cũ nếu vẫn cần giải thích migration.

## 2. Danh sách quyết định

| ID | Quyết định | Trạng thái |
| --- | --- | --- |
| ADR-001 | Xử lý ảnh phía client, không backend lưu ảnh trong bản đầu | Đã chốt theo phạm vi |
| ADR-002 | TypeScript với React/Vite | Đề xuất |
| ADR-003 | Module theo feature, domain thuần, renderer dùng chung | Đã chốt theo đặc tả |
| ADR-004 | CSS thường, BEM và semantic token | Đã chốt theo đặc tả |
| ADR-005 | Thư viện i18n và tích hợp locale/theme | Đề xuất về công cụ |
| ADR-006 | State và quản lý tài nguyên trình duyệt | Đã chốt nguyên tắc; công cụ còn đề xuất |
| ADR-007 | Package manager, test runner và hosting | Chưa chọn; thuộc M0 |

## 3. ADR-001 — Xử lý cục bộ

Ảnh tải lên/chụp được giữ trong phiên trình duyệt, không upload và không yêu cầu tài khoản. Lý do: luồng sản phẩm hiện không cần đồng bộ, giảm dữ liệu cá nhân phải quản lý. Đổi lại, reload có thể mất phiên và thiết bị chịu chi phí decode/render. Nếu thêm cloud phải có quyết định mới về dữ liệu và bảo mật.

## 4. ADR-002 — Stack ứng dụng

Đề xuất TypeScript với React/Vite để phù hợp ví dụ và cấu trúc đã viết. Chưa cài framework/dependency. Chốt sau khi kiểm tra nhu cầu hosting, công cụ render/test và kỹ năng bảo trì; ghi phiên bản, package manager, Node và lockfile khi khởi tạo. Nếu chọn stack khác phải sửa ví dụ/cấu trúc/scripts tương ứng, không coi đề xuất là ràng buộc đã cài đặt.

## 5. ADR-003 — Ranh giới module và renderer

Domain giữ schema/quy tắc thuần; feature sở hữu UI và nghiệp vụ; app điều phối; engine xử lý hình học/canvas. Một bộ tính toán dùng chung cho preview/export để tránh lệch crop/layer. DOM preview được phép nếu dùng cùng hình học và có kiểm tra đối chiếu. Catalog tách layout khỏi biến thể trang trí để mở rộng nội dung bằng dữ liệu.

## 6. ADR-004 — CSS và theme

CSS thường theo BEM, semantic token cho light/dark, data-theme trên HTML. Lý do: cấu trúc có thể kiểm tra, style ít phụ thuộc cây DOM, theme thống nhất. Không trộn hệ styling khác nếu chưa cập nhật quyết định. Renderer không đọc palette theme; frame/export giữ màu riêng.

## 7. ADR-005 — I18n

Đã chốt phạm vi Việt/Anh, key có nghĩa, fallback tiếng Việt và không remount editor khi đổi locale. Thư viện chưa chọn. So sánh theo pluralization, interpolation/escape, typed key, tải namespace, kích thước bundle và cách test; không viết hệ dịch tùy biến thiếu các khả năng đó chỉ để tránh dependency. Dữ liệu/luồng chi tiết theo [localization](localization.md).

## 8. ADR-006 — State và tài nguyên

State UI ở gần nơi dùng; state phối hợp feature do app điều phối. Camera, timer, Blob URL và bitmap có một nơi sở hữu/cleanup; không lưu trực tiếp tất cả vào một global store. Burst dùng state machine và session token. Chưa chọn thư viện store/state machine; reducer/controller thuần là phương án ban đầu, bổ sung thư viện khi có nhu cầu cụ thể và đánh giá chi phí.

## 9. ADR-007 — Toolchain và hosting

Hiện chỉ có package scripts chạy checker Node built-in. Chưa chọn package manager/lockfile, test runner ứng dụng, UI test hay nhà cung cấp hosting. Quyết định tại M0/M1 phải đáp ứng build tái lập, header bảo mật, cache/version asset, preview staging, test camera trên HTTPS và rollback. Không tạo lệnh deploy giả định nhà cung cấp.

## 10. Mẫu ghi quyết định mới

- ID, tiêu đề, ngày, người phụ trách và trạng thái.
- Bối cảnh/vấn đề cần giải quyết.
- Phương án được chọn và các lựa chọn đã cân nhắc.
- Lý do, trade-off, ảnh hưởng dữ liệu/bảo mật/hiệu năng.
- Kế hoạch kiểm chứng và docs/code cần cập nhật.
- Quyết định cũ bị thay thế và cách chuyển đổi nếu có.
