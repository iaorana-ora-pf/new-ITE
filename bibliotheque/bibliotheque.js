// === Script JS de la Bibliothèque ===
// Chargement dynamique des documents depuis JSON + tri, recherche, scroll, admin

// Vérifie si le mode admin est activé via l'URL
const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

// Charge les documents et les insère dans le DOM
async function loadDocuments(sortOrder = 'az') {
  const response = await fetch('./bibliotheque/bibliotheque.json');
  let documents = await response.json();

  // Tri alphabétique des documents selon leur libellé
  documents.sort((a, b) => {
    return sortOrder === 'az'
      ? a.label.localeCompare(b.label)
      : b.label.localeCompare(a.label);
  });

  const container = document.getElementById('bibli-container');
  container.innerHTML = '';

  // Création des cartes document
  documents.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'bibli-card';

    // Titre du document
    const title = document.createElement('h2');
    title.classList.add('doc-title');
    title.textContent = doc.label;

    // Statut pour les admins (coloré)
    if (isAdmin && doc.statut) {
      const statutClass = {
        'traite': 'statut-traite',
        'a_finir': 'statut-a-finir',
        'non_initie': 'statut-non-initie'
      }[doc.statut];

      if (statutClass) {
        title.classList.add(statutClass);
      }
    }

    // Image miniature
    const image = document.createElement('img');
    image.src = doc.image;
    image.alt = "Illustration du document";
    image.className = 'doc-img';

    // Lien vers le PDF (via Google Viewer)
    const link = document.createElement('a');
    link.className = 'doc-link';
    link.href = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
    link.target = '_blank';
    link.textContent = "Voir le document";

    // Insertion dans la carte
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(link);
    container.appendChild(card);
  });
}

// Initialisation dès chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadDocuments('az');

  // Tri dynamique selon le select
  document.getElementById('sort-select').addEventListener('change', function () {
    loadDocuments(this.value);
  });

  // Recherche par mot-clé
  document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.bibli-card').forEach(card => {
      const title = card.querySelector('.doc-title').textContent.toLowerCase();
      card.style.display = title.includes(query) ? 'block' : 'none';
    });
  });

  // Boutons de scroll
  document.querySelector('.scroll-left').addEventListener('click', () => {
    document.getElementById('bibli-container').scrollBy({ left: -300, behavior: 'smooth' });
  });

  document.querySelector('.scroll-right').addEventListener('click', () => {
    document.getElementById('bibli-container').scrollBy({ left: 300, behavior: 'smooth' });
  });

  // Activation visuelle du mode admin
  if (isAdmin) {
    document.body.classList.add('admin-visible');
  }
});

// Code d'accès admin via prompt (fallback rapide)
document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("admin-toggle-btn");
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      const code = prompt("Code admin ?");
      if (code === "bazinga") {
        localStorage.setItem("isAdmin", "true");
        window.location.reload();
      } else {
        alert("Code incorrect");
      }
    });
  }
});

// Modal de saisie sécurisé pour le code admin
document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("admin-access-btn");
  const adminModal = document.getElementById("admin-modal");
  const closeModal = document.getElementById("close-admin-modal");
  const submitBtn = document.getElementById("validate-admin-code");
  const errorMsg = document.getElementById("admin-error");

  if (adminBtn && adminModal) {
    adminBtn.addEventListener("click", () => {
      adminModal.classList.remove("hidden");
      errorMsg.textContent = "";
      document.getElementById("admin-code-input").value = "";
    });

    closeModal.addEventListener("click", () => {
      adminModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === adminModal) {
        adminModal.classList.add("hidden");
      }
    });

    submitBtn.addEventListener("click", () => {
      const code = document.getElementById("admin-code-input").value.trim();
      if (code === "bazinga") {
        const url = new URL(window.location.href);
        url.searchParams.set("admin", "true");
        window.location.href = url.toString();
      } else {
        errorMsg.textContent = "Code incorrect.";
      }
    });
  }
});
