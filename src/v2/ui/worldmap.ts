import { WorldDef, WORLDS } from '../data/worlds';

const PREVIEW_W = 144;
const PREVIEW_H = 96;

// Populates `container` (the .slotsPanel element) with the world map grid.
export function buildWorldMapPanel(
  container: HTMLElement,
  onEnterWorld: (world: WorldDef) => void,
): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const label = document.createElement('div');
  label.className = 'slotsPanelLabel';
  label.textContent = 'WORLD MAP';
  container.append(label);

  const grid = document.createElement('div');
  grid.className = 'slotsGrid';

  for (const world of WORLDS) {
    const card = makeWorldCard(world, world.unlocked, () => onEnterWorld(world));
    grid.append(card);
  }

  container.append(grid);
}

function makeWorldCard(
  world: WorldDef,
  unlocked: boolean,
  onEnter: () => void,
): HTMLElement {
  const card = document.createElement('div');
  card.className = `worldCard ${unlocked ? 'worldCard--unlocked' : 'worldCard--locked'}`;
  if (world.secret) card.classList.add('worldCard--secret');

  // Use CSS custom properties so each card's border/glow matches its theme.
  card.style.setProperty('--world-primary', world.theme.primary);
  card.style.setProperty('--world-glow', world.theme.glow);

  // Canvas preview
  const canvas = document.createElement('canvas');
  canvas.width = PREVIEW_W;
  canvas.height = PREVIEW_H;
  canvas.className = 'worldPreview';
  drawLevelPreview(canvas, world, unlocked);
  card.append(canvas);

  if (unlocked) {
    // Footer: name + summary
    const footer = document.createElement('div');
    footer.className = 'worldCardFooter';

    const nameEl = document.createElement('span');
    nameEl.className = 'worldName';
    nameEl.textContent = world.name;
    footer.append(nameEl);

    if (world.summary) {
      const summaryEl = document.createElement('span');
      summaryEl.className = 'worldSummary';
      summaryEl.textContent = world.summary;
      footer.append(summaryEl);
    }

    card.append(footer);
    card.tabIndex = 0;
    card.addEventListener('click', onEnter);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') onEnter();
    });
  } else {
    // Locked label (hidden for secret worlds)
    if (!world.secret) {
      const lockLabel = document.createElement('div');
      lockLabel.className = 'worldLockLabel';
      lockLabel.textContent = 'LOCKED';
      card.append(lockLabel);
    }

    // Tactile feedback on click
    card.addEventListener('click', () => {
      card.classList.add('worldCard--shake');
      card.addEventListener(
        'animationend',
        () => card.classList.remove('worldCard--shake'),
        { once: true },
      );
    });
  }

  return card;
}

// ---------------------------------------------------------------------------
// Canvas drawing
// ---------------------------------------------------------------------------

function drawLevelPreview(
  canvas: HTMLCanvasElement,
  world: WorldDef,
  unlocked: boolean,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = world.theme.bg;
  ctx.fillRect(0, 0, W, H);

  if (world.secret && !unlocked) {
    drawSecretLockedPreview(ctx, W, H, world);
    return;
  }

  const alpha = unlocked ? 1.0 : 0.22;

  // Faint background stars (deterministic, based on world id)
  if (unlocked) {
    const seed = worldSeed(world.id);
    ctx.fillStyle = 'rgba(180,220,255,0.45)';
    for (let i = 0; i < 20; i++) {
      const sx = Math.abs((seed * 37 + i * 53) % (W - 4)) + 2;
      const sy = Math.abs((seed * 17 + i * 31) % (H - 4)) + 2;
      if ((sx + sy + i) % 3 !== 0) {
        ctx.fillRect(sx, sy, 1, 1);
      }
    }
  }

  // Subtle grid
  const cellW = W / world.gridWidth;
  const cellH = H / world.gridHeight;
  ctx.globalAlpha = unlocked ? 1 : 0.4;
  ctx.strokeStyle = world.theme.grid;
  ctx.lineWidth = 0.5;
  for (let gx = 0; gx <= world.gridWidth; gx++) {
    ctx.beginPath();
    ctx.moveTo(gx * cellW, 0);
    ctx.lineTo(gx * cellW, H);
    ctx.stroke();
  }
  for (let gy = 0; gy <= world.gridHeight; gy++) {
    ctx.beginPath();
    ctx.moveTo(0, gy * cellH);
    ctx.lineTo(W, gy * cellH);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Lane paths
  for (const lane of world.lanes) {
    if (lane.points.length < 2) continue;

    // Glow pass (unlocked only): wider, semi-transparent
    if (unlocked) {
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = world.theme.glow;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawPath(ctx, lane.points, W, H);
    }

    // Main line
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = unlocked ? world.theme.primary : world.theme.grid;
    ctx.lineWidth = unlocked ? 1.5 : 0.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawPath(ctx, lane.points, W, H);
    ctx.globalAlpha = 1;

    // Spawn arrow at lane entry (unlocked only)
    if (unlocked) {
      const p0 = lane.points[0];
      const p1 = lane.points[1];
      const angle = Math.atan2(
        (p1.y - p0.y) * H,
        (p1.x - p0.x) * W,
      );
      const ex = p0.x * W;
      const ey = p0.y * H;
      ctx.fillStyle = world.theme.glow;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(ex + Math.cos(angle) * 4.5, ey + Math.sin(angle) * 4.5);
      ctx.lineTo(ex + Math.cos(angle + 2.3) * 2.5, ey + Math.sin(angle + 2.3) * 2.5);
      ctx.lineTo(ex + Math.cos(angle - 2.3) * 2.5, ey + Math.sin(angle - 2.3) * 2.5);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Core marker (exit end)
  if (unlocked) {
    const cx = world.core.x * W;
    const cy = world.core.y * H;
    // Glow halo
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = world.theme.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
    // Solid dot
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = world.theme.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // TowerStart: small emitter/tower silhouette
  if (unlocked) {
    const tx = world.towerStart.x * W;
    const ty = world.towerStart.y * H;
    ctx.globalAlpha = 0.75;
    // Base block
    ctx.fillStyle = world.theme.primary;
    ctx.fillRect(tx - 3, ty - 1, 6, 4);
    // Barrel
    ctx.fillStyle = world.theme.accent;
    ctx.fillRect(tx - 1, ty - 5, 2, 4);
    ctx.globalAlpha = 1;
  }

  // Locked overlay: scanlines over the silhouette
  if (!unlocked) {
    ctx.fillStyle = 'rgba(0,0,0,0.52)';
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 2);
    }
  }
}

function drawSecretLockedPreview(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  world: WorldDef,
): void {
  // Sparse void-static pixel noise
  const seed = worldSeed(world.id);
  for (let i = 0; i < 90; i++) {
    const px = Math.abs((seed * 41 + i * 59) % W);
    const py = Math.abs((seed * 23 + i * 37) % H);
    const tier = (seed * 7 + i * 11) % 3;
    ctx.globalAlpha = [0.12, 0.25, 0.45][tier];
    ctx.fillStyle = world.theme.glow;
    ctx.fillRect(px, py, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Very faint grid
  ctx.strokeStyle = 'rgba(50,30,70,0.25)';
  ctx.lineWidth = 0.5;
  const cellW = W / world.gridWidth;
  const cellH = H / world.gridHeight;
  for (let gx = 0; gx <= world.gridWidth; gx++) {
    ctx.beginPath();
    ctx.moveTo(gx * cellW, 0);
    ctx.lineTo(gx * cellW, H);
    ctx.stroke();
  }
  for (let gy = 0; gy <= world.gridHeight; gy++) {
    ctx.beginPath();
    ctx.moveTo(0, gy * cellH);
    ctx.lineTo(W, gy * cellH);
    ctx.stroke();
  }

  // Mysterious centre symbol
  ctx.fillStyle = 'rgba(120,70,180,0.4)';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('? ? ?', W / 2, H / 2);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function drawPath(
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>,
  W: number,
  H: number,
): void {
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const px = points[i].x * W;
    const py = points[i].y * H;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

function worldSeed(id: string): number {
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}
