async function loadTitlehero() {
  try {
    const response = await fetch('components/titlehero/titlehero.html');
    const titleheroHTML = await response.text();
    document.body.insertAdjacentHTML('afterbegin', titleheroHTML);
  } catch (error) {
    console.error('Failed to load titlehero:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadTitlehero);