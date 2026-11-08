# Frame và layout: hai lựa chọn độc lập

## Yêu cầu đã hiệu chỉnh theo ảnh tham chiếu

**Frame** là mẫu trang trí: giấy/nền, hoa lá, ren, ruy băng, màu viền, họa tiết, chữ trang trí. Frame không chứa số ảnh, tọa độ ô hay layoutId bắt buộc.

**Layout** là cấu trúc ảnh: số ô, vị trí, kích thước, khoảng cách, mask, góc xoay và tỷ lệ đầu ra. Nhiều layout có cùng số ô nhưng sắp xếp khác nhau, ví dụ 4 ảnh thành strip, lưới 2×2 hoặc một lớn/ba nhỏ.

**Design/thành phẩm** là sự kết hợp frame đang chọn + layout đang chọn + ảnh và crop. Không đăng ký mỗi tổ hợp này thành một frame mới. 62 frame và 93 layout tạo 5.766 tổ hợp, không phải 5.766 frame.

## Giao diện chọn

Hai bộ chọn và nguồn ảnh hiện nằm cùng trang `/setup`, tách khỏi Home giới thiệu. Không có bước chọn thiết kế rồi chuyển sang editor khác nữa. Xem [bố cục Home/Setup](home-and-setup.md).

Kho hiện có 62 frame/93 layout và bộ lọc riêng; các dải thumbnail nằm trong cột trái của Studio `/setup`. Home không chứa các bộ chọn tương tác. Chi tiết tại [kho và bộ lọc](catalog-browsing.md).

1. Panel có thể thu gọn “Chọn mẫu frame”: tên đang chọn, thumbnail giấy trang trí chưa có ô ảnh và tên mẫu. Không hiển thị chữ “Selected”/“Try frame”; thẻ đang chọn nổi lên bằng viền, nền và bóng đổ, đồng thời giữ `aria-pressed` cho công nghệ hỗ trợ. Desktop dùng grid cuộn dọc; tablet/mobile dùng dải cuộn ngang.
2. Panel riêng “Chọn bố cục”: số ảnh/layout đang chọn; bộ lọc Tất cả, 2–3, 4–6, 8–12, 16–20; dải card hình học trung tính, số ảnh và tên bố cục.
3. Preview ở cột giữa kết hợp hai lựa chọn, cập nhật ngay. Chọn frame không tự chọn layout hoặc điều hướng; ảnh được tải/chụp trực tiếp trên cùng trang.
4. Các panel xuất hiện cả trước khi thêm ảnh và trong editor. Thu gọn panel hoặc đổi bộ lọc không xóa lựa chọn; layout được chọn có thể nằm ngoài nhóm lọc hiện tại.

Thumbnail frame không thể hiện layout đang chọn. Thumbnail layout không lấy trang trí frame đang chọn. Chỉ preview/thành phẩm mới kết hợp cả hai.

## Quy tắc dữ liệu và thay đổi

```ts
type Selection = { frameId: string; layoutId: string };
// Catalog: Frame[] và Layout[] độc lập.
// Renderer nhận Design = Frame & { layout: Layout } do composeDesign tạo tạm.
```

- Đổi frame: giữ nguyên layout, ảnh từng ô, selected slot, crop/zoom/rotation/mirror. Chỉ thay trang trí.
- Đổi layout: giữ frame và toàn bộ ảnh trong khay; ánh xạ ảnh đang dùng theo thứ tự sang ô mới, reset crop cho tỷ lệ ô mới. Ảnh dư vẫn ở khay, ô thiếu được hiển thị rõ.
- Đổi frame/layout không xin lại quyền camera, không tự chụp thêm hoặc xóa ảnh.
- Kích thước thành phẩm/số ảnh lấy từ layout; phần trang trí theo tọa độ chuẩn hóa và vùng an toàn để dùng được trên nhiều layout.
- Catalog hiện có 62 frame và 93 layout từ 1 đến 20 ảnh. Mục tiêu sản phẩm là nhiều mẫu trang trí và nhiều bố cục riêng biệt; không có yêu cầu 60 frame được suy ra từ ba palette nhân số layout.
- Chụp liên tiếp hiện tối đa 9 tấm/lượt; layout 16–20 ô có thể điền từ nhiều lượt chụp, ảnh tải lên hoặc tái sử dụng ảnh. Số ô và số tấm mỗi lượt là hai cấu hình khác nhau.

## Nghiệm thu

- Mỗi frame kết hợp được với mọi layout được công bố hỗ trợ, không tạo hàng loạt bản ghi frame-layout.
- Đổi frame sau khi crop vẫn giữ nguyên assignment và transform; đổi sang layout khác không thay frame.
- Nhóm 16–20 hiển thị layout 16 và 20 ảnh; nhiều layout 4 ảnh có thumbnail khác nhau.
- Preview/export dùng cùng frame và layout; theme sáng/tối không tác động lựa chọn hoặc màu thành phẩm.
- Thao tác chạm, bàn phím và trạng thái chọn hoạt động ở cả hai ngôn ngữ, không tràn ngang toàn trang; chỉ các dải card được cuộn ngang.
