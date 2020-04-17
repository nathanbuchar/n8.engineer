import 'common/js/page';

const canvas = document.getElementById('canvas');
const block = document.getElementById('block');

const coords = [0, 0];

const velocity = [
  (2 + 2 * Math.random()) * (Math.random() > 0.5 ? 1 : -1),
  (2 + 2 * Math.random()) * (Math.random() > 0.5 ? 1 : -1),
];

function clip(min, max, curr) {
  return Math.min(max, Math.max(min, curr));
}

function randomColor() {
  return `rgb(${[...new Array(3)].map(() => Math.round(Math.random() * 255)).join(',')})`;
}

function updateBlockPos([x, y]) {
  block.style.transform = `translateX(${x}px) translateY(${y}px)`;
}

function loop() {
  window.requestAnimationFrame(() => {
    const canvasRect = canvas.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    const maxX = canvasRect.right - blockRect.width;
    const maxY = canvasRect.bottom - blockRect.height;
    const newX = clip(canvasRect.left, maxX, blockRect.left + velocity[0]);
    const newY = clip(canvasRect.top, maxY, blockRect.top + velocity[1]);

    if (newX >= maxX || newX <= canvasRect.left) {
      velocity[0] *= -1;
      block.style.backgroundColor = randomColor();
    }

    if (newY >= maxY || newY <= canvasRect.top) {
      velocity[1] *= -1;
      block.style.backgroundColor = randomColor();
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
