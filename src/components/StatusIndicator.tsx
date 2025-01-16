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
          const response = await fetch(endpoint + '/ping');
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
    <div className="d-flex align-items-center">
      <span className="fw-bold me-2">{subject} Status:</span>
      <span
        className={`rounded-circle ${getStatusClass()}`}
        style={{ width: '12px', height: '12px' }}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={getStatusTitle()}
      ></span>
    </div>
  );
};

export default StatusIndicator;
