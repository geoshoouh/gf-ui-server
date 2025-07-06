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
    <div className="d-flex justify-content-between align-items-center bg-card border border-secondary rounded p-3 shadow-sm w-100" style={{ margin: "5px", zIndex: 1050 }}>
      <span className="fw-bold me-2 text-light">{subject} Status:</span>
      <div className="d-flex align-items-center">
        <span
          className={`rounded-circle me-2 ${getStatusClass()}`}
          style={{ width: '10px', height: '10px' }}
        ></span>
        <small className="text-light">{getStatusTitle()}</small>
      </div>
    </div>
  );
};

export default StatusIndicator;
