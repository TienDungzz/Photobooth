# Photobooth

[Tiếng Việt](#tieng-viet) · [English](#english) · [Tài liệu / Documentation](#documentation)

<a id="tieng-viet"></a>

## Tiếng Việt

Ứng dụng photobooth trên web: tải ảnh từ thiết bị hoặc chụp bằng camera, kết hợp frame và bố cục, chỉnh từng ảnh rồi tải thành phẩm về máy.

Đây là sản phẩm độc lập với kho thiết kế riêng. Trải nghiệm lấy cảm hứng từ phần photobooth của dự án Vietnamese Women’s Day; không mặc định kế thừa mã nguồn, tài nguyên hoặc chủ đề của dự án đó.

### Tính năng

- **62 frame và 93 bố cục độc lập**, từ 1 đến 20 ảnh. Đổi frame giữ ảnh và crop; đổi bố cục giữ khay ảnh và căn chỉnh lại các ô.
- Tải ảnh JPEG, PNG, WebP tĩnh; camera có hẹn giờ và chụp liên tiếp tùy chỉnh.
- Popup cắt/căn ảnh, thu phóng, xoay và phản chiếu. Một ảnh có thể dùng ở nhiều ô với chỉnh sửa riêng.
- Xuất JPEG/PNG đã tối ưu, chọn cạnh dài 1200 hoặc 2400 px; PNG hỗ trợ nền trong suốt. Kích thước lớn không bảo đảm ảnh nguồn nhỏ/mờ trở nên sắc nét.
- **Kho ảnh lưu 7 ngày**: xem, tải lại, tiếp tục chỉnh sửa hoặc xóa bản lưu. Badge trên header hiển thị số bản còn hạn.
- Responsive desktop/mobile; tiếng Việt/tiếng Anh và theme sáng, tối hoặc theo hệ thống. Chọn ngôn ngữ trong popup Thiết lập.

Kho frame gồm 13 bộ artwork minh họa và 49 frame Canvas/cơ bản. Ứng dụng dùng React, TypeScript, Vite và Canvas; không có backend lưu ảnh.

### Chạy local

Yêu cầu **Node.js >= 22.12.0** và npm. Chạy tại thư mục dự án:

```sh
npm ci
npm run dev
```

Mở <http://127.0.0.1:5175>. Lệnh dev dùng cổng 5175 cố định. Camera cần localhost hoặc HTTPS; HTTP qua địa chỉ IP nội bộ có thể không mở được camera. Khi thử trên điện thoại, dùng địa chỉ HTTPS và cấu hình host được phép phù hợp.

### Lưu ảnh và quyền riêng tư

Ảnh được xử lý trên thiết bị, không tự gửi lên máy chủ. Chỉnh sửa chưa bấm **Tải ảnh về** chỉ nằm trong bộ nhớ phiên, mất khi reload/đóng trang.

Khi bấm tải, ứng dụng lưu thành phẩm, ảnh làm việc đã chuẩn hóa, frame/layout và các chỉnh sửa trong **IndexedDB**, không dùng cookie chứa ảnh. Mỗi bản xuất khác nhau được lưu riêng trong 7 ngày; tải lại đúng cùng bản không tạo mục trùng. Mở **Kho ảnh** để xem hoặc khôi phục bản chỉnh sửa.

Kho chỉ có trên cùng trình duyệt, hồ sơ và origin (giao thức/tên miền/cổng). Đổi địa chỉ ngrok, xóa dữ liệu web, chế độ riêng tư hoặc trình duyệt dọn bộ nhớ có thể làm mất kho trước hạn. Bản hết hạn được ẩn và dọn khi ứng dụng chạy; đây không phải bản sao lưu đám mây.

Trên iPhone/iPad hỗ trợ chia sẻ file, nút tải mở bảng chia sẻ iOS với ảnh đã chuẩn bị để người dùng chọn lưu/chia sẻ. Website không thể tự lưu vào Photos hoặc xác nhận hệ điều hành đã lưu. Android và thiết bị không dùng nhánh chia sẻ Apple tải file thông thường. Xử lý xuất ảnh quá 15 giây sẽ báo lỗi và cho phép thử lại.

### Kiểm tra và build

```sh
npm run verify
npx playwright install chromium
npm run test:e2e
npm run preview
```

- `verify`: TypeScript, ESLint, Stylelint, Prettier, unit test, test checker, kiểm tra code/tài nguyên/i18n/hiệu năng, build và budget bundle.
- `test:e2e`: Chromium desktop và mobile giả lập, dùng camera giả lập trên cổng riêng 5197; không sử dụng hồ sơ Chrome hoặc webcam thật.
- `build`: tạo bản production trong `dist/`; `preview` phục vụ bản build đó.
- `npm run check -- --strict`: chặn cả cảnh báo heuristic. Camera/timer/object URL vẫn có cảnh báo cần rà soát, nên strict không phải cổng mặc định.

Test/build đạt không thay thế nghiệm thu Safari iOS, camera và bộ nhớ trên thiết bị thật. Mã trong `tests/e2e/` được commit; kết quả như `test-results/`, `playwright-report/` và `coverage/` được ignore. Thư mục ảnh tham khảo `example/` giữ cục bộ, không đưa vào lịch sử Git.

### Tài nguyên thiết kế

```sh
npm run artwork:prepare
npm run branding:prepare
npm run catalog:review
```

Các lệnh lần lượt tạo lại WebP từ PNG trong `artwork-source/`, tạo logo/favicon và rà soát catalog. Xem [nguồn artwork](docs/artwork-provenance.md), [hướng dẫn tạo frame](docs/frame-authoring-guide.md) và [ba frame Canvas với ba bố cục toàn trang](docs/signature-designs.md).

<a id="english"></a>

## English

A browser-based photobooth: upload photos or use your camera, combine a decorative frame with a photo layout, edit each photo, and download the result.

This is an independent product with its own design catalog. Its experience is inspired by the photobooth scene in the Vietnamese Women’s Day project; it does not automatically inherit that project’s code, assets, or theme.

### Features

- **62 frames and 93 independent layouts**, supporting 1–20 photos. Switching frames preserves photos and crops; switching layouts keeps the photo tray and resets slot transforms for the new geometry.
- Still JPEG, PNG, and WebP uploads; camera capture with configurable countdown and burst settings.
- A photo-editing dialog with crop/position, zoom, rotation, and mirroring. Reuse one photo in multiple slots with independent edits.
- Optimized JPEG/PNG exports with a 1200 or 2400 px longest edge; PNG supports transparency. A larger output does not make a small or blurry source photo sharper.
- **Saved photos with 7-day retention**: view, download again, resume editing, or delete saved projects. A header badge counts unexpired entries.
- Responsive desktop/mobile UI, Vietnamese/English, and light/dark/system themes. Language selection is available in Settings.

The frame catalog includes 13 illustrated artwork sets and 49 Canvas/basic frames. Built with React, TypeScript, Vite, and Canvas, without a photo-storage backend.

### Local development

Requires **Node.js >= 22.12.0** and npm. From the project directory:

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:5175>. The dev command uses fixed port 5175. Camera access requires localhost or HTTPS; an HTTP LAN address may not support camera access. For phone testing, use HTTPS and configure allowed hosts as needed.

### Storage and privacy

Photos are processed on the device and are not automatically uploaded. Edits you have not downloaded exist only in session memory and are lost when the page reloads or closes.

Clicking **Download photo** saves the exported file, normalized working photos, frame/layout selection, and edit transforms in **IndexedDB**, rather than image cookies. Distinct exports are stored separately for 7 days; downloading the exact same project again does not create a duplicate entry. Open **Saved photos** to view or restore a project.

Saved projects are limited to the same browser, profile, and origin (protocol/host/port). Changing an ngrok address, clearing site data, private browsing, or browser storage eviction may remove them earlier. Expired entries are hidden and cleaned up while the application runs. This is not a cloud backup.

On iPhone/iPad with file-sharing support, the download button opens the iOS share sheet with a prepared image. The user chooses where to save or share it; the website cannot silently save to Photos or confirm that the OS saved the file. Android and devices outside the Apple sharing flow use a regular file download. Image preparation has a 15-second timeout with a retry option.

### Checks and builds

```sh
npm run verify
npx playwright install chromium
npm run test:e2e
npm run preview
```

- `verify`: TypeScript, ESLint, Stylelint, Prettier, unit tests, checker tests, code/asset/i18n/performance checks, a production build, and bundle budgets.
- `test:e2e`: desktop and emulated mobile Chromium with a fake camera on dedicated port 5197; no personal Chrome profile or real webcam is used.
- `build`: creates production output in `dist/`; `preview` serves that build.
- `npm run check -- --strict`: also fails on heuristic warnings. Camera/timer/object-URL warnings still require review, so strict mode is not the default gate.

Passing checks does not replace testing Safari iOS, real cameras, or device memory limits. Track test source under `tests/e2e/`; ignore generated results such as `test-results/`, `playwright-report/`, and `coverage/`. The local reference-image directory `example/` is excluded from Git history.

### Design assets

```sh
npm run artwork:prepare
npm run branding:prepare
npm run catalog:review
```

These commands regenerate WebP assets from `artwork-source/` PNGs, prepare logo/favicon assets, and review the catalog. See [artwork provenance](docs/artwork-provenance.md), the [frame-authoring guide](docs/frame-authoring-guide.md), and [three Canvas frames with three full-page layouts](docs/signature-designs.md).

<a id="documentation"></a>

## Tài liệu / Documentation

Tài liệu chi tiết hiện chủ yếu bằng tiếng Việt. / Detailed documents are currently primarily in Vietnamese.

| Tiếng Việt / English | Nội dung / Scope |
| --- | --- |
| [Yêu cầu sản phẩm / Product requirements](docs/product-requirements.md) | Phạm vi và nghiệm thu / Scope and acceptance criteria |
| [Luồng trải nghiệm / User flows](docs/user-flows.md) | Setup, chụp và xuất ảnh / Setup, capture, and export |
| [Home và Studio / Home and studio](docs/home-and-setup.md) | Điều hướng và responsive / Navigation and responsive behavior |
| [Kho ảnh / Saved photos](docs/saved-gallery.md) | Lưu 7 ngày và khôi phục / 7-day retention and recovery |
| [Frame và layout / Frames and layouts](docs/frame-layout-selection.md) | Hai lựa chọn độc lập / Independent selections |
| [Catalog và bộ lọc / Catalog and filters](docs/catalog-browsing.md) | Duyệt và chọn mẫu / Browsing and selection |
| [Dropdown và lọc / Dropdown filtering](docs/catalog-filters.md) | Bộ lọc và bàn phím / Filters and keyboard controls |
| [Chỉnh sửa ảnh / Photo editing](docs/photo-cropping.md) | Crop và transform / Cropping and transforms |
| [Khay ảnh / Photo tray](docs/photo-library.md) | Tái sử dụng và khử trùng / Reuse and deduplication |
| [Xuất ảnh / Image export](docs/export-optimization.md) | Tối ưu, timeout và iOS / Optimization, timeout, and iOS |
| [Thiết kế kỹ thuật / Technical design](docs/technical-design.md) | Kiến trúc và dữ liệu / Architecture and data |
| [Quy chuẩn code / Coding standards](docs/coding-standards.md) | BEM, logic và chất lượng / BEM, logic, and quality |
| [Hiệu năng / Performance standards](docs/performance-standards.md) | Budget, bộ nhớ và đo lường / Budgets, memory, and measurement |
| [Bảo mật / Security standards](docs/security-standards.md) | File, camera và quyền riêng tư / Files, camera, and privacy |
| [Cấu trúc thư mục / Folder structure](docs/folder-structure.md) | Trách nhiệm và phụ thuộc / Responsibilities and dependencies |
| [Kiểm tra chất lượng / Quality checks](docs/quality-checks.md) | Script `.mjs` và tài nguyên / `.mjs` scripts and assets |
| [Đa ngôn ngữ / Localization](docs/localization.md) | Bản dịch và thiết lập / Translations and preferences |
| [Sáng/tối / Themes](docs/theme.md) | Token và theme hệ thống / Tokens and system theme |
| [UI/UX](docs/ui-ux-spec.md) | Tương tác và khả năng truy cập / Interaction and accessibility |
| [Tạo frame / Frame authoring](docs/frame-authoring-guide.md) | Hình học, tài nguyên và QA / Geometry, assets, and QA |
| [Nguồn artwork / Artwork provenance](docs/artwork-provenance.md) | Nguồn và pipeline / Sources and pipeline |
| [Đánh giá tham khảo / Reference review](docs/reference-design-review.md) | Hướng thiết kế / Design direction |
| [Thiết kế Canvas / Canvas designs](docs/signature-designs.md) | Ba frame và ba bố cục toàn trang / Three frames and full-page layouts |
| [Kế hoạch / Implementation plan](docs/implementation-plan.md) | Mốc công việc và phụ thuộc / Milestones and dependencies |
| [Quyết định kiến trúc / Architecture decisions](docs/architecture-decisions.md) | Lựa chọn và đánh đổi / Decisions and trade-offs |
| [Kiểm thử / Testing strategy](docs/testing-strategy.md) | Fixture, thiết bị và giới hạn / Fixtures, devices, and limitations |
| [Triển khai / Deployment guide](docs/deployment-guide.md) | Hosting, header và rollback / Hosting, headers, and rollback |
| [Trạng thái / Implementation status](docs/implementation-status.md) | Phần đã có và kiểm chứng / Implemented features and validation |
