const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const sharp = require('sharp');

class PDFConverter {
  static async imageToPdf(imagePath, outputPath) {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Read and process the image
      const imageBuffer = await sharp(imagePath)
        .jpeg({ quality: 90 })
        .toBuffer();
      
      // Embed the image in the PDF
      const image = await pdfDoc.embedJpg(imageBuffer);
      const imageDims = image.scale(1);
      
      // Add a page with the image
      const page = pdfDoc.addPage([imageDims.width, imageDims.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: imageDims.width,
        height: imageDims.height,
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, pdfBytes);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Image to PDF conversion failed: ${error.message}`);
    }
  }

  static async mergePdfs(pdfPaths, outputPath) {
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfPath of pdfPaths) {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      fs.writeFileSync(outputPath, pdfBytes);
      
      return outputPath;
    } catch (error) {
      throw new Error(`PDF merge failed: ${error.message}`);
    }
  }

  static async multipleImagesToPdf(imagePaths, outputPath) {
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imagePath of imagePaths) {
        // Process each image
        const imageBuffer = await sharp(imagePath)
          .jpeg({ quality: 90 })
          .toBuffer();
        
        const image = await pdfDoc.embedJpg(imageBuffer);
        const imageDims = image.scale(0.8); // Scale down a bit
        
        // Add a new page for each image
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
        
        // Center the image on the page
        const x = (595.28 - imageDims.width) / 2;
        const y = (841.89 - imageDims.height) / 2;
        
        page.drawImage(image, {
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: Math.min(imageDims.width, 595.28),
          height: Math.min(imageDims.height, 841.89),
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, pdfBytes);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Multiple images to PDF conversion failed: ${error.message}`);
    }
  }
}

module.exports = PDFConverter;