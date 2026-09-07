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
