import React from 'react';
import { useApp } from '../../contexts/AppContext';

const NotificationContainer = () => {
  const { state, dispatch, actionTypes } = useApp();
  const { notifications } = state;

  const removeNotification = (id) => {
    dispatch({
      type: actionTypes.REMOVE_NOTIFICATION,
      payload: id
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
      default:
        return 'fas fa-info-circle';
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'success':
        return 'notification success';
      case 'error':
        return 'notification error';
      case 'warning':
        return 'notification warning';
      case 'info':
      default:
        return 'notification bg-primary text-white';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container position-fixed" style={{ 
      top: '20px', 
      right: '20px', 
      zIndex: 1050,
      maxWidth: '400px'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationClass(notification.type)} mb-3 shadow-lg`}
          style={{
            borderRadius: 'var(--border-radius)',
            padding: '1rem 1.5rem',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <div className="d-flex align-items-start">
            <div className="notification-icon me-3 mt-1">
              <i className={getNotificationIcon(notification.type)}></i>
            </div>
            
            <div className="notification-content flex-grow-1">
              <div className="notification-message">
                {notification.message}
              </div>
              {notification.description && (
                <div className="notification-description small mt-1 opacity-75">
                  {notification.description}
                </div>
              )}
            </div>
            
            <button
              className="btn-close btn-close-white ms-3"
              onClick={() => removeNotification(notification.id)}
              aria-label="Cerrar notificación"
              style={{ 
                fontSize: '0.75rem',
                filter: notification.type === 'warning' ? 'invert(1)' : 'none'
              }}
            ></button>
          </div>
          
          {/* Barra de progreso para auto-remove */}
          {notification.autoRemove !== false && (
            <div 
              className="notification-progress"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                animation: 'progressBar 5s linear forwards'
              }}
            ></div>
          )}
        </div>
      ))}
      
      {/* Estilos adicionales para las animaciones */}
      <style jsx>{`
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .notification {
          position: relative;
          overflow: hidden;
        }
        
        .notification:hover .notification-progress {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NotificationContainer; 