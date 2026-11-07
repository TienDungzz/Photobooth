# Performance standards

## 1. Phạm vi và mức áp dụng

Quy chuẩn hiệu năng cho gallery, tải ảnh, camera, editor và xuất ảnh. Áp dụng cùng [coding standards](coding-standards.md), [security standards](security-standards.md) và [cơ chế kiểm tra chất lượng](quality-checks.md).

“Bắt buộc” là yêu cầu triển khai. Các budget dưới đây là **mục tiêu ban đầu của dự án**, chưa phải số đo hay khả năng đã được xác nhận. Khi có bản ứng dụng đầu tiên, đo baseline, chốt thiết bị tham chiếu và lưu cấu hình budget trước khi dùng làm cổng phát hành. Không tuyên bố đã tối ưu chỉ vì checker tĩnh chạy thành công.

## 2. Budget và điều kiện đo

| Hạng mục | Mục tiêu ban đầu | Cách kiểm tra |
| --- | --- | --- |
| JavaScript tải ban đầu | Tổng tối đa 250 KiB gzip | Tính các chunk thực sự tải để mở gallery, gồm dependency |
| CSS tải ban đầu | Tổng tối đa 50 KiB gzip | Tính stylesheet thực sự tải ở gallery |
| Tổng dữ liệu mở gallery | Tối đa 1.5 MiB truyền qua mạng | Bao gồm HTML, JS, CSS, font và thumbnail được tải trước tương tác đầu tiên |
| Thumbnail frame | Tối đa 100 KiB/file | Kiểm tra asset thumbnail và kích thước hiển thị |
| Phản hồi điều khiển | p95 không quá 100 ms | Từ thao tác đến phản hồi trạng thái trên UI; tác vụ dài có chỉ báo riêng |
| Export mặc định | p95 không quá 5 giây | Frame 9 ô, cạnh dài 2400 px, ảnh mẫu hợp lệ, asset đã tải |
| Phiên lặp | Không crash, mất ảnh hoặc tăng số tài nguyên còn sống sau cleanup | 20 vòng mở/đóng camera, thay ảnh, đổi frame và export |

Điều kiện đo phải ghi rõ model thiết bị, RAM, hệ điều hành, phiên bản trình duyệt, kích thước ảnh, frame, build/commit và cấu hình mạng. Chọn ít nhất một điện thoại Android tầm trung, một iPhone và một máy tính trong danh sách hỗ trợ thực tế.

Đo trên production build. Đo tải gallery với cache lạnh và một profile mạng cố định được ghi trong báo cáo; đo lại cache ấm riêng. Với thao tác/export, warm-up 3 lượt rồi đo ít nhất 20 lượt mỗi kịch bản, báo median, p95 và số lần lỗi. Không gộp số đo từ nhiều thiết bị thành một kết quả duy nhất.

Tổng tải gallery và các ngưỡng trên cần chốt sau baseline. Thay budget phải kèm lý do, số đo trước/sau và ảnh hưởng người dùng; không nâng ngưỡng chỉ để check xanh. Trước khi có baseline, báo kết quả là “chưa đo” hoặc “chưa chốt”, không tự tính đạt.

## 3. Tải ứng dụng và kho frame

- Bắt buộc tách metadata/thumbnail khỏi asset độ phân giải cao. Chỉ tải background/overlay bản đầy đủ khi chọn frame hoặc chuẩn bị export.
- Không import toàn bộ ảnh frame vào bundle JavaScript hay nhúng base64 để tránh request.
- Gallery tải thumbnail theo vùng hiển thị và vùng đệm nhỏ; không tải đủ 60 frame ngay khi vào trang. Dành sẵn tỷ lệ/kích thước ảnh để hạn chế dịch chuyển bố cục.
- Font, icon và thư viện chỉ đưa vào phần thực sự dùng; tránh nhiều bộ icon hoặc thư viện xử lý ảnh trùng chức năng.
- Trì hoãn module editor/export nặng nếu không cần cho gallery. Quyết định chia chunk dựa trên network trace và bundle analyzer.
- Cache asset phiên bản hóa; thay nội dung phải thay URL/version. Không cache ảnh người dùng qua service worker.
- Kiểm tra asset không dùng và trùng byte trước khi thêm thư viện hoặc bộ frame mới. Cảnh báo cần được xác minh theo catalog, không tự động xóa file.

## 4. Xử lý ảnh và bộ nhớ

- Giữ Blob ảnh gốc, thumbnail và bitmap làm việc theo vòng đời rõ ràng. Không tạo nhiều bản base64 của cùng ảnh trong state.
- Giải mã và resize theo hàng đợi giới hạn concurrency; không giải mã đồng thời toàn bộ ảnh lớn được chọn. Cấu hình concurrency cần kiểm tra trên thiết bị yếu.
- Preview dùng độ phân giải phù hợp với vùng hiển thị. Export dùng kích thước định nghĩa trong frame, không upscale theo kích thước màn hình hoặc device pixel ratio một cách vô hạn.
- Ưu tiên tạo Blob khi xuất; không dùng chuỗi data URL lớn nếu không có lý do đã đo.
- Thu hồi object URL sau khi consumer không còn dùng; đóng bitmap và bỏ canvas tạm đúng lúc. Không thu hồi URL khi thumbnail hoặc tác vụ tải xuống vẫn đang sử dụng.
- Một ảnh có thể được dùng ở nhiều slot. Photo library quản lý quyền sở hữu để xóa một assignment không làm hỏng slot khác và không giải phóng ảnh còn dùng.
- Lưu giới hạn file/pixel tại cấu hình tập trung theo đặc tả sản phẩm. Giới hạn phải được kiểm tra trước xử lý nặng trong khả năng bộ giải mã; không coi giới hạn dung lượng nén là đủ để ngăn bitmap quá lớn.
- Khi lỗi bộ nhớ hoặc export, giữ dữ liệu phiên nếu có thể, hiển thị hướng khôi phục và cho giảm độ phân giải. Không lặp export tự động vô hạn.

## 5. UI, camera và render

- Hàm tính crop/transform và renderer dùng chung cho preview/export; không duy trì hai thuật toán khác nhau vì dễ sai và khó tối ưu.
- Kéo/zoom cập nhật theo nhịp vẽ trình duyệt; gộp thay đổi nhanh. Không export canvas độ phân giải đầy đủ cho mỗi sự kiện pointer.
- Countdown không làm render lại toàn bộ gallery/editor mỗi tick. Locale/theme không khởi tạo lại stream, timer hoặc bitmap.
- Camera chỉ có stream đang dùng; dừng track cũ khi đổi/đóng. Khi tab ẩn, xử lý pause theo luồng sản phẩm và không chụp bù dồn tấm.
- Không dùng timer để giả định tác vụ decode/render đã hoàn tất. Chờ kết quả thực tế và khóa thao tác trùng.
- Tác vụ dài phải có trạng thái bận, cho hủy khi có thể và bỏ kết quả đến muộn sau khi phiên hủy.
- Chỉ đưa xử lý sang worker hoặc thêm memoization sau khi profiling chỉ ra nút thắt. Việc thêm worker không thay thế giới hạn bộ nhớ và cleanup.

## 6. Phát hiện rò rỉ và hồi quy

Kịch bản chuẩn: chọn frame 9 ô → thêm bộ ảnh mẫu → crop/zoom → export → thay frame → mở/chụp/đóng camera → xóa ảnh và trở về trạng thái đầu. Lặp 20 vòng sau warm-up.

Kiểm tra số track còn hoạt động, timer/listener còn đăng ký, object URL và bitmap/canvas do ứng dụng sở hữu sau cleanup. So sánh heap snapshot hoặc công cụ bộ nhớ tương ứng tại các mốc giống nhau; bộ nhớ JS không đại diện cho toàn bộ bộ nhớ hình ảnh/GPU. Không dùng mức tăng tức thời trước GC để kết luận rò rỉ, và không bắt buộc GC trong code sản phẩm.

Hồi quy vượt budget đã chốt phải được sửa hoặc có ngoại lệ ghi trong hồ sơ thay đổi: phạm vi, lý do, bằng chứng đo, người phụ trách và thời điểm xem lại. Không bỏ qua hàng loạt cảnh báo hoặc sửa cấu hình để che hồi quy.

## 7. Kiểm tra tự động và nghiệm thu

- Hiện có `script/check-performance.mjs` cho asset lớn, base64 và một số điểm cần review vòng đời; `check-unused-assets.mjs` cho tham chiếu asset và trùng nội dung. Các ngưỡng hiện có không thay thế budget runtime ở trên.
- Khi có build, bổ sung `script/check-bundle-budget.mjs` để kiểm tra artifact/tải ban đầu và thumbnail theo vai trò; chưa có checker này trong repository.
- Khi có ứng dụng và công cụ đo, thêm kịch bản performance có fixture cố định, lưu báo cáo gắn với commit; không chạy phép đo trên dev server để nghiệm thu.
- CI phải chạy kiểm tra tĩnh, build và budget đã cấu hình. Luồng camera, bộ nhớ và export vẫn cần kiểm chứng thiết bị thật trước phát hành.

Hoàn thành khi budget đã chốt đạt trên thiết bị tham chiếu, các kịch bản chính có số đo, không có tài nguyên còn sống ngoài chủ ý sau cleanup và thành phẩm vẫn đúng về crop/màu/lớp. Nếu chưa đo được hạng mục nào, ghi rõ giới hạn đó trong báo cáo.
