# Artwork và các bộ thiết kế mới

## Phạm vi

Đợt ornamental/occasion bổ sung Butterfly nocturne, Pumpkin after dark và Ivory vows; xem [đối chiếu example](occasion-designs.md), [prompt đầy đủ](occasion-artwork-prompts.md).

Đợt phá cách bổ sung After hours, Picnic playdate và Off the record theo [đối chiếu example](expressive-designs.md). Prompt nguyên bản của ba bộ tại [expressive artwork prompts](expressive-artwork-prompts.md).

Đợt đầu chỉ có **3 bộ artwork**: Silk & pearls, Chrome daydream và Midnight keepsakes; Our cinema ticket chỉ dựng chữ/viền Canvas, không được tính là bộ artwork thứ tư. Đợt bổ sung tạo **4 bộ artwork mới**: Ballet rose, Pressed flower journal, Letters from the sea và Cherry rendezvous. Hiện có **13 bộ artwork minh họa**, cùng 28 frame procedural và 21 thiết kế Canvas trong **Bộ cơ bản**: tổng 62 frame, 93 layout độc lập. Sáu thiết kế Canvas mới thuộc nhóm [signature](signature-designs.md) và [graphic](graphic-designs.md), không dùng atlas hoặc tạo thêm tài nguyên bitmap.

Không sao chép poster, nhân vật hay logo từ ảnh tham khảo. Cinema được dựng bằng Canvas; 13 bộ artwork kết hợp Canvas và sticker nguyên bản được tạo bằng ImageGen. Bộ lọc nổi bật yêu cầu có atlas; không dùng việc có chữ trang trí để đếm thành artwork.

Đợt [craft](craft-designs.md) bổ sung ba thiết kế Canvas không dùng atlas: hóa đơn, vải chần và quỹ đạo. Hiện tổng có 21 thiết kế Canvas ngoài 28 mẫu procedural và 13 atlas.

## Công cụ và nguồn

Dùng skill [imagegen](C:/Users/trant/.codex/skills/.system/imagegen/SKILL.md), chế độ **built-in image_gen**, tạo ảnh mới với `transparent_background: true`. Không dùng CLI/API key. Các PNG nguồn đã được đưa vào `artwork-source/`; không phụ thuộc đường dẫn máy tạo ảnh khi chạy ứng dụng.

| Nguồn | Nội dung | Tài nguyên chạy ứng dụng |
| --- | --- | --- |
| `artwork-source/coquette-atlas.png` | Nơ satin tím, gương tim ngọc trai, bướm, chuỗi ngọc, bó hoa, charm sao | `/artwork/coquette-atlas.webp`, `/artwork/coquette-thumb.webp` |
| `artwork-source/chrome-atlas.png` | Dải chrome, tim kim loại, bướm holographic, sao bốn cánh, móc charm, hành tinh có vành | `/artwork/chrome-atlas.webp`, `/artwork/chrome-thumb.webp` |
| `artwork-source/memo-atlas.png` | Nơ xanh navy, sao denim, dây ngọc/charm, kẹp kim loại, giấy xé/washi, hoa ép | `/artwork/memo-atlas.webp`, `/artwork/memo-thumb.webp` |
| `artwork-source/ballet-atlas.png` | Nơ satin hồng, giày ballet, locket, quạt ren, hoa hồng, charm vàng/ngọc | `/artwork/ballet-atlas.webp`, `/artwork/ballet-thumb.webp` |
| `artwork-source/herbarium-atlas.png` | Hoa cúc ép, nhãn đồng, bướm vàng, dương xỉ, bó hoa dại, giấy herbarium | `/artwork/herbarium-atlas.webp`, `/artwork/herbarium-thumb.webp` |
| `artwork-source/seaside-atlas.png` | Vỏ sò/ngọc, vòng vỏ sò, tim thủy tinh biển, dây ngọc, cụm ốc, chai cát | `/artwork/seaside-atlas.webp`, `/artwork/seaside-thumb.webp` |
| `artwork-source/cherry-atlas.png` | Nơ đỏ rượu, locket tim, cherry, ren, hoa hồng đỏ, ghim charm | `/artwork/cherry-atlas.webp`, `/artwork/cherry-thumb.webp` |
| `artwork-source/afterhours-atlas.png` | Chrome flame, blob ring, charm sao, checker ribbon, khóa neon, starburst | `/artwork/afterhours-atlas.webp`, `/artwork/afterhours-thumb.webp` |
| `artwork-source/playdate-atlas.png` | Paperclip, viền táo, dưa hấu, washi, trái cây, tim/nốt nhạc giấy | `/artwork/playdate-atlas.webp`, `/artwork/playdate-thumb.webp` |
| `artwork-source/zine-atlas.png` | Giấy/tape đỏ, torn ring, sao/ghim, kẹp/caro, seal tim, chain charm | `/artwork/zine-atlas.webp`, `/artwork/zine-thumb.webp` |
| `artwork-source/nocturne-atlas.png` | Filigree bướm, vòng oval, bướm bạc, dây hoa, charm tim và trăng | `/artwork/nocturne-atlas.webp`, `/artwork/nocturne-thumb.webp` |
| `artwork-source/halloween-atlas.png` | Góc khung/mạng nhện, vòng vàng, dơi, cờ, bí ngô/đèn và ghost nguyên bản | `/artwork/halloween-atlas.webp`, `/artwork/halloween-thumb.webp` |
| `artwork-source/vow-atlas.png` | Satin/hoa trắng, vòng champagne, cành lá, lụa/ngọc, bó hoa và nhẫn | `/artwork/vow-atlas.webp`, `/artwork/vow-thumb.webp` |

## Prompt

Prompt đầy đủ của 4 bộ bổ sung nằm tại [artwork prompts expansion](artwork-prompts-expansion.md). Cả bốn được tạo bằng built-in `image_gen`, chế độ generate với alpha; không dùng ảnh mẫu làm tài nguyên xuất bản.

Các yêu cầu chung gửi cho công cụ: original premium photobooth decoration asset atlas; transparent background; precise 3 columns by 2 rows grid of six separate isolated stickers; ample transparent gutters; each object fully contained in its cell; no people, lettering, logos, page mockup, or drawn checkerboard.

- **Coquette:** luxurious lavender satin ribbon bow with flowing tails and white lace edge; ornate lilac heart mirror with pearl edging and transparent center; translucent purple butterfly with opalescent silver details; U-shaped white pearl strand with silver clasps; ivory/mauve flowers with sage leaves and silk; silver/lavender star charms. Dreamy romantic tactile stationery, soft dimension and crisp cutout edges.
- **Chrome:** fluid chrome ribbon twist; puffy metallic heart; holographic butterfly; four-point starbursts; carabiner with purple chain charms; Saturn ring. Glossy Y2K silver, pink, cyan and violet, reflective dimensional objects.
- **Memo:** navy grosgrain bow with ivory tag; stitched denim stars; pearl chain with star charm; metal bulldog clip; torn ivory papers and blue gingham washi with abstract ink; pressed ivory hydrangea and blue leaves. Tactile navy, cream and silver scrapbook materials.

## Pipeline và giới hạn

Chạy `npm run artwork:prepare` để mã hóa PNG nguồn thành WebP, giữ alpha. Bản đầy đủ khoảng 308–503 KB/tệp; thumbnail 480×320 khoảng 46–85 KB/tệp. PNG nguồn không đưa vào `public/` hoặc production build. Sharp chỉ dùng trong pipeline phát triển. Preview đến 300 px dùng thumbnail; editor và export dùng atlas đầy đủ. Trang Home không tải atlas đầy đủ cho từng thẻ nhỏ.

Renderer cắt đúng ô atlas theo lưới 3×2. Không kéo giãn cả poster để làm frame. Thumbnail dùng ảnh nhỏ; preview/export dùng ảnh đầy đủ. Promise được cache theo URL; lỗi tải có thông báo và export thất bại thay vì tạo ảnh thiếu artwork. Preview/export chờ font cục bộ sẵn sàng.

Mask tim, sao, vòm và tem thư dùng chung `Path2D` cho clip ảnh, viền và đường chọn. Viền ảnh co theo kích thước ô; header thu gọn khi layout không dành khoảng trống phía trên. Sticker quanh từng ô chỉ bật cho layout tối đa 6 ảnh. Các vùng bấm vẫn là hộp bao của ô, hỗ trợ bàn phím; chưa có hit testing chính xác theo đường mask.

Chữ trang trí trên bản in là nội dung cố định của bộ thiết kế; giao diện chọn và thông báo hỗ trợ Việt/Anh. Chưa có công cụ sửa chữ trên frame.

## Kiểm tra

Kiểm thử trình duyệt dựng cả 8 theme (7 artwork và cinema), kiểm tra mask, mã hóa PNG và lỗi tải artwork. Ảnh review sinh tại `test-results/artwork-desktop.png` và `test-results/artwork-mobile.png`. Đây là kiểm tra hình học và minh họa tổng hợp; vẫn cần duyệt thủ công với ảnh chân dung thật và thử máy in trước khi phát hành bộ thiết kế thương mại.
