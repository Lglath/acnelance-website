import fs from 'node:fs';
const file='dist/commerce.js';let s=fs.readFileSync(file,'utf8');
if (s.includes('function openQuickView()')) { console.log('Store refinements already applied'); process.exit(0); }
s=s.replace('function cartPage() {',`function cartProgress() {
  return '<ol class="checkout-progress cart-progress" aria-label="Tiến trình mua hàng"><li class="current" aria-current="step">01 Giỏ hàng</li><li>02 Giao nhận & thanh toán</li><li>03 Đơn mẫu</li></ol>';
}
function cartPage() {`);
s=s.replaceAll("${breadcrumbs('Giỏ hàng')}","${breadcrumbs('Giỏ hàng')}${cartProgress()}");
s=s.replace('<button class="store-button full" data-add-cart>Thêm vào giỏ <span>+</span></button></div></article>','<div class="catalog-card-actions"><button class="store-button full" data-add-cart>Thêm vào giỏ <span>+</span></button><button class="quick-view-button" data-quick-view>Xem nhanh <span>↗</span></button></div></div></article>');
s=s.replace('<div class="catalog-toolbar">','<div class="skin-needs"><div><span>LOẠI DA</span><strong>Dầu, mụn</strong></div><div><span>BƯỚC CHĂM SÓC</span><strong>Làm sạch</strong></div><div><span>KẾT CẤU</span><strong>Gel tạo bọt</strong></div></div><div class="catalog-toolbar">');
s=s.replace('  bindPage();updateBadges();','  if (page === \'product\') enhanceProductDetails();\n  bindPage();updateBadges();');
s=s.replace("  main.querySelector('[data-buy-now]')?.addEventListener", "  main.querySelector('[data-quick-view]')?.addEventListener('click', openQuickView);\n  main.querySelector('[data-buy-now]')?.addEventListener");
s=s.replace("  const photo=main.querySelector('#pdp-photo');",`  const photo=main.querySelector('#pdp-photo');
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
  }`);
s=s.replace('const selection=images[button.dataset.gallery];photo.src=selection.src;',"const selection=images[button.dataset.gallery];document.querySelector('.gallery-counter').textContent=`${Object.keys(images).indexOf(button.dataset.gallery)+1} / 3`;photo.src=selection.src;");
s+=`
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
`;
fs.writeFileSync(file,s);console.log('Refined store UX from observed reference patterns');
