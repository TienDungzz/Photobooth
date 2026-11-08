# Trạng thái triển khai — 2026-11-08

Yêu cầu frame/layout đã được hiệu chỉnh theo ảnh tham chiếu của người dùng; xem [frame và layout độc lập](frame-layout-selection.md). Frame chỉ là mẫu trang trí, layout chỉ là hình học ô ảnh; renderer nhận Design kết hợp tạm thời.

## 1. Phần đã có

**Catalog hiện tại:** sau đợt tinh gọn, đã bổ sung 3 bộ/6 layout phá cách, tiếp theo 3 bộ/4 layout [ornamental, Halloween, wedding và vé](occasion-designs.md). Hiện có **42 frame/70 layout**, gồm 13 bộ artwork nổi bật và 29 frame cơ bản. Giữ đủ lựa chọn 1–20 ảnh, không khôi phục các biến thể đã loại. Nguồn atlas, WebP/thumbnail và prompt vẫn đầy đủ; [manifest và contact sheet đợt tinh gọn](catalog-curation.md) giữ nguyên làm lịch sử.

Home `/` đã tách riêng cho banner/giới thiệu/CTA; Studio `/setup` chứa frame/layout trái, preview giữa, ảnh và công cụ phải, có thanh hành động đáy. Route preview `/setup/preview` có guard khi chưa đủ ảnh. Điều hướng giữ state phiên, rời Setup đóng camera; chi tiết tại [Home và Setup](home-and-setup.md). UI sáng dùng rose, UI tối dùng xám than trung tính; Noto Serif đóng gói cục bộ hỗ trợ tiếng Việt.

Header và nội dung chính có cùng max-width 1760px. Frame có tìm kiếm và dropdown Bộ sưu tập; layout có tìm kiếm, dropdown Số ảnh và Phong cách bố cục. Các dropdown là combobox tùy chỉnh có bàn phím, popup portal và max-height; tìm kiếm hỗ trợ metadata màu/tỷ lệ/mask/treatment thay cho các bộ lọc phụ. Hiển thị toàn bộ kết quả, giữ xóa lọc, trạng thái rỗng và hiện mục đang chọn. Desktop dùng grid cuộn dọc có max-height và ba cột sticky. Xem [bộ lọc gọn](catalog-filters.md).

- React 19, TypeScript, Vite; npm và package-lock.json; Node >=22.12.
- Bộ chọn responsive gồm 42 frame và 70 layout độc lập từ 1–20 ảnh. Các bộ mới được hiển thị trước; có lọc artwork/cơ bản, các mask hữu cơ/cắt tự do/giấy xé/quả táo/viền lượn. Treatment hỗ trợ browser, Polaroid và cuống vé. Không tính tổ hợp frame-layout thành frame mới.
- Frame, thumbnail và export dùng chung renderer Canvas. Artwork tải cùng origin, cache theo URL; preview/export chờ artwork và font, có thông báo lỗi tải. Mask dùng chung đường Path2D cho ảnh và viền chọn; không thay đổi hình học layout khi đổi frame.
- Upload JPEG/PNG/WebP tĩnh, xác nhận signature/MIME/extension, đọc kích thước header trước decode, giới hạn 20 MiB và 40 MP/file, chuẩn hóa orientation và resize cạnh dài tối đa 2400 px.
- Tối đa 30 ảnh và 32 MP ảnh làm việc/phiên; decode tuần tự, dữ liệu ảnh không lưu vào storage. Ảnh có alpha được chuẩn hóa trên nền trắng khi nhập; transparency thành phẩm áp dụng cho nền ngoài slot.
- Khay ảnh, gán ô, kéo/slider, zoom/xoay/mirror, reset, đổi với ô trước và xóa ảnh. Đổi frame giữ layout/crop; đổi layout giữ frame/khay và remap các ô.
- Camera chọn thiết bị/trước-sau, hẹn giờ 0–10 giây, burst 1–9 tấm, khoảng nghỉ 1–10 giây, pause khi tab ẩn, dừng/resume, chọn ảnh kết quả và chụp lại ô. Stream chỉ xin video và được dừng khi đóng/đổi.
- Renderer dùng chung preview/export; PNG/JPEG, cạnh dài 1200/2400 px, tùy chọn PNG nền ngoài ô trong suốt, download và mở ảnh đã tạo.
- i18next/react-i18next với Việt/Anh; theme sáng/tối/system, bootstrap trước React và lưu thiết lập có validation/fallback.
- ESLint, Stylelint, Prettier, Vitest, Playwright; workflow GitHub Actions kiểm tra/build/E2E, chưa được chạy trên GitHub trong phiên làm việc này.

## 2. Tổ chức mã hiện tại

`src/domain` giữ kiểu/composition; `src/engine` giữ renderer; các feature gồm frame-catalog, frame-preview, photo-library, camera, capture-session, editor và export-photo. Feature có API `index.ts`; `app` điều phối và chứa dialog thiết lập. Style BEM đặt theo app/feature; token và primitive dùng chung ở shared.

Catalog hiện nằm tập trung tại `src/features/frame-catalog/catalog.ts`, locale tại `src/shared/i18n/locales/{vi,en}.json`. Frame và Layout là hai catalog độc lập; composeDesign tạo Design kết hợp tạm để render. Schema thực thi tại `src/domain/types.ts` là nguồn chuẩn cho code hiện tại; các ví dụ background/overlay, namespace locale và tên field trong tài liệu thiết kế vẫn là hướng mở rộng. Thứ tự slot trong mảng là thứ tự layer và assignment; không có required=false trong bản hiện tại, mọi ô đều bắt buộc.

## 3. Kiểm chứng

Đợt sửa sidebar sticky: bỏ giới hạn chiều cao/scroll container ở cả hai sidebar, giữ max-height riêng của grid frame/layout. CSS/format/build đạt; 6 E2E layout/dropdown/lọc desktop-mobile đạt. Có kiểm tra cuộn trang thực sự đưa preview và sidebar phải về top 24px, hai sidebar có max-height none/overflow visible, và grid vẫn cuộn độc lập.

Đợt bộ lọc gọn/custom dropdown: verify đạt với 29 unit test, 5 checker test, type/lint/format/i18n/build/budget. Lượt E2E toàn bộ có 40 ca đạt và 2 ca popup lỗi do cuộn trang; đã sửa định vị và chỉ cuộn nội bộ menu, chạy lại 4 ca dropdown/lọc desktop-mobile đều đạt (bao gồm hai ca lỗi), đủ 42 ca đã được xác nhận. Có kiểm tra 3 dropdown thay cho select, gõ nhanh số/chữ bỏ dấu, Home/End/mũi tên, Escape không commit, nhấn ngoài trả focus và popup nằm trong viewport. Đã xem screenshot desktop/mobile. Các select ở camera/export không thuộc thay đổi này.

Đợt ornamental/occasion: `verify` đạt với 29 unit test, 5 checker test và build/budget; 40 E2E desktop/mobile giả lập đạt, bao gồm dark mode trung tính. Đã rà ảnh dựng 4 layout, kiểm tra cuống vé và pixel ảnh xuất, vùng giấy/cuống sau xoay, path viền lượn và giữ crop khi đổi frame. 26 WebP không có dư/trùng; JS gzip khoảng 125 KB. Còn 4 cảnh báo heuristic vòng đời tài nguyên như trước; ảnh review và nguồn tham khảo ở [occasion designs](occasion-designs.md).

Đợt phá cách: verify đạt với 28 unit test, 5 checker test và build/budget; toàn bộ 34 E2E đạt. Sau rà ảnh dựng, chỉnh thêm cuống/lá táo, khoảng trống tiêu đề và vị trí sticker zine; verify cùng 4 E2E chuyên biệt chạy lại đạt. Kiểm tra xuất cửa sổ trình duyệt giữ crop khi đổi frame, PNG đúng kích thước/màu và mask có tâm trong/góc ngoài; đã xem ảnh dựng 6 layout. 20 asset WebP không có dư/trùng, JS gzip khoảng 123 KB; còn 4 cảnh báo heuristic vòng đời tài nguyên như trước.

Đợt tinh gọn catalog: `verify` đạt với 27 unit test, 5 checker test và build/budget; toàn bộ 30 E2E desktop/mobile giả lập đạt. Đã xem 10 contact sheet trước và 5 contact sheet sau khi tinh gọn; bản WebP lưu trong docs và danh sách ID giữ/bỏ trong manifest. Không phát hiện asset public dư/trùng. Home lấy số lượng từ catalog, thêm lệnh `npm run catalog:review -- current` để rà soát lần sau.

Đợt sửa ô tròn/oval: nhóm `ellipse-*` giữ đường kính bằng nhau theo pixel đầu ra, căn giữa từng hàng và đổi tên hiển thị thành Tròn/Circle; `oval-trio` chuyển sang strip chân dung để không bị ép dẹt. 26 unit test và 5 checker test đạt; 6 E2E liên quan đạt trên desktop/mobile giả lập, gồm đo đường kính ngang/dọc trên thumbnail 150 px và PNG 600 px, xuất ảnh và bố cục editor. Đã rà ảnh dựng nhóm Circle 1–5.

Đợt bổ sung ballet/hoa ép/biển/cherry: `npm run verify` đạt với 25 unit test, 5 checker test và build/budget; 28 E2E đạt trên Chromium desktop/mobile giả lập. Đã xem ảnh dựng đủ 8 theme (7 artwork và cinema). Checker không phát hiện asset dư/trùng trong 14 WebP; vẫn có 4 cảnh báo heuristic vòng đời đã nêu. Có hồi quy đếm đúng 7 bộ nổi bật/73 cơ bản và xuất PNG giữ hình học ảnh khi đổi frame. Prompt đầy đủ ở [artwork prompts expansion](artwork-prompts-expansion.md).

Đợt artwork 2026-11-08: `npm run verify` đạt (23 unit test, 5 checker test, type/lint/format/i18n/build/budget). 26 ca E2E đã đạt trên Chromium desktop/mobile giả lập: 24 ca đạt trong lượt toàn bộ; 2 ca xuất PNG hình tim chạy lại đạt sau khi sửa lỗi làm tròn cạnh dài 2399→2400 px và cho phép sai số lượng tử hóa JPEG trong kiểm tra màu. Đã rà ảnh dựng 4 bộ thiết kế, kiểm tra đường mask, lỗi tải artwork, bộ lọc mới và giữ crop khi đổi frame. Không có tài nguyên public dư/trùng; JS gzip khoảng 120 KB, CSS khoảng 7 KB. Còn 4 cảnh báo heuristic vòng đời camera/timer/object URL. Cần kiểm tra chân dung thật và chất lượng in trước khi phát hành thương mại.

Đợt tách Home/Setup: verify đạt với 23 unit test và 5 test checker; 20 E2E desktop/mobile giả lập đạt trên server riêng cổng 5197. Kiểm tra Home không chứa bộ chọn/file input, CTA vào Setup, Back/Forward giữ thiết kế, rời Setup đóng camera và mở preview thiếu ảnh trả về Setup. Đã rà screenshot Home/Setup desktop/mobile; preview desktop co theo chiều cao để không bị thanh đáy che. Noto Serif Latin/Vietnamese được bundle cục bộ, tổng font khoảng 118 KB; JS gzip khoảng 117 KB, CSS gzip khoảng 7 KB. Còn 4 cảnh báo heuristic vòng đời tài nguyên, không có lỗi kiểm tra.

Đợt mở rộng kho và chiều rộng trang: verify đạt với 23 unit test và 5 test checker; 16 E2E desktop/mobile giả lập đạt. Có test riêng cho header/main bằng nhau ở 1920px (cùng rộng 1760px), lọc kết hợp không phân biệt dấu, không thay lựa chọn khi hết kết quả và hiển thị thêm 24→48→72 frame. Budget toàn bộ JS gzip khoảng 115 KB, CSS gzip khoảng 5 KB; đây là số đo bundle, không phải baseline runtime trên thiết bị thật.

- Unit test: catalog/hình học, assignment/đổi frame, signature/kích thước header, locale/preferences và lịch chụp/cancel/pause.
- 5 bài test checker với fixture độc lập: BEM, tài nguyên thừa/trùng, ngoại lệ, strict và tín hiệu hiệu năng.
- E2E Chromium desktop và viewport iPhone giả lập: chọn frame/layout độc lập, nhóm 16–20, locale/theme/reload, upload hợp lệ và giả file ảnh, crop, PNG/JPEG đúng kích thước, network không upload ảnh, burst 4 tấm và đóng dialog camera.
- Đã xem screenshot gallery/editor desktop và gallery mobile từ test để rà bố cục; screenshot và trace nằm trong test-results, không commit.
- Budget tự động tổng toàn bộ chunk JS gzip <=250 KiB và CSS gzip <=50 KiB, gồm cả chunk lazy. Chưa đo p95 thao tác/export hoặc bộ nhớ trên thiết bị tham chiếu.

Số bài test và kết quả build mới nhất lấy từ lệnh verify/E2E, không coi tài liệu này là báo cáo bất biến sau những thay đổi mã tiếp theo.

Sau đợt hiệu chỉnh frame/layout: verify đạt với 20 unit test, 5 test checker; 12 E2E đạt trên Chromium desktop/mobile giả lập. Đã bổ sung hồi quy cho việc đổi frame giữ crop, đổi layout giữ frame/khay ảnh, nhóm 16–20 và sidebar không tràn/chồng lên preview ở mobile. Checker vẫn có 4 cảnh báo heuristic vòng đời tài nguyên, không có lỗi; camera thật/Safari iOS vẫn chưa được kiểm chứng.

## 4. Giới hạn và việc cần kiểm chứng tiếp

- Chưa kiểm tra webcam thật, Safari iOS/macOS, Chrome Android trên thiết bị thật, camera bận hoặc tải file theo cơ chế riêng của từng hệ điều hành. Viewport iPhone trên Chromium không tương đương Safari iOS.
- Chưa triển khai hosting, domain, SSL/HSTS và rollback thực tế. `public/_headers` là mẫu cho hosting hỗ trợ cú pháp đó; Vite dev/preview không tự áp dụng file này.
- CSP mẫu cho phép inline style phục vụ tọa độ slot/transform React; script vẫn chỉ cùng origin. Cần kiểm tra header thực tế và luồng camera/download tại staging khi chọn hosting.
- Chưa có checker unused code theo dependency graph, checker security tổng quát hoặc validator catalog độc lập `.mjs`; catalog đang được kiểm chứng bằng unit test.
- Checker performance vẫn cảnh báo timer/camera/object URL hợp lệ để review. Không thêm suppression nhằm làm strict xanh; cleanup có trong controller/component nhưng vẫn cần profiling thiết bị.
- Chưa có pinch-to-zoom, undo/redo tổng quát, khôi phục phiên sau reload, PWA/offline, cloud, tài khoản, in hoặc video.
- Bộ frame procedural là nội dung chạy được; các bộ hình minh họa/theme sự kiện chuyên biệt cần quy trình tác giả và duyệt nội dung riêng.

Các docs yêu cầu/tiêu chuẩn vẫn là mục tiêu nghiệm thu. Nếu chúng mô tả phần chưa có, dùng danh sách giới hạn này và code hiện tại để phân biệt với tính năng đã hoàn thành.
# Tối ưu tải ảnh

Luồng tải ảnh có bước tối ưu trước khi tạo link tải: JPEG mặc định chất lượng 92%, PNG nén lại lossless bằng CompressionStream và chỉ thay file nếu nhỏ hơn. Không giảm kích thước đã chọn; giữ alpha của PNG. Xem [chi tiết và giới hạn kiểm chứng](export-optimization.md).


Kiểm chứng tối ưu export: npm run verify đạt (29 unit test, 5 checker test, build và bundle budget); 10 ca E2E export trên desktop/mobile đạt. Vẫn có 4 cảnh báo heuristic vòng đời tài nguyên đã biết. Mẫu PNG thử nghiệm giảm 57% và pixel giải mã không đổi; tỷ lệ thực tế tùy ảnh.


## Thi?t k? to?n trang ??c l?p

B? sung Memory passport, Our mixtape, The cover story v? ba layout ?nh ch?nh?ph? ri?ng. Kh?ng d?ng atlas ho?c recipe sticker b?n g?c. Catalog hi?n 45 frame / 73 layout. ?? xem render v? ki?m tra 4 ca E2E desktop/mobile (thi?t k? m?i, gallery/locale/theme). Xem [thi?t k? v? b?n render](signature-designs.md).

## Graphic: frame và layout khác cấu trúc cũ

Bổ sung Comic day, On the record, Memory blueprint và 4 layout riêng (3/2/4/4 ảnh). Tổng 48 frame / 77 layout. Không dùng atlas; có thumbnail riêng cho comic và vinyl, ảnh tròn giữ đúng tỷ lệ vật lý. Đã xem bản render, verify đạt và 6 ca E2E catalog/render/gallery desktop/mobile đạt. Xem [thiết kế Graphic](graphic-designs.md).


## Preview desktop lớn theo viewport

Bỏ giới hạn preview 510px ngang/620px dọc và giảm khoảng trừ chiều cao từ 320px xuống sticky top + 110px. Frame giữ nguyên aspect ratio, chừa caption và thanh đáy. Kiểm tra ở 1920x1080: photostrip cao hơn 800px, rộng hơn 300px; layout ngang rộng hơn 700px; không đè thanh đáy hoặc tràn ngang. CSS/format/build đạt; 3 ca E2E đạt, 1 ca chỉ dành desktop được skip trên mobile.


## Craft: hóa đơn, vải chần và quỹ đạo

Thêm 3 frame và 4 layout riêng, nâng catalog lên 51 frame / 81 layout. Có thumbnail riêng; giữ frame/layout độc lập, giới hạn cạnh dài tham chiếu 2400px và ảnh tròn đúng tỷ lệ. Đã xem render; verify đạt (29 unit, 5 checker, build/budget), 6 E2E catalog/gallery/craft desktop/mobile đạt; chạy lại 2 ca craft sau chuẩn hóa kích thước cũng đạt. Vẫn có 4 cảnh báo heuristic vòng đời tài nguyên đã biết. Xem [thiết kế Craft](craft-designs.md).


## Hai frame theo ảnh tham khảo

Thêm Picnic tiger và Rebel star, kèm hai layout riêng 4/3 ảnh; tổng 53 frame / 83 layout. Dựng bằng Canvas theo hai JPG người dùng chỉ định, có thumbnail riêng, giữ frame/layout độc lập. Đã xem bản render; verify đạt, 6 E2E desktop/mobile đạt, 2 ca reference chạy lại sau hoàn thiện nét sét đạt. Xem [hai frame tham khảo](reference-frames.md).


## Năm frame/layout từ bộ ảnh tham khảo

Bổ sung Candy sky club, Wildflower field notes, Luminous garden, Denim bunny keepsakes, Opening night và 5 layout riêng 6/4/1/3/3 ảnh. Catalog 58 frame / 88 layout. Thêm mask đầu gấu, viền sóng và bo một phía trái/phải dùng chung Path2D. Đã xem render; verify đạt (29 unit, 5 checker, build/budget), 6 E2E catalog/gallery/render đạt; 4 E2E mask/render desktop/mobile chạy lại cũng đạt. Vẫn có 4 cảnh báo heuristic vòng đời đã biết. Xem [bộ thiết kế mới](inspired-collection.md).


## Logo và favicon không chữ

Dựng lại biểu tượng máy ảnh/cuộn phim/tia sáng theo example/photobooth.webp dưới dạng SVG nền trong suốt; tạo PNG 512px, favicon SVG/ICO 16-32-48px và touch icon 180px. Header dùng biểu tượng không wordmark/tagline, có màu sáng cho dark mode và accessible name Photobooth. Đã xem PNG/header mobile sáng và desktop tối; verify đạt, 4 ca E2E Home/theme desktop/mobile đạt. Chạy branding:prepare để tái tạo các bản xuất. Xem [branding](branding.md).


## Căn ảnh bằng kéo và zoom

Thay ba thanh zoom/dịch bằng nút Cắt ảnh mở dialog preview lớn, kéo trực tiếp, zoom −/+ và bản nháp Hủy/Áp dụng. Dùng chung coverGeometry/slotPath để preview khớp transform xuất ảnh. Tách Bỏ ảnh khỏi ô/Đổi với ô trước thành hai dòng, sửa lỗi chồng chữ. Verify đạt; 6 E2E crop/export/confirm desktop/mobile đạt. Xem [căn ảnh](photo-cropping.md).


## Viền trang trí cho từng ô của layout

Thêm 5 treatment: lace, filigree, star-curtain, glow-hearts, glow-flowers; 5 layout đi kèm và 4 frame nền. Tổng 62 frame / 93 layout. Viền thuộc layout, giữ nguyên khi đổi frame, có trong thumbnail và xuất PNG/JPEG. Đã xem render, kiểm tra footprint/độ tròn/tâm ảnh; verify đạt, các ca E2E tìm kiếm/catalog/render desktop/mobile đạt sau khi sửa phép so sánh nền trong suốt. Xem [viền trang trí](ornament-layouts.md).


## Camera mặc định chụp đơn

Tái hiện trường hợp layout còn 2 ô trống tự đặt Số tấm = 2, khiến một lần bấm chạy burst 2 ảnh. Bỏ defaultCount suy ra từ layout, camera luôn mở ở 1 tấm; bổ sung mô tả số tấm mỗi lượt bằng Việt/Anh. E2E hồi quy kiểm tra hai lần mở camera/chụp đơn tăng khay 0→1→2, và burst 4 tấm phải chọn chủ động. Verify đạt; kiểm thử camera desktop/mobile ghi nhận trong lượt sửa này.


## Popup công cụ ô ảnh

Chuyển bảng Ô ảnh từ sidebar vào SlotDialog, mở qua nút Chỉnh sửa ô ảnh N hoặc bấm ô đã có ảnh. Kéo ảnh trên preview không mở popup. Giữ đầy đủ crop/zoom/xoay/lật/camera/bỏ ảnh/đổi ô; có Xong, Escape, khóa nền và trả focus. Crop mở dialog con, giữ bản nháp Hủy/Áp dụng. Verify đạt; 10 E2E crop/frame/export desktop/mobile đạt, đã xem popup mobile tối; build/CSS và performance checker sau tách CSS riêng đạt với 4 cảnh báo vòng đời đã biết.


## Popup chỉnh ảnh một bước

Bỏ nút Chỉnh sửa ô ảnh ở sidebar; chỉ bấm ảnh đã gán trên preview để mở popup. Gộp vùng cắt và công cụ xoay/lật/reset/chụp lại/bỏ ảnh vào CropDialog; bỏ SlotDialog và thao tác đổi ô. Mọi transform dùng bản nháp Hủy/Áp dụng; trả focus về ô ảnh. Đã xem render; verify đạt, CSS/i18n/build sau dọn mã thừa đạt; kiểm tra popup/giữ crop/xuất PNG-JPEG desktop/mobile đạt sau cập nhật helper đợi upload gán ảnh vào ô.

