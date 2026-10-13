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
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.case-study .tab');
  const images = document.querySelectorAll('.case-study .tabs-image');

  if (!tabs.length) return;

  tabs.forEach((tab, index) => {
    const button = tab.querySelector('.tab-button');
    if (!button) return;

    button.addEventListener('click', () => {
      const isMobile = window.innerWidth < 900;
      const isAlreadySelected = tab.classList.contains('is-selected');

      // Su mobile, se clicchi sulla voce già aperta, la richiudi (accordion toggle)
      if (isMobile && isAlreadySelected) {
        tab.classList.remove('is-selected');
        return;
      }

      // Comportamento standard: chiude/disattiva tutte le tab e nasconde le immagini
      tabs.forEach((t) => t.classList.remove('is-selected'));
      images.forEach((img) => img.classList.remove('is-visible'));

      // Attiva la tab cliccata e mostra l'immagine corrispondente
      tab.classList.add('is-selected');
      if (images[index]) {
        images[index].classList.add('is-visible');
      }
    });
  });
});

// Gestione delle tab secondarie all'interno dei case study: mostra solo la tab e
// l'immagine corrispondenti alla selezione corrente.
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.case-study .tabs-container');
  const tabs = document.querySelectorAll('.case-study .tab');
  const images = document.querySelectorAll('.case-study .tabs-image');

  if (!container || !tabs.length) return;

  // Segnala al CSS che JavaScript è attivo: solo da ora sotto i 1000px
  // i testi si chiudono e compaiono le frecce dell'accordion.
  // Senza JavaScript questa classe manca e i tre testi restano leggibili.
  container.classList.add('tabs-ready');

  tabs.forEach((tab, index) => {
    const button = tab.querySelector('.tab-button');
    if (!button) return;

    button.addEventListener('click', () => {
      // Disattiva tutte le tab e nascondi tutte le immagini.
      tabs.forEach((t) => {
        t.classList.remove('is-selected');
        const b = t.querySelector('.tab-button');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      images.forEach((img) => img.classList.remove('is-visible'));

      // Attiva la tab cliccata e mostra la relativa immagine.
      tab.classList.add('is-selected');
      button.setAttribute('aria-expanded', 'true');
      if (images[index]) {
        images[index].classList.add('is-visible');
      }
    });
  });
});