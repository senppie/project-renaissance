async function loadTitle() {
  try {
    const response = await fetch('components/title/title.html');
    const titleHTML = await response.text();
    document.body.insertAdjacentHTML('afterbegin', titleHTML);
  } catch (error) {
    console.error('Failed to load title:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadTitle);