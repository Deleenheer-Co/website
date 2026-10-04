(() => {
  function initializeScrollbar() {
    const root = document.documentElement;
    const scroller = document.scrollingElement;
    if (!scroller || !document.getElementById('main') || document.querySelector('.page-scrollbar')) return;

    const forcedColors = window.matchMedia('(forced-colors: active)');
    const track = document.createElement('div');
    const thumb = document.createElement('div');
    track.className = 'page-scrollbar';
    track.hidden = true;
    track.tabIndex = 0;
    for (const [name, value] of Object.entries({
      role: 'scrollbar', 'aria-label': 'Pagina scrollen', 'aria-controls': 'main',
      'aria-orientation': 'vertical', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0'
    })) track.setAttribute(name, value);
    thumb.className = 'page-scrollbar__thumb';
    thumb.setAttribute('aria-hidden', 'true');
    track.append(thumb);
    document.body.append(track);

    let frame = 0;
    let drag = null;
    let range = 0;
    let thumbHeight = 0;
    let travel = 0;
    let keyboardInput = false;
    const clamp = (value, maximum) => Math.max(0, Math.min(maximum, value));

    function usePointerInput() {
      keyboardInput = false;
      track.classList.remove('has-keyboard-focus');
    }

    document.addEventListener('pointerdown', usePointerInput, true);
    document.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.key === 'Shift') return;
      keyboardInput = true;
      if (document.activeElement === track && !drag) track.classList.add('has-keyboard-focus');
    }, true);
    track.addEventListener('focus', () => {
      track.classList.toggle('has-keyboard-focus', keyboardInput && !drag);
    });
    track.addEventListener('blur', () => track.classList.remove('has-keyboard-focus'));

    function endDrag() {
      if (!drag) return;
      const pointerId = drag.pointerId;
      drag = null;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(pointerId)) track.releasePointerCapture(pointerId);
    }

    function update() {
      frame = 0;
      range = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      if (forcedColors.matches || range <= 1) {
        endDrag();
        track.hidden = true;
        root.classList.remove('has-overlay-scrollbar');
        return;
      }
      track.hidden = false;
      const height = track.clientHeight;
      thumbHeight = Math.min(height, Math.max(28, height * scroller.clientHeight / scroller.scrollHeight));
      travel = Math.max(0, height - thumbHeight);
      const progress = clamp(scroller.scrollTop, range) / range;
      thumb.style.height = thumbHeight + 'px';
      thumb.style.transform = 'translateY(' + progress * travel + 'px)';
      track.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      // Hiding the native gutter can change line wrapping, so measure once again.
      if (!root.classList.contains('has-overlay-scrollbar')) {
        root.classList.add('has-overlay-scrollbar');
        requestUpdate();
      }
    }

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function scrollTo(top) {
      // Immediate input response also respects reduced-motion preferences.
      window.scrollTo({ top: clamp(top, range), behavior: 'instant' });
      requestUpdate();
    }

    function dragTo(clientY) {
      if (!drag || !travel) return;
      const offset = Math.min(drag.offset, thumbHeight);
      scrollTo((clientY - track.getBoundingClientRect().top - offset) / travel * range);
    }

    track.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0 || forcedColors.matches) return;
      event.preventDefault();
      usePointerInput();
      if (frame) cancelAnimationFrame(frame);
      update();
      if (track.hidden) return;
      track.focus({ preventScroll: true });
      const thumbRect = thumb.getBoundingClientRect();
      const onThumb = event.clientY >= thumbRect.top && event.clientY <= thumbRect.bottom;
      drag = { pointerId: event.pointerId, offset: onThumb ? event.clientY - thumbRect.top : thumbHeight / 2 };
      track.setPointerCapture(event.pointerId);
      track.classList.add('is-dragging');
      dragTo(event.clientY);
    });
    track.addEventListener('pointermove', event => {
      if (drag && event.pointerId === drag.pointerId) dragTo(event.clientY);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      track.addEventListener(type, event => {
        if (drag && event.pointerId === drag.pointerId) endDrag();
      });
    }
    track.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const page = scroller.clientHeight * .9;
      const positions = {
        ArrowUp: scroller.scrollTop - 40, ArrowDown: scroller.scrollTop + 40,
        PageUp: scroller.scrollTop - page, PageDown: scroller.scrollTop + page,
        Home: 0, End: range
      };
      if (!(event.key in positions)) return;
      event.preventDefault();
      scrollTo(positions[event.key]);
    });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.visualViewport?.addEventListener('resize', requestUpdate);
    document.addEventListener('load', requestUpdate, true);
    forcedColors.addEventListener('change', requestUpdate);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(requestUpdate);
      observer.observe(root);
      observer.observe(document.body);
    }
    const observer = new MutationObserver(records => {
      if (records.some(record => !track.contains(record.target))) requestUpdate();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeScrollbar, { once: true });
  else initializeScrollbar();
})();
