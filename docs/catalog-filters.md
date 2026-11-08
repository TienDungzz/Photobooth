# Bộ lọc gọn và custom dropdown

## Điều khiển đang hiển thị

- Frame: chỉ có **Bộ sưu tập**. Có tất cả, artwork nổi bật, cơ bản và các chủ đề hiện có.
- Layout: chỉ có **Số ảnh** và **Phong cách bố cục**. Đã bỏ hoàn toàn ô nhập tìm kiếm, state query và logic so khớp từ khóa; không có bộ lọc phụ mới thay thế.
- Phong cách gồm **Cơ bản**, **Hình đặc biệt**, **Phá cách**. Cơ bản là ô rect/rounded không xoay, không treatment; hình đặc biệt là các mask như tim/tròn/sao/vòm; phá cách gồm góc xoay, treatment hoặc blob/cutout/torn/apple. Mỗi layout thuộc đúng một nhóm.
- “Xóa bộ lọc” chỉ hiện khi danh mục đó có điều kiện đang bật. Xóa lọc không thay frame/layout đã chọn hoặc ảnh/crop, và không xóa bộ lọc danh mục còn lại.

## Kết hợp bộ lọc

Số ảnh là điều kiện chính xác 1–20, kết hợp với phong cách. Không có kết quả vẫn hiện hướng dẫn xóa/đổi điều kiện; lựa chọn thiết kế hiện tại không bị đổi tự động. Frame lọc độc lập theo bộ sưu tập. Toàn bộ kết quả phù hợp hiển thị cùng lượt, không có chức năng tìm kiếm catalog.

## Dropdown tùy chỉnh

`src/shared/components/Dropdown.tsx` là select-only combobox với popup listbox và option có trạng thái chọn. Không sử dụng thẻ select trong bộ lọc frame/layout; các select camera và định dạng ảnh xuất thuộc luồng khác.

Popup được portal ra body, có max-height và cuộn riêng, chọn hướng trên/dưới theo không gian còn lại để không bị cắt bởi sidebar sticky. Vị trí bám nút khi khung cha cuộn; đóng khi nút rời viewport. Màu/viền/bóng dùng semantic token cho cả light và dark trung tính.

Bàn phím: mũi tên, Home/End di chuyển; Enter/Space chọn; Escape hủy mở; Tab đi tiếp và đóng. Gõ nhanh chữ/số đưa active option tới nhãn phù hợp, có bỏ dấu khi so khớp. Chỉ click/Enter/Space mới đổi giá trị. Nhấn ngoài đóng popup; chọn xong trả focus về nút. Các listener được gỡ khi đóng/unmount.

Không phân trang catalog; toàn bộ kết quả phù hợp vẫn nằm trong grid cuộn desktop hoặc dải cuộn ngang mobile.
