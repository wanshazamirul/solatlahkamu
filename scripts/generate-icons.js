/**
 * Icon Generator for PWA - Converts SVG to PNG
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Simple SVG template with Islamic-inspired pattern
function generateSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 4}" fill="url(#grad)"/>

  <!-- Ka'aba-inspired square -->
  <rect x="${size * 0.3}" y="${size * 0.3}" width="${size * 0.4}" height="${size * 0.4}"
        fill="#fbbf24" stroke="#1f2937" stroke-width="${size / 100}"/>

  <!-- Inner decorative pattern -->
  <rect x="${size * 0.35}" y="${size * 0.35}" width="${size * 0.3}" height="${size * 0.3}"
        fill="none" stroke="#1f2937" stroke-width="${size / 150}"/>

  <!-- Compass star -->
  <path d="M ${size * 0.5} ${size * 0.15}
           L ${size * 0.53} ${size * 0.47}
           L ${size * 0.85} ${size * 0.5}
           L ${size * 0.53} ${size * 0.53}
           L ${size * 0.5} ${size * 0.85}
           L ${size * 0.47} ${size * 0.53}
           L ${size * 0.15} ${size * 0.5}
           L ${size * 0.47} ${size * 0.47}
           Z"
        fill="#ffffff" stroke="#1f2937" stroke-width="${size / 200}"/>
</svg>`;
}

async function generateIcons() {
  console.log('Generating PWA icons...\n');

  for (const size of sizes) {
    const svg = generateSVG(size);
    const svgFilename = `icon-${size}.svg`;
    const pngFilename = `icon-${size}.png`;
    const svgPath = path.join(publicDir, svgFilename);
    const pngPath = path.join(publicDir, pngFilename);

    // Write SVG
    fs.writeFileSync(svgPath, svg);

    // Convert to PNG using sharp
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);

      console.log(`✓ Generated: ${pngFilename} (${size}x${size})`);

      // Clean up SVG file
      fs.unlinkSync(svgPath);
    } catch (error) {
      console.error(`✗ Failed to generate ${pngFilename}:`, error.message);
    }
  }

  // Also generate a favicon.ico
  try {
    const svg192 = generateSVG(192);
    const svgPath = path.join(publicDir, 'icon-temp.svg');
    fs.writeFileSync(svgPath, svg192);

    await sharp(svgPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    fs.unlinkSync(svgPath);
    console.log(`\n✓ Generated: favicon-16x16.png`);
    console.log(`✓ Generated: apple-touch-icon.png`);
  } catch (error) {
    console.error('Warning: Could not generate favicon:', error.message);
  }

  console.log('\n✅ Icon generation complete!');
}

generateIcons().catch(console.error);
