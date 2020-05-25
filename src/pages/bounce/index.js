import 'common/js/page';

const canvas = document.getElementById('canvas');
const block = document.getElementById('block');

const coords = [0, 0];

const velocity = [...new Array(2)].map(() => (
  (2 + 2 * Math.random()) * (Math.random() > 0.5 ? 1 : -1)
));

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
  block.style.transform = `translateX(${x}px) translateY(${y}px)`;
}

function loop() {
  window.requestAnimationFrame(() => {
    const [dx, dy] = velocity;

    const canvasRect = canvas.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    const maxX = canvasRect.right - blockRect.width;
    const maxY = canvasRect.bottom - blockRect.height;
    const newX = clip(canvasRect.left, maxX, blockRect.left + dx);
    const newY = clip(canvasRect.top, maxY, blockRect.top + dy);

    if (!inBounds(canvasRect.left, maxX, newX)) {
      velocity[0] = -dx;
      block.style.background = randomColor();
    }

    if (!inBounds(canvasRect.top, maxY, newY)) {
      velocity[1] = -dy;
      block.style.background = randomColor();
    }

    // Update coords
    coords[0] = newX;
    coords[1] = newY;

    updateBlockPos(coords);
    loop();
  });
}

function init() {
  const canvasRect = canvas.getBoundingClientRect();
  const blockRect = block.getBoundingClientRect();

  // Set initial coords
  coords[0] = canvasRect.left + (canvasRect.right - blockRect.width) * Math.random();
  coords[1] = canvasRect.top + (canvasRect.bottom - blockRect.height) * Math.random();

  updateBlockPos(coords);
  loop();
}

init();
