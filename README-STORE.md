# Acnelance Store

Website thương hiệu và cửa hàng trải nghiệm gồm trang cửa hàng, chi tiết sản phẩm, giỏ hàng, thanh toán mẫu, kết quả đơn mẫu và thông tin mua hàng

## Chạy tại máy

```sh
python3 -m http.server 4173 --directory dist
```

Mở http://localhost:4173/cua-hang/

## Dữ liệu mẫu

Cấu hình sản phẩm trong `dist/commerce-core.mjs`

- Giá minh họa: 289000 VND
- Phí giao hàng minh họa: 30000 VND
- Dung tích có thông tin: 200 ml
- Giỏ hàng giới hạn 10 sản phẩm cho trải nghiệm
- COD là minh họa, chưa nhận tiền hoặc gửi đơn thật

Giỏ hàng chỉ lưu SKU và số lượng trong localStorage; kết quả đơn mẫu trong sessionStorage không chứa thông tin người nhận

## Trước khi mở bán thật

Cần giá và tồn kho chính thức, biểu phí giao hàng, chính sách đã xác nhận, hệ thống máy chủ nhận đơn và phương thức thanh toán

Bản này là website tĩnh; đổi cờ cấu hình không tự bật nhận đơn hoặc xử lý thanh toán thật

Không đặt API key, token, dữ liệu khách hàng hoặc tài khoản ngân hàng nhạy cảm trong JavaScript phía trình duyệt

## Cập nhật giao diện chung

Trang thương hiệu: `dist/index.html`, `dist/style.css`, `dist/app.js`

Các trang cửa hàng dùng `dist/commerce.js` và `dist/commerce.css`; khung header/footer được sinh bởi `scripts/build-commerce.mjs`

Sau khi sửa khung giao diện hoặc thông tin chung, chạy:

```sh
node scripts/build-commerce.mjs
node --test tests/commerce.test.mjs
```

## Ảnh

Ảnh sản phẩm và thành phần lấy từ guideline, cần thay ảnh gốc độ phân giải cao trước khi bán chính thức; banner kết cấu là hình minh họa
