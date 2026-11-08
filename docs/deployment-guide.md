# Hướng dẫn build và deploy

## 1. Trạng thái

Đã có ứng dụng Vite, lệnh build và workflow GitHub Actions; chưa chọn hosting/domain hoặc triển khai staging/production. Nhà cung cấp, cấu hình biến môi trường nếu cần và URL phát hành sẽ được ghi sau khi chốt [quyết định kiến trúc](architecture-decisions.md).

Hiện chạy `npm ci`, `npm run dev` cho local; `npm run verify` để kiểm tra và build vào `dist/`; `npm run preview` để xem bản production local. E2E: `npx playwright install chromium` rồi `npm run test:e2e`. Đây không phải lệnh publish. Chưa có biến môi trường bắt buộc cho ứng dụng hiện tại.

## 2. Môi trường và cấu hình

| Môi trường | Mục đích | Quy tắc |
| --- | --- | --- |
| Local | Phát triển và debug | Dùng nguồn ảnh thử; không cần secret để xử lý ảnh cục bộ |
| Staging/preview | Test bản production trên HTTPS và thiết bị thật | Cùng build/settings quan trọng như production, không dùng ảnh cá nhân |
| Production | Phục vụ người dùng | Chỉ triển khai artifact đã qua kiểm tra và có đường rollback |

Khi có toolchain, ghim Node/package manager, commit lockfile và dùng cài đặt tái lập. Khai báo biến môi trường trong file mẫu không có secret, ghi tên/mục đích/default/bắt buộc. Mọi giá trị đưa vào frontend bundle được xem là công khai; app bản đầu không cần secret truy cập dữ liệu người dùng.

Chốt base path trước build; kiểm tra đường dẫn asset frame và alias tương ứng. Nếu deploy dưới subpath, cập nhật cách dựng URL và checker tham chiếu; không giả định URL bắt đầu bằng / luôn đúng với mọi hosting.

## 3. Build và artifact

1. Checkout commit cần phát hành, cài dependency đúng lockfile bằng lệnh của package manager đã chọn.
2. Chạy checker, test ứng dụng, lint/typecheck/format/CSS theo cấu hình thực tế.
3. Build production; kiểm tra bundle/catalog/i18n và budget đã chốt.
4. Đóng gói output cùng manifest build/commit, cấu hình public và danh sách asset/version. Không đưa source fixture, secret hoặc file ảnh người dùng vào artifact.
5. Triển khai cùng artifact đã kiểm tra lên staging rồi promote lên production nếu nền tảng hỗ trợ; nếu phải build lại, kiểm tra khác biệt cấu hình và tạo bằng chứng tương đương.

Lệnh build thực tế là `npm run build`, output `dist/`. `npm run check:bundle` yêu cầu dist đã tồn tại. File `public/_headers` được copy vào dist như mẫu cho hosting hỗ trợ; Vite dev/preview không tự áp dụng header này. Cần cấu hình tương đương ở hosting khác và kiểm tra response thực tế.

## 4. Hosting, HTTPS và header

Ứng dụng hiện có route `/`, `/setup`, `/setup/preview`; hosting static cần fallback cho hai route Setup. File public/_redirects cung cấp mẫu cho hosting tương thích, không rewrite asset thiếu thành HTML. Xem [Home và Setup](home-and-setup.md). E2E local dùng cổng 5197 riêng, không tái sử dụng server đang chạy.

Hosting cần hỗ trợ HTTPS, security headers, cache theo loại file, atomic deploy/versioned release và rollback. Nếu ứng dụng dùng client-side routing, cấu hình fallback cho route ứng dụng; asset bị thiếu phải trả lỗi thật, không rewrite thành HTML rồi gây lỗi decode.

Áp dụng và kiểm tra response thực tế theo [security standards](security-standards.md): CSP phù hợp app/theme bootstrap, chính sách nhúng, Permissions-Policy cho camera và microphone, content type, referrer và HSTS theo phạm vi domain. CORS chỉ mở cho nguồn cần thiết. Không thêm wildcard chỉ để bản staging chạy được.

Chưa có cấu hình header cụ thể; cần test lại camera, Blob URL, download, font và asset sau khi bật CSP.

## 5. Cache và phiên bản

- HTML/bootstrap và catalog không gắn phiên bản cần revalidate để người dùng nhận bản phát hành phù hợp.
- Asset có tên hash/version bất biến được cache dài; nội dung thay phải đổi URL. Không dùng immutable cho URL có nội dung thay đổi.
- Giữ asset bản cũ trong cửa sổ rollback và đủ để phiên đang mở không bị mất tài nguyên sau release.
- Deploy catalog và asset đồng bộ; không có khoảng thời gian catalog mới trỏ đến file chưa tồn tại.
- Không cache ảnh người dùng hoặc Blob trong service worker. Bản đầu chưa yêu cầu offline/PWA; không cam kết hoạt động đầy đủ khi mất mạng.

## 6. Smoke test trước/sau phát hành

Trên URL thực tế, kiểm tra gallery, ít nhất một frame mỗi nhóm, asset/version, upload → crop → PNG/JPEG, quyền camera → burst → đóng track, locale/theme và reload thiết lập. Kiểm tra cả thiết bị desktop và điện thoại trong ma trận hỗ trợ.

Kiểm tra tab network/console, header, lỗi CSP/CORS, 404 asset, kích thước file tải xuống và không có ảnh/metadata gửi bên ngoài. Không test chỉ trang chủ rồi coi toàn bộ photobooth đã deploy thành công. Dùng fixture có quyền sử dụng.

## 7. Rollback

Lưu bản artifact/config trước và ID release. Khi có lỗi mất ảnh, chụp ngoài ý muốn, lộ dữ liệu hoặc hỏng luồng chính, dừng phát hành tiếp và rollback release theo cơ chế hosting. Không reload cưỡng bức phiên đang chỉnh sửa; thông báo phù hợp nếu cần cập nhật.

Sau rollback kiểm tra lại HTML/catalog/asset đồng bộ, header và smoke test. Giữ version storage tương thích hoặc có fallback an toàn; không xóa thiết lập/ảnh phiên để giải quyết lỗi phiên bản một cách âm thầm. Ghi nguyên nhân, phạm vi ảnh hưởng, release bị thu hồi và cách ngăn tái diễn.

## 8. Vận hành sau phát hành

Theo dõi khả dụng, lỗi asset/build và lỗi luồng ở mức tối thiểu cần thiết. Error report phải loại bỏ ảnh, tên file và dữ liệu cá nhân; không thêm session replay có thể thu nội dung ảnh nếu chưa có thiết kế dữ liệu riêng.

Trước lần deploy đầu, điền thông tin vận hành: nhà cung cấp, domain, output path, lệnh CI/build/deploy/rollback thực tế, người phụ trách, vị trí artifact và thời gian giữ bản cũ. Không ghi credentials trong tài liệu này.
