import 'common/js/page';

import debounce from 'debounce';

const size = 36; // Radius of circle hexagon fits into.
const distanceBetweenCubes = size * Math.sqrt(3);

const colors = {
  white: '#D4D5D0',
  green: '#466446',
  red: '#AE282A',
  yellow: '#F6C42C',
  blue: '#2E51A2',
  orange: '#D56524',
  black: '#271C1C',
};

// Set up canvas
const canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

// Set up context
const ctx = canvas.getContext('2d');
ctx.lineWidth = size / 16;
ctx.strokeStyle = colors.black;

function draw() {
  const numRows = Math.ceil(canvas.width / distanceBetweenCubes) + 1;
  const numCols = Math.ceil(canvas.height / (3 * (size / 2))) + 1;

  for (let y = 0; y < numCols; y++) {
    for (let x = 0; x < numRows; x++) {
      setTimeout(() => {
        const cubeX = x * distanceBetweenCubes - (distanceBetweenCubes / 2) * (y % 2);
        const cubeY = y * size * (3 / 2);

        ctx.setTransform(1, 0, 0, 1, cubeX, cubeY);

        const c = [
          colors.white,
          colors.green,
          colors.red,
          colors.yellow,
          colors.blue,
          colors.orange,
        ];

        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.rotate(i * 120 * (Math.PI / 180));

          // Face
          const color = c.splice(Math.floor(Math.random() * c.length), 1);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(distanceBetweenCubes / 2, size / -2);
          ctx.lineTo(distanceBetweenCubes / 2, size / 2);
          ctx.lineTo(0, size);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.stroke();

          // Lines
          for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
              ctx.moveTo(distanceBetweenCubes * ((k + 1) / 6), size * ((k + 1) / -6));
              ctx.lineTo(distanceBetweenCubes * ((k + 1) / 6), size - size * ((k + 1) / 6));
              ctx.moveTo(0, size * ((k + 1) / 3));
              ctx.lineTo(distanceBetweenCubes / 2, size / -2 + size * ((k + 1) / 3));
              ctx.stroke();
            }
          }

          ctx.restore();
        }
      }, 1000 * Math.random());
    }
  }
}

window.addEventListener('resize', debounce(() => {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  draw();
}, 100));

canvas.addEventListener('click', () => {
  draw();
});

draw();
