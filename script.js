const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

canvas.width = 2351;
canvas.height = 1600;

// Image setup
const img = new Image();
img.src = "arctanamapiona.png"; // Replace with your actual image filename

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let panStart = { x: 0, y: 0 };
let isPanning = false;

let selection = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.drawImage(img, 0, 0);
  
  if (selection) {
    ctx.fillStyle = "rgba(0, 120, 255, 0.3)";
    ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
    ctx.strokeStyle = "rgba(0, 120, 255, 0.8)";
    ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
  }

  ctx.restore();
}

function updateStats() {
  if (selection) {
    const cells = selection.w * selection.h;
    document.getElementById("cellCount").textContent = cells;
    document.getElementById("price").textContent = cells * 5;
    document.getElementById("tokens").textContent = Math.ceil((cells * 5) / 2000);
  } else {
    document.getElementById("cellCount").textContent = "0";
    document.getElementById("price").textContent = "0";
    document.getElementById("tokens").textContent = "0";
  }
}

canvas.addEventListener("mousedown", (e) => {
  const isRightClick = e.button === 2 || e.button === 1;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (isRightClick) {
    isPanning = true;
    panStart = { x: mouseX - offsetX, y: mouseY - offsetY };
  } else {
    isDragging = true;
    const x = Math.floor((mouseX - offsetX) / scale);
    const y = Math.floor((mouseY - offsetY) / scale);
    selection = { x, y, w: 0, h: 0 };
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (isPanning) {
    offsetX = mouseX - panStart.x;
    offsetY = mouseY - panStart.y;
    draw();
  }

  if (isDragging && selection) {
    const endX = Math.floor((mouseX - offsetX) / scale);
    const endY = Math.floor((mouseY - offsetY) / scale);
    selection.w = endX - selection.x;
    selection.h = endY - selection.y;

    if (selection.w < 0) {
      selection.x += selection.w;
      selection.w = Math.abs(selection.w);
    }
    if (selection.h < 0) {
      selection.y += selection.h;
      selection.h = Math.abs(selection.h);
    }

    draw();
    updateStats();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
  isPanning = false;
});

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const zoomFactor = 1.1;
  const zoomIn = e.deltaY < 0;

  const prevScale = scale;
  scale *= zoomIn ? zoomFactor : 1 / zoomFactor;

  const dx = mouseX - offsetX;
  const dy = mouseY - offsetY;

  offsetX -= dx * (scale / prevScale - 1);
  offsetY -= dy * (scale / prevScale - 1);

  draw();
});

canvas.addEventListener("contextmenu", (e) => e.preventDefault());

img.onload = () => {
  draw();
};
