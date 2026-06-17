async function loadCart() {
  try {
    const response = await fetch('components/cart/cart.html');
    const cartHTML = await response.text();
    document.body.insertAdjacentHTML('afterbegin', cartHTML);

    if (window.lucide) {
      lucide.createIcons();
    }

    // Simple localStorage helpers (mirror shop page)
    function getCart() {
      try {
        return JSON.parse(localStorage.getItem('renaissance_cart') || '[]');
      } catch (e) {
        return [];
      }
    }

    function renderCartPanel() {
      const container = document.getElementById('cartItems');
      if (!container) return;
      const cart = getCart();
      if (!cart || cart.length === 0) {
        container.innerHTML = '<p class="text-white/60 text-center py-4 uppercase">Your bag is empty</p>';
        const totalElEmpty = document.getElementById('cartTotal');
        if (totalElEmpty) totalElEmpty.textContent = '$0.00';
        return;
      }

      container.innerHTML = cart.map((it) => `
        <div class="py-2 flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium uppercase">${escapeHtml(it.title)}</div>
            <div class="text-xs text-white/60 uppercase">${it.price} ― ${escapeHtml(it.version || 'Explicit')} ver. ― Qty: ${it.qty || 1}</div>
          </div>
          <div class="flex items-center gap-2">
            <button data-item-id="${it.id}" data-item-version="${escapeHtml(it.version || 'Explicit')}" class="remove-from-cart text-white/60 hover:text-white p-1 rounded cursor-pointer" aria-label="Remove one ${escapeHtml(it.title)}">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `).join('');

      // render lucide icons inside the injected HTML
      if (window.lucide) {
        lucide.createIcons();
      }

      // compute subtotal
      const subtotal = cart.reduce((sum, it) => {
        const price = parseFloat(String(it.price).replace(/[^0-9.]/g, '')) || 0;
        return sum + price * (it.qty || 1);
      }, 0);
      const totalEl = document.getElementById('cartTotal');
      const totalBgEl = document.getElementById('cartTotalBg');
      const totalText = '$' + subtotal.toFixed(2);
      if (totalEl) totalEl.textContent = totalText;
      if (totalBgEl) totalBgEl.textContent = totalText;

      // Attach click handler for remove buttons (decrement qty by 1)
      container.querySelectorAll('.remove-from-cart').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = Number(btn.getAttribute('data-item-id'));
          if (!id && id !== 0) return;
          const cart = getCart();
          const version = btn.getAttribute('data-item-version') || 'Explicit';
          const idx = cart.findIndex((c) => Number(c.id) === id && ((c.version || 'Explicit') === version));
          if (idx === -1) return;
          // if more than one, decrement; otherwise remove item
          if ((cart[idx].qty || 1) > 1) {
            cart[idx].qty = (cart[idx].qty || 1) - 1;
          } else {
            cart.splice(idx, 1);
          }
          try {
            localStorage.setItem('renaissance_cart', JSON.stringify(cart));
          } catch (err) {
            console.error('Failed to update cart', err);
          }
          document.dispatchEvent(new CustomEvent('cart:changed'));
        });
      });
    }

    // Basic escape to avoid injecting HTML from titles
    function escapeHtml(str) {
      if (!str) return '';
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Wire toggle behavior
    const toggle = document.getElementById('cartToggle');
    const panel = document.getElementById('cartPanel');
    const closeBtn = document.getElementById('cartClose');

    function openPanel() {
      if (!panel || !toggle) return;
      // unhide first so transitions can run
      panel.classList.remove('hidden');
      // wait a frame then add open class to trigger transition
      requestAnimationFrame(() => panel.classList.add('open'));
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closePanel() {
      if (!panel || !toggle) return;
      // remove open state to animate closed, then hide after transition
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      setTimeout(() => panel.classList.add('hidden'), 200);
    }

    if (toggle) {
      toggle.addEventListener('click', (e) => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) closePanel(); else openPanel();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closePanel);
    }

    // Re-render panel and badge when cart changes
    document.addEventListener('cart:changed', () => {
      renderCartPanel();
      // update badge text too
      const badge = document.getElementById('cartBadge');
      if (badge) {
        const total = getCart().reduce((s, i) => s + (i.qty || 0), 0);
        badge.textContent = String(total);
        if (total > 0) {
          badge.classList.remove('hidden');
          badge.setAttribute('aria-hidden', 'false');
          badge.style.display = '';
        } else {
          badge.classList.add('hidden');
          badge.setAttribute('aria-hidden', 'true');
          badge.style.display = 'none';
        }
      }
    });

    // initial render
    document.dispatchEvent(new Event('cart:loaded'));
    renderCartPanel();

  } catch (error) {
    console.error('Failed to load cart:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadCart);