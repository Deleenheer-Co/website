const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const navLinks = document.querySelectorAll('.desktop-nav a, #navigation a');
const masthead = document.querySelector('.masthead');
const desktopViewport = window.matchMedia('(min-width: 901px)');
const menuDialog = document.querySelector('#menu-dialog');
function closeMenu() {
  menuDialog.close();
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  menuDialog.showModal();
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
});
document.querySelector('#close-menu').addEventListener('click', closeMenu);
menuDialog.addEventListener('close', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
});
menuDialog.addEventListener('click', event => { if (event.target === menuDialog) closeMenu(); });
navigation.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  const target = document.querySelector(link.hash);
  if (target) {
    target.tabIndex = -1;
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }
});
desktopViewport.addEventListener('change', event => {
  if (event.matches && menuDialog.open) { closeMenu(); masthead.querySelector('.brand').focus(); }
});
document.querySelector('[data-year]').textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
  if (!reduceMotion.matches && window.innerWidth > 760) {
    const rect = cinematic.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight) {
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      cinematic.style.setProperty('--media-inset', Math.max(0, (1 - progress * 2.4) * 55) + 'px');
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
