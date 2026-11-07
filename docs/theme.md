# Giao diện sáng/tối

## 1. Phạm vi

Thuộc phiên bản đầu với ba lựa chọn: sáng (light), tối (dark), theo hệ thống (system). Đây là đặc tả; chưa có runtime theme. Xem riêng [Đa ngôn ngữ](localization.md).

## 2. Lựa chọn và phân giải theme

- Mặc định `system`. Lựa chọn hợp lệ đã lưu được ưu tiên khi mở lại ứng dụng.
- Tách `themePreference` (`light | dark | system`) với `resolvedTheme` (`light | dark`). Khi đang theo hệ thống, cập nhật theo thay đổi giao diện của thiết bị; khi chọn sáng/tối thủ công, giữ nguyên lựa chọn.
- Nút/bộ chọn có nhãn rõ; hiển thị cả lựa chọn “Theo hệ thống” và trạng thái thực tế khi cần. Không chỉ dựa vào icon mặt trời/mặt trăng.
- Áp dụng `data-theme="light"` hoặc `data-theme="dark"` ở phần tử HTML; khai báo `color-scheme` tương ứng cho điều khiển gốc của trình duyệt.
- Khởi tạo theme trước lần vẽ đầu tiên bằng cơ chế bootstrap phù hợp với stack/CSP, tránh lóe theme sai. Nếu đọc thiết lập thất bại, dùng hệ thống và tiếp tục khởi động.
- Không remount editor/camera khi đổi theme. Listener theo dõi theme hệ thống phải được cleanup; không gắn lại nhiều lần.

## 3. Token và phạm vi màu sắc

Token giao diện đặt tại `src/shared/styles/tokens.css`. Dùng semantic token như `--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-focus`, `--color-error`. Mỗi theme cung cấp đủ cùng một bộ token; component vẫn dùng BEM và không hardcode palette riêng.

```css
:root,
:root[data-theme='light'] {
  color-scheme: light;
  --color-background: #ffffff;
  --color-text: #171717;
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --color-background: #171717;
  --color-text: #f5f5f5;
}
```

Ví dụ chỉ minh họa cách khai báo, chưa phải palette đầy đủ. Phải kiểm tra khả năng đọc của chữ, focus, border, disabled, selected và error trên cả hai theme. Không đảo màu toàn trang bằng filter. Icon nên dùng màu kế thừa khi phù hợp; logo hoặc illustration có thể cần biến thể riêng.

**Theme ứng dụng không thay màu frame.** Canvas, background, overlay và chữ nằm trong thành phẩm lấy từ định nghĩa frame; renderer/exporter không đọc token theme giao diện. Vùng preview nền trong suốt có thể dùng checkerboard thích ứng theme nhưng checkerboard không xuất vào ảnh. Chữ đã nằm trong asset frame cũng không tự đổi ngôn ngữ; chỉ có biến thể nội dung frame được thiết kế riêng mới thay đổi phần này.

## 4. Tổ chức mã nguồn và lưu thiết lập

Token thuộc shared/styles/tokens.css; cơ chế phân giải theme và quản lý listener thuộc shared/lib; provider điều phối thuộc app/providers. Không đưa logic theme vào renderer hoặc domain.

Lưu themePreference trong đối tượng photobooth.preferences.v1 cùng locale; schema và chính sách được quy định tại [lưu thiết lập dùng chung](localization.md#4-lưu-thiết-lập-dùng-chung). Chỉ cập nhật trường theme, giữ nguyên locale. Kiểm tra version/giá trị, xử lý lỗi đọc/ghi và fallback về system. Storage bị chặn vẫn phải đổi được theme trong phiên. Không lưu resolvedTheme vì giá trị này phụ thuộc hệ thống.

## 5. Luồng sử dụng

1. Trước khi hiển thị trang, đọc lựa chọn hợp lệ hoặc dùng system và phân giải theme thực tế.
2. Chọn sáng/tối/theo hệ thống tại thiết lập ở bất kỳ bước nào.
3. Áp dụng token ngay, lưu lựa chọn nếu có thể, giữ nguyên ảnh và trạng thái chụp/chỉnh sửa.
4. Theo dõi thay đổi giao diện thiết bị khi lựa chọn là system; lựa chọn thủ công không bị ghi đè.

## 6. Kiểm tra và nghiệm thu

- Test ba lựa chọn, storage hợp lệ/hỏng/bị chặn và thay đổi theme hệ thống.
- Kiểm tra không lóe theme sai khi mở lại và listener được cleanup.
- Đổi theme khi đã crop hoặc đang countdown không làm mất dữ liệu, remount camera hoặc tạo thêm phiên chụp.
- Kiểm tra chữ, icon, focus, border và trạng thái disabled/selected/error trên cả hai theme và hai ngôn ngữ.
- Kiểm tra responsive, bàn phím, giảm chuyển động và độ tương phản thực tế.
- Cùng frame/ảnh/transform phải tạo thành phẩm giống nhau khi đổi theme; checkerboard preview không xuất vào ảnh.
