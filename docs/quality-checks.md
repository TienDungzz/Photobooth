# Cơ chế kiểm tra chất lượng

## 1. Chạy checker

Chiến lược unit/integration/E2E/thiết bị thật nằm tại [testing strategy](testing-strategy.md). Kiểm tra staging và phát hành theo [deployment guide](deployment-guide.md); checker không thay smoke test trên URL thực tế.

Các checker hỗ trợ thực thi [coding standards](coding-standards.md), [performance standards](performance-standards.md) và [security standards](security-standards.md). Đã có check-i18n và check-bundle-budget (tổng gzip mọi chunk JS/CSS sau build); chưa có checker bảo mật tổng quát hoặc đo runtime trên thiết bị thật. Bundle checker chạy riêng hoặc qua verify, không nằm trong check-all vì cần dist.

Các file thực thi kiểm tra dự án nằm trong **`script/`**, dùng đuôi **`.mjs`**. Thư viện hỗ trợ đặt tại `script/lib`; không tạo song song thư mục `scripts/`. Bộ hiện tại dùng Node built-in, không cần dependency ngoài. Dùng Node có hỗ trợ ES modules và `node:test`; phiên bản LTS cụ thể sẽ được ghim khi thiết lập môi trường ứng dụng.

```sh
npm run check
npm run check:code
npm run check:assets
npm run check:performance
npm run check -- --strict
npm run test:checkers
npm run check:i18n
npm run build
npm run check:bundle
npm run verify
npm run test:e2e
```

Mỗi checker xuất `error`, `warning` và tổng kết. Có lỗi trả exit code 1; cảnh báo mặc định không chặn. `--strict` biến mọi cảnh báo thành điều kiện thất bại để dùng làm cổng CI. Lỗi đọc file hoặc lỗi thực thi cũng phải thất bại. Không có source/asset sẽ báo `SKIP`, không có nghĩa ứng dụng đã đạt chất lượng.

`check-all.mjs` chạy hết các checker dù một checker lỗi, sau đó trả trạng thái tổng hợp. Các checker chỉ đọc, không tự sửa hoặc xóa file.

## 2. Kiểm tra code

`check-code.mjs` quét code/CSS trong `src/`:

- Lỗi: ký tự thay thế Unicode, tab đầu dòng, thiếu newline cuối file, CSS có `!important`, ID selector hoặc tên class sai cú pháp BEM.
- Cảnh báo cần rà soát: `var`, token `any`, comment bỏ qua lint/type check.

Đây là kiểm tra bằng mẫu văn bản: có thể bắt cả comment/string và chưa kiểm tra ngữ nghĩa như modifier có đi cùng block, import vòng, unused export, type safety hoặc cleanup. Khi có ứng dụng, bắt buộc bổ sung ESLint, Stylelint, TypeScript và công cụ phân tích unused code có hiểu dependency graph, cấu hình theo stack thực tế. Không xem checker regex là bằng chứng code không có lỗi.

## 3. Tài nguyên thừa và trùng

`check-unused-assets.mjs`:

1. Liệt kê asset trong `src/` và `public/` theo extension trong cấu hình.
2. Tìm tham chiếu literal trong source, stylesheet, HTML, JSON và SVG; hỗ trợ đường dẫn tương đối, `@/` tương ứng `src/`, URL `/` tương ứng `public/`, bỏ query/hash.
3. Cảnh báo asset không có tham chiếu tĩnh.
4. Hash SHA-256 để phát hiện file có nội dung trùng byte, kể cả khác tên.

**Giới hạn:** không dựng import graph từ entrypoint. Một file source không còn được dùng vẫn có thể khiến asset được tính là có tham chiếu; asset có tham chiếu chưa chắc đã được sử dụng lúc chạy. URL tạo động, alias khác `@/`, URL có base path riêng và đường dẫn được ghép từ nhiều biến có thể không được nhận diện. Không quét docs/script/test làm bằng chứng asset được ứng dụng dùng. Tham chiếu trong comment vẫn có thể được tính.

Với asset nạp động, ưu tiên catalog dùng đường dẫn literal. Nếu không phù hợp, khai báo **đường dẫn chính xác và lý do** trong `assetExceptions` của `script/check.config.mjs`. Ngoại lệ thiếu lý do hoặc trỏ tới file không tồn tại là lỗi. Không dùng ngoại lệ để che file thừa; mỗi ngoại lệ cần được rà soát khi thay catalog.

```js
assetExceptions: [
  {
    path: 'public/frames/pastel-strip-01/overlay.png',
    reason: 'Đường dẫn được dựng từ frame ID; đã kiểm tra catalog và preview',
  },
],
```

Không xóa tự động theo cảnh báo. Xác minh catalog, cách ghép URL và bản build trước khi xóa. Trùng byte cũng có thể là chủ ý; cân nhắc chi phí cache, tham chiếu và quyền sử dụng trước khi gom chung.

## 4. Kiểm tra dấu hiệu hiệu năng

`check-performance.mjs` có các ngưỡng ban đầu trong `check.config.mjs`:

| Tín hiệu | Kết quả |
| --- | --- |
| Asset lớn hơn 500 KiB | Cảnh báo |
| Asset lớn hơn 5 MiB | Lỗi |
| Module source dài hơn 400 dòng | Cảnh báo rà soát trách nhiệm |
| Data URL base64 dài hơn 2048 ký tự | Cảnh báo chi phí bộ nhớ/bundle |
| `toDataURL` | Cân nhắc Blob thay chuỗi ảnh |
| Timer | Kiểm tra cleanup, deadline và callback hết hiệu lực |
| `createObjectURL` | Kiểm tra thu hồi URL |
| `getUserMedia` | Kiểm tra dừng track |

Timer hoặc camera là chức năng hợp lệ; cảnh báo chỉ yêu cầu review, không khẳng định thiếu cleanup. Độ dài module không đo độ nhanh; asset nặng có thể cần cho export. Điều chỉnh ngưỡng có lý do theo kết quả đo, không tăng chỉ để check xanh. Hiện chưa có suppression riêng cho từng cảnh báo hiệu năng; strict có thể chặn cả trường hợp đã review.

## 5. Đánh giá tối ưu khi có ứng dụng

Để kết luận về tối ưu cần thêm số đo trên bản production và thiết bị thật:

- Phân tích bundle: kích thước tải đầu, chunk, dependency nặng, tài nguyên được tải theo nhu cầu. Thiết lập budget sau khi có baseline và lưu budget trong cấu hình để CI so sánh.
- Dùng mục tiêu ban đầu và quy trình đo trong [performance standards](performance-standards.md), chốt budget sau baseline; kiểm tra dữ liệu ảnh/network theo [security standards](security-standards.md).
- Đo tải trang và tương tác ở gallery/editor trên thiết bị mục tiêu; xác định điều kiện mạng, số frame và số ảnh mẫu để kết quả có thể lặp lại.
- Đo thời gian và mức dùng bộ nhớ khi upload ảnh lớn, burst 9 tấm, đổi frame và export ở độ phân giải mục tiêu.
- Lặp mở/đóng camera, thay ảnh và export để tìm tăng bộ nhớ liên tục; xác nhận track, timer và object URL được giải phóng.
- Kiểm tra gallery dùng thumbnail, không tải tất cả ảnh export ngay khi mở trang.

Đã có check-i18n trong check-all và check-bundle-budget sau build trong verify. check-unused-code và check-frame-catalog độc lập vẫn cần bổ sung; hiện TypeScript bắt unused local/import và unit test kiểm tra catalog/hình học, chưa thay thế phân tích unused export theo dependency graph. CI đã cấu hình verify và E2E; không dùng trạng thái xanh để tuyên bố mọi thiết bị đã đạt hiệu năng.
