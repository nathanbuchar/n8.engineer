import { ensureArray } from './utils';
import { sendEvent } from './track';

(function trackLinks() {
  const links = document.getElementsByTagName('a');

  ensureArray(links).forEach((link) => {
    link.addEventListener('click', (_evt) => {
      sendEvent('link', 'click', link.getAttribute('href'));
    });
  });
}());
