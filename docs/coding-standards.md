# Quy chuẩn code và BEM

## 1. Phạm vi áp dụng

Áp dụng đồng thời [performance standards](performance-standards.md) và [security standards](security-standards.md). Quy chuẩn code quy định cách viết và tổ chức; hai tài liệu đó quy định budget, vòng đời tài nguyên, bảo vệ dữ liệu và bằng chứng nghiệm thu.

Quy chuẩn này áp dụng cho mã nguồn viết mới. Ví dụ sử dụng TypeScript/TSX theo định hướng React trong thiết kế kỹ thuật; stack chưa được chốt. Khi chọn stack khác, giữ các nguyên tắc phân lớp, đặt tên và BEM, đồng thời cập nhật ví dụ và công cụ tương ứng.

## 2. Định dạng và đặt tên

- File văn bản dùng UTF-8, xuống dòng LF, kết thúc file bằng newline; thụt lề 2 spaces.
- TypeScript dùng dấu chấm phẩy, chuỗi nháy đơn, dấu phẩy cuối khi formatter cho phép. Dùng formatter chung, không định dạng thủ công trái cấu hình.
- Tên code, file và CSS dùng tiếng Anh; nội dung giao diện và docs có thể dùng tiếng Việt.
- Biến/hàm dùng `camelCase`; component/type/interface dùng `PascalCase`; hằng cấu hình bất biến ở cấp module dùng `UPPER_SNAKE_CASE`.
- Boolean dùng `is`, `has`, `can`, `should`; hàm dùng động từ thể hiện tác vụ: `capturePhoto`, `stopCamera`, `validateFrame`.
- Giá trị thời gian phải có đơn vị: `countdownSeconds`, `deadlineMs`; kích thước pixel dùng `widthPx` khi cần phân biệt với tọa độ chuẩn hóa.
- Component: `CameraPreview.tsx`; stylesheet đi kèm: `CameraPreview.css`; hook: `useCamera.ts`; module logic: `capture-session.ts`; test: `capture-session.test.ts`.
- Thư mục dùng `kebab-case`, riêng thư mục component dùng cùng tên PascalCase với component. Tránh tên chung chung như `data.ts`, `helper.ts`, `Common.tsx`.

## 3. TypeScript và logic nghiệp vụ

- Bật chế độ strict khi thiết lập dự án. Không dùng `any` để bỏ qua lỗi; dữ liệu bên ngoài bắt đầu bằng `unknown` và được kiểm tra trước khi sử dụng.
- Khai báo type rõ ở API công khai của module; cho phép suy luận type trong phạm vi nội bộ.
- Dùng union cho trạng thái hữu hạn, không ghép nhiều boolean có thể mâu thuẫn. Ví dụ `status: 'ready' | 'countdown' | 'capturing' | 'paused'`.
- Dùng `const` mặc định; `let` khi phải gán lại; không dùng `var`.
- Hàm có một trách nhiệm. Tách tính toán crop, kiểm tra frame và lịch chụp khỏi component giao diện.
- Giá trị giới hạn và mặc định đặt trong module cấu hình có tên rõ, không lặp số trực tiếp trong nhiều component.
- Không sửa trực tiếp state hoặc dữ liệu catalog. Tạo giá trị mới khi cập nhật.
- Không tắt lint/type check trên cả file. Ngoại lệ hẹp phải có lý do và phạm vi cụ thể.

## 4. Component, state và tác vụ bất đồng bộ

- Component hiển thị nhận dữ liệu qua props; hook/controller quản lý camera, timer và tài nguyên trình duyệt.
- State cục bộ đặt gần nơi dùng. State xuyên nhiều tính năng do lớp điều phối trong `app` sở hữu; không tạo một store chứa mọi trạng thái UI.
- Không lưu lại dữ liệu có thể suy ra đơn giản, như số ô trống khi đã có danh sách assignment.
- Props callback dùng `onCapture`, `onSelectFrame`; handler nội bộ dùng `handleCapture`, `handleSelectFrame`.
- Effect chỉ dùng để đồng bộ với hệ thống bên ngoài, không dùng để thay thế các phép tính thuần.
- Mỗi timer, listener, stream, object URL và bitmap phải có nơi sở hữu cùng đường cleanup rõ ràng.
- Tác vụ async phải xử lý lỗi và kết quả đến muộn. Phiên chụp dùng session ID/token để bỏ callback đã hết hiệu lực.
- Không chạy nhiều thao tác chụp/export trùng nhau. Nút và controller cùng kiểm soát trạng thái bận.
- Không nuốt lỗi bằng `catch` rỗng; ánh xạ lỗi kỹ thuật sang thông báo và hành động khôi phục. Không log dữ liệu ảnh.

## 5. CSS theo BEM

Sử dụng stylesheet `.css` thông thường với BEM làm quy ước chính. Không trộn CSS Modules, CSS-in-JS hoặc hệ utility-first khi chưa có quyết định cập nhật quy chuẩn.

| Thành phần | Cú pháp | Ví dụ |
| --- | --- | --- |
| Block | `block-name` | `camera-panel`, `frame-card` |
| Element | `block-name__element-name` | `camera-panel__preview` |
| Modifier boolean | `block-name--modifier` | `frame-card--selected` |
| Modifier có giá trị | `block-name--property-value` | `button--size-small` |
| Modifier của element | `block-name__element--modifier` | `camera-panel__countdown--urgent` |

Quy tắc bắt buộc:

- Block là đơn vị giao diện có trách nhiệm riêng; element không cần tái sử dụng độc lập ngoài block.
- Element luôn thuộc block, không nối theo cây DOM: dùng `frame-card__title`, không dùng `frame-card__body__title`.
- Modifier luôn đi cùng class gốc: `frame-card frame-card--selected`; không chỉ gắn `frame-card--selected`.
- Tên thể hiện vai trò hoặc trạng thái, tránh phụ thuộc màu/vị trí như `red-box`, `left-text`.
- Một selector class chính cho mỗi rule. Không dùng ID, selector tag toàn cục hoặc chuỗi selector sâu để style component.
- Không dùng `!important` để xử lý xung đột. Sửa phạm vi selector hoặc thứ tự stylesheet.
- Block cha chỉ quản lý bố cục của wrapper, không truy cập element nội bộ của block con. Component con cung cấp modifier/props khi cần biến thể.
- Pseudo-class, pseudo-element và selector thuộc tính trạng thái được phép: `.button:focus-visible`, `.button:disabled`, `.frame-card[aria-selected='true']`.
- Trạng thái truy cập dùng thuộc tính HTML/ARIA đúng ngữ nghĩa. Class modifier chỉ điều khiển hình thức, không thay thế `disabled`, `aria-expanded` hoặc trạng thái tương ứng.
- Class utility ngoại lệ dùng prefix `u-`, ví dụ `u-visually-hidden`, chỉ định nghĩa tập trung. Không tạo utility tùy ý trong từng feature.
- Nesting nếu sử dụng chỉ ở mức pseudo-state/media query; không tạo phụ thuộc vào cấu trúc DOM.

Ví dụ block với modifier:

```tsx
<section className="camera-panel camera-panel--capturing" aria-label="Chụp ảnh">
  <video className="camera-panel__preview" autoPlay playsInline muted />
  <p className="camera-panel__countdown" role="status">3 giây</p>
  <button className="button button--variant-secondary" type="button">
    Dừng chụp
  </button>
</section>
```

```css
.camera-panel {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
}

.camera-panel__preview {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: var(--radius-medium);
}

.camera-panel--capturing {
  outline: 2px solid var(--color-accent);
}

.button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

Block `button` do shared UI sở hữu; CSS của camera không định nghĩa lại `.button`. Ví dụ chỉ minh họa cấu trúc; video, countdown và hành động phải được nối với trạng thái thực tế khi triển khai.

## 6. Design token và responsive

- Mọi chuỗi hiển thị dùng key dịch; không nối chuỗi thành câu hoặc hardcode nhãn trong component. Theme dùng semantic token với đủ giá trị sáng/tối. Tuân theo [Đa ngôn ngữ](localization.md) và [Giao diện sáng/tối](theme.md).

- Màu thương hiệu, khoảng cách, typography, radius, shadow và z-index chung dùng CSS custom properties trong `shared/styles/tokens.css`.
- Reset và style phần tử nền tảng chỉ ở stylesheet global. Style component nằm cạnh component và được import tại đó.
- Viết mobile-first; breakpoint được thống nhất tại tài liệu/token dự án khi thiết kế UI. CSS custom properties không dùng trực tiếp làm điều kiện media query trong CSS thuần.
- Dùng Grid/Flex cho bố cục; tránh tọa độ tuyệt đối cho toàn trang. Overlay và preview frame được dùng positioning theo nhu cầu.
- Inline style chỉ dùng cho giá trị động như transform crop, kích thước slot hoặc CSS variables tính từ dữ liệu. Không dùng inline style cho màu, spacing và trạng thái tĩnh.
- Kích thước canvas xuất lấy từ định nghĩa frame; không suy ra từ breakpoint giao diện.
- Điều khiển có nhãn, dùng phần tử ngữ nghĩa, hỗ trợ bàn phím và `prefers-reduced-motion` cho animation.

## 7. Import và ranh giới module

- Tuân theo [cấu trúc thư mục](folder-structure.md) và chiều phụ thuộc được mô tả ở đó.
- Dùng named export cho code nội bộ; chỉ dùng default export khi công cụ/framework yêu cầu.
- Dùng `import type` cho type-only import.
- Import thư viện ngoài trước, module nội bộ sau, stylesheet cuối; để công cụ tự sắp xếp khi đã cấu hình.
- Import bên trong cùng feature có thể dùng đường dẫn tương đối; import giữa các tầng dùng alias `@/` sau khi cấu hình đồng bộ cho bundler, TypeScript và test runner.
- Chỉ import feature khác qua API công khai `index.ts`; cấm deep import vào nội bộ feature khác và cấm phụ thuộc vòng.
- Không chuyển code lên `shared` chỉ vì file dài. Chỉ chuyển khi code không phụ thuộc nghiệp vụ riêng và có nhu cầu dùng chung thực tế.

## 8. Công cụ và điều kiện hoàn thành

Khi khởi tạo mã nguồn, cấu hình formatter, ESLint cho TypeScript/framework đã chọn, Stylelint cho CSS/BEM và kiểm tra kiểu. Các công cụ phải chạy cùng cấu hình ở local và CI. Repository đã có checker `.mjs` trong `script/`; chưa có cấu hình ESLint, Stylelint, formatter hay TypeScript. Checker hiện tại không thay thế các công cụ đó.

Các lệnh cần cung cấp trong `package.json`: `dev`, `build`, `typecheck`, `lint`, `lint:css`, `format:check`, `test`. Công cụ và phiên bản cụ thể được chốt khi khởi tạo ứng dụng; không xem đây là các lệnh hiện đã chạy được.

Các lệnh `check`, `check:code`, `check:assets`, `check:performance` và `test:checkers` đã chạy được. Xem [cơ chế kiểm tra chất lượng](quality-checks.md) để biết ngưỡng, ngoại lệ, chế độ strict và giới hạn phân tích.

Một thay đổi hoàn thành khi:

- Đúng yêu cầu sản phẩm, đúng ranh giới module và BEM.
- Đáp ứng tiêu chuẩn hiệu năng và bảo mật liên quan; ghi rõ phần chưa đo/kiểm tra và ngoại lệ có lý do.
- Build, typecheck, lint, kiểm tra CSS và formatter chạy thành công.
- Có kiểm thử phù hợp cho hành vi rủi ro như lịch chụp, biến đổi ảnh, render và cleanup; không thêm test chỉ lặp lại chi tiết triển khai.
- Thay đổi UI đã kiểm tra responsive, focus bàn phím và các trạng thái chờ/lỗi/rỗng liên quan.
- Docs cập nhật nếu đổi dữ liệu frame, hành vi chụp, API module hoặc cấu trúc thư mục.
