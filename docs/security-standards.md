# Security standards

## 1. Phạm vi và nguyên tắc

Quy chuẩn bảo mật cho ứng dụng photobooth phía client, xử lý ảnh cục bộ, chưa có tài khoản hay backend lưu ảnh. Áp dụng cùng [coding standards](coding-standards.md), [performance standards](performance-standards.md) và [thiết kế kỹ thuật](technical-design.md).

Ảnh, tên file, metadata, nội dung storage, dữ liệu trong URL và dữ liệu bên ngoài đều phải được xem là đầu vào chưa đáng tin. Asset/frame do dự án quản lý vẫn cần kiểm tra trước phát hành. Quy chuẩn này là yêu cầu triển khai, không phải chứng nhận repository hoặc ứng dụng đã an toàn.

Nếu thêm upload máy chủ, chia sẻ công khai, đăng nhập hoặc thanh toán, phải bổ sung thiết kế về xác thực, phân quyền, lưu trữ, thời hạn giữ dữ liệu, xóa dữ liệu, giới hạn request và bảo vệ endpoint trước khi phát hành phần đó. Kiểm tra phía client không thay thế kiểm tra phía server.

## 2. Dữ liệu ảnh và quyền riêng tư

- Mặc định chỉ xử lý ảnh trên thiết bị. Không gửi ảnh, crop, thumbnail, tên file hoặc metadata cá nhân tới analytics, error tracker, API hay log.
- Không thêm SDK hoặc dịch vụ có quyền đọc DOM/ảnh mà chưa đánh giá luồng dữ liệu. Network request của dependency cũng thuộc phạm vi kiểm tra.
- Không lưu ảnh vào cookie, localStorage, cache hoặc service worker. Kho ảnh được cho phép lưu Blob và metadata chỉnh sửa trong IndexedDB khi bấm tải, thời hạn 7 ngày và xóa theo [đặc tả Kho ảnh](saved-gallery.md). Locale/theme vẫn lưu riêng như đã đặc tả. Không gửi dữ liệu kho tới máy chủ.
- Không đặt ảnh/base64/metadata trong URL, query, fragment hoặc thông điệp lỗi. Không đưa ảnh thật của người dùng vào repository, fixture, screenshot QA hoặc báo cáo lỗi.
- Xóa tham chiếu và giải phóng tài nguyên khi không còn dùng. “Xóa khỏi phiên” nghĩa là ứng dụng bỏ dữ liệu đang giữ; không cam kết xóa an toàn khỏi bộ nhớ thiết bị, file gốc hoặc file đã tải xuống.
- Chỉ hiển thị cam kết “xử lý trên thiết bị” sau khi kiểm tra network của upload, camera, chỉnh sửa và export trên bản production.
- Không sao chép metadata nguồn sang ảnh xuất một cách mặc định. Xác minh file xuất trước khi tuyên bố đã loại bỏ metadata nhạy cảm.

## 3. Kiểm tra file và chống cạn tài nguyên

- Chỉ nhận JPEG, PNG và WebP tĩnh trong phạm vi ban đầu. Thuộc tính accept của file input chỉ là hỗ trợ giao diện, không phải kiểm tra bảo mật.
- Kiểm tra extension/MIME khai báo, định dạng thực tế và khả năng giải mã; không tin riêng tên file hoặc MIME do file cung cấp. Từ chối dữ liệu không khớp hoặc không đọc được bằng lỗi rõ ràng.
- Áp dụng giới hạn dung lượng file và pixel của đặc tả sản phẩm; thêm giới hạn số ảnh và ngân sách bộ nhớ toàn phiên khi có baseline. Không chỉ giới hạn từng file mà cho phép số file vô hạn.
- Kiểm tra kích thước từ header khi có bộ phân tích được kiểm chứng; tiếp tục xác nhận kích thước sau decode. Không tự viết parser định dạng phức tạp chỉ để đọc metadata.
- Hàng đợi decode có concurrency giới hạn và hỗ trợ hủy/bỏ kết quả; tránh một lần chọn nhiều ảnh làm ứng dụng hết bộ nhớ.
- SVG, HTML và file thực thi tải lên không được hỗ trợ. Không render file chưa tin qua iframe, object, embed hoặc innerHTML. HEIC/ảnh động chỉ thêm sau khi có decoder, giới hạn và kiểm thử riêng.
- File hỏng chỉ làm lỗi file đó, không làm mất ảnh hợp lệ hoặc phiên chỉnh sửa. Không liên tục tự thử lại file lỗi.

## 4. DOM, bản dịch, URL và frame

- Hiển thị nội dung người dùng và bản dịch qua text binding có escape. Không dùng innerHTML/dangerouslySetInnerHTML cho tên file, lỗi, tags, bản dịch hoặc dữ liệu URL.
- Không dùng eval, new Function hoặc thực thi chuỗi cấu hình/bản dịch thành code.
- Kiểm tra schema catalog: ID, kiểu dữ liệu, giới hạn tọa độ/kích thước, thứ tự lớp và URL asset. Giá trị số phải hữu hạn; từ chối NaN/Infinity và kích thước canvas vượt cấu hình.
- Asset frame ưu tiên cùng origin, URL thuộc danh sách đường dẫn được quản lý. Không cho query parameter tùy ý chọn URL ảnh, script, stylesheet hoặc font từ bên ngoài.
- Nếu cần asset ngoài origin, phải khai báo origin tin cậy, CORS, phạm vi sử dụng và ảnh hưởng quyền riêng tư. Không dùng proxy tùy ý để vượt hạn chế canvas.
- SVG do dự án cung cấp phải được kiểm soát: không script, handler sự kiện hoặc tham chiếu ngoài không được duyệt. Không chèn SVG chưa kiểm tra thành markup.
- Không tạo CSS selector, đoạn CSS hoặc URL style trực tiếp từ chuỗi chưa kiểm tra. Dữ liệu transform dùng giá trị số đã validate; theme/locale dùng tập giá trị cho phép.
- Storage bị chỉnh sửa hoặc JSON lỗi không được gây crash hay dẫn tới thực thi nội dung; validate version và từng trường, bỏ trường không hỗ trợ.

## 5. Camera và vòng đời quyền truy cập

- Chỉ xin quyền khi người dùng chọn mở camera; chỉ yêu cầu video, không microphone.
- Hiển thị rõ camera đang hoạt động và có hành động đóng. Không tự bật lại sau khi người dùng đóng hoặc từ chối quyền.
- Dừng track khi đóng/rời màn hình chụp, đổi camera hoặc hủy component. Stream không được tồn tại chỉ vì còn tham chiếu trong store toàn cục.
- Khi tab ẩn/thiết bị khóa, dừng lịch chụp theo đặc tả; khi quay lại cần hành động tiếp tục và đếm ngược mới. Không chụp ngầm hoặc chụp bù.
- Lỗi quyền, camera bận hoặc camera mất kết nối có phương án tải ảnh thay thế. Không yêu cầu quyền không liên quan để mở khóa tính năng.

## 6. Hosting và cấu hình trình duyệt

- Production bắt buộc HTTPS. Cấu hình security headers tại hosting; kiểm tra response thực tế sau deploy, không chỉ kiểm tra file cấu hình.
- CSP cần giới hạn script, style, image, font và kết nối vào nguồn cần thiết; chặn object và hạn chế base URI. Không dùng unsafe-eval hoặc nới mọi nguồn bằng wildcard để xử lý lỗi triển khai.
- Cho phép blob cho ảnh/worker chỉ ở directive thực sự cần; không cho blob script chung nếu không có lý do. Theme bootstrap phải phù hợp CSP, dùng file ngoài hoặc nonce/hash tương ứng với cách deploy.
- Đặt chính sách chống nhúng trang theo nhu cầu sản phẩm, mặc định không cho website khác nhúng. Nếu sau này cho iframe, thiết kế rõ origin và quyền camera được ủy quyền.
- Giới hạn Permissions-Policy: camera chỉ cho ứng dụng cần dùng, microphone tắt; không cấp quyền thừa cho bên thứ ba.
- Cấu hình X-Content-Type-Options, Referrer-Policy và HSTS phù hợp môi trường. Chỉ bật HSTS bao gồm subdomain khi chắc toàn bộ phạm vi đó hỗ trợ HTTPS.
- Không công khai source map nếu chứa mã hoặc thông tin nội bộ không muốn phát hành; nếu dùng error tracker, tải source map riêng theo cấu hình được quản lý.

Đã có mẫu public/_headers với CSP, referrer, MIME, framing và permission policy cho hosting tương thích. Vite dev/preview không tự áp dụng mẫu; chưa deploy/kiểm tra response hosting hoặc có checker header. CSP style-src cho phép inline style cần cho hình học slot React; script-src vẫn chỉ self. Cần chốt và kiểm thử policy tại staging, không xem file mẫu là bằng chứng production đã được bảo vệ.

## 7. Dependency, secret và build

- Không đưa secret/API key có quyền riêng vào code frontend, asset, docs, commit hoặc biến môi trường được bundler đưa vào client. Dữ liệu đã nằm trong bundle được xem là công khai.
- Khi thêm dependency, ghi nhận mục đích, phạm vi dữ liệu được truy cập và chi phí; ưu tiên không thêm thư viện nếu chức năng nhỏ đã có cách triển khai rõ ràng.
- Dùng lockfile của package manager đã chọn, cài đặt tái lập trong CI và rà soát thay đổi dependency/install script. Không trộn nhiều lockfile.
- Kiểm tra advisory của dependency khi thêm/nâng phiên bản và trước phát hành. Không chạy auto-fix gây đổi dependency lớn mà chưa kiểm tra tương thích.
- Lỗ hổng có thể khai thác, làm lộ ảnh/secret, thực thi nội dung không tin hoặc vượt quyền truy cập là điều kiện chặn phát hành. Phát hiện khác phải có đánh giá ảnh hưởng thực tế và kế hoạch xử lý; không chỉ dựa vào nhãn severity hoặc bỏ qua toàn bộ dev dependency.
- Không tải và chạy code tùy ý từ CDN/URL động. Dependency và script build phải đến từ nguồn được dự án quản lý.

## 8. Kiểm tra và bằng chứng nghiệm thu

| Nhóm | Kịch bản bắt buộc |
| --- | --- |
| File | Sai extension/MIME, file hỏng/cắt cụt, ảnh quá dung lượng/pixel, nhiều ảnh cùng lúc, định dạng không hỗ trợ |
| XSS/đầu vào | Tên file chứa markup, chuỗi bản dịch/URL/storage độc hại; hiển thị như text hoặc bị từ chối |
| Quyền riêng tư | Network trace khi upload/chụp/chỉnh/export: không gửi dữ liệu ảnh hoặc metadata cá nhân |
| Camera | Từ chối quyền, đóng màn hình, đổi thiết bị, tab ẩn, quay lại; không chụp ngoài ý muốn, track dừng đúng lúc |
| Asset/catalog | URL không được phép, schema sai, số không hữu hạn, SVG không hợp lệ, canvas quá kích thước |
| Deploy | HTTPS, header thực tế, CSP không chặn luồng hợp lệ và vẫn chặn nguồn ngoài chính sách |
| Dependency | Lockfile, advisory, rà soát secret và nội dung production bundle |

Báo cáo phải ghi build/commit, môi trường, các trường hợp đã kiểm tra, kết quả và giới hạn. Dùng ảnh tổng hợp hoặc có quyền sử dụng cho kiểm thử; không lưu ảnh cá nhân trong bằng chứng.

Khi có mã nguồn/hosting, bổ sung checker `.mjs` cho các kiểm tra tĩnh khả thi, ví dụ `script/check-security.mjs`, và kiểm tra header trên môi trường staging. Công cụ quét secret/dependency cần được cấu hình theo stack và CI; không tự viết regex rồi tuyên bố đã phát hiện mọi secret hoặc lỗ hổng. **Hiện chưa có checker bảo mật trong repository.**

Ngoại lệ phải nêu phạm vi, lý do, mức ảnh hưởng, biện pháp giảm thiểu, người phụ trách và thời điểm xem lại. Không cho phép ngoại lệ âm thầm tải ảnh lên bên ngoài hoặc xin quyền camera/microphone trái đặc tả sản phẩm.
