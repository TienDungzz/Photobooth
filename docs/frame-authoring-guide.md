# Hướng dẫn tạo layout và frame

Nhóm mới nhất nằm trong `occasion-catalog.ts`: 3 bộ artwork và 4 layout riêng. Chất liệu/viền theo frame ở `engine/occasion-decoration.ts`; cuống vé ở `engine/ticket-treatment.ts`. Khi dùng `treatment: 'ticket'`, phải tính cả phần giấy và cuống 24% chiều rộng ô vào vùng an toàn sau xoay. Xem [occasion designs](occasion-designs.md).

## 1. Phân biệt và nguồn dữ liệu

Mức chất lượng cần hướng tới được phân tích tại [đánh giá thư mục example](reference-design-review.md). Không dùng việc nhân màu, lặp motif hoặc sinh thêm lưới để thay thế artwork có concept, typography, mask/viền và thứ tự lớp được duyệt.

Layout quy định hình học các ô; frame là mẫu trang trí độc lập, không tham chiếu một layout cố định. Thành phẩm kết hợp frame/layout do người dùng chọn. Biến thể màu không tạo layout mới. Xem [frame và layout](frame-layout-selection.md). Kiểu dữ liệu chuẩn nằm tại [thiết kế kỹ thuật](technical-design.md). Vị trí file theo [cấu trúc thư mục](folder-structure.md); không tạo mô hình riêng trong component.

Catalog được ghép tại `src/features/frame-catalog/catalog.ts`; 7 bộ artwork, 1 cinema Canvas và 12 layout có hình dạng riêng nằm trong `art-frames.ts`. Schema hiện tại hỗ trợ `Frame.artwork` với theme, atlas tùy chọn, title/subtitle; atlas tại `public/artwork/`, nguồn PNG tại `artwork-source/`. Các bộ mới có công thức đặt sticker riêng trong `src/engine/artwork-recipes.ts` và chất liệu nền tại `artwork.ts`. Quy trình nguồn, prompt và nén ảnh được ghi tại [artwork provenance](artwork-provenance.md). Bộ procedural cũ giữ nguyên. ID dùng kebab-case, duy nhất và ổn định; tên hiển thị có bản dịch, ID không dịch.

Ba bộ artwork và sáu layout phá cách bổ sung nằm trong `expressive-catalog.ts`; chất liệu nền tại `engine/expressive-paper.ts`, lớp giấy/cửa sổ tại `engine/slot-treatment.ts`. `Slot.treatment` thuộc hình học layout; đưa nó vào khóa so sánh khi rà trùng để không đánh đồng ô thường với cửa sổ/Polaroid có cùng tọa độ. Xem [hợp đồng dựng ảnh phá cách](expressive-designs.md).

## 2. Quy trình tác giả

1. Xác định đang thêm frame trang trí hay layout hình học; mỗi loại đăng ký riêng trong catalog.
2. Vẽ artboard theo kích thước đầu ra, xác định các ô và vùng trang trí.
3. Chuyển hình học sang tọa độ chuẩn hóa; khai báo slot ID, mask, rotation, required và zIndex.
4. Xuất background/overlay nếu cần; tạo metadata frame và bản dịch.
5. Dựng thumbnail bằng renderer với ảnh mẫu có quyền sử dụng.
6. Đăng ký catalog, kiểm tra tự động và đối chiếu preview/export.
7. Ghi nguồn/quyền sử dụng và kết quả QA trước khi đưa vào bộ phát hành.

## 3. Hình học và vùng an toàn

Các layout tự sinh `ellipse-*` hiện là **ô tròn** (tên hiển thị Tròn/Circle), giữ ID ổn định. Tính đường kính theo pixel trong vùng an toàn rồi mới chia cho kích thước canvas để lấy tọa độ chuẩn hóa; không dùng cùng tỷ lệ width/height chuẩn hóa để suy ra hình tròn trên canvas chữ nhật. Mọi ô trong cùng layout có cùng đường kính, hàng cuối ít ô được căn giữa và khoảng cách ngang/dọc dùng cùng đơn vị pixel. Preview, thumbnail và PNG phải giữ đường kính ngang/dọc bằng nhau, cho phép sai số raster tối đa 2 px. Hai layout oval chân dung có chủ ý (`oval`, `oval-trio`) giữ tỷ lệ rộng/cao khoảng 0.78; không kéo ô bầu dục để lấp đầy diện tích lưới.

Các layout tim/sao/vòm trong `art-frames.ts` được dựng bằng tọa độ pixel riêng rồi chuẩn hóa, không đổ cùng công thức lưới cho mọi hình. Tim và sao có ô bao vuông trong ảnh xuất; cặp ảnh dùng strip 1100×2400, bộ bốn dùng 1800×2200. Hai vòm dùng tờ ngang 2200×1600, ba vòm dùng 2400×1600; ô vòm có tỷ lệ rộng/cao 0.775–0.8 và đỉnh bán nguyệt. Unit test chặn việc vô tình ép bẹt hoặc kéo dài các hình này. Thay đổi hình học phải kiểm tra cả thumbnail và thành phẩm, không chỉnh riêng thumbnail để che lỗi layout.

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

- Layout/frame ID duy nhất trong từng danh mục, version và kích thước hợp lệ; frame không có layoutId bắt buộc. Kiểm tra tổ hợp frame/layout được công bố hỗ trợ.
- Có tên, category, tags, thumbnail, backgroundColor, jpegBackgroundColor và allowTransparency; asset tùy chọn chỉ khai báo khi tồn tại.
- URL dùng literal cùng origin khi có thể; nếu tạo động phải ghi ngoại lệ chính xác có lý do trong checker asset.
- Khóa dịch cho tên/category/tags có đủ Việt/Anh; chữ nằm trong ảnh không tự dịch. Biến thể có chữ khác ngôn ngữ cần tài nguyên và liên kết lựa chọn được thiết kế riêng.
- Ghi nguồn, phương thức tạo, quyền sử dụng và file liên quan vào [sổ tài nguyên](frame-assets-register.md). Các atlas hiện tại được tạo bằng ImageGen; không coi ảnh trong `example/` là asset có thể xuất bản.
- Không dùng ảnh cá nhân chưa được phép cho thumbnail/fixture; ưu tiên ảnh tổng hợp hoặc ảnh có quyền sử dụng.

## 6. Kiểm tra trước khi phát hành

Mỗi frame phải thử ảnh ngang/dọc/vuông, ảnh sát mép, ô xoay hoặc chồng lớp nếu có, zoom/crop/mirror và PNG/JPEG. Kiểm tra không có lỗ nền ngoài ý muốn, viền răng cưa bất thường, chữ bị cắt hoặc họa tiết che sai vùng.

So sánh thumbnail, preview và export cùng bộ ảnh. Kiểm tra sáng/tối không đổi thành phẩm; thiếu asset phải báo lỗi và không xuất file thiếu trang trí một cách âm thầm. Frame có alpha phải có kết quả JPEG nền đúng cấu hình.

Hiện chạy `npm run check:assets` và `npm run check:performance` cho những quy tắc đã có. `script/check-frame-catalog.mjs` cần được triển khai cùng schema/catalog để kiểm tra metadata, hình học và đường dẫn; chưa có checker đó. QA hình ảnh vẫn bắt buộc.

Thay nội dung đã phát hành: tăng version, thay URL asset để tránh cache cũ, dựng lại thumbnail và chạy lại kiểm tra. Không tái sử dụng ID cho một bố cục có ý nghĩa khác. Mục tiêu số lượng layout/frame lấy từ yêu cầu sản phẩm, không đếm biến thể màu thành bố cục mới.
