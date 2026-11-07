# Thiết kế kỹ thuật đề xuất

## 1. Kiến trúc

Trạng thái và lý do chọn phương án được theo dõi tại [quyết định kiến trúc](architecture-decisions.md); thứ tự xây dựng tại [kế hoạch triển khai](implementation-plan.md). Tạo nội dung theo [hướng dẫn frame](frame-authoring-guide.md), kiểm chứng theo [chiến lược kiểm thử](testing-strategy.md) và phát hành theo [hướng dẫn deploy](deployment-guide.md).

Thiết kế và triển khai phải đáp ứng [performance standards](performance-standards.md) và [security standards](security-standards.md), đặc biệt với giới hạn bitmap/canvas, vòng đời camera, dữ liệu ảnh và tài nguyên bên ngoài.

I18n và theme là hạ tầng giao diện dùng chung, được khởi tạo bởi provider tại `app`. Renderer không phụ thuộc locale/theme để giữ màu sắc thành phẩm nhất quán. Xem [Đa ngôn ngữ](localization.md) và [Giao diện sáng/tối](theme.md).

Mã nguồn tuân theo [quy chuẩn code và BEM](coding-standards.md) cùng [cấu trúc thư mục](folder-structure.md). Tài liệu cấu trúc thư mục quy định vị trí triển khai cụ thể cho các module bên dưới.

Ứng dụng web phía client; phiên bản đầu không cần backend lưu ảnh. Stack chưa được chốt. Có thể dùng TypeScript cùng React/Vite hoặc nền tảng tương đương nếu đáp ứng được renderer và vòng đời camera.

Tách các phần chính:

- `frame-catalog`: metadata, tìm kiếm, lọc và tải tài nguyên frame.
- `photo-library`: file tải lên, ảnh chụp, thumbnail và giải phóng tài nguyên.
- `camera-controller`: quyền camera, video stream, chuyển thiết bị và chụp ảnh.
- `capture-session`: state machine cho hẹn giờ, chụp liên tiếp, hủy và tiếp tục.
- `editor`: gán ảnh vào ô và lưu phép biến đổi từng ảnh.
- `renderer`: vẽ nền, ô ảnh, mask và lớp trang trí cho cả preview/export.
- `exporter`: tạo Blob PNG/JPEG và tải file.

Các đường dẫn module là định hướng tổ chức, chưa phải file đã tồn tại.

## 2. Mô hình frame

Tọa độ của bố cục dùng hệ chuẩn hóa từ 0 đến 1; quy đổi sang pixel theo kích thước bản dựng. Mỗi slot có thể xoay quanh tâm. Thứ tự vẽ phải xác định rõ, đặc biệt với bố cục chồng ảnh.

```ts
type PhotoSlot = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // độ; xoay quanh tâm slot
  mask: 'rect' | 'roundedRect' | 'ellipse';
  cornerRadius?: number; // tỷ lệ theo cạnh ngắn slot
  required: boolean;
  zIndex: number;
};

type LayoutDefinition = {
  id: string;
  name: string;
  outputWidth: number;
  outputHeight: number;
  slots: PhotoSlot[];
};

type FrameDefinition = {
  id: string;
  version: number;
  layoutId: string;
  name: string;
  tags: string[];
  category: string;
  thumbnailUrl: string;
  backgroundColor: string;
  backgroundAssetUrl?: string;
  overlayAssetUrl?: string;
  jpegBackgroundColor: string;
  allowTransparency: boolean;
};
```

Trong bản đầu, background nằm dưới các slot và overlay nằm trên toàn bộ slot; slot được vẽ theo `zIndex`. Nếu thiết kế cần họa tiết xen giữa các ảnh, mở rộng thành danh sách layer có thứ tự rõ ràng trước khi bổ sung frame đó. Không gán frame vào mô hình không thể thể hiện đúng thiết kế.

Asset phải có kích thước/tỷ lệ tương ứng với bố cục; ưu tiên tài nguyên cùng origin hoặc được cấu hình CORS đúng để canvas có thể xuất. SVG dùng làm tài nguyên phải được kiểm soát, không nhận SVG tùy ý từ người dùng. Tài nguyên, font và họa tiết cần có quyền sử dụng phù hợp.

Kiểm tra catalog trước khi phát hành: ID duy nhất, layout tham chiếu tồn tại, kích thước dương, ô hợp lệ, asset đọc được và thumbnail có sẵn. Với ô xoay hoặc nằm sát mép, kiểm tra phần bị cắt là chủ ý thiết kế.

## 3. Ảnh và trạng thái editor

```ts
type PhotoAsset = {
  id: string;
  source: 'upload' | 'camera';
  blob: Blob;
  width: number;
  height: number;
  objectUrl: string;
};

type SlotAssignment = {
  slotId: string;
  photoId: string;
  transform: {
    offsetX: number; // tọa độ dịch chuyển trong hệ local của slot
    offsetY: number;
    scale: number; // hệ số so với cover mặc định
    rotation: number;
    mirrored: boolean;
  };
};
```

Renderer và editor phải thống nhất đơn vị offset, tâm xoay và thứ tự transform. Không lưu crop theo pixel của màn hình vì preview có thể đổi kích thước. Lưu ảnh gốc tách biệt với thumbnail và ảnh làm việc đã giảm kích thước; không nhân bản base64 lớn trong state.

## 4. Camera và lịch chụp

Triển khai camera bằng API trình duyệt sau khi xác minh tương thích với các trình duyệt mục tiêu. Camera cần secure context như HTTPS hoặc localhost trong môi trường phát triển. Các chi tiết API và giới hạn nền tảng cần được đối chiếu tài liệu chính thức tại thời điểm triển khai; đây là đặc tả kiến trúc, không phải hướng dẫn tích hợp đã kiểm chứng.

- Chỉ yêu cầu video, không yêu cầu audio.
- Chờ video có kích thước hợp lệ trước khi cho chụp.
- Khi đổi camera, dừng track cũ trước khi mở stream mới; có xử lý khi yêu cầu camera cụ thể không khả dụng.
- Preview phản chiếu bằng giao diện không đồng nghĩa ảnh chụp tự được phản chiếu. Áp dụng lựa chọn mirror rõ ràng vào ảnh và lưu nhất quán.
- Chụp từ khung hình video hiện tại; không hứa chất lượng bằng ứng dụng camera gốc của thiết bị.
- Dừng mọi track khi đóng camera và khi component bị hủy.

State machine:

```text
idle → requestingPermission → ready → countdown → capturing
                                      ↑            ↓
                                      └─ interval ─┘
capturing → reviewing       (đủ N ảnh)
countdown/interval/capturing → paused  (tab ẩn hoặc camera gián đoạn)
countdown/interval/capturing/paused → reviewing (người dùng dừng)
requestingPermission/ready → error    (không mở được camera)
```

`capturing` xử lý tuần tự, chỉ lên lịch tấm tiếp theo sau khi lưu thành công tấm hiện tại. Mỗi phiên có token/ID; callback từ phiên bị hủy không được cập nhật state. Khi dừng hoặc pause, hủy timer ngay. Ảnh đang xử lý chỉ được nhận một lần và không tạo thêm lần chụp.

Đặt deadline bằng đồng hồ đơn điệu. Khoảng nghỉ tính từ thời điểm chụp tấm trước; nếu xử lý chậm quá khoảng nghỉ, không chụp bù dồn nhiều tấm. Bắt đầu một khoảng nghỉ mới và cập nhật UI theo lịch thực tế. Khi tiếp tục sau pause, đếm ngược lại trước ảnh kế tiếp, giữ nguyên số ảnh đã chụp.

Đóng màn hình chụp thì dừng stream. Nếu chỉ duyệt kết quả ngay trong màn hình chụp và giữ stream để chụp lại, phải báo camera vẫn bật và có nút đóng rõ ràng.

## 5. Quy trình render và export

1. Kiểm tra mọi ô bắt buộc đã có ảnh và toàn bộ asset cần thiết đã tải/giải mã.
2. Tạo canvas theo kích thước đầu ra, độc lập với kích thước CSS của preview.
3. Vẽ màu nền và background asset.
4. Với từng slot theo thứ tự lớp: lưu context, chuyển hệ tọa độ, xoay slot, tạo clip/mask, áp dụng cover/crop/zoom/xoay/mirror của ảnh, vẽ ảnh rồi khôi phục context.
5. Vẽ overlay và các phần trang trí còn lại.
6. Xuất Blob; PNG giữ alpha được cho phép, JPEG được flatten trên màu nền chỉ định.
7. Tạo URL tải xuống; giải phóng URL khi không dùng nữa.

Preview và export dùng cùng tính toán hình học, cùng thứ tự lớp. Nếu preview dùng DOM, vẫn phải dùng các hàm transform chung và có kiểm tra hình ảnh đối chiếu với canvas. Chờ font sẵn sàng trước khi vẽ nếu bổ sung chữ động. Không có chữ tùy chỉnh trong phạm vi ban đầu.

## 6. Bộ nhớ và dữ liệu cá nhân

- Giới hạn file và pixel trước khi đưa ảnh vào bộ nhớ làm việc; tránh giữ nhiều bitmap kích thước gốc cùng lúc.
- Tạo thumbnail nhỏ cho khay ảnh; dùng ảnh đủ độ phân giải cho export.
- Thu hồi object URL, đóng bitmap và bỏ canvas tạm khi ảnh hoặc phiên không còn dùng.
- Không đưa Blob, URL ảnh tạm hoặc ảnh dạng base64 vào log và analytics.
- Không lưu ảnh trong localStorage. Nếu thêm khôi phục phiên bằng IndexedDB, phải có thiết kế riêng về thời hạn, xóa dữ liệu và thông báo người dùng.
- Canvas export tạo ảnh mới; không chủ động sao chép metadata nguồn sang ảnh xuất. Cần xác minh đầu ra thực tế trước khi tuyên bố đã loại bỏ toàn bộ metadata.

## 7. Kế hoạch kiểm chứng khi có mã nguồn

| Phạm vi | Kiểm chứng có giá trị |
| --- | --- |
| Catalog | Schema và tài nguyên hợp lệ cho tất cả frame; kiểm tra số bố cục riêng biệt |
| Hình học | Ảnh ngang/dọc, crop sát mép, slot xoay, mask tròn, chồng lớp và mirror |
| Lịch chụp | Timer điều khiển được: 0 giây, N=1, N=9, hủy, pause, tiếp tục, callback cũ |
| Luồng tích hợp | Upload → gán ô → chỉnh → export; camera giả lập cho burst và chụp lại |
| Thiết bị thật | Quyền camera, đổi trước/sau, khóa màn hình, tải file trên iOS/Android |
| Bộ nhớ | Nhiều ảnh gần giới hạn, đổi frame nhiều lần, mở/đóng camera và export lặp lại |

Các giới hạn file, độ phân giải và khoảng thời gian là cấu hình tập trung, có kiểm tra đầu vào. Chỉ công bố hỗ trợ trình duyệt sau khi đã chạy thử các luồng chính trên trình duyệt và thiết bị tương ứng.
