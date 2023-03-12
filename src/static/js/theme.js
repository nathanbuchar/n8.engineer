const light = Symbol('light');
const dark = Symbol('dark');

function setTheme(scheme) {
  switch (scheme) {
    case dark:
      document
        .querySelector(`link[title="dark"]`)
        .removeAttribute('disabled');
      document
        .querySelector(`link[title="light"]`)
        .setAttribute('disabled', 'disabled');
      break;
    case light:
      document
        .querySelector(`link[title="light"]`)
        .removeAttribute('disabled');
      document
        .querySelector(`link[title="dark"]`)
        .setAttribute('disabled', 'disabled');
      break;
  }
}

function init() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme(dark);
  } else {
    setTheme(light);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (evt) => {
    const newColorScheme = evt.matches ? dark : light;

    setTheme(newColorScheme);
  });
}

init();
