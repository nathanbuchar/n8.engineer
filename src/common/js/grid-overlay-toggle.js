import { html } from 'common-tags';

/**
 * Toggles the grid overlay.
 *
 * @returns {void}
 */
export function toggleGrid() {
  const elem = document.getElementById('x-grid-overlay');

  if (elem) {
    document.body.removeChild(elem);
  } else {
    document.body.insertAdjacentHTML('beforeend', html`
      <div id="x-grid-overlay" class="container" style="position:fixed;top:0;right:0;bottom:0;left:0;pointer-events:none">
        <div class="row" style="height:100%">
          ${(new Array(12)).fill(0).map(() => `
            <div class="col-2 col-md-1" style="background-color:rgba(255,0,0,0.1);height:100%">
              <div style="background-color:rgba(255,0,0,0.1);height:100%"></div>
            </div>
          `)}
        </div>
      </div>
    `);
  }
}
