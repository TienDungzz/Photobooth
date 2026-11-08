# Đa ngôn ngữ

## 1. Phạm vi

Thuộc phiên bản đầu, hỗ trợ tiếng Việt (vi) và tiếng Anh (en). Đã triển khai i18next/react-i18next; catalog hiện là locales/vi.json và en.json, chưa tách namespace như cấu trúc mục tiêu dưới đây. Xem riêng [Giao diện sáng/tối](theme.md) và [trạng thái triển khai](implementation-status.md).

## 2. Chọn và chuyển ngôn ngữ

- Bộ chọn ngôn ngữ chỉ nằm trong popup Thiết lập, không có nút đổi ngôn ngữ riêng trên header. Hiển thị tên bản ngữ “Tiếng Việt”, “English”; không dùng cờ làm dấu hiệu duy nhất.
- Thứ tự xác định khi mở ứng dụng: lựa chọn hợp lệ đã lưu → ngôn ngữ trình duyệt được hỗ trợ → tiếng Việt. Quy các locale như `vi-VN` về `vi`, `en-US` về `en`.
- Khi người dùng đã chọn, giữ lựa chọn đó; không tự đổi theo trình duyệt giữa phiên.
- Đổi ngôn ngữ không reload trang, không remount toàn bộ editor và không xóa ảnh/crop/frame. State camera và lịch chụp độc lập với locale; không tạo lại timer khi thay bản dịch.
- Cập nhật thuộc tính `lang` trên phần tử HTML. Dùng định dạng theo locale cho số, ngày và kích thước file khi có hiển thị.
- Dịch nhãn, nút, placeholder, tooltip, lỗi, trạng thái rỗng/chờ, tiến độ, nội dung thông báo và tên truy cập. Hộp xin quyền camera và trình chọn file do trình duyệt/hệ điều hành quản lý, không đảm bảo theo locale của ứng dụng.
- Danh mục, tags và tên frame hiển thị hỗ trợ dịch; ID frame/layout/tags nội bộ giữ nguyên giữa các locale. Tên thương hiệu có thể giữ nguyên theo quyết định nội dung.

## 3. Tổ chức bản dịch

```text
src/shared/i18n/
├── config.ts
├── index.ts
└── locales/
    ├── vi/
    │   ├── common.json
    │   ├── photobooth.json
    │   └── frames.json
    └── en/
        ├── common.json
        ├── photobooth.json
        └── frames.json
```

`shared/i18n` sở hữu cơ chế i18n và dữ liệu bản dịch; không import component, store hoặc logic từ feature. Feature dùng react-i18next để truy cập bản dịch. Runtime hiện dùng một file JSON mỗi locale; cấu trúc namespace phía trên là hướng mở rộng, chưa tạo các file namespace rỗng.

Quy chuẩn:

- Key thể hiện ý nghĩa, ví dụ `camera.captureProgress`, `editor.missingPhotos`; không dùng nguyên câu tiếng Việt làm key.
- Các locale có cùng bộ key và cùng tên placeholder. Không nối chuỗi thành câu; dùng bản dịch trọn câu với tham số.
- Ví dụ: `camera.captureProgress` tương ứng “Ảnh {current}/{total}” và “Photo {current}/{total}”. Ký hiệu placeholder thực tế theo thư viện đã chọn.
- Dùng pluralization cho ngôn ngữ cần phân biệt số ít/số nhiều; không giả định quy tắc tiếng Việt áp dụng cho tiếng Anh.
- Không hardcode chuỗi hiển thị trong component/controller. Error kỹ thuật dùng mã ổn định, ánh xạ sang bản dịch ở lớp UI.
- Không đưa HTML tùy ý hoặc dữ liệu người dùng chưa escape vào bản dịch. Không hiển thị nội dung lỗi nội bộ như thông báo cho người dùng.
- Thiếu bản dịch: fallback về tiếng Việt, ghi nhận key ở môi trường phát triển, không log ảnh hay dữ liệu người dùng. CI phải chặn missing key để fallback chỉ là phương án dự phòng.
- Bản dịch của nhóm chức năng và thay đổi key phải được cập nhật cho cả hai locale trong cùng thay đổi.

## 4. Lưu thiết lập dùng chung

Đề xuất lưu đối tượng nhỏ có version tại key `photobooth.preferences.v1` trong localStorage:

```json
{
  "version": 1,
  "locale": "vi",
  "themePreference": "system"
}
```

`locale` có thể chưa có khi chưa chọn thủ công. Chỉ lưu thiết lập, không lưu ảnh/Blob/camera stream. Bao lỗi đọc/ghi storage; kiểm tra JSON, version và từng giá trị trước khi dùng, fallback riêng cho trường không hợp lệ. Storage bị chặn hoặc đầy không được làm hỏng luồng chụp. Chỉ ghi khi người dùng đổi thiết lập, không ghi theo mỗi tick countdown. Bản đầu không yêu cầu đồng bộ lựa chọn giữa các tab.

Cơ chế đọc/ghi chung thuộc `shared/lib`; schema thiết lập thuộc `shared/config`. Provider điều phối nằm tại `app/providers`, khởi tạo i18n/theme từ thiết lập đã kiểm tra.

## 5. Luồng sử dụng

1. Mở ứng dụng: dùng locale đã lưu, ngôn ngữ trình duyệt hoặc fallback tiếng Việt.
2. Chọn Tiếng Việt/English tại thiết lập ở bất kỳ bước nào.
3. Cập nhật bản dịch và thuộc tính HTML lang ngay, lưu lựa chọn nếu có thể.
4. Giữ nguyên ảnh, crop, frame, camera và phiên chụp hiện tại.

## 6. Kiểm tra và nghiệm thu

- Test locale vi-VN, en-US, ngôn ngữ chưa hỗ trợ, lựa chọn đã lưu, JSON lỗi và storage bị chặn.
- Đổi ngôn ngữ khi đã crop hoặc đang countdown phải giữ dữ liệu và không tạo thêm timer/phiên chụp.
- Kiểm tra nhãn, lỗi, trạng thái và tên truy cập trên cả hai ngôn ngữ, cả hai theme, màn hình nhỏ và bàn phím.
- Kiểm tra câu dài, pluralization, định dạng số và fallback.
- Đã có script/check-i18n.mjs kiểm tra JSON, bộ key, chuỗi rỗng và placeholder giữa các locale; nằm trong check-all.mjs. Unit test cũng kiểm tra parity.
- Rà soát chữ hardcode; kiểm tra tĩnh không thay thế đánh giá chất lượng bản dịch.
- Chữ trong asset frame không tự dịch; cần biến thể nội dung frame riêng nếu muốn hỗ trợ.
