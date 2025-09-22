// Año en footer
document.getElementById('year').textContent = new Date().getFullYear();

const productGrid = document.getElementById('productGrid');
const resultsCount = document.getElementById('resultsCount');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

// Inicializa miniaturas y modal
function initThumbnails() {
  document.querySelectorAll('.card').forEach(card => {
    const thumbImg = card.querySelector('.thumb-img');
    const thumbs = card.querySelectorAll('.thumbnails img');

    thumbs.forEach(t => {
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        thumbImg.src = t.src;
        thumbs.forEach(x => x.classList.remove('selected'));
        t.classList.add('selected');
      });
    });

    card.querySelector('.thumb').addEventListener('click', () => openModalFromCard(card));
    card.querySelector('.product-title').addEventListener('click', () => openModalFromCard(card));
  });
}

// Modal
const modalBackdrop = document.getElementById('modalBackdrop');
const modalBigImg = document.getElementById('modalBigImg');
const modalThumbs = document.getElementById('modalThumbs');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');

function openModalFromCard(card) {
  const title = card.dataset.title;
  const desc = card.dataset.desc;
  const price = card.dataset.price;
  const thumbs = Array.from(card.querySelectorAll('.thumbnails img')).map(i => i.src);

  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalPrice.textContent = '$' + parseFloat(price).toFixed(2);
  modalBigImg.src = card.querySelector('.thumb-img').src;

  modalThumbs.innerHTML = '';
  thumbs.forEach((src, i) => {
    const im = document.createElement('img');
    im.src = src;
    im.style.width = '64px';
    im.style.height = '64px';
    im.style.objectFit = 'cover';
    im.style.borderRadius = '8px';
    im.style.cursor = 'pointer';
    if (i === 0) im.style.outline = '3px solid var(--primary)';
    im.addEventListener('click', () => {
      Array.from(modalThumbs.querySelectorAll('img')).forEach(x => x.style.outline = '');
      im.style.outline = '3px solid var(--primary)';
      modalBigImg.src = src;
    });
    modalThumbs.appendChild(im);
  });

  modalBackdrop.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBackdrop.style.display = 'none';
  document.body.style.overflow = '';
}
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });

// Búsqueda
function applySearch() {
  const q = searchInput.value.trim().toLowerCase();
  const cards = Array.from(document.querySelectorAll('.card'));
  let shown = 0;
  cards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const desc = card.dataset.desc.toLowerCase();
    if (!q || title.includes(q) || desc.includes(q)) {
      card.style.display = '';
      shown++;
    } else {
      card.style.display = 'none';
    }
  });
  resultsCount.textContent = shown;
}
searchInput.addEventListener('input', applySearch);

// Ordenar
function applySort() {
  const v = sortSelect.value;
  const cards = Array.from(document.querySelectorAll('.card'));
  if (v === 'priceAsc') {
    cards.sort((a,b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
  } else if (v === 'priceDesc') {
    cards.sort((a,b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
  }
  cards.forEach(c => productGrid.appendChild(c));
}

function resetFilters() {
  searchInput.value = '';
  sortSelect.value = 'pop';
  applySearch();
  applySort();
}

// Init
initThumbnails();
applySearch();
