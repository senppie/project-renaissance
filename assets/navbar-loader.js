async function loadNavbar() {
  try {
    const response = await fetch('assets/navbar.html');
    const navbarHTML = await response.text();
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  } catch (error) {
    console.error('Failed to load navbar:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadNavbar);