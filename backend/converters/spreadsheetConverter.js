const XLSX = require('xlsx');
const fs = require('fs');
const csv = require('csv-parser');

class SpreadsheetConverter {
  static async xlsxToCsv(inputPath, outputPath) {
    try {
      const workbook = XLSX.readFile(inputPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      fs.writeFileSync(outputPath, csvData);
      
      return outputPath;
    } catch (error) {
      throw new Error(`XLSX to CSV conversion failed: ${error.message}`);
    }
  }

  static async csvToXlsx(inputPath, outputPath) {
    try {
      const csvData = fs.readFileSync(inputPath, 'utf8');
      const workbook = XLSX.read(csvData, { type: 'string' });
      
      XLSX.writeFile(workbook, outputPath);
      
      return outputPath;
    } catch (error) {
      throw new Error(`CSV to XLSX conversion failed: ${error.message}`);
    }
  }

  static async xlsxToJson(inputPath, outputPath) {
    try {
      const workbook = XLSX.readFile(inputPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
      
      return outputPath;
    } catch (error) {
      throw new Error(`XLSX to JSON conversion failed: ${error.message}`);
    }
  }
}

module.exports = SpreadsheetConverter;