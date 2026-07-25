/**
 * 3D Pixel Scroll World Component
 * Inspired by scroll-world (oso95/scroll-world)
 * Interactive 3D Pixel Canvas that reacts to scroll depth and mouse motion
 */

let animationFrameId = null;
let isAutoRotating = true;
let activeTheme = 'neon'; // 'neon' | 'cyber' | 'retro'
let cameraPitch = 0.55;
let cameraYaw = 0.75;
let targetYaw = 0.75;
let scrollOffset = 0;

export function renderPixelScrollWorld() {
  return `
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
      <canvas id="pixel-world-canvas" class="w-full h-full block image-rendering-pixelated opacity-60 cursor-grab active:cursor-grabbing"></canvas>
      <div class="absolute inset-0 bg-gradient-to-t from-[#ffd803]/80 via-transparent to-[#ffd803]/30 pointer-events-none"></div>
    </div>
  `;
}

export function initPixelScrollWorld() {
  const canvas = document.getElementById('pixel-world-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Handle Resize
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Voxel Palette themes
  const themes = {
    neon: {
      gridLine: '#2cb67d',
      topFace: '#ff8e3c',
      leftFace: '#e53170',
      rightFace: '#7f5af0',
      nodeColor: '#fffffe',
      bgColor: '#08070d'
    },
    cyber: {
      gridLine: '#00f0ff',
      topFace: '#7000ff',
      leftFace: '#ff007f',
      rightFace: '#00b8ff',
      nodeColor: '#ffffff',
      bgColor: '#020208'
    },
    retro: {
      gridLine: '#fde047',
      topFace: '#22c55e',
      leftFace: '#15803d',
      rightFace: '#166534',
      nodeColor: '#fef08a',
      bgColor: '#051808'
    }
  };

  // Generate Voxel Blocks
  const blocks = [];
  const gridSize = 7;
  const spacing = 36;

  for (let x = -gridSize; x <= gridSize; x++) {
    for (let z = -gridSize; z <= gridSize; z++) {
      // Height variance
      const dist = Math.sqrt(x * x + z * z);
      const height = Math.floor(Math.sin(dist * 0.6) * 3 + Math.cos(x * 0.8) * 2) + 2;
      const isServerNode = (x % 3 === 0 && z % 3 === 0);
      blocks.push({ x: x * spacing, z: z * spacing, y: height * 12, size: 28, isNode: isServerNode });
    }
  }

  // Floating Cloud Particles
  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 500,
      y: Math.random() * 120 + 80,
      z: (Math.random() - 0.5) * 500,
      size: Math.random() * 8 + 6,
      speed: Math.random() * 0.5 + 0.2
    });
  }

  // Mouse / Touch Drag Tracking
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  window.addEventListener('mousemove', e => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      targetYaw += deltaX * 0.008;
      cameraPitch = Math.max(0.1, Math.min(1.2, cameraPitch + deltaY * 0.005));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    } else {
      // Gentle parallax follow
      const rect = canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        targetYaw += normX * 0.002;
      }
    }
  });

  // Scroll Listener
  const onScroll = () => {
    scrollOffset = window.scrollY;
    const depthEl = document.getElementById('pixel-3d-depth-val');
    if (depthEl) depthEl.innerText = `${Math.floor(scrollOffset)}px`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // FPS Counter
  let lastTime = performance.now();
  let frameCount = 0;
  let currentFps = 60;

  // Main Render Loop
  function render(now) {
    frameCount++;
    if (now - lastTime >= 1000) {
      currentFps = frameCount;
      frameCount = 0;
      lastTime = now;
      const fpsEl = document.getElementById('pixel-3d-fps-val');
      if (fpsEl) fpsEl.innerText = currentFps;
    }

    if (isAutoRotating && !isDragging) {
      targetYaw += 0.006;
    }
    cameraYaw += (targetYaw - cameraYaw) * 0.1;

    const t = themes[activeTheme] || themes.neon;
    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2 + 30 + Math.sin(now * 0.002) * 6;

    // Clear Screen
    ctx.fillStyle = t.bgColor;
    ctx.fillRect(0, 0, w, h);

    // Dynamic Scroll Camera Shift
    const cameraScrollY = (scrollOffset % 300) * 0.15;
    const cosYaw = Math.cos(cameraYaw);
    const sinYaw = Math.sin(cameraYaw);
    const cosPitch = Math.cos(cameraPitch);
    const sinPitch = Math.sin(cameraPitch);

    // 3D Isometric Projection Helper
    function project(x, y, z) {
      // Rotate Y (Yaw)
      const rx = x * cosYaw - z * sinYaw;
      const rz = x * sinYaw + z * cosYaw;

      // Rotate X (Pitch)
      const ry = y * cosPitch - rz * sinPitch;
      const rz2 = y * sinPitch + rz * cosPitch + 380 + cameraScrollY;

      const scale = 360 / Math.max(10, rz2);
      return {
        px: centerX + rx * scale,
        py: centerY - ry * scale,
        scale,
        depth: rz2
      };
    }

    // Draw Isometric Grid Lines
    ctx.strokeStyle = t.gridLine;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 1;

    const gridExtent = 300;
    for (let g = -gridExtent; g <= gridExtent; g += 40) {
      const p1 = project(g, -10, -gridExtent);
      const p2 = project(g, -10, gridExtent);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();

      const p3 = project(-gridExtent, -10, g);
      const p4 = project(gridExtent, -10, g);
      ctx.beginPath();
      ctx.moveTo(p3.px, p3.py);
      ctx.lineTo(p4.px, p4.py);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Sort Blocks Back-to-Front
    const projectedBlocks = blocks.map(b => {
      const p = project(b.x, b.y, b.z);
      return { ...b, ...p };
    }).sort((a, b) => b.depth - a.depth);

    // Draw 3D Pixel Voxel Blocks
    for (const b of projectedBlocks) {
      if (b.px < -100 || b.px > w + 100 || b.py < -100 || b.py > h + 100) continue;

      const size = b.size * b.scale * 0.5;
      const height = (b.y + Math.sin(now * 0.003 + b.x) * 4) * b.scale * 0.4;

      // Top Face
      ctx.fillStyle = b.isNode ? t.nodeColor : t.topFace;
      ctx.beginPath();
      ctx.moveTo(b.px, b.py - height - size);
      ctx.lineTo(b.px + size, b.py - height - size * 0.5);
      ctx.lineTo(b.px, b.py - height);
      ctx.lineTo(b.px - size, b.py - height - size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Left Face
      ctx.fillStyle = b.isNode ? t.topFace : t.leftFace;
      ctx.beginPath();
      ctx.moveTo(b.px - size, b.py - height - size * 0.5);
      ctx.lineTo(b.px, b.py - height);
      ctx.lineTo(b.px, b.py);
      ctx.lineTo(b.px - size, b.py - size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Face
      ctx.fillStyle = b.isNode ? t.leftFace : t.rightFace;
      ctx.beginPath();
      ctx.moveTo(b.px, b.py - height);
      ctx.lineTo(b.px + size, b.py - height - size * 0.5);
      ctx.lineTo(b.px + size, b.py - size * 0.5);
      ctx.lineTo(b.px, b.py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Render Floating Cloud Cubes & Stars
    for (const p of particles) {
      p.y += p.speed * 0.2;
      if (p.y > 220) p.y = 80;

      const proj = project(p.x, p.y, p.z);
      if (proj.px > 0 && proj.px < w && proj.py > 0 && proj.py < h) {
        const sz = p.size * proj.scale;
        ctx.fillStyle = t.nodeColor;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(proj.px, proj.py, sz, sz);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(proj.px, proj.py, sz, sz);
      }
    }
    ctx.globalAlpha = 1.0;

    animationFrameId = requestAnimationFrame(render);
  }

  // Window Controls Setup
  window.togglePixel3DRotation = function() {
    isAutoRotating = !isAutoRotating;
    const btn = document.getElementById('btn-3d-rotate');
    if (btn) {
      btn.innerHTML = `<span>🔄 Auto Rotasi: ${isAutoRotating ? 'ON' : 'OFF'}</span>`;
    }
  };

  window.changePixel3DTheme = function() {
    if (activeTheme === 'neon') activeTheme = 'cyber';
    else if (activeTheme === 'cyber') activeTheme = 'retro';
    else activeTheme = 'neon';
  };

  window.resetPixel3DCamera = function() {
    cameraPitch = 0.55;
    cameraYaw = 0.75;
    targetYaw = 0.75;
    isAutoRotating = true;
  };

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(render);
}
