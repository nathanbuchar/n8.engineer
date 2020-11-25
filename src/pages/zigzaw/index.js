import 'common/js/page';

const CUBE_SIZE = 36; // Radius of circle hexagon fits into.
const YELLOW = '#F6C42C';
const RED = '#AE282A';
const BLUE = '#2E51A2';
const GREEN = '#466446';
const ORANGE = '#D56524';
const WHITE = '#D4D5D0';
const BLACK = '#271C1C';
const COLORS = [YELLOW, RED, WHITE, GREEN, ORANGE, BLUE];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const distanceBetweenVertices = CUBE_SIZE * Math.sqrt(3);
const numTilesHorizontal = Math.ceil(canvas.width / distanceBetweenVertices) + 1;
const numTilesVertical = Math.ceil(canvas.height / (3 * (CUBE_SIZE / 2))) + 1;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < numTilesVertical; y++) {
    for (let x = 0; x < numTilesHorizontal; x++) {
      const availableColors = [...COLORS];

      const cubeX = x * distanceBetweenVertices - (distanceBetweenVertices / 2) * (y % 2);
      const cubeY = y * (3 * (CUBE_SIZE / 2)) + CUBE_SIZE / 2;

      ctx.setTransform(1, 0, 0, 1, cubeX, cubeY);
      ctx.lineWidth = CUBE_SIZE / 15;
      ctx.strokeStyle = BLACK;

      // I could probably do something fancy with
      // matrix transforms and loops that I don't
      // have to repeat myself so much.

      // Faces
      const color1 = availableColors.splice(Math.floor(Math.random() * availableColors.length), 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(distanceBetweenVertices / 2, CUBE_SIZE / -2);
      ctx.lineTo(distanceBetweenVertices / 2, CUBE_SIZE / 2);
      ctx.lineTo(0, CUBE_SIZE);
      ctx.lineTo(0, 0);
      ctx.fillStyle = color1;
      ctx.fill();

      const color2 = availableColors.splice(Math.floor(Math.random() * availableColors.length), 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, CUBE_SIZE);
      ctx.lineTo(distanceBetweenVertices / -2, CUBE_SIZE / 2);
      ctx.lineTo(distanceBetweenVertices / -2, CUBE_SIZE / -2);
      ctx.lineTo(0, 0);
      ctx.fillStyle = color2;
      ctx.fill();

      const color3 = availableColors.splice(Math.floor(Math.random() * availableColors.length), 1);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(distanceBetweenVertices / 2, CUBE_SIZE / -2);
      ctx.lineTo(0, -CUBE_SIZE);
      ctx.lineTo(distanceBetweenVertices / -2, CUBE_SIZE / -2);
      ctx.lineTo(0, 0);
      ctx.fillStyle = color3;
      ctx.fill();

      // Outline
      ctx.beginPath();
      ctx.moveTo(0, -CUBE_SIZE);
      ctx.lineTo(distanceBetweenVertices / 2, CUBE_SIZE / -2);
      ctx.lineTo(distanceBetweenVertices / 2, CUBE_SIZE / 2);
      ctx.lineTo(0, CUBE_SIZE);
      ctx.lineTo(distanceBetweenVertices / -2, CUBE_SIZE / -2 + CUBE_SIZE);
      ctx.lineTo(distanceBetweenVertices / -2, CUBE_SIZE / -2);
      ctx.lineTo(0, -CUBE_SIZE);
      ctx.stroke();
      ctx.closePath();

      // Lines
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, CUBE_SIZE);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(distanceBetweenVertices / -2, CUBE_SIZE / -2);
      ctx.lineTo(0, 0);
      ctx.lineTo(distanceBetweenVertices / 2, CUBE_SIZE / -2);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(distanceBetweenVertices / -2, CUBE_SIZE / -2 + CUBE_SIZE * (1 / 3));
      ctx.lineTo(0, CUBE_SIZE * (1 / 3));
      ctx.lineTo(distanceBetweenVertices / 2, CUBE_SIZE / -2 + CUBE_SIZE * (1 / 3));
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(distanceBetweenVertices / -2, CUBE_SIZE / -2 + CUBE_SIZE * (2 / 3));
      ctx.lineTo(0, CUBE_SIZE * (2 / 3));
      ctx.lineTo(distanceBetweenVertices / 2, CUBE_SIZE / -2 + CUBE_SIZE * (2 / 3));
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(-distanceBetweenVertices / 6, -CUBE_SIZE + CUBE_SIZE * (1 / 6));
      ctx.lineTo(distanceBetweenVertices / 3, CUBE_SIZE / -3);
      ctx.lineTo(distanceBetweenVertices / 3, CUBE_SIZE - CUBE_SIZE * (1 / 3));
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(-distanceBetweenVertices / 3, -CUBE_SIZE + CUBE_SIZE * (1 / 3));
      ctx.lineTo(distanceBetweenVertices / 6, CUBE_SIZE / -6);
      ctx.lineTo(distanceBetweenVertices / 6, CUBE_SIZE - CUBE_SIZE * (1 / 6));
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(-distanceBetweenVertices / 3, CUBE_SIZE - CUBE_SIZE * (1 / 3));
      ctx.lineTo(-distanceBetweenVertices / 3, CUBE_SIZE / -3);
      ctx.lineTo(distanceBetweenVertices / 6, -CUBE_SIZE + CUBE_SIZE * (1 / 6));
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(-distanceBetweenVertices / 6, CUBE_SIZE - CUBE_SIZE * (1 / 6));
      ctx.lineTo(-distanceBetweenVertices / 6, CUBE_SIZE / -6);
      ctx.lineTo(distanceBetweenVertices / 3, -CUBE_SIZE + CUBE_SIZE * (1 / 3));
      ctx.stroke();
      ctx.closePath();
    }
  }
}

function loop() {
  setInterval(() => {
    draw();
  }, 2500);

  // Initial draw.
  draw();
}

loop();
