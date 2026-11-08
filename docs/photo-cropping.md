# Căn ảnh bằng kéo và thu phóng

Các công cụ ô ảnh nằm trong một popup duy nhất với tiêu đề chung **Chỉnh sửa ảnh / Edit photo**, mở bằng cách bấm ô đã có ảnh trên preview. Đã bỏ nút mở chỉnh sửa ở sidebar, thao tác đổi ảnh với ô khác và nút chụp lại ô này. Kéo ảnh trên preview không tự mở popup. Vùng cắt ảnh hiển thị trực tiếp khi mở popup, không cần bấm Cắt ảnh hoặc mở dialog con. Popup có zoom −/+, xoay, lật, căn chỉnh lại và bỏ ảnh khỏi ô.

Dialog Cắt ảnh cung cấp vùng xem trước lớn trên nền tối, đường viền theo mask đang chọn và làm tối phần nằm ngoài mask. Dùng `coverGeometry` và `slotPath` chung với renderer để giữ cùng tỷ lệ crop, xoay và lật; không tạo file ảnh mới hoặc nén ảnh khi đang chỉnh.

- Kéo trực tiếp bằng chuột hoặc cảm ứng để đổi vị trí. Delta kéo được quy đổi qua kích thước canvas, góc xoay ảnh và phần ảnh dư, giới hạn offset trong [-1, 1].
- Zoom từ 100% đến 300%; nút −/+ thay đổi 10%, slider thay đổi 1%. Track/thumb dùng token light/dark.
- Điều chỉnh trong dialog là bản nháp. Áp dụng mới cập nhật transform vào ô; Hủy, đóng hoặc Escape giữ nguyên transform cũ. Căn chỉnh lại chỉ đặt lại bản nháp.
- Có thể focus canvas và dùng phím mũi tên để dịch ảnh. Dialog có tên/mô tả, khóa cuộn nền, quản lý focus bằng HTML dialog và trả focus về nút Cắt ảnh khi đóng.
- Mọi thay đổi crop/zoom/xoay/lật trong popup là bản nháp, lưu bằng Áp dụng. Hủy, nút đóng hoặc Escape bỏ thay đổi và trả focus về ô ảnh. Khi bỏ ảnh khỏi ô, popup đóng. Camera chỉ mở từ nút chung ở Studio. Ảnh gốc của thư viện không thay đổi, các ô khác giữ crop riêng. Không có popup lồng nhau.

Nguồn: `CropDialog.tsx`, `CropDialog.css`, `ZoomControl.tsx`, `Editor.tsx`. E2E `crop.spec.ts` kiểm tra bấm ảnh mở đúng một popup có preview, hủy/áp dụng, kéo thay đổi pixel, zoom, mở lại giữ crop, khôi phục focus và không còn nút sidebar/đổi ô; chạy trên Chromium desktop/mobile. Luồng giữ transform khi đổi frame và tải PNG/JPEG cũng được kiểm tra hồi quy. Chưa nghiệm thu Safari/Firefox hoặc thao tác cảm ứng trên thiết bị thật.
