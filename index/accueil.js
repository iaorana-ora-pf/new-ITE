// Script pour charger et afficher le nombre d'événements validés depuis un fichier JSON local
// Utilisé uniquement sur la page d'accueil

document.addEventListener("DOMContentLoaded", async () => {
  const countEl = document.getElementById("event-count-number");
  if (!countEl) return; // Ne rien faire si l'élément n'existe pas

  try {
    // Chargement du fichier JSON des événements
    const response = await fetch("events.json");
    if (!response.ok) throw new Error("events.json introuvable");

    // Extraction des données
    const data = await response.json();
    const allEvents = Object.values(data).flat();

    // Filtrage : ne garder que les événements validés
    const validatedEvents = allEvents.filter(evt => evt.validated);

    // Affichage du nombre d'événements validés
    countEl.textContent = validatedEvents.length;
  } catch (err) {
    console.error("Erreur de chargement des événements :", err);
    // Affichage d'un message d'erreur simple à l'écran
    countEl.textContent = "— (chargement échoué)";
  }
});
