const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'icon.svg');
const outputDir = path.join(__dirname, 'public');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read SVG file
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  try {
    // Generate PNG icons in various sizes
    const sizes = [16, 24, 32, 48, 64, 128, 256, 512];
    
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon-${size}.png`));
      console.log(`Generated icon-${size}.png`);
    }
    
    // Generate main icon.png (256x256)
    await sharp(svgBuffer)
      .resize(256, 256)
      .png()
      .toFile(path.join(outputDir, 'icon.png'));
    console.log('Generated icon.png');
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
