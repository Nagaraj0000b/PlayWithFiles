import React, { useState, useEffect, useRef } from 'react';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking');
  const [countdown, setCountdown] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const intervalRef = useRef(null);
  const maxRetries = 3;

  useEffect(() => {
    checkBackendStatus();
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const checkBackendStatus = async () => {
    if (retryCount >= maxRetries) {
      setStatus('offline');
      return;
    }

    try {
      const response = await fetch('https://playwithfiles.onrender.com/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setStatus('online');
        setRetryCount(0);
      } else {
        setStatus('starting');
        setRetryCount(prev => prev + 1);
        startCountdown();
      }
    } catch (error) {
      setStatus('starting');
      setRetryCount(prev => prev + 1);
      startCountdown();
    }
  };

  const startCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    let timeLeft = 60;
    setCountdown(timeLeft);
    
    intervalRef.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        checkBackendStatus();
      }
    }, 1000);
  };

  if (status === 'online') return null;

  if (status === 'offline') {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-red-400 text-sm">
            Backend is currently unavailable. Please try again later.
          </p>
          <button 
            onClick={() => {
              setRetryCount(0);
              setStatus('checking');
              checkBackendStatus();
            }}
            className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
        <p className="text-yellow-400 text-sm">
          {status === 'checking' 
            ? 'Checking backend status...' 
            : `Backend is starting up... Ready in ${countdown} seconds (Attempt ${retryCount}/${maxRetries})`
          }
        </p>
      </div>
    </div>
  );
};

export default BackendStatus;