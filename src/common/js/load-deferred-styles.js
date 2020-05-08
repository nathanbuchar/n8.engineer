/**
 * Asynchronously loads render-blocking, non-critical
 * stylesheets to optimize for CSS delivery.
 *
 * @see https://developers.google.com/speeds/docs/insights/OptimizeCSSDelivery
 */
(function loadDeferredStyles() {
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      const addStylesNode = document.getElementById('deferred-styles');
      const replacement = document.createElement('div');
      replacement.innerHTML = addStylesNode.textContent;
      document.body.appendChild(replacement);
      addStylesNode.parentElement.removeChild(addStylesNode);
    }, 0);
  });
}());
