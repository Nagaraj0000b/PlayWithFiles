import React, { useState, useEffect } from 'react';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('fileHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('fileHistory');
    setHistory([]);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'conversion': return 'text-blue-400';
      case 'compression': return 'text-green-400';
      case 'merge': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Your History</h1>
        <p className="text-gray-400">Your personal file processing history (stored locally)</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No history yet</p>
            <p className="text-gray-500 mt-2">Start converting, compressing, or merging files to see your history here</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-100">Recent Activities ({history.length})</h2>
              <button 
                onClick={clearHistory}
                className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
              >
                Clear History
              </button>
            </div>
            
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold capitalize ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                        {item.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm break-all">
                      Files: {item.files.join(', ')}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                      <span>{formatDate(item.timestamp)}</span>
                      {item.outputFormat && <span>→ {item.outputFormat.toUpperCase()}</span>}
                      {item.quality && <span>Quality: {item.quality}</span>}
                      {item.mergeType && <span>Type: {item.mergeType}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;