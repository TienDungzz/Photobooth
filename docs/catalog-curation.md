# Rà soát và tinh gọn catalog — 2026-11-08

Catalog tiếp tục được bổ sung có chọn lọc qua [đợt occasion](occasion-designs.md), hiện đạt 42 frame/70 layout. Các số liệu/manifest trước–sau của đợt tinh gọn vẫn là lịch sử, không bị ghi đè theo số lượng hiện tại.

Đây là bản ghi đợt tinh gọn 80/132 xuống 36/60. Sau đó bổ sung có chọn lọc 3 frame/6 layout khác biệt theo [thiết kế phá cách](expressive-designs.md), đưa catalog hiện tại lên 39 frame/66 layout. Manifest và ảnh trước–sau bên dưới giữ nguyên làm bằng chứng lịch sử.

Đã dựng và xem toàn bộ 80 frame, 132 layout trước khi chọn lại danh mục. Sau rà soát còn **36 frame, 60 layout**, loại bỏ **44 frame và 72 layout** tương đồng. Các mục bị loại được bỏ khỏi nguồn sinh catalog, không chỉ ẩn bằng bộ lọc giao diện.

## Tiêu chí

- Frame cùng motif, chỉ đổi nền hoặc vị trí viền: giữ một cách bố trí đại diện. Giữ đủ 22 motif, 6 mẫu gốc, 7 bộ artwork riêng và cinema.
- Layout cùng số ảnh và cách chia ô, chỉ đổi tỷ lệ trang hoặc khoảng cách nhỏ: ưu tiên một đại diện. Không dùng việc khác ID/kích thước để khẳng định là thiết kế khác.
- Giữ bố cục strip, ngang, hero, ảnh nghiêng, scrapbook và các mask có khác biệt rõ. Lưới bo góc chỉ giữ 2 đại diện bổ sung thay vì nhân thành 20 layout.
- Giữ đủ số ảnh 1–20. Lưới dọc bổ sung các số ảnh còn thiếu; lưới ngang 5/8/10 ảnh được giữ vì khác số cột và cách chia hàng.
- Không tự xóa bằng điểm tương đồng hình ảnh: quyết định có đối chiếu contact sheet và metadata hình học.

## Kết quả theo nhóm

| Nhóm frame | Trước | Sau |
| --- | ---: | ---: |
| Artwork riêng | 7 | 7 |
| Cinema Canvas | 1 | 1 |
| Mẫu cơ bản gốc | 6 | 6 |
| 22 motif × biến thể vị trí/nền | 66 | 22 |
| **Tổng** | **80** | **36** |

| Nhóm layout | Trước | Sau |
| --- | ---: | ---: |
| Bố cục cơ bản gốc | 26 | 26 |
| Mosaic dọc/vuông/ngang | 51 | 12 |
| Hero + ảnh nhỏ tự sinh | 18 | 3 |
| Lưới bo góc tự sinh | 20 | 2 |
| Ô tròn tự sinh | 5 | 5 |
| Layout tim/sao/vòm/tem/ảnh nghiêng/cameo | 12 | 12 |
| **Tổng** | **132** | **60** |

Giữ nguyên ID và hình học các mục được chọn lại. Không có dữ liệu ảnh/crop lưu bền theo catalog ID trong bản hiện tại, nên không cần chuyển đổi phiên đã lưu. Reload trang vẫn xóa ảnh phiên như trước.

## Bằng chứng và danh sách ID

[Manifest](catalog-curation-manifest.json) ghi đầy đủ ID giữ/bỏ cho cả hai danh mục, cùng số lượng trước/sau. Contact sheet dùng renderer của ứng dụng; frame được xem ở chế độ chỉ trang trí để so sánh motif, layout được xem ở chế độ hình học để so sánh ô ảnh:

| Danh mục | Trước | Sau |
| --- | --- | --- |
| Frame | [1](reviews/catalog-curation/before/frames-1.webp), [2](reviews/catalog-curation/before/frames-2.webp), [3](reviews/catalog-curation/before/frames-3.webp), [4](reviews/catalog-curation/before/frames-4.webp) | [1](reviews/catalog-curation/after/frames-1.webp), [2](reviews/catalog-curation/after/frames-2.webp) |
| Layout | [1](reviews/catalog-curation/before/layouts-1.webp), [2](reviews/catalog-curation/before/layouts-2.webp), [3](reviews/catalog-curation/before/layouts-3.webp), [4](reviews/catalog-curation/before/layouts-4.webp), [5](reviews/catalog-curation/before/layouts-5.webp), [6](reviews/catalog-curation/before/layouts-6.webp) | [1](reviews/catalog-curation/after/layouts-1.webp), [2](reviews/catalog-curation/after/layouts-2.webp), [3](reviews/catalog-curation/after/layouts-3.webp) |

Các WebP review nằm trong docs, không đi vào production build. Đây là rà soát mức tương đồng, không thay thế QA chân dung thật, vùng che mặt hoặc chất lượng in.

## Rà soát lần sau

Chạy `npm run catalog:review -- current` để tạo catalog JSON và PNG contact sheet trong `test-results/catalog-review/current/`. Script `.mjs` mở Vite riêng cổng 5198 và Chromium riêng, tự đóng khi xong; không dùng server dev của người dùng. So sánh mục mới với đại diện hiện có trước khi bổ sung, thay vì đặt mục tiêu tăng số lượng.

Unit test giữ một đại diện cho mỗi motif, kiểm tra ID/hình học không trùng, đủ số ảnh 1–20 và các tỷ lệ mask đã sửa. Số lượng trên Home lấy trực tiếp từ catalog để không còn sai lệch khi danh mục thay đổi.
