# Kho frame/layout lớn và cách duyệt

## Nội dung hiện tại

- **62 frame độc lập:** 13 bộ artwork minh họa và 49 frame Canvas/cơ bản (28 procedural, 1 cinema, 3 signature, 3 graphic, 3 craft, 2 reference, 5 inspired, 4 ornament). Ưu tiên nhóm [viền trang trí](ornament-layouts.md), sau đó nhóm inspired và reference. Không lấy số layout nhân lên để đếm frame.
- Họ họa tiết bổ sung gồm tim, nơ, tulip, cúc, anh đào, cherry, lá, dây leo, trăng, mây, mặt trời, cầu vồng, confetti, bóng bay, caro, chấm bi, sọc, tem thư, art deco, hình thoi, sóng và viền vỏ sò.
- **93 layout**, từ 1–20 ảnh: 60 layout sau rà soát, 6 [layout phá cách](expressive-designs.md), 4 [layout huy hiệu/vé](occasion-designs.md), 3 [signature](signature-designs.md), 4 [graphic](graphic-designs.md), 4 [craft](craft-designs.md), 2 [reference](reference-frames.md), 5 [inspired](inspired-collection.md) và 5 [ornament](ornament-layouts.md). Ưu tiên nhóm mới trước; không khôi phục các biến thể tương đồng đã bỏ.
- Frame/layout vẫn độc lập; 5.766 cách kết hợp không phải số frame. Xem [định nghĩa và quy tắc giữ ảnh](frame-layout-selection.md).

## Bộ lọc

Frame có một dropdown **Bộ sưu tập**. Layout có hai dropdown **Số ảnh / Phong cách bố cục**; không có tìm kiếm, bộ lọc tông màu, tỷ lệ, category, mask riêng hoặc chip nhóm số ảnh. Logic query và metadata từ khóa đã được gỡ. Xem [bộ lọc và custom dropdown](catalog-filters.md).

Các điều kiện trong cùng danh mục kết hợp với nhau; lọc frame không lọc layout và ngược lại. Không có kết quả sẽ hiển thị hướng dẫn đổi điều kiện. Không có nút “Xóa bộ lọc” hoặc “Hiện mục đang chọn”; chọn “Tất cả” trong dropdown để bỏ điều kiện, không đổi thiết kế hoặc ảnh.

Mỗi danh mục hiển thị toàn bộ kết quả phù hợp trong một lượt, không chia trang, không có dòng đếm kết quả hoặc nút “Xem thêm”. Desktop giữ grid có max-height và cuộn dọc riêng; tablet/mobile giữ dải cuộn ngang. Mobile mở từng mục Frame/Bố cục trong vùng công cụ cố định phía dưới, ẩn nhãn card và bộ lọc, giữ tên truy cập đầy đủ.

## Bố trí

Bộ chọn hiện chỉ nằm trên `/setup`, không nằm trên Home. Studio dùng bộ chọn gọn bên trái, preview giữa, ảnh/công cụ bên phải; Home chỉ có các bản in minh họa và link vào Studio. Xem [Home và Setup](home-and-setup.md).

Header, main và footer dùng chung biến --page-width: 1760px. Header/main có cùng padding theo breakpoint; header Setup gọn về chiều cao. Các dải thumbnail/filter có vùng cuộn riêng tại cột trái. Mobile xếp một cột và chặn min-content của rail làm nở trang.

## Mã nguồn và kiểm tra

- catalog.ts giữ mẫu gốc và tổng hợp hai danh mục; extra-frames.ts định nghĩa họ họa tiết/phiên bản; extra-layouts.ts tạo và khử trùng hình học.
- engine/motif-shapes.ts vẽ họa tiết bằng Canvas, dùng chung trong thumbnail/preview/export; không cần tải ảnh mẫu bên ngoài.
- filters.ts chứa hàm lọc thuần; PickerTools.tsx và DesignPicker hiển thị điều khiển/giới hạn kết quả.
- Unit test kiểm tra đủ số lượng, hình học không trùng, bao phủ số ảnh 1–20 và lọc kết hợp không phân biệt dấu.
- E2E kiểm tra chiều rộng header/main trên màn hình 1920px, không overflow mobile, lọc kết hợp, giữ lựa chọn và hiển thị đủ 62 frame/93 layout ngay từ đầu; chọn được mục cuối trong khung cuộn, không có dòng đếm hoặc nút xem thêm. Có hồi quy lọc bộ artwork, hình dạng tim và xuất PNG có mask.

Kho hiện kết hợp 13 bộ artwork, 28 frame procedural và 21 thiết kế Canvas. Atlas, prompt và cách nén được ghi trong [artwork provenance](artwork-provenance.md). Tiếp tục QA nội dung theo [hướng dẫn tác giả](frame-authoring-guide.md); bộ đếm số lượng không thay cho việc đánh giá chất lượng thiết kế.

Ba frame Canvas v? ba b? c?c m?i: [thi?t k? to?n trang](signature-designs.md).
