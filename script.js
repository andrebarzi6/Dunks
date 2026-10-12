// ==========================================
// 1. NAVIGAZIONE RESPONSIVE E POPOVER
// ==========================================

// Seleziona gli elementi principali del menu di navigazione.
const navigationButton = document.querySelector('.navigation-toggle');
const navigationLabel = document.querySelector('.navigation-label');
const navigationPanel = document.querySelector('.navigation-panel');

// Controlla se il viewport è a dimensione desktop e se il browser supporta
// la funzionalità popover nativa, necessaria per il menu mobile.
const desktopMedia = window.matchMedia('(min-width: 63.25rem)');
const supportsNavigation = 'popover' in HTMLElement.prototype &&
  CSS.supports('top', 'anchor(bottom)') &&
  CSS.supports('width', 'anchor-size(width)');

// Aggiorna il testo e l'aria-label del bottone del menu in base allo stato aperto/chiuso.
function updateNavigationLabel() {
  const text = navigationPanel.matches(':popover-open') ? 'Chiudi menu' : 'Apri menu';
  navigationButton.setAttribute('aria-label', text);
  navigationLabel.textContent = text;
}

// Adatta l'aspetto e il comportamento del menu a desktop o mobile.
function updateNavigationLayout() {
  if (desktopMedia.matches) {
    // Su desktop il menu è sempre visibile e non usa il popover.
    navigationButton.removeAttribute('popovertarget');
    navigationPanel.removeAttribute('popover');
    navigationButton.hidden = true;
  } else {
    // Su mobile il menu viene gestito come popover e il bottone diventa visibile.
    navigationPanel.setAttribute('popover', 'auto');
    navigationButton.setAttribute('popovertarget', navigationPanel.id);
    navigationButton.hidden = false;
  }
  updateNavigationLabel();
}

// Se il browser supporta i popover, registra gli eventi necessari e prepara il layout.
if (supportsNavigation) {
  navigationPanel.addEventListener('toggle', updateNavigationLabel);
  updateNavigationLayout();
} else {
  // Fallback: se il browser non supporta i popover, disabilita il menu mobile.
  navigationButton.removeAttribute('popovertarget');
  navigationPanel.removeAttribute('popover');
  navigationButton.hidden = true;
}

// Chiude il menu mobile quando si seleziona un link interno alla pagina.
navigationPanel.addEventListener('click', function (event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (supportsNavigation && navigationPanel.matches(':popover-open')) navigationPanel.hidePopover();
});

// Gestisce il link "skip to content" portando il focus in alto alla pagina.
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', function () {
    const topElement = document.querySelector('#top');
    if (topElement) topElement.focus();
  });
}

// Quando cambia la dimensione della finestra, si ricalcola il layout e si mantiene
// il focus corretto nel menu o nel bottone di apertura.
desktopMedia.addEventListener('change', function () {
  if (!supportsNavigation) return;
  const focused = document.activeElement;
  const focusInNavigation = navigationPanel.contains(focused);
  const focusOnButton = focused === navigationButton;
  updateNavigationLayout();
  if (desktopMedia.matches && focusInNavigation) focused.focus();
  else if (desktopMedia.matches && focusOnButton) navigationPanel.querySelector('a')?.focus();
  else if (!desktopMedia.matches && focusInNavigation) navigationButton.focus();
});

// ==========================================
// 2. BREAKOUT TABS / ACCORDION MODULE
// ==========================================

// Gestione della tabella di contenuti "breakdownTabs": cambia il pannello attivo,
// aggiorna l'immagine principale e imposta correttamente gli attributi ARIA.
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.breakdownTabs-trigger');
  const items = document.querySelectorAll('.breakdownTabs-item');
  const mainImage = document.getElementById('breakdown-image');

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const parentItem = tab.closest('.breakdownTabs-item');
      const targetPanelId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      const newImageSrc = tab.getAttribute('data-image');

      // Aggiorna l'immagine visualizzata quando la tab cambia.
      if (mainImage && newImageSrc) {
        mainImage.setAttribute('src', newImageSrc);
      }

      // Rimuove lo stato attivo da tutte le voci e chiude i pannelli associati.
      items.forEach((item) => item.classList.remove('is-active'));
      tabs.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        const pId = t.getAttribute('aria-controls');
        const pEl = document.getElementById(pId);
        if (pEl) pEl.setAttribute('hidden', '');
      });

      // Attiva la scheda cliccata e mostra il suo pannello associato.
      if (parentItem) parentItem.classList.add('is-active');
      tab.setAttribute('aria-expanded', 'true');
      if (targetPanel) {
        targetPanel.removeAttribute('hidden');
      }
    });
  });
});

// Gestione delle tab secondarie all'interno dei case study: mostra solo la tab e
// l'immagine corrispondenti alla selezione corrente.
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.case-study .tab');
  const images = document.querySelectorAll('.case-study .tabs-image');

  tabs.forEach((tab, index) => {
    const button = tab.querySelector('.tab-button');
    if (!button) return;

    button.addEventListener('click', () => {
      // Disattiva tutte le tab e nascondi tutte le immagini.
      tabs.forEach((t) => t.classList.remove('is-selected'));
      images.forEach((img) => img.classList.remove('is-visible'));

      // Attiva la tab cliccata e mostra la relativa immagine.
      tab.classList.add('is-selected');
      if (images[index]) {
        images[index].classList.add('is-visible');
      }
    });
  });
});