(function hash() {
  // If there is a hash at page load, force the browser to
  // attempt to jump to the appropriate element on the page
  // (if one exists). This shim shouldn't realy be
  // necessary, but for some reason my browser isn't
  // behaving as expected.
  window.location.hash += '';
}());
