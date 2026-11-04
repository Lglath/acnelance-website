const root = document.documentElement;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
const menuButton = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Mở menu');
}
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const dialogs = document.querySelectorAll('dialog');
const productDialog = document.querySelector('#product-dialog');
document.querySelector('#details-button')?.addEventListener('click', () => productDialog.showModal());
document.querySelector('#privacy-button').addEventListener('click', () => document.querySelector('#privacy-dialog').showModal());
dialogs.forEach(dialog => {
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
document.querySelector('#dialog-ritual').addEventListener('click', () => productDialog.close());
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectFormula(tab) {
  const update = () => {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  };
  // Keep the transition local so changing one ingredient does not animate the entire page.
  if (document.startViewTransition && !motionPreference.matches && !root.classList.contains('motion-paused')) {
    document.startViewTransition(update);
  } else { update(); }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectFormula(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); tabs[next].focus(); selectFormula(tabs[next]);
  });
});
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  root.classList.add('motion-ready');
}
function setMotion(paused) {
  root.classList.toggle('motion-paused', paused);
  motionButton.textContent = paused ? 'Chuyển động: Tắt' : 'Chuyển động: Bật';
  motionButton.setAttribute('aria-pressed', String(paused));
}
setMotion(motionPreference.matches);
motionButton.addEventListener('click', () => setMotion(!root.classList.contains('motion-paused')));
motionPreference.addEventListener('change', event => setMotion(event.matches));
let scrollScheduled = false;
const header = document.querySelector('.header');
const progress = document.querySelector('.scroll-progress');
const nativeScrollTimeline = CSS.supports('animation-timeline: scroll()');
function updateScroll() {
  header.classList.toggle('scrolled', scrollY > 24);
  if (!nativeScrollTimeline) {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? scrollY / distance : 0})`;
  }
  scrollScheduled = false;
}
addEventListener('scroll', () => {
  if (!scrollScheduled) { requestAnimationFrame(updateScroll); scrollScheduled = true; }
}, { passive: true });
updateScroll();
const textureSection = document.querySelector('.sensory');
const textureChoices = [...document.querySelectorAll('[data-texture-choice]')];
textureChoices.forEach(button => button.addEventListener('click', () => {
  const choice = button.dataset.textureChoice;
  textureSection.dataset.texture = choice;
  textureChoices.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('.texture-description').textContent = choice === 'foam'
    ? 'Thêm nước, xoa nhẹ trong lòng bàn tay để tạo bọt mịn'
    : 'Kết cấu gel trong, dễ tán đều trong lòng bàn tay';
}));
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.product-stage').forEach(card => card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
  }));
}
// Tilt is limited to precise pointers so touch scrolling remains predictable.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const canMove = () => !motionPreference.matches && !root.classList.contains('motion-paused');
  document.querySelectorAll('.hero-photo, .product-stage').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!canMove()) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 10}deg`);
      card.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 12}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg');
    });
  });
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (!canMove()) return;
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--magnet-x', `${(event.clientX - rect.left - rect.width / 2) * .06}px`);
      button.style.setProperty('--magnet-y', `${(event.clientY - rect.top - rect.height / 2) * .1}px`);
      button.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      button.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--magnet-x', '0px'); button.style.setProperty('--magnet-y', '0px');
    });
  });
}
