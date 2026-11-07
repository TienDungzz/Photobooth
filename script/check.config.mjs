export default {
  ignoredDirectories: ['node_modules', '.git', 'dist', 'build', 'coverage', '.cache'],
  assetRoots: ['public', 'src'],
  assetExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.mp4', '.webm', '.mp3', '.wav'],
  // Đường dẫn tương đối chính xác, dùng dấu /. Ngoại lệ phải có lý do.
  assetExceptions: [], // Ví dụ: { path: 'public/frames/example/overlay.png', reason: 'URL tạo động từ catalog' }
  limits: {
    assetWarningBytes: 500 * 1024,
    assetErrorBytes: 5 * 1024 * 1024,
    sourceWarningLines: 400,
    inlineDataWarningCharacters: 2048,
  },
};
