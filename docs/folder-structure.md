# Cấu trúc thư mục

Phần artwork đang triển khai: `artwork-source/` giữ PNG nguồn không xuất bản; `public/artwork/` giữ atlas WebP và thumbnail; `script/prepare-artwork.mjs` tái tạo tài nguyên; `src/features/frame-catalog/art-frames.ts` khai báo bộ thiết kế/layout; `src/engine/artwork.ts` tải và dựng các lớp; `src/engine/slot-path.ts` giữ hình học mask dùng chung. Xem [nguồn artwork](artwork-provenance.md).

## 1. Cây thư mục mục tiêu

Ứng dụng React/TypeScript đã được khởi tạo. Cây bên dưới là cấu trúc mục tiêu để mở rộng; không phải mọi file mẫu đều tồn tại. Catalog hiện tập trung trong `features/frame-catalog/catalog.ts`, locale trong `shared/i18n/locales/{vi,en}.json`; có thêm feature `frame-preview` cho Canvas dùng chung. Xem [trạng thái triển khai](implementation-status.md) để đối chiếu phần đã có. Chỉ tạo thư mục khi có nội dung sử dụng thực tế.

```text
Photobooth/
├── docs/
│   ├── product-requirements.md
│   ├── user-flows.md
│   ├── technical-design.md
│   ├── coding-standards.md
│   ├── performance-standards.md
│   ├── security-standards.md
│   ├── folder-structure.md
│   ├── quality-checks.md
│   ├── localization.md
│   ├── theme.md
│   ├── ui-ux-spec.md
│   ├── frame-authoring-guide.md
│   ├── frame-layout-selection.md
│   ├── catalog-browsing.md
│   ├── home-and-setup.md
│   ├── implementation-plan.md
│   ├── architecture-decisions.md
│   ├── testing-strategy.md
│   ├── deployment-guide.md
│   └── implementation-status.md
├── public/
│   └── frames/
│       └── pastel-strip-01/
│           ├── thumbnail.webp
│           ├── background.png
│           └── overlay.png
├── script/
│   ├── check-all.mjs
│   ├── check-code.mjs
│   ├── check-unused-assets.mjs
│   ├── check-performance.mjs
│   ├── check-i18n.mjs
│   ├── check-bundle-budget.mjs
│   ├── check.config.mjs
│   ├── lib/
│   │   └── project.mjs
│   └── tests/
│       └── checkers.test.mjs
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Home.css
│   │   │   └── HomeHero.css
│   │   ├── usePage.ts
│   │   ├── providers/
│   │   └── model/
│   │       └── photobooth-session.ts
│   ├── features/
│   │   ├── frame-catalog/
│   │   │   ├── components/
│   │   │   │   └── FrameCard/
│   │   │   │       ├── FrameCard.tsx
│   │   │   │       └── FrameCard.css
│   │   │   ├── data/
│   │   │   │   ├── layouts/
│   │   │   │   │   └── strip-four.ts
│   │   │   │   ├── frames/
│   │   │   │   │   └── pastel-strip-01.ts
│   │   │   │   └── catalog.ts
│   │   │   ├── model/
│   │   │   │   └── filter-frames.ts
│   │   │   └── index.ts
│   │   ├── photo-library/
│   │   ├── camera/
│   │   ├── capture-session/
│   │   ├── editor/
│   │   └── export-photo/
│   ├── domain/
│   │   ├── frame/
│   │   │   ├── frame.types.ts
│   │   │   ├── validate-frame.ts
│   │   │   └── index.ts
│   │   ├── photo/
│   │   └── composition/
│   ├── engine/
│   │   └── renderer/
│   │       ├── render-composition.ts
│   │       ├── calculate-cover-transform.ts
│   │       ├── calculate-cover-transform.test.ts
│   │       └── index.ts
│   └── shared/
│       ├── ui/
│       │   └── Button/
│       │       ├── Button.tsx
│       │       └── Button.css
│       ├── lib/
│       ├── config/
│       ├── i18n/
│       │   ├── config.ts
│       │   ├── index.ts
│       │   └── locales/
│       │       ├── vi/
│       │       └── en/
│       ├── assets/
│       └── styles/
│           ├── tokens.css
│           ├── reset.css
│           ├── global.css
│           └── utilities.css
├── tests/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── index.html
├── package.json
└── cấu hình build, TypeScript, lint, formatter và test
```

Các file background/overlay là tùy chọn tùy frame. Không tạo asset rỗng để đủ cây thư mục.

## 2. Trách nhiệm và chiều phụ thuộc

| Tầng | Trách nhiệm | Được import |
| --- | --- | --- |
| `app` | Khởi tạo, màn hình, provider, điều phối phiên giữa các feature | `features`, `engine`, `domain`, `shared` |
| `features` | Một khả năng sản phẩm, UI và logic liên quan | `engine`, `domain`, `shared`; feature khác qua API công khai khi cần |
| `engine` | Pipeline render, hình học và thao tác canvas | `domain`, `shared/lib`, `shared/config` |
| `domain` | Kiểu dữ liệu nghiệp vụ, validation và quy tắc thuần | Nội bộ `domain`, thư viện thuần bên ngoài |
| `shared` | UI tổng quát, tiện ích và cấu hình không phụ thuộc feature | Nội bộ `shared`, thư viện bên ngoài |

`domain` không biết React, DOM, camera hay canvas. `engine` không import component/store/hook. `shared` không import các tầng phía trên. Không tầng nào được import `app`.

Giữa các feature chỉ chấp nhận quan hệ có một chiều, không tạo vòng. Luồng cần phối hợp hai feature được đặt tại `app/model` hoặc trang điều phối, truyền dữ liệu qua props/callback hay adapter thay vì để hai store gọi nhau.

Ví dụ: `app` lấy ảnh từ `camera`, chuyển kết quả sang `photo-library`, rồi cập nhật `editor`. `capture-session` nhận hàm chụp qua dependency thay vì tự truy cập store camera; nhờ đó kiểm thử lịch chụp bằng camera giả lập.

## 3. Cấu trúc bên trong feature

Mỗi feature có thể dùng các thư mục sau, chỉ tạo phần cần thiết:

| Thư mục/file | Nội dung |
| --- | --- |
| `components/` | Component và CSS BEM đặt cạnh nhau |
| `hooks/` | Hook kết nối logic feature với vòng đời UI |
| `model/` | State, reducer, state machine, selector và quy tắc feature |
| `services/` | Giao tiếp API trình duyệt hoặc hệ thống bên ngoài |
| `lib/` | Hàm hỗ trợ riêng của feature |
| `data/` | Dữ liệu tĩnh do feature sở hữu |
| `index.ts` | API công khai tối thiểu, không export toàn bộ nội bộ |

Test đơn vị đặt cạnh module: `validate-upload.test.ts`. Test tích hợp nhiều feature đặt trong `tests/integration`; test hành trình người dùng đặt trong `tests/e2e`. Fixture dùng chung nằm trong `tests/fixtures`; fixture riêng có thể nằm cạnh test tương ứng.

Không tạo `src/components`, `src/utils` hoặc `src/hooks` như nơi gom mọi thứ. Component nghiệp vụ thuộc feature, component tổng quát thuộc `shared/ui`; tiện ích đặt tại nơi sở hữu nghiệp vụ.

## 4. Ranh giới các feature của photobooth

| Feature | Sở hữu | Không sở hữu |
| --- | --- | --- |
| `frame-catalog` | Danh mục layout/frame, tìm kiếm, lọc, gallery | Ảnh người dùng, lịch chụp |
| `photo-library` | Nhập file, giải mã, thumbnail, khay ảnh, vòng đời Blob/object URL | Crop của từng slot |
| `camera` | Media stream, thiết bị camera, khung hình chụp, cleanup | Số tấm và lịch burst |
| `capture-session` | Countdown, khoảng nghỉ, tiến độ, pause/cancel | Quyền camera, lưu trữ ảnh dài hạn |
| `editor` | Gán ảnh vào slot, crop/zoom/xoay/mirror, preview | Tải file thành phẩm |
| `export-photo` | Cấu hình định dạng, gọi renderer, Blob kết quả và tải file | Thuật toán hình học riêng khác preview |

`renderer` trong thiết kế kỹ thuật tương ứng với `engine/renderer`; `camera-controller` là phần service/controller của feature `camera`; `exporter` thuộc feature `export-photo`. Dùng một tên thư mục thống nhất khi triển khai.

Kiểu `PhotoAsset` thuộc `domain/photo`; `LayoutDefinition` và `FrameDefinition` thuộc `domain/frame`; assignment và transform thuộc `domain/composition`. State cụ thể của UI nằm trong feature, không đưa lên domain.

## 5. Quản lý frame và asset

- Metadata layout và frame lưu tại `features/frame-catalog/data`, dùng type và validation từ `domain/frame`.
- Mỗi layout có ID riêng; nhiều frame có thể tham chiếu cùng một layout. Không sao chép tọa độ slot cho từng biến thể màu.
- Asset frame đặt tại `public/frames/<frame-id>/`; ID dùng kebab-case và khớp metadata.
- `catalog.ts` đăng ký frame/layout; không hardcode danh sách frame bên trong component gallery.
- Asset UI cần bundler xử lý đặt tại `shared/assets` hoặc cạnh feature nếu chỉ feature đó dùng.
- Không đưa ảnh người dùng, ảnh chụp, file export, URL tạm hoặc dữ liệu base64 vào source/public.
- Khi thay asset đã phát hành, tăng version và dùng URL có phiên bản/tên file mới để tránh cache cũ.

Quy trình thêm frame: chọn/tạo layout → thêm metadata → thêm asset → đăng ký catalog → chạy validator → kiểm tra thumbnail, preview và export trên cùng ảnh mẫu. Một biến thể trang trí không được tính thành layout mới.

## 6. Quy trình thêm tính năng

Đa ngôn ngữ dùng `shared/i18n`; theme dùng token trong `shared/styles` và cơ chế phân giải theme ở `shared/lib`. Provider nằm tại `app/providers`. Xem [Đa ngôn ngữ](localization.md) và [Giao diện sáng/tối](theme.md) cho cấu trúc namespace và thiết lập lưu trên thiết bị.

1. Xác định feature sở hữu và kiểm tra API sẵn có trước khi thêm thư mục.
2. Đặt kiểu nghiệp vụ dùng chung vào domain; giữ kiểu props/state gần nơi sử dụng.
3. Viết logic thuần hoặc service trước phần nối UI; đảm bảo cleanup với tài nguyên trình duyệt.
4. Đặt component và stylesheet BEM cạnh nhau; chỉ export API cần dùng ra ngoài feature.
5. Nối feature tại `app`, kiểm tra chiều phụ thuộc và cập nhật docs liên quan.

Không tạo sẵn toàn bộ skeleton rỗng. Khi thay đổi stack hoặc cấu trúc, cập nhật tài liệu này và các import liên quan trong cùng thay đổi.
