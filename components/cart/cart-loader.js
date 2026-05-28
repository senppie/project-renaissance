async function loadCart() {
  try {
    const response = await fetch('components/cart/cart.html');
    const cartHTML = await response.text();
    document.body.insertAdjacentHTML('afterbegin', cartHTML);

    if (window.lucide) {
      lucide.createIcons();
    }

  } catch (error) {
    console.error('Failed to load cart:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadCart);