const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open); });
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
document.querySelector('[data-year]').textContent = new Date().getFullYear();

const watchedSections = document.querySelectorAll('main > section[id]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navigation.querySelectorAll('a').forEach(link => {
      if (link.hash === '#' + visible.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  watchedSections.forEach(section => observer.observe(section));
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
