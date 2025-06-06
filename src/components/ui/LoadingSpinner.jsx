import React from 'react';

const LoadingSpinner = ({ 
  variant = 'default', 
  size = 'md', 
  text = '', 
  color = 'primary',
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md', 
    lg: 'loading-lg',
    xl: 'loading-xl'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-info'
  };

  const LoadingContent = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className="loading-pulse">
            <div className="pulse-circle"></div>
          </div>
        );
      
      case 'bars':
        return (
          <div className="loading-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        );
      
      case 'spinner':
      default:
        return (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        );
    }
  };

  const content = (
    <div className={`loading-container ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <LoadingContent />
      {text && (
        <div className="loading-text">
          {text}
        </div>
      )}
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        
        .loading-text {
          font-weight: 500;
          font-size: 0.9em;
          opacity: 0.8;
          animation: fadeInOut 2s ease-in-out infinite;
        }
        
        /* Spinner clásico */
        .loading-spinner .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0,0,0,0.1);
          border-left-color: currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        /* Dots animados */
        .loading-dots {
          display: flex;
          gap: 0.5rem;
        }
        
        .loading-dots .dot {
          width: 12px;
          height: 12px;
          background-color: currentColor;
          border-radius: 50%;
          animation: dotBounce 1.4s ease-in-out infinite both;
        }
        
        .loading-dots .dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots .dot:nth-child(2) { animation-delay: -0.16s; }
        .loading-dots .dot:nth-child(3) { animation-delay: 0s; }
        
        /* Pulse animado */
        .loading-pulse .pulse-circle {
          width: 40px;
          height: 40px;
          background-color: currentColor;
          border-radius: 50%;
          animation: pulseScale 1.5s ease-in-out infinite;
        }
        
        /* Bars animados */
        .loading-bars {
          display: flex;
          gap: 0.3rem;
          align-items: end;
        }
        
        .loading-bars .bar {
          width: 4px;
          height: 30px;
          background-color: currentColor;
          border-radius: 2px;
          animation: barStretch 1.2s ease-in-out infinite;
        }
        
        .loading-bars .bar:nth-child(1) { animation-delay: -0.45s; }
        .loading-bars .bar:nth-child(2) { animation-delay: -0.3s; }
        .loading-bars .bar:nth-child(3) { animation-delay: -0.15s; }
        .loading-bars .bar:nth-child(4) { animation-delay: 0s; }
        
        /* Tamaños */
        .loading-sm .spinner { width: 20px; height: 20px; border-width: 2px; }
        .loading-sm .pulse-circle { width: 20px; height: 20px; }
        .loading-sm .dot { width: 6px; height: 6px; }
        .loading-sm .bar { width: 2px; height: 15px; }
        .loading-sm .loading-text { font-size: 0.75em; }
        
        .loading-lg .spinner { width: 60px; height: 60px; border-width: 4px; }
        .loading-lg .pulse-circle { width: 60px; height: 60px; }
        .loading-lg .dot { width: 16px; height: 16px; }
        .loading-lg .bar { width: 6px; height: 45px; }
        .loading-lg .loading-text { font-size: 1.1em; }
        
        .loading-xl .spinner { width: 80px; height: 80px; border-width: 5px; }
        .loading-xl .pulse-circle { width: 80px; height: 80px; }
        .loading-xl .dot { width: 20px; height: 20px; }
        .loading-xl .bar { width: 8px; height: 60px; }
        .loading-xl .loading-text { font-size: 1.3em; }
        
        /* Animaciones */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          } 40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes pulseScale {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        
        @keyframes barStretch {
          0%, 40%, 100% {
            transform: scaleY(0.4);
          } 20% {
            transform: scaleY(1);
          }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {content}
        <style jsx>{`
          .loading-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(4px);
            z-index: 9999;
          }
          
          [data-theme="dark"] .loading-fullscreen {
            background: rgba(33, 37, 41, 0.9);
          }
        `}</style>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner; 