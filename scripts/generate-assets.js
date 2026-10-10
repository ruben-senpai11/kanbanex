const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const USER_K_EMBLEM = 'C:/Users/ADMIN/.gemini/antigravity/brain/d00c6db1-f41a-436b-af30-e2362882fb43/.user_uploaded/media_1791638207596.png';
const USER_FULL_PNG = 'C:/Users/ADMIN/Downloads/Logo KanbanEx doré et brillant.png';
const USER_SVG = 'C:/Users/ADMIN/Downloads/KanbanEx_logo_web.svg';

const PUBLIC_DIR = path.join(__dirname, '../apps/web/public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

function createIco(pngBuffers, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(pngBuffers.length, 4); // count

  let offset = 6 + (16 * pngBuffers.length);
  const dirEntries = [];

  for (let i = 0; i < pngBuffers.length; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function run() {
  console.log('Generating KanbanEx assets...');

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  // 1. High-res K Emblem (1024x1024)
  const emblem1024 = await sharp(USER_K_EMBLEM).png().toBuffer();
  fs.writeFileSync(path.join(IMAGES_DIR, 'kanbanex-k-emblem.png'), emblem1024);
  console.log('✓ kanbanex-k-emblem.png (1024x1024)');

  // 2. Logo 512x512
  const emblem512 = await sharp(USER_K_EMBLEM).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(IMAGES_DIR, 'kanbanex-logo.png'), emblem512);
  console.log('✓ kanbanex-logo.png (512x512)');

  // 3. Small Logo 96x96
  const emblem96 = await sharp(USER_K_EMBLEM).resize(96, 96).png().toBuffer();
  fs.writeFileSync(path.join(IMAGES_DIR, 'kanbanex-logo-small.png'), emblem96);
  console.log('✓ kanbanex-logo-small.png (96x96)');

  // 4. Apple Touch Icon (180x180)
  const appleTouch = await sharp(USER_K_EMBLEM).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), appleTouch);
  console.log('✓ apple-touch-icon.png (180x180)');

  // 5. Favicon PNG (32x32 & 16x16)
  const fav32 = await sharp(USER_K_EMBLEM).resize(32, 32).png().toBuffer();
  const fav16 = await sharp(USER_K_EMBLEM).resize(16, 16).png().toBuffer();
  const fav48 = await sharp(USER_K_EMBLEM).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.png'), fav32);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), fav32);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-16x16.png'), fav16);

  // 6. Favicon.ico (multi-resolution 16, 32, 48)
  const icoBuf = createIco([fav16, fav32, fav48], [16, 32, 48]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuf);
  console.log('✓ favicon.ico (16, 32, 48)');

  // 7. Full PNG Logo
  if (fs.existsSync(USER_FULL_PNG)) {
    const fullLogoBuf = fs.readFileSync(USER_FULL_PNG);
    fs.writeFileSync(path.join(IMAGES_DIR, 'kanbanex-full-logo.png'), fullLogoBuf);
    console.log('✓ kanbanex-full-logo.png');
  }

  // 8. SVGs
  if (fs.existsSync(USER_SVG)) {
    const rawSvg = fs.readFileSync(USER_SVG, 'utf8');

    // Official copy
    fs.writeFileSync(path.join(IMAGES_DIR, 'KanbanEx_logo_web.svg'), rawSvg);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'KanbanEx_logo_web.svg'), rawSvg);

    // Dark theme SVG (text is white)
    const darkSvg = rawSvg.replace(/fill="#FFFFFF"/g, 'fill="#FFFFFF"');
    fs.writeFileSync(path.join(IMAGES_DIR, 'kanbanex-logo-dark.svg'), darkSvg);

    // Light theme SVG (Kanban text is #0F172A)
    const lightSvg = rawSvg.replace(/<text x="285" y="211" fill="#FFFFFF">Kanban<\/text>/g, '<text x="285" y="211" fill="#0F172A">Kanban</text>');
    fs.writeFileSync(path.join(IMAGES_DIR, 'kanbanex-logo-light.svg'), lightSvg);

    // Adaptive SVG (uses CSS styles for light/dark contrast)
    const adaptiveSvg = rawSvg.replace(
      '<defs>',
      `<defs>
    <style>
      .logo-brand-text { fill: #0F172A; }
      @media (prefers-color-scheme: dark) {
        .logo-brand-text { fill: #FFFFFF; }
      }
    </style>`
    ).replace(
      '<text x="285" y="211" fill="#FFFFFF">Kanban</text>',
      '<text x="285" y="211" class="logo-brand-text">Kanban</text>'
    );
    fs.writeFileSync(path.join(IMAGES_DIR, 'kanbanex-logo.svg'), adaptiveSvg);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'kanbanex-logo.svg'), adaptiveSvg);

    console.log('✓ SVGs (KanbanEx_logo_web.svg, kanbanex-logo-light.svg, kanbanex-logo-dark.svg, kanbanex-logo.svg)');
  }

  console.log('All assets generated successfully!');
}

run().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
