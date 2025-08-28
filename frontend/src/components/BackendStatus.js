import React, { useState, useEffect } from 'react';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('https://playwithfiles.onrender.com/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('starting');
        startCountdown();
      }
    } catch (error) {
      setStatus('starting');
      startCountdown();
    }
  };

  const startCountdown = () => {
    let timeLeft = 60;
    setCountdown(timeLeft);
    
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        checkBackendStatus();
      }
    }, 1000);
  };

  if (status === 'online') return null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
        <p className="text-yellow-400 text-sm">
          {status === 'checking' 
            ? 'Checking backend status...' 
            : `Backend is starting up... Ready in ${countdown} seconds`
          }
        </p>
      </div>
    </div>
  );
};

export default BackendStatus;