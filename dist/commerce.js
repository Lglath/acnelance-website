import { catalog as product, readCart, normalizeQuantity, totals, validPhone, money } from './commerce-core.mjs';
const productUrl = '/san-pham/purifying-blemish-care-cleanser/';
const cartKey = 'acnelance.cart.v1';
let memoryCart = { sku: product.sku, quantity: 0 };
let toastTimer;
let storageUnavailable = false;
const page = document.body.dataset.storePage;
const main = document.querySelector('#store-main');
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function getCart() {
  if (storageUnavailable) return memoryCart;
  try { const raw = localStorage.getItem(cartKey); return raw ? readCart(JSON.parse(raw)) : memoryCart; }
  catch (error) { storageUnavailable = true; console.warn('[Acnelance cart] Unable to read saved basket', error.name); return memoryCart; }
}
function saveCart(quantity) {
  memoryCart = { sku: product.sku, quantity: normalizeQuantity(quantity) };
  try { localStorage.setItem(cartKey, JSON.stringify(memoryCart)); }
  catch (error) { storageUnavailable = true; console.warn('[Acnelance cart] Basket remains in memory', error.name); toast('Trình duyệt không cho lưu giỏ hàng, giỏ hiện chỉ giữ trong phiên này'); }
  updateBadges();
}
function toast(message) {
  const element = document.querySelector('.store-toast');
  if (!element) return;
  element.textContent = message; element.classList.add('visible'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 3500);
}
function updateBadges() {
  const quantity = getCart().quantity;
  document.querySelectorAll('[data-cart-count]').forEach(element => { element.textContent = String(quantity); element.hidden = quantity === 0; });
  document.querySelectorAll('.cart-link').forEach(link => link.setAttribute('aria-label', `Giỏ hàng, ${quantity} sản phẩm`));
}
const breadcrumbs = current => `<nav class="breadcrumbs" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span>/</span>${current === 'Cửa hàng' ? '' : '<a href="/cua-hang/">Cửa hàng</a><span>/</span>'}<span aria-current="page">${current}</span></nav>`;
const demoNote = `<div class="demo-note"><span class="demo-tag">BẢN TRẢI NGHIỆM</span><p>Giá sản phẩm ${money(product.price)} và phí giao hàng ${money(product.shippingFee)} là dữ liệu mẫu, chưa phải mức bán chính thức</p></div>`;
const quantityControl = (quantity, scope='cart') => `<div class="quantity-control" data-quantity-scope="${scope}"><button type="button" data-quantity-minus aria-label="Giảm số lượng" ${quantity<=1?'disabled':''}>−</button><input type="number" min="1" max="${product.maximumQuantity}" step="1" value="${quantity}" aria-label="Số lượng sản phẩm" ${scope==='product'?'id="pdp-quantity"':''} inputmode="numeric"><button type="button" data-quantity-plus aria-label="Tăng số lượng" ${quantity>=product.maximumQuantity?'disabled':''}>+</button></div>`;
const samplePrice = `<span class="price">${money(product.price)}</span><span class="sample-price-label">Giá mẫu</span>`;
function orderSummary(quantity, action='') {
  const sum=totals(quantity);
  return `<aside class="order-summary"><span class="eyebrow">YOUR BALANCE BAG</span><h2>Tóm tắt đơn hàng</h2><dl><div><dt>Sản phẩm (${sum.quantity})</dt><dd>${money(sum.subtotal)}</dd></div><div><dt>Phí giao hàng mẫu</dt><dd>${money(sum.shipping)}</dd></div><div class="summary-total"><dt>Tổng cộng mẫu</dt><dd>${money(sum.total)}</dd></div></dl><p class="summary-note">Các khoản tiền chỉ dùng để kiểm tra luồng mua hàng, chưa phát sinh thanh toán</p>${action}<div class="summary-assurance"><span>200 ml</span><span>Da dầu mụn</span><span>Việt Nam</span></div></aside>`;
}
function catalogPage() {
  return `<div class="store-wrap">${breadcrumbs('Cửa hàng')}<section class="shop-intro"><div><span class="eyebrow">THE ACNELANCE STORE</span><h1>Chăm sóc từ<br><span>những điều vừa đủ</span></h1></div><p>Khám phá Purifying, bắt đầu từ bước làm sạch dành cho da dầu mụn</p></section><div class="skin-needs"><div><span>LOẠI DA</span><strong>Dầu, mụn</strong></div><div><span>BƯỚC CHĂM SÓC</span><strong>Làm sạch</strong></div><div><span>KẾT CẤU</span><strong>Gel tạo bọt</strong></div></div><div class="catalog-toolbar"><div class="collection-filter"><button class="active" aria-pressed="true">Tất cả</button><button data-filter-purifying aria-pressed="false">Purifying</button></div><span>1 sản phẩm</span></div><div class="catalog-layout"><article class="store-product-card"><a class="store-product-photo" href="${productUrl}" aria-label="Xem Purifying Blemish Care Cleanser"><span class="product-badge">PURIFYING · 200 ML</span><img src="${product.image}" width="441" height="443" alt="Acnelance Purifying Blemish Care Cleanser 200 ml"><span class="photo-explore">Khám phá sản phẩm <span>↗</span></span></a><div class="product-card-body"><span class="eyebrow">LÀM SẠCH CHO DA DẦU MỤN</span><h2><a href="${productUrl}">Purifying<br>Blemish Care Cleanser</a></h2><p>Gel trong tạo bọt mịn, làm sạch dầu thừa và bụi bẩn</p><div class="price-row">${samplePrice}</div><div class="catalog-card-actions"><button class="store-button full" data-add-cart>Thêm vào giỏ <span>+</span></button><button class="quick-view-button" data-quick-view>Xem nhanh <span>↗</span></button></div></div></article><aside class="catalog-editorial"><div class="editorial-content"><span class="eyebrow">SCIENCE TO BALANCE</span><h2>Một công thức<br><span>Một bước chăm sóc</span></h2><p>Hiểu điều gì chạm lên làn da trước khi thêm vào giỏ hàng</p><a class="text-link" href="${productUrl}#thanh-phan">Khám phá công thức <span>↗</span></a></div><img src="/assets/texture-editorial.png" alt="Hình minh họa gel trong và bọt mịn" width="1774" height="887"><span class="illustration-label">Hình minh họa kết cấu</span></aside></div>${demoNote}</div>`;
}
function productPage() {
  return `<div class="store-wrap">${breadcrumbs('Purifying Blemish Care Cleanser')}<section class="pdp-grid"><div class="pdp-gallery"><div class="pdp-main-photo"><span class="product-badge">PURIFYING COLLECTION</span><button class="photo-zoom" aria-label="Phóng to hình sản phẩm">↗</button><img id="pdp-photo" src="${product.image}" width="441" height="443" alt="Acnelance Purifying Blemish Care Cleanser 200 ml"></div><div class="gallery-thumbnails" aria-label="Chọn ảnh sản phẩm"><button class="selected" data-gallery="product" aria-pressed="true"><img src="${product.image}" alt="Ảnh sản phẩm"></button><button data-gallery="texture" aria-pressed="false"><img src="/assets/texture-editorial.png" alt="Hình minh họa kết cấu"></button><button data-gallery="ingredients" aria-pressed="false"><img src="/assets/ingredients.webp" alt="Thông tin nhóm thành phần"></button></div><p class="gallery-note" data-gallery-note>Ảnh sản phẩm từ tài liệu thương hiệu</p></div><div class="pdp-purchase"><span class="eyebrow">ACNELANCE / PURIFYING</span><h1>Purifying<span>Blemish Care Cleanser</span></h1><p class="pdp-subtitle">${product.vietnameseName}</p><div class="pdp-facts"><span>Gel trong</span><span>Bọt mịn</span><span>Da dầu mụn</span></div><div class="price-row pdp-price">${samplePrice}</div><p class="pdp-description">Kết cấu gel trong tạo bọt mịn, giúp làm sạch dầu thừa, bụi bẩn và sợi bã nhờn trong bước chăm sóc mỗi ngày</p><div class="size-choice"><span>Dung tích</span><button aria-pressed="true">200 ml <span>✓</span></button></div><div class="purchase-quantity"><label for="pdp-quantity">Số lượng</label>${quantityControl(1,'product')}</div><div class="purchase-actions"><button class="store-button full" data-add-cart>Thêm vào giỏ <span>+</span></button><button class="store-button secondary full" data-buy-now>Mua ngay <span>↗</span></button></div><p class="purchase-disclaimer">Bản trải nghiệm với giá mẫu, chưa nhận đơn hoặc thu tiền thực tế</p><div class="pdp-delivery"><span>↗</span><div><strong>Thông tin giao hàng minh bạch</strong><p>Phí giao hàng mẫu ${money(product.shippingFee)} được hiển thị trước khi xác nhận</p><a href="/chinh-sach/">Xem thông tin mua hàng</a></div></div></div></section><nav class="pdp-section-nav" aria-label="Thông tin sản phẩm"><a href="#tong-quan">Tổng quan</a><a href="#thanh-phan">Thành phần</a><a href="#cach-dung">Cách sử dụng</a><a href="#luu-y">Lưu ý</a></nav><section class="pdp-detail-section" id="tong-quan"><div><span class="eyebrow">THE DAILY ESSENTIAL</span><h2>Làm sạch<br><span>Vừa đủ cho da</span></h2></div><div><p>Purifying Blemish Care Cleanser là sữa rửa mặt thuộc dòng Purifying của Acnelance, dành cho da dầu mụn</p><dl class="spec-table"><div><dt>Dung tích</dt><dd>200 ml</dd></div><div><dt>Kết cấu</dt><dd>Gel trong, tạo bọt mịn</dd></div><div><dt>Xuất xứ</dt><dd>Việt Nam</dd></div><div><dt>Công dụng</dt><dd>Làm sạch dầu thừa, bụi bẩn và sợi bã nhờn</dd></div></dl></div></section><section class="pdp-detail-section" id="thanh-phan"><div><span class="eyebrow">FORMULA, EXPLAINED</span><h2>Hiểu công thức<br><span>Chọn cách chăm sóc</span></h2><p>Thông tin theo tài liệu thương hiệu, xem bao bì để biết danh sách thành phần đầy đủ</p></div><div class="ingredient-cards"><article><span>01 / LÀM SẠCH</span><h3>SLES · ALS · Cocamidopropyl Betaine</h3><p>Tạo bọt, làm sạch bụi bẩn, dầu thừa và bã nhờn trên bề mặt da</p></article><article><span>02 / DƯỠNG ẨM</span><h3>Panthenol · Allantoin · Trehalose</h3><p>Các thành phần dưỡng ẩm trong công thức chăm sóc da hằng ngày</p></article><article><span>03 / DA DẦU MỤN</span><h3>Zinc PCA · Chiết xuất rau má</h3><p>Kẽm PCA hỗ trợ làm sạch dầu thừa và bã nhờn</p></article></div></section><section class="pdp-detail-section" id="cach-dung"><div><span class="eyebrow">YOUR DAILY RITUAL</span><h2>Bốn bước nhỏ<br><span>Một nhịp chăm sóc</span></h2></div><ol class="pdp-steps"><li><h3>Làm ướt</h3><p>Làm ướt da mặt và lòng bàn tay</p></li><li><h3>Lấy gel</h3><p>Cho lượng gel vừa đủ ra tay và thêm nước</p></li><li><h3>Tạo bọt</h3><p>Xoa nhẹ trong lòng bàn tay để tạo bọt</p></li><li><h3>Rửa sạch</h3><p>Mát xa 20–30 giây, sau đó rửa sạch với nước</p></li></ol></section><section class="pdp-detail-section last" id="luu-y"><div><span class="eyebrow">CARE WITH CLARITY</span><h2>Chăm sóc<br><span>Có chừng mực</span></h2></div><div><ul class="care-list"><li>Chỉ dùng ngoài da, tránh tiếp xúc với mắt</li><li>Ngừng sử dụng nếu xuất hiện kích ứng</li><li>Mỗi làn da có thể có cảm nhận khác nhau</li><li>Đây là mỹ phẩm, không phải thuốc và không thay thế thuốc điều trị</li></ul><a class="text-link" href="/chinh-sach/">Giao hàng, đổi trả và quyền riêng tư <span>↗</span></a></div></section></div><div class="mobile-purchase"><div><strong>${money(product.price)}</strong><small>Giá mẫu · 200 ml</small></div><button class="store-button" data-add-cart>Thêm vào giỏ <span>+</span></button></div><dialog class="photo-dialog" id="photo-dialog" aria-label="Ảnh phóng to"><button data-close-photo aria-label="Đóng ảnh">×</button><img alt="Ảnh sản phẩm phóng to"></dialog>`;
}
function cartProgress() {
  return '<ol class="checkout-progress cart-progress" aria-label="Tiến trình mua hàng"><li class="current" aria-current="step">01 Giỏ hàng</li><li>02 Giao nhận & thanh toán</li><li>03 Đơn mẫu</li></ol>';
}
function cartPage() {
  const cart=getCart();
  if(!cart.quantity) return `<div class="store-wrap">${breadcrumbs('Giỏ hàng')}${cartProgress()}<section class="empty-state"><div class="empty-orb">◌</div><span class="eyebrow">YOUR BALANCE BAG</span><h1>Giỏ hàng đang trống</h1><p>Khám phá bước làm sạch cho làn da dầu mụn và chọn sản phẩm phù hợp với bạn</p><a class="store-button" href="/cua-hang/">Khám phá cửa hàng <span>↗</span></a></section></div>`;
  return `<div class="store-wrap">${breadcrumbs('Giỏ hàng')}${cartProgress()}<div class="cart-page-heading"><span class="eyebrow">YOUR BALANCE BAG</span><h1>Giỏ hàng của bạn</h1><p>${cart.quantity} sản phẩm · Dữ liệu giá mẫu</p></div><div class="cart-layout"><section aria-label="Sản phẩm trong giỏ"><div class="cart-line"><a href="${productUrl}"><img src="${product.image}" width="441" height="443" alt="Purifying Blemish Care Cleanser"></a><div class="cart-line-copy"><span class="eyebrow">PURIFYING / 200 ML</span><h2><a href="${productUrl}">${product.name}</a></h2><p>Gel trong tạo bọt mịn cho da dầu mụn</p><div class="price-row">${samplePrice}</div><div class="cart-line-actions">${quantityControl(cart.quantity)}<button class="remove-item" data-remove-cart>Xóa khỏi giỏ</button></div></div><strong class="line-total">${money(totals(cart.quantity).subtotal)}</strong></div><a class="continue-shopping" href="/cua-hang/">← Tiếp tục mua sắm</a><div class="cart-explainer"><h3>Biết rõ trước khi thanh toán</h3><p>Đây là giỏ hàng trải nghiệm, giá và phí giao hàng chưa phải thông tin bán chính thức</p><a href="/chinh-sach/">Xem thông tin mua hàng ↗</a></div></section>${orderSummary(cart.quantity,'<a class="store-button full" href="/thanh-toan/">Tiếp tục thanh toán <span>↗</span></a>')}</div></div>`;
}
function checkoutPage() {
  const cart=getCart();if(!cart.quantity)return cartPage();
  return `<div class="store-wrap checkout-wrap">${breadcrumbs('Thanh toán')}<ol class="checkout-progress" aria-label="Tiến trình mua hàng"><li><a href="/gio-hang/">01 Giỏ hàng</a></li><li class="current" aria-current="step">02 Thanh toán</li><li>03 Hoàn tất</li></ol><div class="checkout-heading"><span class="eyebrow">ONE STEP CLOSER TO BALANCE</span><h1>Thông tin nhận hàng</h1><p>Kiểm tra thông tin và tổng tiền trước khi tạo đơn mẫu</p></div><div class="checkout-layout"><form id="checkout-form" novalidate><div class="checkout-demo-notice"><strong>Đang ở chế độ trải nghiệm</strong><p>Chỉ nhập thông tin giả để thử luồng, thông tin trong biểu mẫu không được gửi đến máy chủ</p><button type="button" data-fill-sample>Điền dữ liệu mẫu ↗</button></div><fieldset><legend>Người nhận</legend><div class="field-grid"><div class="form-field"><label for="customer-name">Họ và tên <span>*</span></label><input id="customer-name" name="customerName" autocomplete="name" maxlength="80" placeholder="Tên người nhận" required><small class="field-error" id="error-customer-name"></small></div><div class="form-field"><label for="customer-phone">Số điện thoại <span>*</span></label><input id="customer-phone" name="customerPhone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="Ví dụ 0900000000" required><small class="field-error" id="error-customer-phone"></small></div></div><div class="form-field"><label for="customer-email">Email <small>Không bắt buộc</small></label><input id="customer-email" name="customerEmail" type="email" autocomplete="email" maxlength="120" placeholder="Địa chỉ email"><small class="field-error" id="error-customer-email"></small></div></fieldset><fieldset><legend>Địa chỉ giao hàng</legend><div class="field-grid"><div class="form-field"><label for="customer-city">Tỉnh / thành phố <span>*</span></label><input id="customer-city" name="customerCity" autocomplete="address-level1" maxlength="80" placeholder="Tỉnh hoặc thành phố" list="city-options" required><datalist id="city-options"><option value="Thành phố Hồ Chí Minh"><option value="Hà Nội"><option value="Đà Nẵng"></datalist><small class="field-error" id="error-customer-city"></small></div><div class="form-field"><label for="customer-ward">Phường / xã <span>*</span></label><input id="customer-ward" name="customerWard" autocomplete="address-level2" maxlength="100" placeholder="Phường hoặc xã" required><small class="field-error" id="error-customer-ward"></small></div></div><div class="form-field"><label for="customer-address">Số nhà, tên đường <span>*</span></label><input id="customer-address" name="customerAddress" autocomplete="street-address" maxlength="200" placeholder="Số nhà, tên đường, tòa nhà" required><small class="field-error" id="error-customer-address"></small></div><div class="form-field"><label for="order-note">Ghi chú giao hàng <small>Không bắt buộc</small></label><textarea id="order-note" name="orderNote" maxlength="300" rows="3" placeholder="Thông tin giúp giao hàng thuận tiện hơn"></textarea></div></fieldset><fieldset><legend>Giao hàng</legend><label class="delivery-option"><input type="radio" checked name="shipping" value="sample"><span><strong>Giao hàng tiêu chuẩn — minh họa</strong><small>Phí và thời gian giao thực tế sẽ cập nhật trước khi mở bán</small></span><strong>${money(product.shippingFee)}</strong></label></fieldset><fieldset><legend>Phương thức thanh toán</legend><label class="payment-option selected"><input type="radio" name="payment" value="cod-demo" checked><span><strong>Thanh toán khi nhận hàng</strong><small>COD minh họa — không phát sinh đơn giao hàng</small></span><span class="payment-mark">COD</span></label><label class="payment-option unavailable"><input type="radio" name="payment" value="transfer" disabled><span><strong>Chuyển khoản / thanh toán trực tuyến</strong><small>Chưa được cấu hình, không chuyển tiền trong bản trải nghiệm</small></span></label></fieldset><label class="checkout-consent"><input id="sample-consent" type="checkbox"><span>Tôi hiểu đây là đơn mẫu, không phát sinh mua hàng hoặc thanh toán thực tế</span></label><small class="field-error" id="error-sample-consent"></small><div class="form-error-summary" role="alert" tabindex="-1" hidden></div><button class="store-button full checkout-submit" type="submit">Kiểm tra & tạo đơn mẫu <span>↗</span></button><p class="form-privacy">Thông tin người nhận không được lưu vào giỏ hàng hoặc gửi đi · <a href="/chinh-sach/#quyen-rieng-tu">Quyền riêng tư</a></p></form><div class="checkout-sidebar"><div class="checkout-item"><img src="${product.image}" alt="Purifying Blemish Care Cleanser" width="80" height="80"><div><strong>${product.name}</strong><small>200 ml · Số lượng ${cart.quantity}</small></div></div>${orderSummary(cart.quantity)}<a class="edit-cart-link" href="/gio-hang/">← Chỉnh sửa giỏ hàng</a></div></div></div>`;
}
function confirmationPage() {
  let order;
  try { order=JSON.parse(sessionStorage.getItem('acnelance.lastSampleOrder')||'null'); }
  catch(error){ console.warn('[Acnelance checkout] Unable to read sample order',error.name); }
  if(!order || typeof order.id!=='string' || !Number.isInteger(order.quantity) || order.quantity<1 || order.quantity>product.maximumQuantity){return `<div class="store-wrap"><section class="empty-state"><span class="eyebrow">ORDER PREVIEW</span><h1>Chưa có đơn mẫu</h1><p>Bắt đầu từ cửa hàng để trải nghiệm luồng mua sắm</p><a class="store-button" href="/cua-hang/">Đến cửa hàng <span>↗</span></a></section></div>`;}
  const sum=totals(order.quantity);
  return `<div class="store-wrap confirmation-wrap"><ol class="checkout-progress"><li>01 Giỏ hàng</li><li>02 Thanh toán</li><li class="current">03 Hoàn tất mẫu</li></ol><section class="confirmation-card"><div class="confirmation-icon" aria-hidden="true">✓</div><span class="eyebrow">YOUR ROUTINE, PREVIEWED</span><h1>Bạn đã hoàn tất<br><span>một đơn hàng mẫu</span></h1><p>Luồng mua sắm đã được kiểm tra, chưa có đơn hàng thật được gửi đến Acnelance và chưa thu tiền</p><div class="sample-order-id"><span>MÃ ĐƠN MẪU</span><strong>${escapeHtml(order.id)}</strong></div><dl class="confirmation-details"><div><dt>Sản phẩm</dt><dd>${product.name} · 200 ml</dd></div><div><dt>Số lượng</dt><dd>${order.quantity}</dd></div><div><dt>Tổng tiền minh họa</dt><dd>${money(sum.total)}</dd></div><div><dt>Thanh toán</dt><dd>COD minh họa · Chưa thanh toán</dd></div></dl><div class="confirmation-next"><h2>Trước khi cửa hàng mở bán</h2><p>Acnelance cần công bố giá, phí giao hàng, chính sách và kết nối hệ thống nhận đơn chính thức</p></div><a class="store-button" href="/cua-hang/">Quay lại cửa hàng <span>↗</span></a></section></div>`;
}
function policiesPage() {
  return `<div class="store-wrap policies-wrap">${breadcrumbs('Hỗ trợ mua hàng')}<div class="policies-heading"><span class="eyebrow">SHOP WITH CLARITY</span><h1>Thông tin mua hàng<br><span>Rõ ràng từ đầu</span></h1><p>Cửa hàng đang ở chế độ trải nghiệm, các điều kiện bán hàng thực tế chưa có hiệu lực</p></div><div class="policy-layout"><nav aria-label="Thông tin hỗ trợ"><a href="#gia-ban">Giá & trạng thái cửa hàng</a><a href="#giao-hang">Giao hàng</a><a href="#thanh-toan">Thanh toán</a><a href="#doi-tra">Đổi trả</a><a href="#quyen-rieng-tu">Quyền riêng tư</a></nav><div><section id="gia-ban"><h2>Giá & trạng thái cửa hàng</h2><p>Giá sản phẩm ${money(product.price)} và phí giao hàng ${money(product.shippingFee)} được dùng để minh họa phép tính trong giỏ hàng và thanh toán</p><p>Cửa hàng chưa nhận đơn thực tế, chưa có giá bán chính thức hoặc xác nhận tình trạng tồn kho</p></section><section id="giao-hang"><h2>Giao hàng</h2><p>Phạm vi giao hàng, thời gian dự kiến và biểu phí chính thức sẽ được công bố trước khi mở bán</p><p>Không có đơn vị vận chuyển nào được đặt giao hàng từ bản trải nghiệm này</p></section><section id="thanh-toan"><h2>Thanh toán</h2><p>COD hiện chỉ là lựa chọn minh họa, chưa tích hợp tài khoản nhận tiền hoặc cổng thanh toán</p><p>Không chuyển khoản hoặc nhập thông tin thẻ để thực hiện đơn mẫu</p></section><section id="doi-tra"><h2>Đổi trả</h2><p>Điều kiện, thời hạn và kênh tiếp nhận đổi trả cần được thương hiệu xác nhận trước khi bán hàng</p><p>Bản trải nghiệm chưa có cam kết đổi trả hoặc bảo đảm giao hàng</p></section><section id="quyen-rieng-tu"><h2>Quyền riêng tư</h2><p>Giỏ hàng chỉ lưu mã sản phẩm và số lượng trong trình duyệt, không lưu họ tên, điện thoại hoặc địa chỉ</p><p>Thông tin nhập trong thanh toán mẫu chỉ được dùng để kiểm tra biểu mẫu tại chỗ, không được gửi đến máy chủ và không được ghi vào dữ liệu đơn mẫu</p><p>Sau khi hoàn tất, phiên trình duyệt chỉ giữ mã đơn mẫu, số lượng và thời điểm tạo để hiển thị kết quả</p><p>Chính sách xử lý dữ liệu đầy đủ cần được công bố trước khi bật nhận đơn thực tế</p></section></div></div></div>`;
}
function render() {
  if(!main)return;
  const renderers={catalog:catalogPage,product:productPage,cart:cartPage,checkout:checkoutPage,confirmation:confirmationPage,policies:policiesPage};
  main.innerHTML=renderers[page]?.()||'';
  if (page === 'product') enhanceProductDetails();
  bindPage();updateBadges();
}
function getProductQuantity() {
  const input=document.querySelector('[data-quantity-scope="product"] input');
  return Math.max(1,normalizeQuantity(input?.value||1));
}
function addToCart(buyNow=false) {
  const current=getCart().quantity;
  const requested=page==='product'?getProductQuantity():1;
  if(current>=product.maximumQuantity){toast(`Giỏ hàng tối đa ${product.maximumQuantity} sản phẩm trong bản trải nghiệm`);if(buyNow)location.href='/thanh-toan/';return;}
  saveCart(current+requested);
  if(buyNow){location.href='/thanh-toan/';return;}
  openDrawer();
}
function bindQuantityControl(control) {
  const input=control.querySelector('input');
  const apply=value=>{
    const quantity=Math.max(1,normalizeQuantity(value));input.value=String(quantity);
    control.querySelector('[data-quantity-minus]').disabled=quantity<=1;
    control.querySelector('[data-quantity-plus]').disabled=quantity>=product.maximumQuantity;
    if(control.dataset.quantityScope==='cart'){saveCart(quantity);if(page==='cart'||page==='checkout')render();if(document.querySelector('#cart-drawer')?.open)renderDrawer();}
  };
  control.querySelector('[data-quantity-minus]').addEventListener('click',()=>apply(Number(input.value)-1));
  control.querySelector('[data-quantity-plus]').addEventListener('click',()=>apply(Number(input.value)+1));
  input.addEventListener('change',()=>apply(input.value));
}
function bindPage() {
  main.querySelectorAll('[data-add-cart]').forEach(button=>button.addEventListener('click',()=>addToCart()));
  main.querySelector('[data-quick-view]')?.addEventListener('click', openQuickView);
  main.querySelector('[data-buy-now]')?.addEventListener('click',()=>addToCart(true));
  main.querySelectorAll('.quantity-control').forEach(bindQuantityControl);
  main.querySelector('[data-remove-cart]')?.addEventListener('click',()=>{saveCart(0);render();toast('Đã xóa sản phẩm khỏi giỏ');});
  main.querySelectorAll('.collection-filter button').forEach(button=>button.addEventListener('click',()=>{
    main.querySelectorAll('.collection-filter button').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
  }));
  const photo=main.querySelector('#pdp-photo');
  if (photo) {
    const stage = main.querySelector('.pdp-main-photo');
    stage.insertAdjacentHTML('beforeend', '<button class="gallery-arrow previous" data-gallery-prev aria-label="Ảnh trước">←</button><button class="gallery-arrow next" data-gallery-next aria-label="Ảnh tiếp theo">→</button><span class="gallery-counter" aria-live="polite">1 / 3</span>');
    const move = delta => {
      const buttons = [...main.querySelectorAll('[data-gallery]')];
      const current = buttons.findIndex(button => button.classList.contains('selected'));
      buttons[(current + delta + buttons.length) % buttons.length].click();
    };
    stage.querySelector('[data-gallery-prev]').addEventListener('click', () => move(-1));
    stage.querySelector('[data-gallery-next]').addEventListener('click', () => move(1));
    stage.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
    });
  }
  const images={product:{src:product.image,alt:'Acnelance Purifying Blemish Care Cleanser 200 ml',note:'Ảnh sản phẩm từ tài liệu thương hiệu'},texture:{src:'/assets/texture-editorial.png',alt:'Hình minh họa gel trong và bọt mịn',note:'Hình minh họa kết cấu'},ingredients:{src:'/assets/ingredients.webp',alt:'Nhóm thành phần theo tài liệu thương hiệu',note:'Hình minh họa nhóm thành phần'}};
  main.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{
    const selection=images[button.dataset.gallery];document.querySelector('.gallery-counter').textContent=`${Object.keys(images).indexOf(button.dataset.gallery)+1} / 3`;photo.src=selection.src;photo.alt=selection.alt;document.querySelector('[data-gallery-note]').textContent=selection.note;
    main.querySelectorAll('[data-gallery]').forEach(item=>{item.classList.toggle('selected',item===button);item.setAttribute('aria-pressed',String(item===button));});
  }));
  main.querySelector('.photo-zoom')?.addEventListener('click',()=>{
    const dialog=document.querySelector('#photo-dialog');dialog.querySelector('img').src=photo.src;dialog.querySelector('img').alt=photo.alt;dialog.showModal();
  });
  main.querySelector('[data-close-photo]')?.addEventListener('click',()=>document.querySelector('#photo-dialog').close());
  if(page==='checkout'&&getCart().quantity)bindCheckout();
}
function renderDrawer() {
  const content=document.querySelector('[data-drawer-content]');if(!content)return;
  const cart=getCart();
  content.innerHTML=cart.quantity?`<p class="drawer-added">✓ Đã thêm vào giỏ hàng</p><div class="drawer-product"><img src="${product.image}" width="100" height="110" alt="Purifying Blemish Care Cleanser"><div><span class="eyebrow">PURIFYING / 200 ML</span><h3>${product.name}</h3><p>${money(product.price)} <small>Giá mẫu</small></p>${quantityControl(cart.quantity)}</div></div><div class="drawer-subtotal"><span>Tạm tính mẫu</span><strong>${money(totals(cart.quantity).subtotal)}</strong></div><p class="drawer-note">Phí giao hàng mẫu ${money(product.shippingFee)}, chưa thu tiền thực tế</p><a class="store-button full" href="/gio-hang/">Xem giỏ hàng <span>↗</span></a><a class="store-button secondary full" href="/thanh-toan/">Tiếp tục thanh toán <span>→</span></a><button class="drawer-continue" data-close-drawer>Tiếp tục mua sắm</button>`:'<p>Giỏ hàng đang trống</p><a class="store-button full" href="/cua-hang/">Khám phá sản phẩm ↗</a>';
  content.querySelectorAll('.quantity-control').forEach(bindQuantityControl);
  content.querySelectorAll('[data-close-drawer]').forEach(button=>button.addEventListener('click',()=>document.querySelector('#cart-drawer').close()));
}
function openDrawer(){const drawer=document.querySelector('#cart-drawer');if(!drawer){location.href='/gio-hang/';return;}renderDrawer();drawer.showModal();}
function bindCheckout() {
  const form=document.querySelector('#checkout-form');
  form.querySelector('[data-fill-sample]').addEventListener('click',()=>{
    const sample={'customer-name':'Khách trải nghiệm','customer-phone':'0900000000','customer-email':'demo@example.com','customer-city':'Thành phố Hồ Chí Minh','customer-ward':'Phường minh họa','customer-address':'123 Đường mẫu'};
    Object.entries(sample).forEach(([id,value])=>document.getElementById(id).value=value);toast('Đã điền thông tin giả để kiểm tra biểu mẫu');
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const cart=getCart();if(!cart.quantity){location.href='/gio-hang/';return;}
    const errors=[];
    const check=(id,message,valid)=>{
      const field=document.getElementById(id),error=document.getElementById(`error-${id}`);
      field.setAttribute('aria-invalid',String(!valid));
      if(!valid){field.setAttribute('aria-describedby',`error-${id}`);error.textContent=message;errors.push({id,message});}else{field.removeAttribute('aria-describedby');error.textContent='';}
    };
    check('customer-name','Nhập họ tên từ 2 ký tự',form.elements.customerName.value.trim().length>=2);
    check('customer-phone','Nhập số điện thoại Việt Nam hợp lệ',validPhone(form.elements.customerPhone.value));
    check('customer-email','Kiểm tra lại định dạng email',!form.elements.customerEmail.value.trim()||form.elements.customerEmail.validity.valid);
    check('customer-city','Nhập tỉnh hoặc thành phố',form.elements.customerCity.value.trim().length>=2);
    check('customer-ward','Nhập phường hoặc xã',form.elements.customerWard.value.trim().length>=2);
    check('customer-address','Nhập số nhà và tên đường từ 5 ký tự',form.elements.customerAddress.value.trim().length>=5);
    check('sample-consent','Vui lòng xác nhận đây là đơn mẫu',document.querySelector('#sample-consent').checked);
    const summary=form.querySelector('.form-error-summary');summary.hidden=errors.length===0;
    if(errors.length){summary.textContent=`Còn ${errors.length} mục cần kiểm tra trước khi tạo đơn mẫu`;document.getElementById(errors[0].id).focus();return;}
    // Store only non-personal sample metadata; receiving a real order requires a server integration.
    const order={id:`MAU-${crypto.randomUUID().slice(0,8).toUpperCase()}`,quantity:cart.quantity,createdAt:new Date().toISOString(),sample:true};
    try{sessionStorage.setItem('acnelance.lastSampleOrder',JSON.stringify(order));}
    catch(error){console.error('[Acnelance checkout] Cannot save sample confirmation',error.name);summary.hidden=false;summary.textContent='Trình duyệt không cho lưu phiên, đơn mẫu chưa được tạo và giỏ hàng vẫn được giữ';summary.focus();return;}
    saveCart(0);form.reset();location.href='/don-hang/';
  });
}
const menuButton=document.querySelector('.store-menu');
menuButton?.addEventListener('click',()=>{const nav=document.querySelector('#store-navigation');const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Đóng menu':'Mở menu');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('#store-navigation')?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Mở menu');}});
document.querySelector('[data-close-drawer]')?.addEventListener('click',()=>document.querySelector('#cart-drawer').close());
window.addEventListener('storage',event=>{if(event.key===cartKey){updateBadges();if(page==='cart')render();if(page==='checkout'){toast('Giỏ hàng vừa thay đổi ở tab khác, vui lòng kiểm tra lại');render();}}});
render();updateBadges();

function enhanceProductDetails() {
  const labels = { 'tong-quan': 'Mô tả sản phẩm', 'thanh-phan': 'Thành phần chính', 'cach-dung': 'Cách sử dụng', 'luu-y': 'Lưu ý, giao hàng & đổi trả' };
  main.querySelectorAll('.pdp-detail-section').forEach((section, index) => {
    const detail = document.createElement('details');
    detail.id = section.id; detail.className = 'pdp-accordion'; detail.open = index === 0;
    const intro = [...section.firstElementChild.querySelectorAll('p')].map(p => p.outerHTML).join('');
    const content = section.children[1].outerHTML;
    detail.innerHTML = '<summary><span class="accordion-index">0' + (index+1) + '</span><h2>' + labels[section.id] + '</h2><span class="accordion-plus" aria-hidden="true">+</span></summary><div class="pdp-accordion-content">' + intro + content + '</div>';
    section.replaceWith(detail);
  });
  const openTarget = hash => {
    const target = document.getElementById(hash.replace('#',''));
    if (target?.matches('.pdp-accordion')) target.open = true;
  };
  main.querySelectorAll('.pdp-section-nav a').forEach(link => link.addEventListener('click', () => openTarget(link.hash)));
  openTarget(location.hash);
}
function openQuickView() {
  let dialog = document.querySelector('#quick-view');
  if (!dialog) {
    dialog = document.createElement('dialog'); dialog.id='quick-view'; dialog.className='quick-view-dialog';
    dialog.setAttribute('aria-labelledby','quick-view-title');
    dialog.innerHTML = '<button class="quick-view-close" aria-label="Đóng xem nhanh">×</button><div class="quick-view-grid"><img src="'+product.image+'" alt="Purifying Blemish Care Cleanser 200 ml"><div><span class="eyebrow">PURIFYING / 200 ML</span><h2 id="quick-view-title">'+product.name+'</h2><p>'+product.vietnameseName+'</p><div class="price-row">'+samplePrice+'</div><p class="quick-view-description">Gel trong tạo bọt mịn, làm sạch dầu thừa, bụi bẩn và sợi bã nhờn</p><button class="store-button full" data-quick-add>Thêm vào giỏ <span>+</span></button><a class="quick-view-detail" href="'+productUrl+'">Xem chi tiết sản phẩm ↗</a><small>Giá mẫu · Chưa nhận đơn thực tế</small></div></div>';
    document.body.append(dialog);
    dialog.querySelector('.quick-view-close').addEventListener('click',()=>dialog.close());
    dialog.querySelector('[data-quick-add]').addEventListener('click',()=>{dialog.close();addToCart();});
  }
  dialog.showModal();
}
// Mark the current section without relying on hover to orient shoppers.
document.querySelectorAll('#store-navigation a').forEach(link => {
  if (new URL(link.href).pathname === location.pathname) link.setAttribute('aria-current', 'page');
});
