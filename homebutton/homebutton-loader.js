async function loadHomeButton() {
  try {
    const response = await fetch('homebutton/homebutton.html');
    const homeButtonHTML = await response.text();
    document.body.insertAdjacentHTML('afterbegin', homeButtonHTML);

    if (window.lucide) {
      lucide.createIcons();
    }

  } catch (error) {
    console.error('Failed to load home button:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadHomeButton);