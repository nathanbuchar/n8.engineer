import 'common/js/page';

const canvasEl = document.getElementById('canvas');
const blockEl = document.getElementById('block');

const coords = [0, 0];

const velocity = [
  (2 + 2 * Math.random()) * (Math.random() > 0.5 ? 1 : -1),
  (2 + 2 * Math.random()) * (Math.random() > 0.5 ? 1 : -1),
];

function clip(min, max, curr) {
  return Math.min(max, Math.max(min, curr));
}

function inBounds(min, max, curr) {
  return min < curr && curr < max;
}

function randomColor() {
  const values = [...new Array(3)].map(() => Math.round(Math.random() * 255));

  return `rgb(${values.join(',')})`;
}

function updateBlockPos([x, y]) {
  blockEl.style.transform = `translateX(${x}px) translateY(${y}px)`;
}

function loop() {
  window.requestAnimationFrame(() => {
    const canvas = canvasEl.getBoundingClientRect();
    const block = blockEl.getBoundingClientRect();

    const maxX = canvas.right - block.width;
    const maxY = canvas.bottom - block.height;
    const newX = clip(canvas.left, maxX, block.left + velocity[0]);
    const newY = clip(canvas.top, maxY, block.top + velocity[1]);

    if (!inBounds(canvas.left, maxX, newX)) {
      velocity[0] *= -1;
      blockEl.style.background = randomColor();
    }

    if (!inBounds(canvas.top, maxY, newY)) {
      velocity[1] *= -1;
      blockEl.style.background = randomColor();
    }

    // Update coords
    coords[0] = newX;
    coords[1] = newY;

    updateBlockPos(coords);
    loop();
  });
}

function init() {
  const canvas = canvasEl.getBoundingClientRect();
  const block = blockEl.getBoundingClientRect();

  // Set initial coords
  coords[0] = canvas.left + (canvas.right - block.width) * Math.random();
  coords[1] = canvas.top + (canvas.bottom - block.height) * Math.random();

  updateBlockPos(coords);
  loop();
}

init();
