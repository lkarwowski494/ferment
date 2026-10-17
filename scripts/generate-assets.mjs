import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal zero-dependency pure Node.js PNG encoder
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function createPng(width, height, getPixel, colorType = 6) {
  const bytesPerPixel = colorType === 2 ? 3 : 4;
  const rowSize = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      if (bytesPerPixel === 4) {
        rawData[pxOffset + 3] = a !== undefined ? a : 255;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = colorType; // 2: RGB (no alpha, App Store ITMS-90717), 6: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const len = data ? data.length : 0;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    typeBuf.copy(chunk, 4);
    if (data) data.copy(chunk, 8);
    const crc = crc32(Buffer.concat([typeBuf, data || Buffer.alloc(0)]));
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', null),
  ]);
}

const assetsDir = path.resolve('assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('Generating official Apps4Craft ceramic icons for Ferment...');

function blend(bg, fg, alpha) {
  const a = Math.max(0, Math.min(1, alpha));
  return [
    Math.round(bg[0] * (1 - a) + fg[0] * a),
    Math.round(bg[1] * (1 - a) + fg[1] * a),
    Math.round(bg[2] * (1 - a) + fg[2] * a),
    255,
  ];
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

// Render Ferment emblem: Stylized cheese wheel with slice cut-out & fermentation flora
function renderFermentIconPixel(x, y, w, h) {
  const scale = w / 1024;
  const px = x / scale;
  const py = y / scale;

  // 1. Ceramic Basalt Background #1C1917 (R:28, G:25, B:23) with radial gradient
  const centerDist = Math.hypot(px - 512, py - 512) / 600;
  const vignette = Math.max(0, 1 - centerDist * 0.4);
  let col = [
    Math.round(28 + 8 * vignette),
    Math.round(25 + 7 * vignette),
    Math.round(23 + 6 * vignette),
    255,
  ];

  // 2. Debossed ceramic medallion circle at center (radius 400px)
  const medDist = Math.hypot(px - 512, py - 512);
  if (medDist <= 400) {
    const medAlpha = Math.min(1, (400 - medDist) / 4);
    col = blend(col, [24, 21, 19], medAlpha * 0.7);
  }
  const rimDist = Math.abs(medDist - 400);
  if (rimDist < 3.5) {
    const rimA = 1 - rimDist / 3.5;
    col = blend(col, [55, 48, 44], rimA * 0.5);
  }

  // 3. Cheese Wheel Emblem
  // Isometric / perspective disc centered at (512, 530)
  // Outer ellipse of cheese top: rx=260, ry=140, center=(512, 480)
  // Height of cheese side: 150px (down to y=630)
  const cx = 512;
  const cyTop = 470;
  const cheeseHeight = 130;
  const rx = 240;
  const ry = 130;

  const amberGold = [217, 119, 6];     // #D97706
  const brightAmber = [245, 158, 11];  // #F59E0B
  const creamLight = [254, 243, 199];  // #FEF3C7
  const crustDark = [180, 83, 9];      // #B45309

  // Angle from center
  const angle = Math.atan2((py - cyTop) / ry, (px - cx) / rx);
  // Cut wedge between -0.4 rad (-23 deg) and 0.8 rad (45 deg)
  const isCut = angle > -0.35 && angle < 0.85;

  // Top surface ellipse equation
  const topNorm = Math.pow((px - cx) / rx, 2) + Math.pow((py - cyTop) / ry, 2);
  const bottomNorm = Math.pow((px - cx) / rx, 2) + Math.pow((py - (cyTop + cheeseHeight)) / ry, 2);

  // Cheese cylinder side
  if (py >= cyTop && py <= cyTop + cheeseHeight) {
    const sideY = py - (cyTop);
    const sideNorm = Math.pow((px - cx) / rx, 2);
    if (sideNorm <= 1.0) {
      // Visible front half (angle > 0)
      const sideAngle = Math.atan2((py - (cyTop + sideY)) / ry, (px - cx) / rx);
      if (sideAngle >= -0.2 && !isCut) {
        const edgeShade = Math.sin(Math.acos(Math.min(1, Math.abs(px - cx) / rx)));
        const sideCol = blend(crustDark, amberGold, edgeShade * 0.85);
        col = blend(col, sideCol, 0.95);
      }
    }
  }

  // Top surface
  if (topNorm <= 1.0 && !isCut) {
    const radial = 1 - Math.sqrt(topNorm);
    const topCol = blend(amberGold, brightAmber, radial * 0.9);
    col = blend(col, topCol, 0.98);

    // Cheese eyes / holes (bubbles of fermentation)
    const eyes = [
      { ex: 450, ey: 430, er: 22 },
      { ex: 540, ey: 450, er: 16 },
      { ex: 420, ey: 490, er: 28 },
      { ex: 510, ey: 400, er: 18 },
      { ex: 360, ey: 450, er: 20 },
      { ex: 480, ey: 500, er: 25 },
    ];
    for (const eye of eyes) {
      const ed = Math.hypot(px - eye.ex, (py - eye.ey) * (rx / ry));
      if (ed <= eye.er) {
        const eyeA = Math.min(1, (eye.er - ed) / 2);
        const depthShade = (eye.ey - py) / eye.er;
        const eyeCol = depthShade > 0 ? [146, 64, 14] : [245, 158, 11];
        col = blend(col, eyeCol, eyeA * 0.9);
      }
    }
  }

  // Slice cut interior walls
  if (isCut && topNorm <= 1.0) {
    // Cut surfaces are creamy inside
    col = blend(col, creamLight, 0.92);
  }

  // Fermentation flora / bubble dots around the wheel
  const flora = [
    { fx: 310, fy: 320, fr: 14 },
    { fx: 680, fy: 310, fr: 18 },
    { fx: 730, fy: 420, fr: 12 },
    { fx: 710, fy: 620, fr: 20 },
    { fx: 280, fy: 590, fr: 16 },
    { fx: 512, fy: 260, fr: 22 },
  ];
  for (const f of flora) {
    const fd = Math.hypot(px - f.fx, py - f.fy);
    if (fd <= f.fr) {
      const fAlpha = Math.min(1, (f.fr - fd) / 2);
      col = blend(col, brightAmber, fAlpha * 0.85);
    } else if (fd <= f.fr + 4) {
      const rimA = 1 - (fd - f.fr) / 4;
      col = blend(col, creamLight, rimA * 0.5);
    }
  }

  return col;
}

// 1. App Store Icon (1024x1024, RGB ColorType 2 - NO ALPHA per ITMS-90717)
console.log('Rendering 1024x1024 icon.png (RGB ColorType: 2)...');
const iconBuffer = createPng(1024, 1024, (x, y, w, h) => renderFermentIconPixel(x, y, w, h), 2);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);
console.log('  ✓ assets/icon.png created (1024x1024, RGB ColorType 2)');

// 2. Adaptive Icon (1024x1024, RGBA ColorType 6)
console.log('Rendering 1024x1024 adaptive-icon.png...');
const adaptiveIconBuffer = createPng(1024, 1024, (x, y, w, h) => renderFermentIconPixel(x, y, w, h), 6);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveIconBuffer);
console.log('  ✓ assets/adaptive-icon.png created (1024x1024, RGBA)');

// 3. Splash Icon (512x512, RGBA ColorType 6)
console.log('Rendering 512x512 splash-icon.png...');
const splashIconBuffer = createPng(512, 512, (x, y, w, h) => renderFermentIconPixel(x, y, w, h), 6);
fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), splashIconBuffer);
console.log('  ✓ assets/splash-icon.png created (512x512, RGBA)');

// 4. Splash Screen (1242x2688)
console.log('Rendering 1242x2688 splash.png...');
const splashBuffer = createPng(1242, 2688, (x, y, w, h) => {
  const cx = 1242 / 2;
  const cy = 2688 / 2;
  const targetEmblemSize = 512;
  const scale = targetEmblemSize / 1024;
  const iconX = (x - cx) / scale + 512;
  const iconY = (y - cy) / scale + 512;
  if (iconX >= 0 && iconX < 1024 && iconY >= 0 && iconY < 1024) {
    return renderFermentIconPixel(iconX, iconY, 1024, 1024);
  }
  const dy = Math.abs(y - cy) / cy;
  const basaltShade = Math.round(28 - 4 * dy);
  return [basaltShade, basaltShade - 3, basaltShade - 5, 255];
}, 6);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashBuffer);
console.log('  ✓ assets/splash.png created (1242x2688)');

// 5. Favicon (48x48)
console.log('Rendering 48x48 favicon.png...');
const faviconBuffer = createPng(48, 48, (x, y, w, h) => {
  return renderFermentIconPixel(x * (1024 / 48), y * (1024 / 48), 1024, 1024);
}, 6);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconBuffer);
console.log('  ✓ assets/favicon.png created (48x48)');

console.log('Official Apps4Craft ceramic assets generated successfully.');
