import React from 'react';

const StatusMessage = ({ message, type = 'info' }) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
  };

  if (!message) return null;

  return (
    <div className={`p-4 rounded-lg border ${getStyles()} mb-4`}>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default StatusMessage;