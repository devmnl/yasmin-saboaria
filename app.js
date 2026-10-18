/* Dados demonstrativos: substitua catálogo, preços, contatos e textos antes de publicar. */
const STORE = {
  name: 'Yasbella Saboaria',
  whatsapp: '5511943370562', // DDI + DDD + número, somente dígitos
  email: 'yasbella@gmail.com',
  instagram: 'yasbella'
};

const PRODUCTS = [
  { id: 'curcuma', name: 'Barra de Cúrcuma', subtitle: 'Cúrcuma & especiarias · luminosidade', price: 22, category: 'argilas', tone: 'turmeric', badge: 'Destaque', weight: '100 g', description: 'Uma barra vibrante e energizante, formulada com cúrcuma para trazer luminosidade e cuidado natural para a sua pele.', notes: ['Propriedades antioxidantes', 'Aroma quente e terroso', 'Textura suave com especiarias'] },
  { id: 'calma', name: 'Barra Botânica', subtitle: 'Lavanda · pausa e aconchego', price: 18, category: 'banho', tone: 'rose', badge: 'Mais querido', weight: '100 g', description: 'Uma barra artesanal de aroma delicado, criada para transformar o banho em uma pausa tranquila no meio do dia.', notes: ['Aroma floral suave', 'Produção artesanal em pequenos lotes', 'Ideal para um ritual de cuidado'] },
  { id: 'verde', name: 'Banho Verde', subtitle: 'Ervas frescas · sensação leve', price: 19, category: 'banho', tone: 'sage', badge: '', weight: '100 g', description: 'Uma combinação fresca e envolvente para quem gosta de aromas verdes e de um banho com clima de natureza.', notes: ['Perfil aromático herbal', 'Textura cremosa', 'Uma escolha para presentear ou se presentear'] },
  { id: 'terra', name: 'Barra de Argila', subtitle: 'Argila · cuidado essencial', price: 21, category: 'argilas', tone: 'clay', badge: 'Novidade', weight: '100 g', description: 'Uma barra de aparência terrosa e toque artesanal, feita para trazer simplicidade e intenção à rotina de cuidado.', notes: ['Inspirada nos tons da terra', 'Acabamento artesanal', 'Cada peça tem seu próprio desenho'] },
  { id: 'ritual', name: 'Kit Meu Ritual', subtitle: 'Três barras · presente especial', price: 54, category: 'kits', tone: 'cream', badge: 'Para presentear', weight: '3 unidades', description: 'Um conjunto demonstrativo para montar uma lembrança delicada. Personalize os aromas, a composição e a embalagem conforme sua coleção.', notes: ['Composição personalizável', 'Sugestão de presente', 'Embalagem e aromas a confirmar'] },
  { id: 'mel', name: 'Barra Dourada', subtitle: 'Mel · aroma acolhedor', price: 18, category: 'banho', tone: 'cream', badge: '', weight: '100 g', description: 'Uma opção de aroma aconchegante para deixar o momento do banho mais especial.', notes: ['Perfil adocicado e confortável', 'Produção artesanal', 'Descrição final deve refletir sua fórmula'] },
  { id: 'argila-rosa', name: 'Barra Rosé', subtitle: 'Argila rosa · delicadeza', price: 22, category: 'argilas', tone: 'rose', badge: '', weight: '100 g', description: 'Um sabonete demonstrativo em tons rosados, inspirado em uma rotina de cuidado leve e acolhedora.', notes: ['Visual delicado', 'Feito para uma experiência sensorial', 'Ingredientes a confirmar'] },
  { id: 'duo', name: 'Duo de Afeto', subtitle: 'Duas barras · escolha seus aromas', price: 35, category: 'kits', tone: 'clay', badge: '', weight: '2 unidades', description: 'Monte um par com dois aromas da coleção e prepare um presente simples, bonito e cheio de intenção.', notes: ['Escolha dois aromas', 'Composição de exemplo', 'Confirme a disponibilidade no atendimento'] },
  { id: 'botanico', name: 'Botânico Especial', subtitle: 'Edição artesanal · aroma suave', price: 20, category: 'banho', tone: 'sage', badge: '', weight: '100 g', description: 'Uma peça de exemplo com identidade botânica, pensada para ampliar sua coleção de cuidados artesanais.', notes: ['Aroma a definir', 'Design artesanal', 'Substitua por informações reais do produto'] }
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
  try { return JSON.parse(localStorage.getItem('yasmin-cart') || '{}'); }
  catch (_) { return {}; }
}

function saveCart() {
  try { localStorage.setItem('yasmin-cart', JSON.stringify(cart)); } catch (_) { /* armazenamento indisponível */ }
}

function soapArt(product, className) {
  return '<div class="soap-illustration tone-' + product.tone + ' ' + (className || '') + '" aria-hidden="true"><span>YASBELLA</span></div>';
}

function productCard(product) {
  return '<article class="product-card" data-id="' + product.id + '" data-category="' + product.category + '" data-tone="' + product.tone + '">' +
    '<div class="product-visual">' +
      '<button class="product-image-open" type="button" data-open-product="' + product.id + '" aria-label="Ver ' + product.name + '"></button>' +
      (product.badge ? '<span class="product-badge">' + product.badge + '</span>' : '') + soapArt(product) +
      '<button class="quick-add" type="button" data-add="' + product.id + '">Adicionar à sacola</button>' +
    '</div><div class="product-info"><button type="button" data-open-product="' + product.id + '"><h3>' + product.name + '</h3></button>' +
      '<p>' + product.subtitle + '</p><div class="product-price"><span>' + money(product.price) + '</span><small>em até 1x</small></div></div></article>';
}

function renderProducts() {
  const filtered = PRODUCTS.filter(product => {
    const matchesCategory = activeFilter === 'todos' || product.category === activeFilter;
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
    return '<article class="cart-item"><div class="cart-item-art" data-tone="' + product.tone + '">' + soapArt(product) + '</div><div><h3>' + product.name + '</h3><p>' + money(product.price) + '</p><div class="cart-item-controls"><button type="button" aria-label="Diminuir quantidade" data-cart-change="' + id + '" data-delta="-1">−</button><span>' + qty + '</span><button type="button" aria-label="Aumentar quantidade" data-cart-change="' + id + '" data-delta="1">+</button></div></div><button class="cart-item-remove" type="button" data-remove="' + id + '">Remover</button></article>';
  });
  document.querySelector('[data-cart-items]').innerHTML = items.join('');
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);
  document.querySelector('[data-cart-subtotal]').textContent = money(subtotal);
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
  productPage.innerHTML = '<div class="detail-breadcrumb"><a href="#inicio">Início</a> &nbsp;·&nbsp; <a href="#produtos">Produtos</a> &nbsp;·&nbsp; ' + product.name + '</div>' +
    '<div class="detail-layout"><div class="detail-gallery"><div class="detail-thumbs"><button class="detail-thumb" type="button" aria-label="Imagem ilustrativa 1">' + soapArt(product) + '</button><button class="detail-thumb" type="button" aria-label="Imagem ilustrativa 2">✦</button></div>' +
    '<div class="detail-main-art" data-tone="' + product.tone + '">' + soapArt(product) + '</div></div>' +
    '<div class="detail-copy"><p class="eyebrow">YASBELLA SABOARIA · ' + product.weight + '</p><h1>' + product.name + '</h1><p class="detail-price">' + money(product.price) + '<small>Valor demonstrativo · ajuste para o seu produto</small></p>' +
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
    return product ? qty + ' × ' + product.name + ' — ' + money(product.price * qty) : '';
  }).filter(Boolean);
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find(item => item.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);
  whatsapp('Olá, Yasbella! Gostaria de fazer este pedido:\n' + items.join('\n') + '\nSubtotal: ' + money(total) + '\nPode me informar frete e formas de pagamento?');
}

document.addEventListener('click', event => {
  const action = event.target.closest('[data-action]');
  const add = event.target.closest('[data-add]');
  const open = event.target.closest('[data-open-product]');
  const filter = event.target.closest('[data-filter]');
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
