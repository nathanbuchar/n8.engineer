import { ensureArray } from 'common/js/utils';
import { sendEvent } from 'common/js/track';

(function trackLinks() {
  const links = document.getElementsByTagName('a');

  ensureArray(links).forEach((link) => {
    link.addEventListener('click', (_evt) => {
      sendEvent('link', 'click', link.getAttribute('href'));
    });
  });
}());
