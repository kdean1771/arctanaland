const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = 'https://via.placeholder.com/2000x1000'; // Replace with your own image path later

let isDragging = false;
let startX = 0, startY = 0, currentX = 0, currentY = 0;

img.onload = () => {
  ctx.drawImage(img, 0, 0);
};

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const rect = canvas.getBoundingClientRect();
  currentX = e.clientX - rect.left;
  currentY = e.clientY - rect.top;

  redraw();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);
  const w = Math.abs(startX - currentX);
  const h = Math.abs(startY - currentY);

  ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  const selectedCells = Math.floor(w) * Math.floor(h);
  const price = selectedCells * 5;
  const tokens = Math.floor(price / 2000);

  document.getElementById('cellCount').textContent = selectedCells;
  document.getElementById('price').textContent = price;
  document.getElementById('tokens').textContent = tokens;
}
