import { sendEvent } from 'common/js/track';

(function trackLinks() {
  const links = document.getElementsByTagName('a');

  Array.from(links).forEach((link) => {
    link.addEventListener('click', (_evt) => {
      sendEvent('link', 'click', link.getAttribute('href'));
    });
  });
}());
