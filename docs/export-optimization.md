# Tối ưu ảnh tải xuống

Ảnh được render ở kích thước đã chọn, sau đó tối ưu và tạo Blob trước khi trình duyệt tải xuống. Toàn bộ xử lý diễn ra trên thiết bị; không gửi ảnh đến dịch vụ nén bên ngoài.

- Mặc định JPEG chất lượng 92%, mã hóa trực tiếp từ canvas để tránh nén mất dữ liệu nhiều lần. Giữ nguyên cạnh dài 2400 hoặc 1200 px; không tự giảm kích thước để ép dung lượng. JPEG dùng nền của frame.
- PNG giữ nguyên pixel, alpha và metadata màu. Ghép các chunk IDAT và nén lại luồng DEFLATE bằng CompressionStream, tính lại CRC. Chỉ dùng kết quả nếu nhỏ hơn bản gốc. Không giảm bảng màu hay độ sâu màu.
- Trình duyệt thiếu API nén hoặc nén PNG thất bại sẽ tải bản PNG gốc hợp lệ. Không đổi đuôi file hoặc MIME để che việc đổi định dạng.
- Nút tải khóa trong suốt quá trình tạo và tối ưu ảnh. Canvas xuất được giải phóng sau khi tạo Blob; URL kết quả được thu hồi khi thay file hoặc rời trang.

JPEG có nén mất dữ liệu nhẹ nên không cam kết giống từng pixel. Người cần bản không mất dữ liệu hoặc nền trong suốt có thể chọn PNG. Không cam kết một mức dung lượng cố định: ảnh nhiều chi tiết và nhiễu sẽ khó nén hơn ảnh nền phẳng.

## Kiểm chứng

`tests/e2e/export-optimization.spec.ts` kiểm tra kích thước, PNG giải mã giống từng pixel, alpha 0/128, JPEG PSNR trên 35 dB và dung lượng giảm trên mẫu gradient có chữ. Trong Chromium thử nghiệm, mẫu 900 × 1200 px giảm từ PNG canvas 1.099.789 byte xuống PNG 471.234 byte (57%) hoặc JPEG 18.573 byte. Đây là mẫu tổng hợp, không đại diện cho mọi ảnh photobooth hay thiết bị.

Các ca E2E tải file PNG/JPEG thật tiếp tục kiểm tra kích thước 1800 × 2400, artwork, bố cục cửa sổ và cuống vé. Chưa nghiệm thu chất lượng trên Safari/Firefox hoặc đo p95 export trên điện thoại thật.
