/**
 * Open Graph Image Generator for PARIBITO
 * 
 * This script creates a 1200x630px Open Graph image for social media sharing.
 * 
 * INSTRUCTIONS:
 * Run: node generate-og-image.js
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, 'src', 'assets', 'logo.jpg');
const logoTextPath = path.join(__dirname, 'src', 'assets', 'logotext.png');
const outputPath = path.join(__dirname, 'public', 'og-image.jpg');

async function generateOGImage() {
  try {
    console.log('🎨 Generating Open Graph image...\n');

    // Create a black background with logo
    const background = await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    })
    .png()
    .toBuffer();

    // Resize logo to fit nicely
    const logo = await sharp(logoPath)
      .resize(300, 300, { fit: 'contain' })
      .toBuffer();

    // Composite logo onto background
    await sharp(background)
      .composite([
        {
          input: logo,
          top: 165,
          left: 450
        }
      ])
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log('✅ Generated og-image.jpg (1200x630)');
    console.log('\n🎉 Open Graph image created successfully!');
    console.log('\n📝 This image will be used when sharing your site on:');
    console.log('   - Facebook');
    console.log('   - Twitter');
    console.log('   - LinkedIn');
    console.log('   - WhatsApp');
    console.log('   - Other social platforms');

  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOGImage();
