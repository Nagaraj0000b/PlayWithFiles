import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import StatusMessage from '../components/StatusMessage';
import BackendStatus from '../components/BackendStatus';

const ConvertedFileItem = ({ file }) => {
  const [customName, setCustomName] = useState(file.convertedFilename.replace(/\.[^/.]+$/, ''));
  
  return (
    <div className="bg-slate-800 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-gray-200 font-medium">{file.convertedFilename}</p>
          <p className="text-sm text-neon-blue">Converted to {file.convertedFormat.toUpperCase()}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
            <span>Original: {(file.originalSize / 1024).toFixed(1)} KB</span>
            <span>→</span>
            <span>Converted: {(file.convertedSize / 1024).toFixed(1)} KB</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mt-3">
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-700 text-gray-200 rounded border border-slate-600 focus:border-neon-blue focus:outline-none text-sm"
          placeholder="Enter filename"
        />
        <span className="text-gray-400 text-sm">.{file.convertedFormat}</span>
        <a 
          href={`https://playwithfiles.onrender.com${file.downloadUrl}?name=${encodeURIComponent(customName)}.${file.convertedFormat}`}
          className="px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg hover:bg-neon-blue/20 transition-colors text-sm"
        >
          Download
        </a>
      </div>
    </div>
  );
};

const Convert = () => {
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info');

  const onDrop = (acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setConvertedFiles([]);
  };

  const handleAddMoreFiles = (event) => {
    try {
      const newFiles = Array.from(event.target.files);
      if (newFiles.length === 0) return;
      
      setFiles(prev => [...prev, ...newFiles]);
      setConvertedFiles([]);
      event.target.value = '';
    } catch (error) {
      console.error('Error adding files:', error);
      alert('Error adding files. Please try again.');
    }
  };

  const clearAllFiles = () => {
    try {
      setFiles([]);
      setConvertedFiles([]);
    } catch (error) {
      console.error('Error clearing files:', error);
    }
  };

  const removeFile = (index) => {
    try {
      setFiles(prev => prev.filter((_, i) => i !== index));
      setConvertedFiles([]);
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please select files to convert');
      return;
    }
    
    setIsConverting(true);
    
    try {
      // Check if backend is available first
      const healthCheck = await fetch('https://playwithfiles.onrender.com/health', {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      }).catch(() => null);
      
      if (!healthCheck || !healthCheck.ok) {
        throw new Error('Backend is starting up. Please wait a moment and try again.');
      }
      
      // Upload files
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const uploadResponse = await fetch('https://playwithfiles.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(60000) // 60 second timeout for large files
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Upload failed');
      }
      
      // Convert files
      const convertResponse = await fetch('https://playwithfiles.onrender.com/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: uploadResult.files,
          outputFormat
        })
      });
      
      if (!convertResponse.ok) {
        throw new Error(`Conversion failed with status: ${convertResponse.status}`);
      }
      
      const convertResult = await convertResponse.json();
      
      if (!convertResult.success) {
        throw new Error(convertResult.message || 'Conversion failed');
      }
      
      setConvertedFiles(convertResult.convertedFiles);
      
      // Save to localStorage for history
      const historyItem = {
        id: Date.now(),
        type: 'conversion',
        timestamp: new Date().toISOString(),
        files: files.map(f => f.name),
        outputFormat,
        status: 'completed'
      };
      
      const history = JSON.parse(localStorage.getItem('fileHistory') || '[]');
      history.unshift(historyItem);
      localStorage.setItem('fileHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50 items
      
    } catch (error) {
      console.error('Conversion error:', error);
      

      
      let errorMessage = 'An error occurred during conversion.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. The backend might be starting up. Please try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. The backend service might be sleeping. Please try again in a moment.';
      } else {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">File Converter</h1>
        <p className="text-gray-400">Upload your files and convert them to your desired format</p>
      </div>
      
      <BackendStatus />
      <StatusMessage message={statusMessage} type={statusType} />

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 sm:p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragActive 
              ? 'border-neon-blue bg-neon-blue/5' 
              : 'border-slate-600 hover:border-neon-blue hover:bg-slate-800/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <p className={`text-lg font-semibold mb-2 ${isDragActive ? 'text-neon-blue' : 'text-gray-200'}`}>
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-gray-400">
              or <span className="text-neon-blue font-medium cursor-pointer">browse files</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports: PDF, DOCX, TXT, HTML, CSV, XLSX, JPG, PNG, GIF
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <label className="px-3 py-2 bg-slate-800 text-gray-300 text-sm rounded-lg border border-slate-600 hover:border-neon-blue hover:text-neon-blue transition-colors cursor-pointer">
              <input 
                type="file" 
                multiple 
                onChange={handleAddMoreFiles}
                className="hidden"
                accept=".pdf,.docx,.txt,.html,.csv,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
              />
              Add More Files
            </label>
            <button 
              onClick={clearAllFiles}
              className="px-3 py-2 bg-slate-800 text-gray-300 text-sm rounded-lg border border-slate-600 hover:border-red-400 hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="bg-slate-800 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleConvert}
              disabled={isConverting}
              className={`btn-primary mt-4 w-full ${isConverting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isConverting ? 'Converting...' : 'Convert Files'}
            </button>
            
            {convertedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Converted Files
                </h3>
                <div className="space-y-2">
                  {convertedFiles.map((file, index) => (
                    <ConvertedFileItem key={index} file={file} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Output Format Selection */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Output Format</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {['pdf', 'docx', 'txt', 'html', 'png', 'jpg', 'csv', 'xlsx', 'json'].map((format) => (
              <label key={format} className="flex items-center space-x-2 cursor-pointer p-3 bg-slate-800 rounded-lg border border-slate-600 hover:border-neon-blue transition-colors">
                <input
                  type="radio"
                  name="outputFormat"
                  value={format}
                  checked={outputFormat === format}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="text-neon-blue focus:ring-neon-blue"
                />
                <span className="text-gray-200 font-medium">{format.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convert;