const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ImageConverter = require('./converters/imageConverter');
const DocumentConverter = require('./converters/documentConverter');
const PDFConverter = require('./converters/pdfConverter');
const SpreadsheetConverter = require('./converters/spreadsheetConverter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Files Converter API is running!' });
});

// File upload endpoint
app.post('/api/upload', upload.array('files'), (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path
    }));
    
    res.json({
      success: true,
      message: 'Files uploaded successfully',
      files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

// Convert files endpoint
app.post('/api/convert', async (req, res) => {
  try {
    const { files, outputFormat } = req.body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided for conversion'
      });
    }
    
    if (!outputFormat) {
      return res.status(400).json({
        success: false,
        message: 'Output format not specified'
      });
    }
    
    const convertedFiles = [];
    
    for (const file of files) {
      try {
        const inputPath = file.path;
        const outputFilename = `converted-${Date.now()}-${path.parse(file.originalname).name}.${outputFormat}`;
        const outputPath = path.join('converted', outputFilename);
        
        if (!fs.existsSync(inputPath)) {
          throw new Error(`Input file not found: ${file.originalname}`);
        }
        
        const fileExtension = path.extname(file.originalname).toLowerCase();
        let converted = false;
        
        // Image conversion
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
          if (outputFormat === 'pdf') {
            await PDFConverter.imageToPdf(inputPath, outputPath);
          } else {
            await ImageConverter.convertImage(inputPath, outputFormat, outputPath);
          }
          converted = true;
        }
        // Document conversion
        else if (['.docx'].includes(fileExtension)) {
          if (outputFormat === 'html') {
            await DocumentConverter.docxToHtml(inputPath, outputPath);
          } else if (outputFormat === 'txt') {
            await DocumentConverter.docxToText(inputPath, outputPath);
          }
          converted = true;
        }
        // Text conversion
        else if (['.txt'].includes(fileExtension)) {
          if (outputFormat === 'html') {
            await DocumentConverter.textToHtml(inputPath, outputPath);
          }
          converted = true;
        }
        // Spreadsheet conversion
        else if (['.xlsx', '.xls'].includes(fileExtension)) {
          if (outputFormat === 'csv') {
            await SpreadsheetConverter.xlsxToCsv(inputPath, outputPath);
          } else if (outputFormat === 'json') {
            await SpreadsheetConverter.xlsxToJson(inputPath, outputPath);
          }
          converted = true;
        }
        // CSV conversion
        else if (['.csv'].includes(fileExtension)) {
          if (outputFormat === 'xlsx') {
            await SpreadsheetConverter.csvToXlsx(inputPath, outputPath);
          }
          converted = true;
        }
        
        if (!converted) {
          throw new Error(`Unsupported conversion: ${fileExtension} to ${outputFormat}`);
        }
        
        if (!fs.existsSync(outputPath)) {
          throw new Error(`Conversion failed - output file not created`);
        }
        
        const originalSize = file.size;
        const convertedSize = fs.statSync(outputPath).size;
        
        convertedFiles.push({
          ...file,
          convertedFormat: outputFormat,
          convertedFilename: outputFilename,
          downloadUrl: `/api/download/${outputFilename}`,
          originalSize,
          convertedSize
        });
        
      } catch (fileError) {
        console.error(`Error converting ${file.originalname}:`, fileError);
        // Continue with other files, but log the error
      }
    }
    
    if (convertedFiles.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'No files could be converted'
      });
    }
    
    res.json({
      success: true,
      message: `${convertedFiles.length} files converted successfully`,
      convertedFiles
    });
    
  } catch (error) {
    console.error('Conversion endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during conversion',
      error: error.message
    });
  }
});

// Merge files endpoint
app.post('/api/merge', async (req, res) => {
  try {
    const { files, mergeType } = req.body;
    const timestamp = Date.now();
    const mergedFilename = `merged-${timestamp}.pdf`;
    const outputPath = path.join('converted', mergedFilename);
    
    if (mergeType === 'images') {
      // Merge images into PDF
      const imagePaths = files.map(file => file.path);
      await PDFConverter.multipleImagesToPdf(imagePaths, outputPath);
    } else if (mergeType === 'pdf') {
      // Merge PDF files
      const pdfPaths = files.map(file => file.path);
      await PDFConverter.mergePdfs(pdfPaths, outputPath);
    } else if (mergeType === 'docs') {
      // For now, just merge text content
      let mergedContent = '';
      for (const file of files) {
        if (path.extname(file.originalname).toLowerCase() === '.txt') {
          const content = fs.readFileSync(file.path, 'utf8');
          mergedContent += content + '\n\n---\n\n';
        }
      }
      
      // Convert merged text to HTML then to PDF would be complex
      // For now, save as text file
      const textFilename = `merged-${timestamp}.txt`;
      const textOutputPath = path.join('converted', textFilename);
      fs.writeFileSync(textOutputPath, mergedContent);
      
      res.json({
        success: true,
        message: 'Files merged successfully',
        mergedFile: {
          filename: textFilename,
          downloadUrl: `/api/download/${textFilename}`
        }
      });
      return;
      return;
    }
    
    // Get merged file size
    const mergedSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
    const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    res.json({
      success: true,
      message: 'Files merged successfully',
      mergedFile: {
        filename: mergedFilename,
        downloadUrl: `/api/download/${mergedFilename}`,
        originalTotalSize: totalOriginalSize,
        mergedSize
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Merge failed',
      error: error.message
    });
  }
});

// Compress files endpoint
app.post('/api/compress', async (req, res) => {
  try {
    const { files, quality } = req.body;
    const compressedFiles = [];
    
    for (const file of files) {
      const inputPath = file.path;
      const outputFilename = `compressed-${Date.now()}-${path.parse(file.originalname).name}.jpg`;
      const outputPath = path.join('converted', outputFilename);
      
      // Compress image using Sharp
      await ImageConverter.compressImage(inputPath, outputPath, parseInt(quality));
      
      // Get file sizes
      const originalSize = file.size;
      const compressedSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : 0;
      const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : 0;
      
      compressedFiles.push({
        ...file,
        compressedFilename: outputFilename,
        downloadUrl: `/api/download/${outputFilename}`,
        originalSize,
        compressedSize,
        compressionRatio
      });
    }
    
    res.json({
      success: true,
      message: 'Images compressed successfully',
      compressedFiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Compression failed',
      error: error.message
    });
  }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const customName = req.query.name || filename;
  const filePath = path.join(__dirname, 'converted', filename);
  
  console.log('Download request for:', filename);
  console.log('Custom name:', customName);
  console.log('Looking for file at:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, customName);
  } else {
    res.status(404).json({ 
      error: 'File not found',
      filename: filename,
      path: filePath
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Image and Document converters loaded');
});