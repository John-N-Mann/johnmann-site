
const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");

const cols = 100;
const rows = 100;
const tileSize = 8;

canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

canvas.style.display = "block";
canvas.style.margin = "auto";

let tiles = [];

function createTile(x, y) {
  const baseHue = 260 + Math.random() * 20;
  return {
    x,
    y,
    hue: baseHue,
    baseHue: baseHue,
    saturation: 30 + Math.random() * 30,
    baseSaturation: 30 + Math.random() * 30,
    lightness: 30 + Math.random() * 20,
    baseLightness: 30 + Math.random() * 20,
    driftSpeed: Math.random() * 0.5 + 0.1,
    influence: 0,
  };
}

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    tiles.push(createTile(x, y));
  }
}

let ripples = [];

function launchRipple(x, y) {
  ripples.push({
    originX: x,
    originY: y,
    radius: 0,
    maxRadius: 50,
    strength: 1,
    speed: 1.5,
  });
}

function updateRipples() {
  ripples.forEach((ripple) => {
    ripple.radius += ripple.speed;

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const dx = tile.x - ripple.originX;
      const dy = tile.y - ripple.originY;
      let dist = Math.sqrt(dx * dx + dy * dy);

      const mirrorX = Math.min(cols - 1, Math.max(0, 2 * ripple.originX - tile.x));
      const mirrorY = Math.min(rows - 1, Math.max(0, 2 * ripple.originY - tile.y));
      const reflectedDist = Math.sqrt((mirrorX - tile.x) ** 2 + (mirrorY - tile.y) ** 2);
      dist = Math.min(dist, reflectedDist);

      const delta = Math.abs(dist - ripple.radius);
      if (delta < 2) {
        const boost = ripple.strength * (1 - delta / 2);
        tile.influence += boost * 0.015;

        // Clamp hue adjustments to subtle range
        tile.hue += boost * 0.1;
        tile.baseHue += boost * 0.02;

        // Clamp hue to visible range
        tile.hue = (tile.hue + 360) % 360;
        tile.baseHue = (tile.baseHue + 360) % 360;
      }
    }
  });

  ripples = ripples.filter((r) => r.radius < r.maxRadius);
}

function drawTile(tile) {
  const boostedLight = Math.min(80, tile.lightness + tile.influence * 10);
  const boostedSat = Math.min(80, tile.saturation + tile.influence * 10);
  ctx.fillStyle = `hsl(${tile.hue}, ${boostedSat}%, ${boostedLight}%)`;
  ctx.fillRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
}

let hueInjectionTimer = 0;
const hueInjectionInterval = 20000;
const hueShiftRange = 60;

function injectHueDrift() {
  const corners = [
    { x: 0, y: 0 },
    { x: cols - 1, y: 0 },
    { x: 0, y: rows - 1 },
    { x: cols - 1, y: rows - 1 },
  ];
  const corner = corners[Math.floor(Math.random() * corners.length)];
  const newHue = (260 + Math.random() * hueShiftRange + hueShiftRange) % 360;

  const radius = 6;
  for (let dy = 0; dy < radius; dy++) {
    for (let dx = 0; dx < radius; dx++) {
      const tx = corner.x === 0 ? dx : cols - 1 - dx;
      const ty = corner.y === 0 ? dy : rows - 1 - dy;
      if (tx >= 0 && tx < cols && ty >= 0 && ty < rows) {
        const tile = tiles[ty * cols + tx];
        tile.baseHue = newHue;
        tile.hue = (tile.hue + newHue) / 2;
      }
    }
  }
}

function updateTiles(deltaTime) {
  hueInjectionTimer += deltaTime;
  if (hueInjectionTimer > hueInjectionInterval) {
    injectHueDrift();
    hueInjectionTimer = 0;
  }

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.influence *= 0.92;

    let totalHue = 0;
    let neighborCount = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = tile.x + dx;
        const ny = tile.y + dy;
        if (
          nx >= 0 && nx < cols &&
          ny >= 0 && ny < rows &&
          !(dx === 0 && dy === 0)
        ) {
          const neighbor = tiles[ny * cols + nx];
          totalHue += neighbor.hue;
          neighborCount++;
        }
      }
    }

    const avgHue = totalHue / neighborCount;
    tile.hue += (avgHue - tile.hue) * 0.04;
    tile.hue += (tile.baseHue - tile.hue) * 0.005;
    tile.hue += (Math.random() - 0.5) * tile.driftSpeed * 0.1;
    tile.hue = (tile.hue + 360) % 360;

    tile.lightness +=
      ((tile.baseLightness - tile.lightness) * 0.01) +
      (Math.random() - 0.5) * tile.driftSpeed;

    tile.saturation +=
      ((tile.baseSaturation - tile.saturation) * 0.01) +
      (Math.random() - 0.5) * tile.driftSpeed;

    tile.lightness = Math.max(20, Math.min(70, tile.lightness));
    tile.saturation = Math.max(20, Math.min(80, tile.saturation));
  }
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const tx = Math.floor(mx / tileSize);
  const ty = Math.floor(my / tileSize);
  launchRipple(tx, ty);
});

let lastTime = performance.now();
function animate(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  updateRipples();
  updateTiles(deltaTime);

  for (const tile of tiles) {
    drawTile(tile);
  }

  requestAnimationFrame(animate);
}

animate();
