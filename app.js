/* Dados da coleção Yasbella Saboaria. */
const STORE = {
  name: 'Yasbella Saboaria',
  whatsapp: '5511943370562', // DDI + DDD + número, somente dígitos
  email: 'yasbella@gmail.com',
  instagram: 'yasbella'
};

const PRODUCTS = [
  { id: 'la-vie-est-belle', name: 'La Vie Est Belle', subtitle: 'Fragrância La Vie Est Belle', price: 12, weight: '90 g', images: ['assets/products/la-vie-est-belle.webp'], description: 'Sabonete perfumado com a fragrância La Vie Est Belle.', notes: ['Fragrância: La Vie Est Belle', 'Peso: 90 g'] },
  { id: 'jasmin', name: 'Jasmin', subtitle: 'Fragrância Jasmin', price: 12, weight: '90 g', images: ['assets/products/jasmin.webp'], description: 'Sabonete perfumado com fragrância Jasmin.', notes: ['Fragrância: Jasmin', 'Peso: 90 g'] },
  { id: 'giovanna-baby', name: 'Giovanna Baby', subtitle: 'Fragrância Giovanna Baby', price: 12, weight: '90 g', images: ['assets/products/giovanna-baby.webp'], description: 'Sabonete perfumado com fragrância Giovanna Baby.', notes: ['Fragrância: Giovanna Baby', 'Peso: 90 g'] },
  { id: 'talco', name: 'Talco', subtitle: 'Fragrância Talco', price: 15, weight: '120 g', images: ['assets/products/talco.webp'], description: 'Sabonete perfumado com fragrância Talco.', notes: ['Fragrância: Talco', 'Peso: 120 g'] },
  { id: 'lavanda', name: 'Lavanda', subtitle: 'Fragrância Lavanda', price: 15, weight: '120 g', images: ['assets/products/lavanda.webp'], description: 'Sabonete perfumado com fragrância Lavanda.', notes: ['Fragrância: Lavanda', 'Peso: 120 g'] },
  { id: 'camomila', name: 'Camomila', subtitle: 'Fragrância Camomila', price: 15, weight: '120 g', images: ['assets/products/camomila.webp'], description: 'Sabonete perfumado com fragrância Camomila.', notes: ['Fragrância: Camomila', 'Peso: 120 g'] }
];

const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const grid = document.querySelector('[data-product-grid]');
const productPage = document.querySelector('#productPage');
const homePage = document.querySelector('#homePage');
const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartBackdrop = document.querySelector('.cart-backdrop');
const toast = document.querySelector('[data-toast]');
let activeFilter = 'todos';
let searchTerm = '';
let detailQuantity = 1;
let toastTimer;
let cart = readCart();

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('yasmin-cart') || '{}');
    return Object.fromEntries(Object.entries(saved).filter(([id, qty]) => PRODUCTS.some(product => product.id === id) && Number(qty) > 0));
  }
  catch (_) { return {}; }
}

function saveCart() {
  try { localStorage.setItem('yasmin-cart', JSON.stringify(cart)); } catch (_) { /* armazenamento indisponível */ }
}

function productPhoto(product, image, index, className) {
  const alt = index === undefined ? product.name : product.name + ' — foto ' + (index + 1);
  return '<img class="' + (className || '') + '" src="' + image + '" alt="' + alt + '" loading="lazy">';
}

function productCard(product) {
  return '<article class="product-card" data-id="' + product.id + '">' +
    '<div class="product-visual">' +
      '<button class="product-image-open" type="button" data-open-product="' + product.id + '" aria-label="Ver ' + product.name + '"></button>' +
      productPhoto(product, product.images[0], undefined, 'product-photo') +
      '<button class="quick-add" type="button" data-add="' + product.id + '">Adicionar à sacola</button>' +
    '</div><div class="product-info"><button type="button" data-open-product="' + product.id + '"><h3>' + product.name + '</h3></button>' +
      '<p>' + product.subtitle + (product.weight ? ' · ' + product.weight : '') + '</p><div class="product-price"><span>' + (product.price == null ? 'Consulte' : money(product.price)) + '</span><small>' + (product.price == null ? 'preço pelo WhatsApp' : 'por unidade') + '</small></div></div></article>';
}

function renderProducts() {
  const filtered = PRODUCTS.filter(product => {
    const matchesCategory = activeFilter === 'todos' || product.id === activeFilter;
    const haystack = (product.name + ' ' + product.subtitle + ' ' + product.description).toLocaleLowerCase('pt-BR');
    return matchesCategory && haystack.includes(searchTerm.toLocaleLowerCase('pt-BR'));
  });
  grid.innerHTML = filtered.map(productCard).join('');
  document.querySelector('[data-empty-search]').hidden = filtered.length > 0;
}

function updateCartCount() {
  const count = Object.values(cart).reduce((total, qty) => total + qty, 0);
  document.querySelector('[data-cart-count]').textContent = count;
  document.querySelector('[data-cart-heading-count]').textContent = '(' + count + ')';
  document.querySelector('[data-cart-empty]').hidden = count > 0;
  document.querySelector('[data-cart-footer]').hidden = count === 0;
  const items = Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => {
    const product = PRODUCTS.find(item => item.id === id);
    if (!product) return '';
    return '<article class="cart-item"><div class="cart-item-art">' + productPhoto(product, product.images[0], undefined, 'cart-item-photo') + '</div><div><h3>' + product.name + '</h3><p>' + (product.weight ? product.weight + ' · ' : '') + (product.price == null ? 'Consulte preço' : money(product.price)) + '</p><div class="cart-item-controls"><button type="button" aria-label="Diminuir quantidade" data-cart-change="' + id + '" data-delta="-1">−</button><span>' + qty + '</span><button type="button" aria-label="Aumentar quantidade" data-cart-change="' + id + '" data-delta="1">+</button></div></div><button class="cart-item-remove" type="button" data-remove="' + id + '">Remover</button></article>';
  });
  document.querySelector('[data-cart-items]').innerHTML = items.join('');
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);
  const hasUnpricedItem = Object.entries(cart).some(([id, qty]) => qty > 0 && PRODUCTS.some(product => product.id === id && product.price == null));
  document.querySelector('[data-cart-subtotal]').textContent = hasUnpricedItem ? 'A combinar' : money(subtotal);
  saveCart();
}

function openCart() {
  cartBackdrop.hidden = false;
  requestAnimationFrame(() => cartBackdrop.classList.add('is-visible'));
  cartDrawer.classList.add('is-open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  cartDrawer.querySelector('button').focus();
}

function closeCart() {
  cartBackdrop.classList.remove('is-visible');
  cartDrawer.classList.remove('is-open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
  window.setTimeout(() => { if (!cartDrawer.classList.contains('is-open')) cartBackdrop.hidden = true; }, 260);
}

function addToCart(id, quantity) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return;
  cart[id] = (cart[id] || 0) + (quantity || 1);
  updateCartCount();
  openCart();
  showToast(product.name + ' adicionado à sua sacola.');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function openProduct(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return;
  detailQuantity = 1;
  window.location.hash = 'produto/' + product.id;
}

function renderProductPage(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) { window.location.hash = 'inicio'; return; }
  homePage.hidden = true;
  productPage.hidden = false;
  const similar = PRODUCTS.filter(item => item.id !== id).slice(0, 4);
  const thumbs = product.images.length > 1 ? '<div class="detail-thumbs">' + product.images.map((image, index) => '<button class="detail-thumb' + (index === 0 ? ' is-active' : '') + '" type="button" data-detail-image="' + index + '" aria-label="Ver foto ' + (index + 1) + '">' + productPhoto(product, image, index, 'detail-thumb-photo') + '</button>').join('') + '</div>' : '';
  productPage.innerHTML = '<div class="detail-breadcrumb"><a href="#inicio">Início</a> &nbsp;·&nbsp; <a href="#produtos">Produtos</a> &nbsp;·&nbsp; ' + product.name + '</div>' +
    '<div class="detail-layout"><div class="detail-gallery' + (product.images.length > 1 ? '' : ' detail-gallery--single') + '">' + thumbs +
    '<div class="detail-main-art">' + productPhoto(product, product.images[0], 0, 'detail-main-photo') + '</div></div>' +
    '<div class="detail-copy"><p class="eyebrow">YASBELLA SABOARIA · ' + product.weight + '</p><h1>' + product.name + '</h1><p class="detail-price">' + (product.price == null ? 'Consulte' : money(product.price)) + '<small>' + (product.price == null ? 'Preço e disponibilidade pelo WhatsApp' : 'Valor do produto') + '</small></p>' +
    '<div class="detail-buy-row"><div class="quantity-picker"><button type="button" aria-label="Diminuir quantidade" data-detail-quantity="-1">−</button><span data-detail-count>1</span><button type="button" aria-label="Aumentar quantidade" data-detail-quantity="1">+</button></div><button class="button button-dark" type="button" data-add="' + product.id + '" data-add-quantity="detail">Adicionar à sacola <span aria-hidden="true">↗</span></button></div>' +
    '<div class="detail-shipping"><strong>Entrega e atendimento</strong><p>Consulte disponibilidade, frete e prazo diretamente com a loja.</p><button type="button" data-action="whatsapp" data-product-message="' + product.name + '">Consultar pelo WhatsApp</button></div>' +
    '<div class="detail-description"><h2>Sobre este produto</h2><p>' + product.description + '</p><strong>Detalhes</strong><ul>' + product.notes.map(note => '<li>' + note + '</li>').join('') + '</ul></div></div></div>' +
    '<section class="similar-section"><p class="eyebrow">CONTINUE SEU RITUAL</p><h2>Você também pode gostar</h2><div class="product-grid">' + similar.map(productCard).join('') + '</div></section>';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderRoute() {
  const route = decodeURIComponent(window.location.hash.slice(1));
  const match = route.match(/^produto\/([a-z0-9-]+)$/i);
  if (match) renderProductPage(match[1]);
  else {
    productPage.hidden = true;
    homePage.hidden = false;
    if (route === 'produtos') window.setTimeout(() => document.querySelector('#produtos').scrollIntoView(), 0);
    if (route === 'essencia') window.setTimeout(() => document.querySelector('#essencia').scrollIntoView(), 0);
  }
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('[data-filter]').forEach(button => button.classList.toggle('is-active', button.dataset.filter === filter));
  renderProducts();
  productPage.hidden = true;
  homePage.hidden = false;
  document.querySelector('#produtos').scrollIntoView({ behavior: 'smooth' });
}

function whatsapp(text) {
  if (!STORE.whatsapp) {
    showToast('Configure o número do WhatsApp em app.js para ativar este contato.');
    return;
  }
  const url = 'https://wa.me/' + STORE.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(text || 'Olá, Yasbella! Vim pela loja e gostaria de saber mais sobre os produtos.');
  window.open(url, '_blank', 'noopener,noreferrer');
}

function checkout() {
  const items = Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return product ? qty + ' × ' + product.name + (product.weight ? ' (' + product.weight + ')' : '') + (product.price == null ? '' : ' — ' + money(product.price * qty)) : '';
  }).filter(Boolean);
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + (product && product.price != null ? product.price * qty : 0);
  }, 0);
  const hasUnpricedItem = Object.entries(cart).some(([id, qty]) => qty > 0 && PRODUCTS.some(product => product.id === id && product.price == null));
  whatsapp('Olá, Yasbella! Gostaria de fazer este pedido:\n' + items.join('\n') + '\nTotal: ' + (hasUnpricedItem ? 'a combinar' : money(total)) + '\nPode me informar o valor, frete e formas de pagamento?');
}

document.addEventListener('click', event => {
  const action = event.target.closest('[data-action]');
  const add = event.target.closest('[data-add]');
  const open = event.target.closest('[data-open-product]');
  const filter = event.target.closest('[data-filter]');
  const detailImage = event.target.closest('[data-detail-image]');
  const cartChange = event.target.closest('[data-cart-change]');
  const remove = event.target.closest('[data-remove]');
  const detailQuantityButton = event.target.closest('[data-detail-quantity]');
  const sliderPrev = event.target.closest('[data-slider-prev]');
  const sliderNext = event.target.closest('[data-slider-next]');
  const sliderDot = event.target.closest('[data-dot]');

  if (add) {
    const qty = add.dataset.addQuantity === 'detail' ? detailQuantity : 1;
    addToCart(add.dataset.add, qty);
    return;
  }
  if (open && !event.target.closest('.quick-add')) { openProduct(open.dataset.openProduct); return; }
  if (filter) { setFilter(filter.dataset.filter); return; }
  if (detailImage) {
    const gallery = detailImage.closest('.detail-gallery');
    const mainImage = gallery.querySelector('.detail-main-photo');
    const selectedImage = detailImage.querySelector('img');
    mainImage.src = selectedImage.src;
    mainImage.alt = selectedImage.alt;
    gallery.querySelectorAll('[data-detail-image]').forEach(button => button.classList.toggle('is-active', button === detailImage));
    return;
  }
  if (cartChange) {
    const id = cartChange.dataset.cartChange;
    cart[id] = (cart[id] || 0) + Number(cartChange.dataset.delta);
    if (cart[id] <= 0) delete cart[id];
    updateCartCount(); return;
  }
  if (remove) { delete cart[remove.dataset.remove]; updateCartCount(); return; }
  if (detailQuantityButton) {
    detailQuantity = Math.max(1, detailQuantity + Number(detailQuantityButton.dataset.detailQuantity));
    const count = document.querySelector('[data-detail-count]');
    if (count) count.textContent = detailQuantity;
    return;
  }
  if (sliderPrev) { moveSlider(-1); return; }
  if (sliderNext) { moveSlider(1); return; }
  if (sliderDot) { gotoSlide(Number(sliderDot.dataset.dot)); return; }

  if (!action) return;
  if (action.dataset.action === 'open-cart') openCart();
  if (action.dataset.action === 'close-cart') closeCart();
  if (action.dataset.action === 'checkout') checkout();
  if (action.dataset.action === 'whatsapp') {
    const productName = action.dataset.productMessage;
    whatsapp(productName ? 'Olá, Yasbella! Gostaria de consultar entrega e disponibilidade para: ' + productName + '.' : 'Olá, Yasbella! Vim pela loja e gostaria de saber mais sobre os produtos.');
  }
  if (action.dataset.action === 'dismiss-cookie') {
    document.querySelector('[data-cookie-note]').hidden = true;
    try { localStorage.setItem('yasmin-cookie-dismissed', '1'); } catch (_) { /* armazenamento indisponível */ }
  }
  if (action.dataset.action === 'menu') {
    const nav = document.querySelector('[data-main-nav]');
    const expanded = action.getAttribute('aria-expanded') === 'true';
    action.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
  }
  if (action.dataset.action === 'show-all') { setFilter('todos'); }
});

document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });

document.querySelector('[data-search-form]').addEventListener('submit', event => {
  event.preventDefault();
  searchTerm = document.querySelector('#siteSearch').value.trim();
  activeFilter = 'todos';
  document.querySelectorAll('[data-filter]').forEach(button => button.classList.toggle('is-active', button.dataset.filter === 'todos'));
  renderProducts();
  homePage.hidden = false;
  productPage.hidden = true;
  document.querySelector('#produtos').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#siteSearch').addEventListener('input', event => {
  searchTerm = event.target.value.trim();
  activeFilter = 'todos';
  renderProducts();
});

const newsletterForm = document.querySelector('[data-newsletter-form]');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', event => {
    event.preventDefault();
    showToast('Formulário demonstrativo. Conecte uma ferramenta de e-mail antes de publicar.');
    event.currentTarget.reset();
  });
}

document.querySelector('[data-contact]').addEventListener('click', event => {
  if (STORE.whatsapp) {
    event.preventDefault();
    whatsapp('Olá, Yasbella! Gostaria de conversar sobre os produtos.');
  } else {
    showToast('Configure seus canais de atendimento em app.js.');
  }
});

const emailLink = document.querySelector('[data-email-link]');
if (STORE.email) {
  emailLink.href = 'mailto:' + STORE.email;
  emailLink.textContent = STORE.email;
} else {
  emailLink.addEventListener('click', event => { event.preventDefault(); showToast('Configure seu e-mail em app.js.'); });
}

const instagramLink = document.querySelector('[data-instagram-link]');
if (STORE.instagram) {
  instagramLink.href = STORE.instagram;
  instagramLink.target = '_blank';
  instagramLink.rel = 'noopener noreferrer';
} else {
  instagramLink.addEventListener('click', event => { event.preventDefault(); showToast('Configure o perfil do Instagram em app.js.'); });
}

window.addEventListener('hashchange', renderRoute);
document.querySelector('[data-year]').textContent = new Date().getFullYear();

// Slider Logic
let currentSlide = 0;
let sliderInterval;
const slides = document.querySelectorAll('[data-slide]');
const dots = document.querySelectorAll('[data-dot]');

function gotoSlide(index) {
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  
  currentSlide = index;
  
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === currentSlide);
  });
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === currentSlide);
  });
  
  resetSliderTimer();
}

function moveSlider(delta) {
  gotoSlide(currentSlide + delta);
}

function resetSliderTimer() {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => moveSlider(1), 5000);
}

function initSlider() {
  if (slides.length > 0) {
    resetSliderTimer();
  }
}

function initAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Stagger children if they exist
        const staggerItems = entry.target.querySelectorAll('.stagger-item');
        staggerItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('is-visible');
          }, index * 150);
        });
        
        // Once visible, stop observing
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

try {
  if (localStorage.getItem('yasmin-cookie-dismissed') === '1') document.querySelector('[data-cookie-note]').hidden = true;
} catch (_) { /* armazenamento indisponível */ }
renderProducts();
updateCartCount();
renderRoute();
initSlider();
initAnimations();
