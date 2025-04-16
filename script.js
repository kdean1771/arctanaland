const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const image = new Image();
    image.src = 'arctanamapiona.png'; // replace with your image filename

    let selection = null;
    let dragging = false;
    let panning = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;
    let scale = 1;

    const canvasContainer = document.getElementById('canvas-container');
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;

    function draw() {
      ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
      ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);
      ctx.drawImage(image, 0, 0);

      if (selection) {
        ctx.fillStyle = 'rgba(0, 128, 255, 0.3)';
        ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1 / scale;
        ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
      }
    }

    function updateStats() {
      const cellCount = selection ? selection.w * selection.h : 0;
      document.getElementById('cellCount').textContent = cellCount;
      document.getElementById('price').textContent = cellCount * 5;
      document.getElementById('tokens').textContent = Math.floor((cellCount * 5) / 2000);
    }

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left);
      const mouseY = (e.clientY - rect.top);
      const worldX = Math.floor((mouseX - offsetX) / scale);
      const worldY = Math.floor((mouseY - offsetY) / scale);

      if (e.button === 0) { // Left click for selection
        dragging = true;
        selection = { x: worldX, y: worldY, w: 0, h: 0, startX: worldX, startY: worldY };
      } else if (e.button === 1 || e.button === 2) { // Middle or right click for pan
        panning = true;
        startX = e.clientX;
        startY = e.clientY;
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left);
      const mouseY = (e.clientY - rect.top);

      if (dragging && selection) {
        const currentX = Math.floor((mouseX - offsetX) / scale);
        const currentY = Math.floor((mouseY - offsetY) / scale);
        selection.x = Math.min(selection.startX, currentX);
        selection.y = Math.min(selection.startY, currentY);
        selection.w = Math.abs(currentX - selection.startX);
        selection.h = Math.abs(currentY - selection.startY);
        updateStats();
      }

      if (panning) {
        offsetX += e.clientX - startX;
        offsetY += e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
      }

      draw();
    });

    canvas.addEventListener('mouseup', () => {
      dragging = false;
      panning = false;
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX - offsetX) / scale;
      const worldY = (mouseY - offsetY) / scale;

      const zoomAmount = e.deltaY < 0 ? 1.1 : 0.9;
      scale *= zoomAmount;

      offsetX = mouseX - worldX * scale;
      offsetY = mouseY - worldY * scale;

      draw();
    }, { passive: false });

    image.onload = () => {
      draw();
    };

    window.addEventListener('resize', () => {
      canvas.width = canvasContainer.clientWidth;
      canvas.height = canvasContainer.clientHeight;
      draw();
    });
