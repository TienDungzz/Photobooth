# Frame và layout phá cách theo example

Đây là bản ghi đợt thêm 3 frame/6 layout phá cách. Sau đó có thêm [3 frame/4 layout occasion](occasion-designs.md), đưa catalog hiện tại lên 42 frame/70 layout; các số liệu trong mô tả đợt dưới đây thuộc thời điểm bổ sung nhóm phá cách.

## Hướng tham khảo

Đã mở lại ảnh gốc, phân biệt tờ photobooth trong poster với phần quảng bá và watermark. Artwork được tạo nguyên bản bằng ImageGen; không cắt poster, ảnh người mẫu, tên nghệ sĩ hoặc nhãn tác giả vào ứng dụng.

| Tham khảo | Phần bổ sung |
| --- | --- |
| [Y2K](../example/52daf1af89a2a4631e2de4e230fd648c.jpg) | Màu tương phản, checkerboard, sticker chrome, ô hữu cơ và cắt tự do |
| [Picnic collage](../example/a75b3eb0fe37c6acf6980d12b30ce72f.jpg) | Caro nhiều mảng màu, sticker giấy trái cây, trộn ô hữu cơ/Polaroid/quả táo |
| [Scrapbook navy](../example/7531ee34c699e79bc2d62f31ce7838a5.jpg) | Ảnh lệch góc, giấy xé, kẹp và tape; chuyển thành concept zine đen/đỏ riêng |
| [Cửa sổ pastel](../example/2e9ac29382ceaa0598ae98a86c6e076c.jpg) | Viền cửa sổ trình duyệt, thanh tiêu đề và các nút trang trí |

## 3 bộ frame mới

- **After hours / Sau giờ lên đèn:** nền tối tím, cyan/hồng neon, mép checkerboard, chrome flame, khóa và charm sao.
- **Picnic playdate / Một ngày tinh nghịch:** caro xanh/hồng/kem, giấy cắt, paperclip và trái cây.
- **Off the record / Ngoài khuôn khổ:** nền giả nhịp chữ newsprint, tape đỏ, giấy xé, kẹp và chữ đậm. Các nét newsprint không chứa bài báo hoặc nội dung đọc được.

Mỗi bộ có atlas 3×2 riêng, công thức đặt sticker và chất liệu nền riêng. PNG nguồn tại `artwork-source/`; atlas/thumbnail WebP tại `public/artwork/`. Prompt đầy đủ và tool mode tại [expressive artwork prompts](expressive-artwork-prompts.md).

## 6 layout mới

| ID | Số ảnh | Khác biệt |
| --- | ---: | --- |
| liquid-duet | 2 | Hai ô hữu cơ lớn, lệch góc nhẹ |
| cutout-trio | 3 | Ba ô đa giác cắt tự do trên strip |
| browser-trio | 3 | Ba cửa sổ có thanh tiêu đề và nút trang trí |
| mixed-playdate | 3 | Ô hữu cơ, Polaroid nghiêng và ô táo có cuống/lá |
| ripped-editorial | 3 | Một ảnh lớn và hai ảnh nhỏ, mép giấy xé, góc xoay khác nhau |
| polaroid-pile | 4 | Chồng Polaroid bất đối xứng, có lớp giấy và bóng đổ |

Các vị trí được thiết kế riêng, không sinh tổ hợp mask × số ảnh. Giữ tiêu chí tinh gọn sau [đợt rà soát](catalog-curation.md): tổng hiện tại 39 frame/66 layout, gồm 10 bộ artwork và 29 frame cơ bản.

## Hợp đồng dựng ảnh

Schema bổ sung mask `blob`, `cutout`, `torn`, `apple` và `Slot.treatment` là `browser | polaroid`. Mask sử dụng cùng Path2D cho clip ảnh và viền chọn. Treatment thuộc layout, được vẽ trước ảnh, xoay cùng slot; thanh cửa sổ chỉ là chi tiết trang trí, không phải giao diện có thể bấm. Cuống/lá táo vẽ sau ảnh. Các slot vẫn được xếp lớp theo thứ tự trong mảng, giữ cùng thứ tự trong vùng bấm của editor.

Đổi frame giữ layout, treatment, ảnh và crop. Đổi layout vẫn remap ảnh theo cơ chế chung. Không có layout bị ép dùng một frame cụ thể. Các bộ có thể kết hợp tự do; bộ hình giới thiệu dùng những cặp phù hợp để rà trực quan.

PNG trong suốt vẫn giữ giấy Polaroid, thanh cửa sổ và sticker theo thiết kế; chỉ nền giấy toàn trang được bỏ. Không kéo giãn atlas hoặc poster thành một lớp phủ cố định.

## Kiểm chứng và giới hạn

Đã kiểm tra mask tâm trong/góc ngoài, biên ô sau xoay, PNG decode, bộ lọc artwork, đổi frame giữ crop và xuất cửa sổ trình duyệt đúng màu/vị trí. Test trình duyệt dựng cả 6 layout; [ảnh review desktop](reviews/expressive-designs.webp) dùng ảnh minh họa tổng hợp, không phải kiểm thử chân dung thật.

Vùng bấm vẫn là hộp bao slot; chưa hit-test chính xác theo mask. Chồng ảnh có chủ ý ở mép; cần duyệt với ảnh người thật để đánh giá che mặt trước khi dùng cho bộ phát hành thương mại.
