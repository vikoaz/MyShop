(function () {
  const STORAGE_KEY = 'viko_shop_cart_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function save(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  function uid(p){ return [p.id, p.variant || '', p.color || '', p.size || ''].join('::'); }

  function get() { return load(); }

  function add(product) {
    const items = load();
    const key = uid(product);
    const idx = items.findIndex(i => uid(i) === key);
    if (idx === -1) items.push({...product, qty: product.qty || 1});
    else items[idx].qty += product.qty || 1;
    save(items);
    notify();
  }

  function remove(key) {
    const items = load().filter(i => uid(i) !== key);
    save(items); notify();
  }

  function setQty(key, qty) {
    const items = load();
    const i = items.findIndex(p => uid(p) === key);
    if (i === -1) return;
    if (qty <= 0) items.splice(i,1); else items[i].qty = qty;
    save(items); notify();
  }

  function clear() { save([]); notify(); }

  function totals() {
    const items = load();
    const subtotal = items.reduce((s,i)=> s + (i.price * i.qty), 0);
    const count = items.reduce((s,i)=> s + i.qty, 0);
    return { count, subtotal, currency: '₪' };
  }

  function notify() {
    const t = totals();
    document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = t.count);
  }

  window.Cart = { get, add, remove, setQty, clear, totals, uid, notify };

  document.addEventListener('DOMContentLoaded', notify);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    const product = {
      id:    btn.dataset.id,
      title: btn.dataset.title,
      price: parseFloat(btn.dataset.price || '0'),
      color: btn.dataset.color || '',
      size:  btn.dataset.size  || '',
      variant: btn.dataset.variant || '',
      image: btn.dataset.image || '',
      qty:   parseInt(btn.dataset.qty || '1', 10)
    };
    add(product);
  });
})();
