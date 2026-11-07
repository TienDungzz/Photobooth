# Hướng dẫn tạo layout và frame

## 1. Phân biệt và nguồn dữ liệu

Layout quy định hình học các ô; frame tham chiếu layout và bổ sung trang trí; biến thể màu không tạo layout mới. Kiểu dữ liệu chuẩn nằm tại [thiết kế kỹ thuật](technical-design.md). Vị trí file theo [cấu trúc thư mục](folder-structure.md); không tạo mô hình riêng trong component.

Metadata nằm ở `src/features/frame-catalog/data/layouts/` và `frames/`, được đăng ký qua `catalog.ts`. Asset nằm ở `public/frames/<frame-id>/`. ID dùng kebab-case, duy nhất và ổn định; tên hiển thị/tags có bản dịch, ID không dịch.

## 2. Quy trình tác giả

1. Chọn nhóm bố cục và số ô; kiểm tra catalog để tái sử dụng layout phù hợp.
2. Vẽ artboard theo kích thước đầu ra, xác định các ô và vùng trang trí.
3. Chuyển hình học sang tọa độ chuẩn hóa; khai báo slot ID, mask, rotation, required và zIndex.
4. Xuất background/overlay nếu cần; tạo metadata frame và bản dịch.
5. Dựng thumbnail bằng renderer với ảnh mẫu có quyền sử dụng.
6. Đăng ký catalog, kiểm tra tự động và đối chiếu preview/export.
7. Ghi nguồn/quyền sử dụng và kết quả QA trước khi đưa vào bộ phát hành.

## 3. Hình học và vùng an toàn

- `x`, `y` là góc trên trái của slot chưa xoay, chia cho kích thước artboard tương ứng. `width`, `height` là tỷ lệ artboard; xoay theo độ quanh tâm slot.
- Ví dụ artboard 1200×2400 px, ô tại (120, 240), rộng 960, cao 480: x=0.1, y=0.1, width=0.8, height=0.2.
- Giá trị phải hữu hạn, kích thước dương; không đặt ô ngoài canvas nếu không có chủ ý crop được ghi rõ. Kiểm tra biên cả sau khi xoay.
- `cornerRadius` chuẩn hóa theo cạnh ngắn slot; mask dùng tập giá trị đã được renderer hỗ trợ. Hình mới cần mở rộng schema/renderer trước khi tạo nội dung.
- Ô chồng nhau dùng zIndex riêng và thứ tự ổn định. Metadata không phụ thuộc vị trí file trong thư mục.
- Đề xuất giữ nội dung chữ/trang trí quan trọng cách mép ngoài ít nhất 3% cạnh ngắn artboard; đây là safe area hiển thị, chưa phải bleed/cut line cho in.
- Giữ vùng trung tâm mỗi ô thông thoáng với ảnh mẫu cận mặt/nhóm; không khẳng định nhận diện mặt hoặc tự căn mặt nếu chưa có tính năng đó.

## 4. Asset và thứ tự lớp

Thứ tự chuẩn: màu nền → background asset → các slot theo zIndex → overlay. Background/overlay dùng cùng tỷ lệ và kích thước artboard; overlay để alpha trong vùng cần thấy ảnh. Không nhúng ảnh mẫu vào overlay thành phẩm.

PNG hoặc WebP phù hợp với thiết kế và alpha; dùng định dạng đã kiểm tra trên trình duyệt mục tiêu. SVG chỉ nhận từ nguồn dự án quản lý và kiểm tra theo [security standards](security-standards.md). Không dùng filter/theme UI để thay màu frame.

Đầu ra mặc định hướng tới cạnh dài 2400 px; kích thước cụ thể nằm trong layout. Tránh asset lớn hơn nhu cầu xuất khi không có lý do. Thumbnail tối đa 100 KiB theo mục tiêu [performance standards](performance-standards.md), giữ tỷ lệ đầu ra, tách biệt asset bản đầy đủ.

Nếu thiết kế cần họa tiết xen giữa ảnh, mô hình background/overlay hiện tại chưa đủ: cập nhật hợp đồng layer và kiểm thử trước, không mô phỏng bằng CSS chỉ có ở preview.

## 5. Checklist metadata và bản quyền

- Layout/frame ID duy nhất, layoutId hợp lệ, version nguyên dương, kích thước hợp lệ.
- Có tên, category, tags, thumbnail, backgroundColor, jpegBackgroundColor và allowTransparency; asset tùy chọn chỉ khai báo khi tồn tại.
- URL dùng literal cùng origin khi có thể; nếu tạo động phải ghi ngoại lệ chính xác có lý do trong checker asset.
- Khóa dịch cho tên/category/tags có đủ Việt/Anh; chữ nằm trong ảnh không tự dịch. Biến thể có chữ khác ngôn ngữ cần tài nguyên và liên kết lựa chọn được thiết kế riêng.
- Ghi nguồn và quyền sử dụng vào `docs/frame-assets-register.md` khi thêm bộ asset đầu tiên: frame ID, tác giả/nguồn, giấy phép hoặc bằng chứng được phép dùng, yêu cầu ghi công, file liên quan. File sổ này chưa được tạo vì chưa có asset.
- Không dùng ảnh cá nhân chưa được phép cho thumbnail/fixture; ưu tiên ảnh tổng hợp hoặc ảnh có quyền sử dụng.

## 6. Kiểm tra trước khi phát hành

Mỗi frame phải thử ảnh ngang/dọc/vuông, ảnh sát mép, ô xoay hoặc chồng lớp nếu có, zoom/crop/mirror và PNG/JPEG. Kiểm tra không có lỗ nền ngoài ý muốn, viền răng cưa bất thường, chữ bị cắt hoặc họa tiết che sai vùng.

So sánh thumbnail, preview và export cùng bộ ảnh. Kiểm tra sáng/tối không đổi thành phẩm; thiếu asset phải báo lỗi và không xuất file thiếu trang trí một cách âm thầm. Frame có alpha phải có kết quả JPEG nền đúng cấu hình.

Hiện chạy `npm run check:assets` và `npm run check:performance` cho những quy tắc đã có. `script/check-frame-catalog.mjs` cần được triển khai cùng schema/catalog để kiểm tra metadata, hình học và đường dẫn; chưa có checker đó. QA hình ảnh vẫn bắt buộc.

Thay nội dung đã phát hành: tăng version, thay URL asset để tránh cache cũ, dựng lại thumbnail và chạy lại kiểm tra. Không tái sử dụng ID cho một bố cục có ý nghĩa khác. Mục tiêu số lượng layout/frame lấy từ yêu cầu sản phẩm, không đếm biến thể màu thành bố cục mới.
