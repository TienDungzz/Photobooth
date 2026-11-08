# Đánh giá thiết kế từ thư mục example

## 1. Phạm vi đã xem

Đã xem toàn bộ 35 file: 34 JPG và một WebP logo Photobooth. Hai file a7060cfdd7d0e4b019a02932add701cc.jpg và bản tên có “(1)” trùng byte, nên có 33 JPG khác nhau. Đã xem tổng thể bằng contact sheet và mở lớn các mẫu tiêu biểu để kiểm tra chi tiết.

Phần lớn JPG là poster giới thiệu nhiều mẫu, ảnh mockup hoặc ảnh chụp màn hình trình thiết kế. Cần phân biệt **tờ photostrip/thành phẩm nằm trong ảnh** với nền poster, tiêu đề quảng cáo, giao diện phần mềm, watermark và thông tin tác giả. Các ảnh này là tài liệu tham khảo, chưa phải asset frame trong ứng dụng.

## 2. Nhận định về kho hiện tại

Đánh giá “basic” là đúng. Kho hiện tại có nhiều tổ hợp hình học và phiên bản họa tiết, nhưng chưa có độ hoàn thiện nghệ thuật tương đương ảnh mẫu:

- Frame chủ yếu là nền phẳng, motif nhỏ lặp quanh mép và một dòng chữ cuối trang. Thay màu/mật độ/vị trí motif chưa tạo ra một concept hoàn chỉnh.
- Layout mở rộng chủ yếu từ lưới và tỷ lệ; số lượng hình học khác nhau không đồng nghĩa với số thiết kế được art direction riêng.
- Chưa có texture giấy/vải/film rõ, sticker minh họa chi tiết, typography theo chủ đề, viền trang trí cho từng ô và tương tác lớp trước/sau ảnh.
- Mask hiện mới là hình chữ nhật, bo góc và ellipse; chưa có tim, sao, mây, gợn sóng, tem thư hoặc mép giấy xé.

Vì vậy, **72 frame và 120 layout là quy mô catalog basic**, không phải bằng chứng về chất lượng thiết kế hay 72 mẫu artwork hoàn chỉnh. Không giải quyết phản hồi này bằng cách tiếp tục nhân palette hoặc thêm lưới tự động.

## 3. Những nhóm thiết kế đọc được từ ảnh

| Nhóm | Tham khảo | Điểm đáng học |
| --- | --- | --- |
| Pastel, nơ và ren | [Mẫu tím](../example/2e9ac29382ceaa0598ae98a86c6e076c.jpg), [mẫu viền cầu kỳ](../example/a7060cfdd7d0e4b019a02932add701cc.jpg) | Nơ có kích thước lớn, nhiều lớp viền, mask tim/viền lượn, hình minh họa đặt có chủ đích giữa các ảnh |
| Y2K và sticker collage | [Mẫu holographic](../example/52daf1af89a2a4631e2de4e230fd648c.jpg), [mẫu collage nhiều màu](../example/a75b3eb0fe37c6acf6980d12b30ce72f.jpg) | Typography đậm, hình sao, chrome/holographic, nhãn dán nổi, mask không đều, chất liệu và độ tương phản mạnh |
| Scrapbook xanh | [Mẫu xanh navy](../example/7531ee34c699e79bc2d62f31ce7838a5.jpg) | Giấy xé, kẹp giấy, chuỗi hạt, nét vẽ tay, nhãn chữ và bố trí bất đối xứng; chi tiết bám theo từng ô ảnh |
| Vintage, ticket và cinema | [Vé cinema](../example/970e5e69d590e67a4d6674d8c17a699e.jpg), [film đỏ](../example/6137075e842bc6e025e12e25dca8e7cb.jpg) | Mép vé/tem, thông tin vé, barcode trang trí, perforation, thứ bậc chữ và tỷ lệ phần ảnh/phần nội dung được thiết kế riêng |
| Romantic và wedding | [Bộ đỏ romantic](../example/81fd89a83169e395540cd35dcde593bf.jpg), [wedding botanical](../example/3615c44314d0921ba57bc820ac500a0b.jpg) | Bảng màu có chủ đề, viền ren, nơ, hoa, cấu trúc oval/tim/tem; chữ và khoảng trắng thuộc bố cục tổng thể |
| Dark, ornate và seasonal | [Viền ornamental](../example/3529c6e66f654024810919b7dfbba88b.jpg), [Halloween](../example/e972efed8611bf67d9434e5e2203d7be.jpg) | Tương phản sáng/tối, viền có đường nét riêng, minh họa chủ đề và trang trí chồng lên mép ô ảnh |

Đây là mô tả những gì nhìn thấy, không phải xác nhận nguồn gốc hoặc giấy phép của từng mẫu. Khi sản xuất nội dung cần tạo artwork riêng hoặc có asset được phép sử dụng; không đưa nguyên poster, watermark, ảnh người mẫu hay nhân vật có sẵn vào catalog như tác phẩm của dự án.

## 4. Yêu cầu thiết kế cần nâng cấp

### Frame phải là một bộ artwork

Mỗi bộ cần có concept, palette, chất liệu, hệ chữ, vùng tiêu đề/footer, viền ô và bộ sticker đồng bộ. Sticker có kích thước, vị trí và thứ tự lớp theo bố cục, không chỉ được rải đều trên hai cạnh giấy.

Cần phân biệt lớp nền/texture, lớp dưới ảnh, đường viền theo mask, sticker chồng mép ảnh và lớp chữ. Có kiểm soát vùng che ảnh, đặc biệt ở các vị trí dễ đặt khuôn mặt. Trang trí phải đủ rõ ở kích thước preview và bản xuất, không chỉ thấy khi phóng lớn.

### Layout phải có thiết kế hình học và khoảng trống có chủ đích

Bổ sung mask tim, sao, cloud/scallop, tem thư, giấy xé và hình tự do từ path tin cậy. Không chỉ thay mask cho toàn bộ lưới: cần thiết kế số ảnh, kích thước, khoảng cách, nhịp điệu, vị trí nhãn và vùng nội dung cùng nhau.

Phân biệt một strip với poster trưng bày nhiều strip. Tỷ lệ header/footer, chỗ cho nơ/sticker và vùng chữ lớn phải được xác định trước khi gán ô ảnh. Không lấy toàn bộ ảnh quảng cáo làm một layout duy nhất.

## 5. Hướng nâng cấp mô hình kỹ thuật

Giữ Frame và Layout độc lập như yêu cầu đã chốt; không quay lại catalog nhân frame × layout.

- **Layout** sở hữu hình học ô, clipping path/mask và vùng an toàn dành cho nội dung/trang trí.
- **Frame** sở hữu artwork, texture, typography và recipe trang trí. Viền/sticker có thể neo theo góc, cạnh hoặc điểm đặc biệt của slot, ngoài các layer ở cấp trang.
- **Renderer** cần hỗ trợ thứ tự layer rõ ràng, clip path cùng contour viền, opacity/rotation và asset raster/vector do dự án quản lý.
- Một frame có thể có art direction khác nhau cho nhóm single, strip, collage và dense grid. Đây là cách thích ứng artwork theo layout, không phải các frame mới để tăng số lượng.
- Với 16–20 ô, giảm mật độ chi tiết hoặc chọn recipe đã được duyệt; không ép artwork dành cho strip ba ảnh vào mọi lưới bằng phép kéo giãn.
- Đổi frame vẫn giữ layout/crop. Đổi layout mới remap ô. Artwork không được tự thay layout hoặc âm thầm đổi mask người dùng đã chọn.

Các điểm trên là hướng cần triển khai tiếp; lượt đọc tài liệu tham khảo này chưa nâng cấp renderer hoặc tạo bộ artwork mới.

## 6. Tiêu chí duyệt trước khi mở rộng số lượng

1. Nhìn thumbnail nhận ra được concept của bộ, không chỉ nhận ra màu.
2. Có artwork/typography/texture được thiết kế, không chỉ motif nhỏ lặp và nhãn “Photobooth” chung.
3. Mask và viền phù hợp nhau; sticker chồng lớp có chủ đích, không che vùng ảnh quan trọng ngoài thiết kế.
4. Thử với ảnh người thật có quyền sử dụng hoặc ảnh tổng hợp; placeholder phong cảnh không đủ để nghiệm thu crop và độ che mặt.
5. Preview và PNG/JPEG xuất ra thống nhất về mask, layer, font, nét viền và alpha.
6. Thử ở các nhóm layout được công bố hỗ trợ, trên cả tờ strip hẹp và bố cục nhiều ô; không chấp nhận artwork bị kéo méo.
7. Biến thể màu hoặc số ô không được tính như concept mới. Số lượng không thay thế chất lượng thiết kế.

Thứ tự hợp lý là làm một nhóm mẫu chủ lực đạt chất lượng tham khảo, đối chiếu trực tiếp, rồi mới mở rộng cả thư viện. Các mẫu basic có thể giữ ở nhóm tối giản; không dùng chúng đại diện cho toàn bộ định hướng nghệ thuật.
