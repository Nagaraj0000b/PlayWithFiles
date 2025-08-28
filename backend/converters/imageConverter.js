const sharp = require('sharp');
const path = require('path');

class ImageConverter {
  static async convertImage(inputPath, outputFormat, outputPath) {
    try {
      const image = sharp(inputPath);
      
      switch (outputFormat.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
          await image.jpeg({ quality: 90 }).toFile(outputPath);
          break;
        case 'png':
          await image.png().toFile(outputPath);
          break;
        case 'webp':
          await image.webp({ quality: 90 }).toFile(outputPath);
          break;
        default:
          throw new Error(`Unsupported format: ${outputFormat}`);
      }
      
      return outputPath;
    } catch (error) {
      throw new Error(`Image conversion failed: ${error.message}`);
    }
  }

  static async compressImage(inputPath, outputPath, quality = 80) {
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Compress based on original format or convert to JPEG for better compression
      if (metadata.format === 'png' && quality < 90) {
        // Convert PNG to JPEG for better compression at lower qualities
        await image.jpeg({ quality }).toFile(outputPath);
      } else if (metadata.format === 'jpeg') {
        await image.jpeg({ quality }).toFile(outputPath);
      } else {
        // For other formats, convert to JPEG
        await image.jpeg({ quality }).toFile(outputPath);
      }
      
      return outputPath;
    } catch (error) {
      throw new Error(`Image compression failed: ${error.message}`);
    }
  }
}

module.exports = ImageConverter;