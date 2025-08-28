const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

class DocumentConverter {
  static async docxToHtml(inputPath, outputPath) {
    try {
      const result = await mammoth.convertToHtml({ path: inputPath });
      fs.writeFileSync(outputPath, result.value);
      return outputPath;
    } catch (error) {
      throw new Error(`DOCX to HTML conversion failed: ${error.message}`);
    }
  }

  static async docxToText(inputPath, outputPath) {
    try {
      const result = await mammoth.extractRawText({ path: inputPath });
      fs.writeFileSync(outputPath, result.value);
      return outputPath;
    } catch (error) {
      throw new Error(`DOCX to Text conversion failed: ${error.message}`);
    }
  }

  static async textToHtml(inputPath, outputPath) {
    try {
      const text = fs.readFileSync(inputPath, 'utf8');
      const html = `<!DOCTYPE html>
<html>
<head>
    <title>Converted Document</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        pre { white-space: pre-wrap; }
    </style>
</head>
<body>
    <pre>${text}</pre>
</body>
</html>`;
      fs.writeFileSync(outputPath, html);
      return outputPath;
    } catch (error) {
      throw new Error(`Text to HTML conversion failed: ${error.message}`);
    }
  }
}

module.exports = DocumentConverter;