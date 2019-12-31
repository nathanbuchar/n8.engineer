/**
 * Returns a Promise which resolves when the document is
 * ready.
 *
 * @returns {Promise}
 */
function domReady() {
  return new Promise((resolve) => {
    if (['interactive', 'complete'].contains(document.readyState)) {
      resolve();
    } else {
      document.addEventListener('DOMContentLoaded', function handleDOMReady() {
        document.removeEventListener('DOMContentLoaded', handleDOMReady);
        resolve();
      }, false);
    }
  });
}

export default domReady;
