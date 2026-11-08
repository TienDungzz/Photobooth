# Kế hoạch triển khai

## 1. Trạng thái và nguyên tắc

Đã có ứng dụng, catalog 42 mẫu frame và 70 layout độc lập, locale/theme và toolchain; [trạng thái triển khai](implementation-status.md) liệt kê phần đã có và giới hạn. Các giai đoạn dưới đây vẫn dùng làm cổng nghiệm thu: chưa đánh dấu hoàn thành toàn bộ vì còn kiểm chứng thiết bị thật, hosting và performance baseline. Không suy ra ngày phát hành từ việc build/E2E đạt.

[Yêu cầu sản phẩm](product-requirements.md) là nguồn phạm vi; tiêu chuẩn code/hiệu năng/bảo mật là điều kiện xuyên suốt. Các mốc dưới đây chi tiết hóa thứ tự triển khai đã có trong yêu cầu sản phẩm.

## 2. Các giai đoạn

| Mốc | Công việc và đầu ra | Phụ thuộc | Điều kiện hoàn thành |
| --- | --- | --- | --- |
| M0 — Chốt nền tảng | Quyết định stack, package manager, hosting dự kiến, thiết bị tham chiếu; wireframe và style direction | Docs hiện tại | Ghi quyết định tại architecture decisions; chốt thiết bị đo và hợp đồng dữ liệu frame |
| M1 — Khởi tạo | App shell, cấu trúc module, lint/typecheck/formatter, CI cơ bản, locale Việt/Anh, light/dark/system | M0 | Build/check chạy được; đổi locale/theme và storage fallback được kiểm thử |
| M2 — Lát cắt tải ảnh | Domain frame/photo/composition, renderer, 6 frame đại diện, gallery, upload, crop/zoom/xoay/mirror, export | M1 | Upload → chỉnh → xuất đúng PNG/JPEG; không mất ảnh khi đổi frame; giới hạn file và cleanup hoạt động |
| M3 — Camera | Stream, chọn thiết bị, timer, burst, pause/cancel, review, chụp lại một ô | M2 | Đạt kịch bản lịch chụp, quyền/gián đoạn; camera dừng đúng vòng đời trên thiết bị thật |
| M4 — Mở rộng nội dung | Catalog theo mục tiêu sản phẩm, filter/search, thumbnail, tài liệu nguồn asset, validator catalog | M2; M3 trước nghiệm thu toàn bộ | Mỗi frame qua QA; đủ layout khác nhau, không đếm biến thể màu; không tải toàn bộ asset lớn lúc vào gallery |
| M5 — Ổn định và phát hành | Baseline/budget, kiểm thử thiết bị, bảo mật, staging, header/cache và rollback | M3, M4 | Đạt các cổng phát hành; lưu báo cáo và giới hạn còn lại |

Sáu tổ hợp frame/layout thử ở M2 cần bao phủ: một ảnh, strip, grid, bất đối xứng, ô xoay/chồng lớp và alpha/mask. Đây là tập kiểm chứng renderer trước khi sản xuất số lượng lớn; các tổ hợp không được tính thành số frame.

## 3. Cổng kiểm tra

- Sau M1: có scripts thật cho build/typecheck/lint/CSS/format/test, cấu hình nhất quán với CI; không chỉ ghi tên lệnh trong docs.
- Sau M2: kiểm tra file/asset, renderer và vòng đời ảnh; đo baseline upload/export sớm trên thiết bị tham chiếu.
- Sau M3: kiểm chứng camera thực tế, timer có kiểm soát trong test và xử lý tab ẩn.
- Sau M4: validator catalog, kiểm tra bản dịch và asset; rà soát bản quyền và thumbnail từng frame.
- Trước phát hành: hoàn thành [testing strategy](testing-strategy.md), [performance standards](performance-standards.md), [security standards](security-standards.md) và smoke test theo [deployment guide](deployment-guide.md).

Đã triển khai check-i18n và check-bundle-budget. check-frame-catalog độc lập, check-unused-code theo dependency graph và các kiểm tra security khả thi vẫn cần bổ sung trước nghiệm thu đầy đủ; hiện catalog đã có validation trong unit test.

## 4. Rủi ro và cách giảm

| Rủi ro | Cách xử lý sớm |
| --- | --- |
| Thiết kế frame vượt khả năng layer | Dùng frame phức tạp trong M2; cập nhật schema trước sản xuất hàng loạt |
| Bộ nhớ ảnh trên điện thoại | Kiểm tra ảnh gần giới hạn, hàng đợi decode và export trước mở rộng catalog |
| Camera/tải file khác nhau giữa trình duyệt | Chạy thiết bị thật từ M3, không chờ sát phát hành |
| Bản dịch/UI bị tràn | Tích hợp i18n và theme từ app shell, kiểm tra câu dài ở mỗi mốc |
| Docs/checker bị hiểu là tính năng hoàn thành | Chỉ ghi hoàn thành khi có code, kết quả kiểm tra và bằng chứng theo mốc |

Tính năng ngoài phạm vi như cloud, tài khoản, video và in cần đánh giá riêng; không thêm âm thầm vào các mốc hiện tại.
