const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = path.join(__dirname, '../public/image.png');
const outputDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  try {
    const metadata = await sharp(inputImagePath).metadata();
    console.log('Original image metadata:', metadata);

    // 192x192 icon
    await sharp(inputImagePath)
      .resize(192, 192, { fit: 'cover' })
      .png()
      .toFile(path.join(outputDir, 'icon-192.png'));

    // 512x512 icon
    await sharp(inputImagePath)
      .resize(512, 512, { fit: 'cover' })
      .png()
      .toFile(path.join(outputDir, 'icon-512.png'));

    // Apple touch icon 180x180
    await sharp(inputImagePath)
      .resize(180, 180, { fit: 'cover' })
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));

    // Maskable 192x192 (with padding so safe area is preserved)
    await sharp(inputImagePath)
      .resize(150, 150, { fit: 'cover' })
      .extend({
        top: 21,
        bottom: 21,
        left: 21,
        right: 21,
        background: { r: 5, g: 5, b: 17, alpha: 1 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon-maskable-192.png'));

    // Maskable 512x512
    await sharp(inputImagePath)
      .resize(400, 400, { fit: 'cover' })
      .extend({
        top: 56,
        bottom: 56,
        left: 56,
        right: 56,
        background: { r: 5, g: 5, b: 17, alpha: 1 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon-maskable-512.png'));

    console.log('Successfully generated all PWA icons in public/icons/');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
