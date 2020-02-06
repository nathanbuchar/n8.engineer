import 'common/js/page';

import { toggleGrid } from 'common/js/grid-overlay-toggle';

document.getElementById('toggle-grid-btn').addEventListener('click', () => {
  toggleGrid();
});
