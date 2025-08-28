import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Merge = () => {
  const [files, setFiles] = useState([]);
  const [mergeType, setMergeType] = useState('pdf');
  const [isMerging, setIsMerging] = useState(false);
  const [mergedFile, setMergedFile] = useState(null);
  const [customMergeName, setCustomMergeName] = useState('');

  const onDrop = (acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setMergedFile(null);
  };

  const clearFiles = () => {
    setFiles([]);
    setMergedFile(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    
    setIsMerging(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const uploadResponse = await fetch('https://playwithfiles.onrender.com/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (uploadResult.success) {
        const mergeResponse = await fetch('https://playwithfiles.onrender.com/api/merge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            files: uploadResult.files,
            mergeType
          })
        });
        
        const mergeResult = await mergeResponse.json();
        
        if (mergeResult.success) {
          setMergedFile(mergeResult.mergedFile);
          
          // Save to localStorage for history
          const historyItem = {
            id: Date.now(),
            type: 'merge',
            timestamp: new Date().toISOString(),
            files: files.map(f => f.name),
            mergeType,
            status: 'completed'
          };
          
          const history = JSON.parse(localStorage.getItem('fileHistory') || '[]');
          history.unshift(historyItem);
          localStorage.setItem('fileHistory', JSON.stringify(history.slice(0, 50)));
        } else {
          alert('Merge failed: ' + mergeResult.message);
        }
      } else {
        alert('Upload failed: ' + uploadResult.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsMerging(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">File Merger</h1>
        <p className="text-gray-400">Combine multiple files into a single document</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Upload Files to Merge</h2>
            
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
                  {isDragActive ? 'Drop files here' : 'Drag & drop files to merge'}
                </p>
                <p className="text-gray-400">
                  or <span className="text-neon-blue font-medium cursor-pointer">browse files</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports: PDF files, Images (JPG, PNG), Documents (DOCX, TXT)
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Files to Merge ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="bg-slate-800 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-gray-200 font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-neon-blue text-sm">#{index + 1}</span>
                        <button 
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={clearFiles}
                    className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg border border-slate-600 hover:border-red-400 hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                  <div 
                    {...getRootProps()}
                    className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg border border-slate-600 hover:border-neon-blue hover:text-neon-blue transition-colors cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    Add More Files
                  </div>
                </div>
                
                <button 
                  onClick={handleMerge}
                  disabled={isMerging}
                  className={`btn-primary mt-4 w-full ${isMerging ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isMerging ? 'Merging...' : 'Merge Files'}
                </button>
                
                {mergedFile && (() => {
                  const fileExtension = mergedFile.filename.split('.').pop();
                  const defaultName = mergedFile.filename.replace(/\.[^/.]+$/, '');
                  
                  // Set default name if not already set
                  if (!customMergeName) {
                    setCustomMergeName(defaultName);
                  }
                  
                  return (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-3">Files Merged Successfully!</h4>
                      
                      <div className="mb-3">
                        <span className="text-gray-200 block">{mergedFile.filename}</span>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span>Total Original: {(mergedFile.originalTotalSize / 1024).toFixed(1)} KB</span>
                          <span>→</span>
                          <span>Merged: {(mergedFile.mergedSize / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={customMergeName}
                          onChange={(e) => setCustomMergeName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-700 text-gray-200 rounded border border-slate-600 focus:border-neon-blue focus:outline-none text-sm"
                          placeholder="Enter filename"
                        />
                        <span className="text-gray-400 text-sm">.{fileExtension}</span>
                        <a 
                          href={`https://playwithfiles.onrender.com${mergedFile.downloadUrl}?name=${encodeURIComponent(customMergeName)}.${fileExtension}`}
                          className="btn-primary text-sm"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Merge Type</h3>
            
            <div className="space-y-3">
              {[
                { value: 'pdf', label: 'Merge PDFs', desc: 'Combine multiple PDF files into one' },
                { value: 'images', label: 'Images to PDF', desc: 'Convert images to single PDF' },
                { value: 'docs', label: 'Documents to PDF', desc: 'Merge documents into PDF' }
              ].map((type) => (
                <label key={type.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="mergeType"
                    value={type.value}
                    checked={mergeType === type.value}
                    onChange={(e) => setMergeType(e.target.value)}
                    className="mt-1 text-neon-blue focus:ring-neon-blue"
                  />
                  <div>
                    <span className="text-gray-200 font-medium block">{type.label}</span>
                    <span className="text-sm text-gray-400">{type.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merge;