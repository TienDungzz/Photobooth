# Bộ frame tiếp theo từ example

## Tham khảo đã xem lại

| Ảnh gốc | Chi tiết học được | Kết quả mới |
| --- | --- | --- |
| [Ornamental butterflies](../example/3529c6e66f654024810919b7dfbba88b.jpg) | Đường cong, bướm, điểm sáng trên nền tối | **Dạ khúc cánh bướm / Butterfly nocturne** |
| [Halloween](../example/e972efed8611bf67d9434e5e2203d7be.jpg) | Khung cổ, mạng nhện, bí ngô, phối nhiều cửa ảnh | **Đêm hội bí ngô / Pumpkin after dark** |
| [Wedding](../example/3615c44314d0921ba57bc820ac500a0b.jpg) | Satin ngà, hoa trắng, lá sage và nét viền mảnh | **Lời hẹn sắc ngà / Ivory vows** |
| [Cinema ticket](../example/970e5e69d590e67a4d6674d8c17a699e.jpg) | Cuống vé, đường xé, barcode và thứ bậc nội dung | Layout **Hai vé kỷ niệm** có cuống riêng, không thêm một frame cinema tương tự mẫu cũ |

Artwork nguyên bản được tạo bằng ImageGen, không đưa poster, tên người trong mẫu, watermark hay ảnh người mẫu vào sản phẩm. Prompt đầy đủ và tool mode tại [occasion artwork prompts](occasion-artwork-prompts.md).

## Nội dung bổ sung

3 frame có atlas riêng, chất liệu nền và viền quanh ô ảnh riêng. Bộ tối dùng kim loại/filigree hoặc mạng nhện; bộ wedding dùng satin và hoa trắng. Theme giao diện sáng/tối không đổi màu các frame này.

| Layout ID | Số ảnh | Thiết kế |
| --- | ---: | --- |
| gallery-medallion | 3 | Hai vòm chân dung phía trên và huy hiệu viền lượn phía dưới |
| cabinet-portrait | 3 | Một vòm lớn ở giữa, hai cửa tròn nhỏ hai bên |
| ticket-duo | 2 | Hai vé nghiêng, ảnh bên trái và cuống in bên phải |
| scalloped-duet | 2 | Hai huy hiệu viền lượn tròn trên tờ ngang |

Các layout được thiết kế riêng, không nhân thêm theo số ảnh/màu. Catalog hiện tại **42 frame / 70 layout**, gồm **13 bộ artwork / 29 frame cơ bản**. Bộ chọn ưu tiên nhóm mới, vẫn cho kết hợp độc lập với frame/layout cũ. Các mục đã loại trong đợt tinh gọn không được đưa trở lại.

## Hình học và lớp dựng

- `scallop` dùng đường Path2D kín có 14 múi, giữ ô bao vuông theo pixel đầu ra; clipping, viền và selected outline dùng cùng path.
- `Slot.treatment = 'ticket'` thêm giấy, cuống, đường xé, chữ và barcode trước khi vẽ ảnh. Cuống có bề rộng 24% ô ảnh; metadata chừa sẵn không gian đó. Unit test kiểm tra cả giấy/cuống sau xoay vẫn nằm trong canvas.
- Barcode và chữ vé là trang trí cố định, không phải vé phát hành hay dữ liệu thanh toán; chưa có công cụ sửa nội dung chữ trên bản in.
- Viền filigree mảnh được vẽ sau ảnh, trước viền chọn; chi tiết góc chỉ bật với layout tối đa 6 ảnh. Không kéo giãn một poster/overlay theo tỷ lệ tờ giấy.
- PNG nền trong suốt vẫn giữ giấy/cuống và các lớp trang trí, tương tự treatment Polaroid.

Nguồn metadata: `src/features/frame-catalog/occasion-catalog.ts`; renderer bổ sung tại `engine/occasion-decoration.ts` và `engine/ticket-treatment.ts`. PNG nguồn ở `artwork-source/{nocturne,halloween,vow}-atlas.png`; WebP/thumbnail ở `public/artwork/`.

## Kiểm chứng

Đã dựng và xem [ảnh review 4 layout](reviews/occasion-designs.webp). Có kiểm tra mask tâm trong/góc ngoài, PNG decode, crop không đổi khi thay frame và pixel cuống vé/ảnh xuất. Review dùng hình minh họa tổng hợp; cần duyệt thêm với chân dung thật và bản in. Vùng bấm hiện vẫn dùng hộp bao slot như các layout khác.
