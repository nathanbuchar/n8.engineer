import throttle from 'lodash.throttle';
import { toggleGrid } from 'common/js/grid-overlay-toggle';

(function gridOverlay() {
  if (__IS_DEBUG) {
    window.addEventListener('keypress', throttle(({ target, key }) => {
      if (key !== '?') return;

      if (!['input', 'textarea'].includes(target.tagName.toLowerCase())) {
        toggleGrid();
      }
    }, 250));
  }
}());
