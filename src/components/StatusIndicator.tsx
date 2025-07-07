import React, { useEffect, useState } from 'react';

interface StatusIndicatorProps {
  subject: string
  endpoint?: string;
  interval?: number; // in milliseconds, default is 5000
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ subject = '', endpoint, interval = 5000 }) => {
  const [status, setStatus] = useState<'ok' | 'error' | 'loading'>('loading');

  useEffect(() => {
    const checkStatus = async () => {
      if (!endpoint) {
        setStatus('error');
      } else {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            setStatus('ok');
          } else {
            setStatus('error');
          }
        } catch (error) {
          console.log(error)
          setStatus('error');
        }
      }
    };

    checkStatus(); // Check immediately on mount
    const intervalId = setInterval(checkStatus, interval);

    return () => clearInterval(intervalId);
  }, [endpoint, interval]);

  const getStatusClass = () => {
    switch (status) {
      case 'ok':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'loading':
      default:
        return 'bg-warning';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'ok':
        return 'Online';
      case 'error':
        return 'Offline';
      case 'loading':
      default:
        return 'Loading...';
    }
  };

  return (
    <div 
      className="d-flex justify-content-between align-items-center bg-dark border border-secondary rounded p-2 shadow-sm" 
      style={{ 
        margin: "2px", 
        zIndex: 1050,
        minWidth: "120px",
        maxWidth: "200px",
        opacity: 0.9,
        backdropFilter: "blur(5px)"
      }}
    >
      <span className="fw-bold me-2 text-light small">{subject}:</span>
      <div className="d-flex align-items-center">
        <span
          className={`rounded-circle me-1 ${getStatusClass()}`}
          style={{ width: '8px', height: '8px' }}
        ></span>
        <small className="text-light">{getStatusTitle()}</small>
      </div>
    </div>
  );
};

export default StatusIndicator;
