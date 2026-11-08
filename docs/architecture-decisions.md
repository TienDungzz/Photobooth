# Quyết định kiến trúc

## 1. Cách quản lý

Tài liệu này ghi quyết định và lý do, không thay [thiết kế kỹ thuật](technical-design.md). Trạng thái dùng: Đề xuất → Đã chốt → Được thay thế. “Đã chốt” là hướng triển khai được đặc tả, không có nghĩa code đã tồn tại. Thay quyết định phải ghi tác động và cập nhật docs liên quan; không xóa lý do cũ nếu vẫn cần giải thích migration.

## 2. Danh sách quyết định

Điều hướng hiện dùng History API trong app/usePage.ts cho Home và Setup riêng, giữ dữ liệu phiên tại App. UI dùng Noto Serif Variable đóng gói local với subset Latin/Vietnamese; không gọi dịch vụ font ngoài. Xem [Home và Setup](home-and-setup.md).

| ID | Quyết định | Trạng thái |
| --- | --- | --- |
| ADR-001 | Xử lý ảnh phía client, không backend lưu ảnh trong bản đầu | Đã chốt theo phạm vi |
| ADR-002 | TypeScript với React/Vite | Đã chốt và triển khai |
| ADR-003 | Module theo feature, domain thuần, renderer dùng chung | Đã chốt theo đặc tả |
| ADR-004 | CSS thường, BEM và semantic token | Đã chốt theo đặc tả |
| ADR-005 | i18next/react-i18next và locale/theme | Đã chốt và triển khai |
| ADR-006 | State và quản lý tài nguyên trình duyệt | Đã chốt nguyên tắc; công cụ còn đề xuất |
| ADR-007 | npm, Vitest, Playwright; hosting chưa chọn | Đã chốt toolchain; hosting còn mở |

## 3. ADR-001 — Xử lý cục bộ

Ảnh tải lên/chụp được giữ trong phiên trình duyệt, không upload và không yêu cầu tài khoản. Khi bấm tải ảnh thành phẩm, lưu bản chỉnh sửa cục bộ bằng IndexedDB trong 7 ngày theo [Kho ảnh](saved-gallery.md); không dùng cookie/localStorage chứa ảnh. Lý do: cho phép xem lại và khôi phục mà không cần đồng bộ hay backend. Đổi lại, chỉnh sửa chưa bấm tải mất khi reload; kho phụ thuộc origin/trình duyệt và có thể bị trình duyệt dọn sớm. Nếu thêm cloud phải có quyết định mới về dữ liệu và bảo mật.

## 4. ADR-002 — Stack ứng dụng

Đã chọn React, TypeScript và Vite cho ứng dụng static phía client; npm với package-lock.json, Node >=22.12. Phiên bản thực tế nằm trong package/lockfile. Camera/export được lazy-load; renderer Canvas dùng chung. Việc chọn hosting vẫn độc lập với toolchain này.

## 5. ADR-003 — Ranh giới module và renderer

Domain giữ schema/quy tắc thuần; feature sở hữu UI và nghiệp vụ; app điều phối; engine xử lý hình học/canvas. Một bộ tính toán dùng chung cho preview/export để tránh lệch crop/layer. DOM preview được phép nếu dùng cùng hình học và có kiểm tra đối chiếu. Catalog Frame và Layout hoàn toàn độc lập. Frame không giữ layoutId; composeDesign kết hợp hai lựa chọn tại runtime. Đổi frame giữ crop, chỉ đổi layout mới remap. Chi tiết tại [frame-layout-selection](frame-layout-selection.md).

## 6. ADR-004 — CSS và theme

CSS thường theo BEM, semantic token cho light/dark, data-theme trên HTML. Lý do: cấu trúc có thể kiểm tra, style ít phụ thuộc cây DOM, theme thống nhất. Không trộn hệ styling khác nếu chưa cập nhật quyết định. Renderer không đọc palette theme; frame/export giữ màu riêng.

## 7. ADR-005 — I18n

Đã chọn i18next/react-i18next cho Việt/Anh, interpolation/escape và fallback tiếng Việt; đổi locale không remount editor/camera. Catalog hiện nhỏ nên dùng một file JSON mỗi locale; tách namespace khi có nhu cầu đo được. Key/placeholder parity được kiểm tra bằng script/check-i18n.mjs và unit test. Dữ liệu/luồng chi tiết theo [localization](localization.md).

## 8. ADR-006 — State và tài nguyên

State UI ở gần nơi dùng; state phối hợp feature do app điều phối. Camera, timer, Blob URL và bitmap có một nơi sở hữu/cleanup; không lưu trực tiếp tất cả vào một global store. Burst dùng state machine và session token. Chưa chọn thư viện store/state machine; reducer/controller thuần là phương án ban đầu, bổ sung thư viện khi có nhu cầu cụ thể và đánh giá chi phí.

## 9. ADR-007 — Toolchain và hosting

Đã có npm/lockfile, ESLint, Stylelint, Prettier, Vitest và Playwright Chromium; GitHub Actions được cấu hình chạy verify/E2E. Override minimatch >=11.0.1 xử lý advisory gián tiếp của toolchain; kiểm tra lại khi nâng dependency. Chưa chọn hosting/domain; vẫn cần xác minh header, camera HTTPS và rollback trên staging trước phát hành. Không có lệnh deploy giả định nhà cung cấp.

## 10. Mẫu ghi quyết định mới

- ID, tiêu đề, ngày, người phụ trách và trạng thái.
- Bối cảnh/vấn đề cần giải quyết.
- Phương án được chọn và các lựa chọn đã cân nhắc.
- Lý do, trade-off, ảnh hưởng dữ liệu/bảo mật/hiệu năng.
- Kế hoạch kiểm chứng và docs/code cần cập nhật.
- Quyết định cũ bị thay thế và cách chuyển đổi nếu có.
