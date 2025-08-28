import React, { useState } from 'react';

const History = () => {
  // Mock history data
  const [historyItems] = useState([
    {
      id: 1,
      fileName: 'business-report.pdf',
      originalFormat: 'docx',
      convertedFormat: 'pdf',
      date: '2024-01-15',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: 2,
      fileName: 'financial-data.xlsx',
      originalFormat: 'csv',
      convertedFormat: 'xlsx',
      date: '2024-01-14',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: 3,
      fileName: 'product-images.pdf',
      originalFormat: 'jpg',
      convertedFormat: 'pdf',
      date: '2024-01-14',
      status: 'completed',
      size: '5.2 MB'
    },
    {
      id: 4,
      fileName: 'presentation.docx',
      originalFormat: 'html',
      convertedFormat: 'docx',
      date: '2024-01-13',
      status: 'completed',
      size: '3.1 MB'
    }
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Conversion History</h1>
        <p className="text-gray-400">Track and manage your file conversion history</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Recent Conversions</h2>
          <span className="text-sm text-gray-400">{historyItems.length} total conversions</span>
        </div>

        <div className="space-y-4">
          {historyItems.map((item) => (
            <div key={item.id} className="bg-slate-800 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-200 mb-1">{item.fileName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <span className="uppercase font-medium text-neon-blue">
                        {item.originalFormat}
                      </span>
                      <span className="mx-2">→</span>
                      <span className="uppercase font-medium text-neon-cyan">
                        {item.convertedFormat}
                      </span>
                    </span>
                    <span>•</span>
                    <span>{item.size}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full border border-green-500/30">
                    Completed
                  </span>
                  
                  <button className="px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg hover:bg-neon-blue/20 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {historyItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No conversion history found</p>
            <p className="text-gray-500 mt-2">Start converting files to see your history here</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold text-neon-blue mb-2">{historyItems.length}</h3>
          <p className="text-gray-400">Total Conversions</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold text-neon-cyan mb-2">
            {historyItems.filter(item => item.originalFormat === 'docx' || item.originalFormat === 'html').length}
          </h3>
          <p className="text-gray-400">Documents Converted</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-2">
            {historyItems.filter(item => item.status === 'completed').length}
          </h3>
          <p className="text-gray-400">Successful Conversions</p>
        </div>
      </div>
    </div>
  );
};

export default History;