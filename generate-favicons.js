/**
 * Favicon Generation Script for PARIBITO
 * 
 * This script helps generate favicons from the logo.jpg file.
 * 
 * INSTRUCTIONS:
 * 1. Install sharp: npm install sharp
 * 2. Run: node generate-favicons.js
 * 
 * This will create all necessary favicon sizes from src/assets/logo.jpg
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, 'src', 'assets', 'logo.jpg');
const publicDir = path.join(__dirname, 'public');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

async function generateFavicons() {
  try {
    console.log('🎨 Generating favicons from logo.jpg...\n');

    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
      console.error('❌ Error: logo.jpg not found at', logoPath);
      process.exit(1);
    }

    // Generate each size
    for (const { name, size } of sizes) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (32x32)
    const icoPath = path.join(publicDir, 'favicon.ico');
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(icoPath);
    
    console.log(`✅ Generated favicon.ico (32x32)`);

    console.log('\n🎉 All favicons generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Check the /public folder for all generated favicons');
    console.log('2. Test your site to ensure favicons load correctly');
    console.log('3. You can delete this script after generation');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
