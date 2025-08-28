# File Converter Web Application

A professional file conversion tool built with React and Node.js that supports multiple file formats including documents, images, spreadsheets, and PDFs.

## Features

- **File Conversion**: Convert between PDF, DOCX, TXT, HTML, JPG, PNG, CSV, XLSX, JSON
- **Image Compression**: Reduce image file sizes with quality control
- **File Merging**: Combine multiple PDFs or images into single documents
- **Drag & Drop Interface**: Easy file upload with modern UI
- **Custom Renaming**: Rename files before downloading
- **File Size Preview**: See before/after file sizes
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Dropzone
- React Router

### Backend
- Node.js
- Express.js
- Sharp (Image processing)
- PDF-lib (PDF manipulation)
- Mammoth (DOCX conversion)
- XLSX (Spreadsheet processing)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/files-converter-project.git
cd files-converter-project
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

2. Start the frontend development server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

## Supported Conversions

### Images
- JPG ↔ PNG ↔ GIF ↔ WEBP
- Images → PDF
- Image compression with quality control

### Documents
- DOCX → HTML
- DOCX → TXT
- TXT → HTML

### Spreadsheets
- XLSX ↔ CSV
- XLSX → JSON

### PDFs
- Merge multiple PDFs
- Images → PDF
- PDF creation from various formats

## API Endpoints

- `POST /api/upload` - Upload files
- `POST /api/convert` - Convert files
- `POST /api/compress` - Compress images
- `POST /api/merge` - Merge files
- `GET /api/download/:filename` - Download converted files

## Project Structure

```
files-converter-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── backend/
│   ├── converters/
│   ├── uploads/
│   ├── converted/
│   ├── server.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Sharp for image processing
- PDF-lib for PDF manipulation
- React Dropzone for file uploads
- Tailwind CSS for styling