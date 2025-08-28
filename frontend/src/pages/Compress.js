import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const CompressedFileItem = ({ file }) => {
  const [customName, setCustomName] = useState(file.compressedFilename.replace(/\.[^/.]+$/, ''));
  
  return (
    <div className="bg-slate-800 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-gray-200 font-medium">{file.compressedFilename}</p>
          <p className="text-sm text-neon-green">Size reduced by {file.compressionRatio}%</p>
          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
            <span>Original: {(file.originalSize / 1024).toFixed(1)} KB</span>
            <span>→</span>
            <span>Compressed: {(file.compressedSize / 1024).toFixed(1)} KB</span>
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
        <span className="text-gray-400 text-sm">.jpg</span>
        <a 
          href={`http://localhost:5000${file.downloadUrl}?name=${encodeURIComponent(customName)}.jpg`}
          className="px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg hover:bg-neon-blue/20 transition-colors text-sm"
        >
          Download
        </a>
      </div>
    </div>
  );
};

const Compress = () => {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFiles, setCompressedFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setCompressedFiles([]);
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    setIsCompressing(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const uploadResponse = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (uploadResult.success) {
        const compressResponse = await fetch('http://localhost:5000/api/compress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            files: uploadResult.files,
            quality: quality
          })
        });
        
        const compressResult = await compressResponse.json();
        
        if (compressResult.success) {
          setCompressedFiles(compressResult.compressedFiles);
        } else {
          alert('Compression failed: ' + compressResult.message);
        }
      } else {
        alert('Upload failed: ' + uploadResult.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsCompressing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Image Compressor</h1>
        <p className="text-gray-400">Reduce image file sizes while maintaining quality</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
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
              {isDragActive ? 'Drop images here' : 'Drag & drop images to compress'}
            </p>
            <p className="text-gray-400">
              or <span className="text-neon-blue font-medium cursor-pointer">browse images</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports: JPG, PNG, GIF, WEBP
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Compression Quality</h3>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Low</span>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-gray-400">High</span>
            <span className="text-neon-blue font-semibold w-12">{quality}%</span>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Selected Images ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="bg-slate-800 p-3 rounded-lg">
                  <p className="text-gray-200 font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleCompress}
              disabled={isCompressing}
              className={`btn-primary mt-4 w-full ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCompressing ? 'Compressing...' : 'Compress Images'}
            </button>
            
            {compressedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Compressed Images
                </h3>
                <div className="space-y-2">
                  {compressedFiles.map((file, index) => (
                    <CompressedFileItem key={index} file={file} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Compress;