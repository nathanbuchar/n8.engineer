const light = Symbol('light');
const dark = Symbol('dark');

function setTheme(scheme) {
  document
    .querySelector(`link[title="${scheme === dark ? 'dark' : 'light'}"]`)
    .removeAttribute('disabled');
  document
    .querySelector(`link[title="${scheme === dark ? 'light' : 'dark'}"]`)
    .setAttribute('disabled', 'disabled');
}

function onColorSchemeChanged(evt) {
  const newColorScheme = evt.matches ? dark : light;

  setTheme(newColorScheme);
}

function init() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onColorSchemeChanged);

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme(dark);
  } else {
    setTheme(light);
  }
}

init();
