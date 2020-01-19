import { ensureArray, slugify } from './utils';

(function anchors() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  ensureArray(headings).forEach((elem) => {
    if (!elem.hasAttribute('id')) {
      const txt = elem.textContent;

      if (txt.length) {
        const slug = slugify(txt);

        // Ensure id is unique.
        if (!document.getElementById(slug)) {
          elem.setAttribute('id', slug);

          if (window.location.hash === `#${slug}`) {
            // Reset location hash now that the anchor exists.
            window.location.hash += '';
          }
        }
      }
    }
  });
}());
