const products = [
  { id: 1, name: 'Air Motion 01', category: 'Sneakers', price: 145, tag: 'New', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85' },
  { id: 2, name: 'Cloud Runner', category: 'Running', price: 168, tag: 'Best seller', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85' },
  { id: 3, name: 'Court Classic', category: 'Casual', price: 110, tag: '', image: 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85' },
  { id: 4, name: 'Elevate Pro', category: 'Basketball', price: 190, tag: 'Limited', image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=700&q=85' },
  { id: 5, name: 'Metro 550', category: 'Sneakers', price: 135, tag: '', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85' },
  { id: 6, name: 'Pace Form', category: 'Running', price: 155, tag: 'New', image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=700&q=85' },
  { id: 7, name: 'Canvas Low', category: 'Casual', price: 95, tag: '', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85' },
  { id: 8, name: 'Apex One', category: 'Basketball', price: 180, tag: 'New', image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=85' }
];

let activeFilter = 'All';
let query = '';
let cart = JSON.parse(localStorage.getItem('solehub-cart') || '[]');
const $ = (selector) => document.querySelector(selector);
const money = (amount) => `$${amount.toFixed(2)}`;

function renderProducts() {
  const visible = products.filter(p => (activeFilter === 'All' || p.category === activeFilter) && p.name.toLowerCase().includes(query.toLowerCase()));
  $('#productGrid').innerHTML = visible.map((p, i) => `
    <article class="product-card" style="animation-delay:${i * 45}ms">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" /><span class="tag" ${p.tag ? '' : 'hidden'}>${p.tag}</span><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div>
      <div class="product-info"><div><small>${p.category}</small><h3>${p.name}</h3></div><strong>${money(p.price)}</strong></div>
    </article>`).join('');
  $('#emptyState').hidden = visible.length > 0;
  document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => addToCart(+button.dataset.add)));
}

function saveCart() { localStorage.setItem('solehub-cart', JSON.stringify(cart)); }
function addToCart(id) { const item = cart.find(x => x.id === id); item ? item.qty++ : cart.push({ id, qty: 1 }); saveCart(); renderCart(); showToast('Added to your bag'); }
function changeQuantity(id, amount) { const item = cart.find(x => x.id === id); if (!item) return; item.qty += amount; if (item.qty <= 0) cart = cart.filter(x => x.id !== id); saveCart(); renderCart(); }
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.qty, 0);
  $('#cartCount').textContent = count; $('#cartItemsLabel').textContent = `(${count})`; $('#cartTotal').textContent = money(total);
  $('#cartItems').innerHTML = cart.map(item => { const p = products.find(product => product.id === item.id); return `<div class="cart-item"><img src="${p.image}" alt="${p.name}" /><div><p>${p.category}</p><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity"><button data-change="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-change="1" data-id="${p.id}" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div>`; }).join('');
  $('#cartEmpty').hidden = count > 0; $('#cartFooter').hidden = count === 0;
  document.querySelectorAll('[data-change]').forEach(button => button.addEventListener('click', () => changeQuantity(+button.dataset.id, +button.dataset.change)));
  document.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { cart = cart.filter(x => x.id !== +button.dataset.remove); saveCart(); renderCart(); }));
}
function setCart(open) { $('#cartDrawer').classList.toggle('open', open); $('#cartOverlay').classList.toggle('open', open); $('#cartDrawer').setAttribute('aria-hidden', !open); document.body.style.overflow = open ? 'hidden' : ''; }
let toastTimer;
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200); }

$('#searchInput').addEventListener('input', event => { query = event.target.value; renderProducts(); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === button)); renderProducts(); }));
document.querySelectorAll('.category-card').forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.category; document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b.dataset.filter === activeFilter)); $('#shop').scrollIntoView({ behavior: 'smooth' }); renderProducts(); }));
$('#cartButton').addEventListener('click', () => setCart(true)); $('#closeCart').addEventListener('click', () => setCart(false)); $('#cartOverlay').addEventListener('click', () => setCart(false)); $('#continueShopping').addEventListener('click', () => setCart(false));
$('#checkoutButton').addEventListener('click', () => {
  if (!cart.length) return;
  showToast('Thanks! Your SOLEHUB order has been placed.');
  cart = []; saveCart(); renderCart(); setCart(false);
});
$('#menuButton').addEventListener('click', () => { const menu = $('.main-nav'); const open = menu.classList.toggle('open'); $('#menuButton').setAttribute('aria-expanded', open); });
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => $('.main-nav').classList.remove('open')));
window.addEventListener('scroll', () => $('.site-header').classList.toggle('scrolled', window.scrollY > 5));
renderProducts(); renderCart();

/* ─── Scroll-triggered reveal ─────────────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => {
    if (prefersReducedMotion) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });
}
initReveal();

/* ─── Custom scrollbar: draggable shoe thumb + neon-red pixel trail ──────────── */
(function initCustomScrollbar() {
  const container = document.getElementById('custom-scrollbar');
  const track     = document.getElementById('scrollbar-track');
  const thumb     = document.getElementById('scrollbar-thumb');
  const canvas    = document.getElementById('trail-canvas');
  if (!container || !track || !thumb || !canvas) return;

  const ctx       = canvas.getContext('2d');
  const TRACK_PAD = 6;  // matches CSS: track top:6px / bottom:6px within container
  const PIXEL     = 3;  // trail pixel block size

  /* canvas sizing — matches container's physical pixel size */
  function resizeCanvas() {
    const w = container.offsetWidth || 62;
    const h = window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }
  resizeCanvas();

  /* live measurements so desktop/mobile auto-adapt */
  function thumbH() {
    return thumb.offsetHeight || 27;
  }
  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }
  function travelRange() {
    return Math.max(1, window.innerHeight - 2 * TRACK_PAD - thumbH());
  }

  /* thumb travel = pixels from top of track to thumb's top edge */
  function thumbTravel() {
    const ms = maxScroll();
    return ms > 0 ? Math.min((window.scrollY || window.pageYOffset || 0) / ms, 1) * travelRange() : 0;
  }

  let prevTravel = 0;

  function updateThumb(doTrail) {
    const travel = thumbTravel();
    thumb.style.top = (TRACK_PAD + travel) + 'px';

    if (doTrail && !prefersReducedMotion) {
      const th  = thumbH();
      const fmY = TRACK_PAD + prevTravel + th / 2;
      const toY = TRACK_PAD + travel     + th / 2;
      if (Math.abs(toY - fmY) > 0.5) spawnPixelTrail(fmY, toY);
    }
    prevTravel = travel;
  }

  /* initial placement */
  updateThumb(false);

  /* ─ pixel trail particles ─ */
  const particles = [];

  function spawnPixelTrail(fromY, toY) {
    // compute track center x dynamically so responsive breakpoint works
    const trackRight = parseInt(window.getComputedStyle(track).right, 10) || 30;
    const trackX = canvas.width - trackRight - 1;
    const minY   = Math.min(fromY, toY);
    const maxY   = Math.max(fromY, toY);

    for (let y = minY; y <= maxY; y += PIXEL) {
      const cols = Math.random() > 0.4 ? 2 : 1;
      for (let i = 0; i < cols; i++) {
        const xOff = (Math.floor(Math.random() * 3) - 1) * PIXEL;
        particles.push({
          x:     trackX + xOff,
          y,
          alpha: 0.55 + Math.random() * 0.40,
          decay: 0.020 + Math.random() * 0.025,
        });
      }
    }
    scheduleRender();
  }

  /* RAF loop — only active while particles exist */
  let rafId = null;

  function scheduleRender() {
    if (!rafId) rafId = requestAnimationFrame(renderLoop);
  }

  function renderLoop() {
    rafId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.shadowColor = '#ff1a2e';
      ctx.shadowBlur  = 4;
      ctx.fillStyle   = `rgba(255,26,46,${p.alpha.toFixed(3)})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), PIXEL, PIXEL);
      ctx.restore();
    }

    if (particles.length > 0) rafId = requestAnimationFrame(renderLoop);
  }

  /* scroll & resize listeners */
  window.addEventListener('scroll', () => updateThumb(true), { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateThumb(false);
  });
  window.addEventListener('load', () => {
    resizeCanvas();
    updateThumb(false);
  });

  /* drag */
  let dragging    = false;
  let dragOffsetY = 0;

  function startDrag(clientY) {
    dragging = true;
    dragOffsetY = clientY - thumb.getBoundingClientRect().top;
    document.body.style.userSelect = 'none';
    document.documentElement.style.scrollBehavior = 'auto'; // ensure instant response while dragging
  }

  function moveDrag(clientY) {
    if (!dragging) return;
    const relTravel = clientY - TRACK_PAD - dragOffsetY;
    const range     = travelRange();
    const clamped   = Math.max(0, Math.min(relTravel, range));
    const targetScroll = (clamped / range) * maxScroll();
    window.scrollTo(0, targetScroll);
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    document.body.style.userSelect = '';
    document.documentElement.style.scrollBehavior = ''; // restore smooth scroll
  }

  /* mouse events */
  thumb.addEventListener('mousedown', e => {
    e.preventDefault();
    startDrag(e.clientY);
  });
  window.addEventListener('mousemove', e => moveDrag(e.clientY));
  window.addEventListener('mouseup',   endDrag);

  /* touch events */
  thumb.addEventListener('touchstart', e => {
    e.preventDefault();
    startDrag(e.touches[0].clientY);
  }, { passive: false });
  window.addEventListener('touchmove', e => {
    if (dragging) {
      e.preventDefault();
      moveDrag(e.touches[0].clientY);
    }
  }, { passive: false });
  window.addEventListener('touchend', endDrag);

  /* click on track to jump */
  track.addEventListener('click', e => {
    if (thumb.contains(e.target)) return;
    const trackRect = track.getBoundingClientRect();
    const relY      = e.clientY - trackRect.top - thumbH() / 2;
    const range     = travelRange();
    const clamped   = Math.max(0, Math.min(relY, range));
    window.scrollTo({ top: (clamped / range) * maxScroll(), behavior: 'smooth' });
  });
})();
