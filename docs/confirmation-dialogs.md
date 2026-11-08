# Xác nhận thao tác bằng dialog custom

Ứng dụng không dùng `window.confirm`, `window.alert` hoặc `window.prompt` cho thao tác trong trang. `ConfirmDialog` dùng HTML dialog ở top layer với giao diện, màu và bản dịch của ứng dụng; không phải hộp thoại JavaScript của trình duyệt.

- Xóa ảnh khỏi khay: chỉ sau khi xác nhận mới xóa ảnh, giải phóng URL và bỏ ảnh khỏi các ô đang dùng. Hủy/Escape/nút đóng giữ nguyên dữ liệu.
- Tạo kỷ niệm mới: chỉ sau khi xác nhận mới xóa ảnh/chỉnh sửa và trở về Studio. Điều hướng khỏi trang thành phẩm đóng yêu cầu xác nhận cũ.
- Focus mặc định ở Hủy. HTML dialog giữ focus trong hộp và làm nền inert; khóa cuộn nền khi mở. Khi đóng, focus về nút mở, hoặc khay ảnh/main nếu nút cũ đã bị xóa.
- Có `role=alertdialog`, tiêu đề và mô tả liên kết bằng ID riêng. Dùng token light/dark; nút thao tác phá hủy có màu cảnh báo. Nền bấm bên ngoài không tự xác nhận.
- Cảnh báo đóng/reload tab có ảnh chưa lưu vẫn dùng `beforeunload` do trình duyệt quản lý. Trình duyệt không cho thay hộp này bằng UI tùy chỉnh; đây là cơ chế bảo vệ phiên riêng, không phải confirm trong ứng dụng.

Nguồn: `src/shared/components/ConfirmDialog.tsx` và `.css`. Kiểm thử `tests/e2e/confirmation.spec.ts` thực hiện hủy, Escape, khôi phục focus, xác nhận xóa và reset trên Chromium desktop/mobile, đồng thời chặn/phát hiện hộp thoại native ngoài ý muốn.
