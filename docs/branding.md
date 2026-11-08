# Logo và favicon

Biểu tượng dựa trên ảnh người dùng cung cấp `example/photobooth.webp`: máy ảnh, ống kính, dải phim và tia sáng. Dựng lại bằng đường SVG, bỏ toàn bộ chữ PHOTOBOOTH và nền giấy. Ảnh tham khảo gốc được giữ nguyên.

- `public/brand/logo.svg`: bản vector nền trong suốt, nguồn chỉnh sửa chính.
- `public/brand/logo.png`: bản 512 × 512 px có alpha, dùng làm fallback cho logo trên header.
- `public/favicon.svg`: bản riêng cho kích thước nhỏ, chỉ giữ thân máy ảnh và vòng ống kính nét rose trên nền ngà bo góc. Không thu nhỏ các chi tiết cuộn phim của logo header.
- `public/favicon.ico`: chứa các kích thước 16, 32, 48 px.
- `public/apple-touch-icon.png`: biểu tượng 180 × 180 px cho shortcut thiết bị Apple.

Header hiển thị biểu tượng bên cạnh wordmark “photobooth.” và tagline Việt/Anh. Nút có accessible name Photobooth và dẫn về Home. File logo/favicon vẫn không chứa chữ. Logo đổi thành nét sáng trong dark mode, không thêm bản bitmap trùng lặp. Kích thước biểu tượng 56 px desktop, 44 px mobile; chữ thu gọn trên mobile.

Chạy `npm run branding:prepare` sau khi sửa SVG để tạo lại PNG/ICO bằng Sharp. `brand/logo.svg` và `favicon.svg` là hai nguồn riêng, script không ghi đè favicon bằng logo chi tiết. Link icon dùng phiên bản query để trình duyệt tải lại khi cập nhật. Không dùng ImageGen hoặc API tạo ảnh trong bước này; đây là tài nguyên vector do code dựng lại theo mẫu.

Kiểm chứng: đã xem PNG và header trên bản chụp; verify đạt, bao gồm kiểm tra asset thừa/trùng và bundle budget. Các ca E2E Home/theme kiểm tra desktop/mobile.
