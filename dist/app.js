const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-explore a');
const masthead = document.querySelector('.masthead');
const exploreButton = document.querySelector('.explore-toggle');
const navTrack = document.querySelector('.nav-track');
const mobileExplore = document.querySelector('.mobile-explore');
const navBrand = masthead.querySelector('.brand');
const mobileViewport = window.matchMedia('(max-width: 900px)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let exploreOpen = false;
let exploreAnimation = null;
let exploreRevision = 0;
async function setExplore(open, { immediate = false } = {}) {
  const revision = ++exploreRevision;
  const from = getComputedStyle(navTrack).transform;
  exploreAnimation?.cancel();
  exploreOpen = open;
  exploreButton.setAttribute('aria-expanded', String(open));
  exploreButton.setAttribute('aria-label', open ? 'Sluiten' : 'Menu');
  mobileExplore.style.visibility = 'visible';
  mobileExplore.inert = !open;
  navBrand.inert = open;
  masthead.classList.toggle('is-exploring', open);
  if (!immediate && !reduceMotion.matches && mobileViewport.matches) {
    exploreAnimation = navTrack.animate([
      { transform: from }, { transform: open ? 'translateX(-100%)' : 'translateX(0)' }
    ], { duration: open ? 550 : 480, easing: 'cubic-bezier(.22,1,.36,1)' });
    try { await exploreAnimation.finished; } catch { return false; }
  }
  if (revision !== exploreRevision) return false;
  mobileExplore.style.visibility = open ? 'visible' : 'hidden';
  exploreAnimation = null;
  return true;
}
exploreButton.addEventListener('click', () => setExplore(!exploreOpen));
mobileExplore.addEventListener('click', async event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const target = document.querySelector(link.hash);
  if (!(await setExplore(false)) || !target) return;
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'instant' : 'smooth' });
});
masthead.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !exploreOpen) return;
  event.preventDefault();
  setExplore(false);
  exploreButton.focus({ preventScroll: true });
});
mobileViewport.addEventListener('change', event => {
  if (event.matches) {
    if (document.activeElement.closest('.desktop-nav a')) exploreButton.focus({ preventScroll: true });
    return;
  }
  const focusedLink = document.activeElement.closest('.mobile-explore a');
  const buttonFocused = document.activeElement === exploreButton;
  setExplore(false, { immediate: true });
  if (focusedLink) document.querySelector('.desktop-nav a[href="' + focusedLink.hash + '"]').focus({ preventScroll: true });
  else if (buttonFocused) navBrand.focus({ preventScroll: true });
});
window.addEventListener('resize', () => exploreAnimation?.finish());
reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) exploreAnimation?.finish(); });
document.querySelector('[data-year]').textContent = new Date().getFullYear();
const cinematic = document.querySelector('.cinematic');
const hero = document.querySelector('.hero');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
let ticking = false;
function updateScroll() {
  const sections = [...document.querySelectorAll('main > section[data-number]')];
  const current = sections.filter(section => section.getBoundingClientRect().top <= innerHeight * .45).pop() || sections[0];
  navLinks.forEach(link => {
    if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const heroRect = hero.getBoundingClientRect();
  const heroProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
  hero.style.setProperty('--ledger-scroll', reduceMotion.matches ? '0px' : heroProgress * 70 + 'px');
  hero.style.setProperty('--hero-line', String(1 + heroProgress * 8));
  if (!reduceMotion.matches) {
    const rect = cinematic.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight) {
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / Math.max(1, innerHeight - masthead.offsetHeight)));
      const inset = Math.min(88, Math.max(24, innerWidth * .04));
      cinematic.style.setProperty('--media-inset', (1 - progress) * inset + 'px');
      cinematic.style.setProperty('--media-offset', (-5 + progress * 5) + '%');
    }
  } else {
    cinematic.style.removeProperty('--media-inset');
    cinematic.style.removeProperty('--media-offset');
  }
  ticking = false;
}
function requestScrollUpdate() { if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; } }
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
reduceMotion.addEventListener('change', requestScrollUpdate);
updateScroll();
let pointerFrame = 0;
let pointerX = 0;
let pointerY = 0;
function resetHeroPointer() {
  cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  hero.style.removeProperty('--ledger-x');
  hero.style.removeProperty('--ledger-y');
}
hero.addEventListener('pointermove', event => {
  if (reduceMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
  const rect = hero.getBoundingClientRect();
  pointerX = (event.clientX - rect.left) / rect.width - .5;
  pointerY = (event.clientY - rect.top) / rect.height - .5;
  if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
    hero.style.setProperty('--ledger-x', pointerX * 20 + 'px');
    hero.style.setProperty('--ledger-y', pointerY * 16 + 'px');
    pointerFrame = 0;
  });
}, { passive: true });
hero.addEventListener('pointerleave', resetHeroPointer);
reduceMotion.addEventListener('change', resetHeroPointer);
finePointer.addEventListener('change', resetHeroPointer);
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
  document.body.classList.add('motion-ready');
}

const newsButton = document.querySelector('#news-toggle');
const newsPanel = document.querySelector('#news-panel');
newsButton.addEventListener('click', () => {
  const open = newsButton.getAttribute('aria-expanded') !== 'true';
  newsButton.setAttribute('aria-expanded', String(open));
  newsButton.textContent = open ? 'Sluit het sectornieuws' : 'Bekijk het sectornieuws';
  newsPanel.hidden = !open;
  const frameHost = document.querySelector('#news-frame');
  if (open && !frameHost.firstElementChild) {
    const frame = document.createElement('iframe');
    frame.title = 'Sectornieuws van De Leenheer & C° via Webwin';
    frame.src = 'https://deleenheer.webwin.be/';
    frame.referrerPolicy = 'no-referrer';
    frame.loading = 'lazy';
    frameHost.append(frame);
  }
});

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const subject = fields.get('topic') + ' — ' + fields.get('name').trim();
  const body = 'Beste De Leenheer & C°,\n\n' + fields.get('message').trim() + '\n\nMet vriendelijke groeten,\n' + fields.get('name').trim() + (fields.get('company').trim() ? '\n' + fields.get('company').trim() : '') + '\n' + fields.get('email').trim();
  const status = document.querySelector('#form-status');
  status.textContent = 'Uw e-mailprogramma wordt geopend. Uw bericht is nog niet verzonden. Opent er niets? Mail dan rechtstreeks naar kantoor@deleenheer.be. Uw ingevulde tekst blijft hier staan.';
  status.hidden = false;
  window.location.href = 'mailto:kantoor@deleenheer.be?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});

function openPrivacy() {
  if (window.location.hash === '#privacy') document.querySelector('#privacy details').open = true;
}
window.addEventListener('hashchange', openPrivacy);
document.querySelectorAll('a[href="#privacy"]').forEach(link => link.addEventListener('click', () => { document.querySelector('#privacy details').open = true; }));
openPrivacy();
