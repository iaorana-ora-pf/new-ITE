// === Chargement dynamique de la bibliothèque ===

// Détecte si l'URL contient admin=true
const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

// Références DOM
const bibliContainer = document.getElementById('bibli-container');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');

// Admin modal
const adminBtn = document.getElementById('admin-access-btn');
const adminModal = document.getElementById('admin-modal');
const closeModal = document.getElementById('close-admin-modal');
const codeInput = document.getElementById('admin-code-input');
const validateBtn = document.getElementById('validate-admin-code');
const errorMsg = document.getElementById('admin-error');

// === Récupération des documents depuis bibliotheque.json ===
let allDocuments = [];
fetch('bibliotheque/bibliotheque.json')
  .then(res => res.json())
  .then(data => {
    allDocuments = data;
    renderDocuments();
  });

// === Affichage des documents ===
function renderDocuments() {
  const searchTerm = searchInput.value.toLowerCase();
  const sortOrder = sortSelect.value;

  let filtered = allDocuments.filter(doc =>
    doc.label.toLowerCase().includes(searchTerm)
  );

  filtered.sort((a, b) => {
    if (sortOrder === 'az') return a.label.localeCompare(b.label);
    else return b.label.localeCompare(a.label);
  });

  bibliContainer.innerHTML = '';
  filtered.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'bibli-card';

    card.innerHTML = `
      <h3 class="doc-title">${doc.label}</h3>
      <img class="doc-img" src="${doc.image}" alt="${doc.label}">
      <a class="doc-link" href="${doc.url}" target="_blank">Voir le document</a>
      ${isAdmin ? `<p class="statut statut-${doc.statut}">${doc.statut}</p>` : ''}
    `;

    bibliContainer.appendChild(card);
  });

  // Ajout d'une classe spéciale si admin actif
  if (isAdmin) bibliContainer.classList.add('admin-visible');
}

// === Filtres : recherche + tri ===
sortSelect.addEventListener('change', renderDocuments);
searchInput.addEventListener('input', renderDocuments);

// === Défilement latéral ===
scrollLeftBtn.addEventListener('click', () => {
  bibliContainer.scrollBy({ left: -400, behavior: 'smooth' });
});
scrollRightBtn.addEventListener('click', () => {
  bibliContainer.scrollBy({ left: 400, behavior: 'smooth' });
});

// === Modale d'accès admin ===
adminBtn.addEventListener('click', () => {
  adminModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  adminModal.classList.add('hidden');
});

validateBtn.addEventListener('click', () => {
  const code = codeInput.value.trim();
  if (code === 'ite2025') {
    window.location.search = '?admin=true';
  } else {
    errorMsg.textContent = 'Code incorrect.';
  }
});
