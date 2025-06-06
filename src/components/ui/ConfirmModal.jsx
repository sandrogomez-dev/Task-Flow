import React from 'react';

const ConfirmModal = ({
  show = false,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que quieres continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger', // danger, warning, info, success
  icon = null,
  loading = false
}) => {
  if (!show) return null;

  const getTypeClasses = () => {
    switch (type) {
      case 'danger':
        return {
          headerClass: 'bg-danger text-white',
          buttonClass: 'btn-danger',
          iconClass: 'text-danger',
          defaultIcon: 'fa-trash-alt'
        };
      case 'warning':
        return {
          headerClass: 'bg-warning text-dark',
          buttonClass: 'btn-warning',
          iconClass: 'text-warning',
          defaultIcon: 'fa-exclamation-triangle'
        };
      case 'info':
        return {
          headerClass: 'bg-info text-white',
          buttonClass: 'btn-info',
          iconClass: 'text-info',
          defaultIcon: 'fa-info-circle'
        };
      case 'success':
        return {
          headerClass: 'bg-success text-white',
          buttonClass: 'btn-success',
          iconClass: 'text-success',
          defaultIcon: 'fa-check-circle'
        };
      default:
        return {
          headerClass: 'bg-danger text-white',
          buttonClass: 'btn-danger',
          iconClass: 'text-danger',
          defaultIcon: 'fa-question-circle'
        };
    }
  };

  const typeClasses = getTypeClasses();
  const displayIcon = icon || typeClasses.defaultIcon;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter') {
      onConfirm();
    }
  };

  return (
    <div 
      className="modal show d-block confirm-modal-backdrop" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content confirm-modal">
          <div className={`modal-header ${typeClasses.headerClass}`}>
            <h5 className="modal-title d-flex align-items-center">
              <i className={`fas ${displayIcon} me-2`}></i>
              {title}
            </h5>
          </div>
          
          <div className="modal-body text-center py-4">
            <div className="confirm-icon mb-3">
              <i className={`fas ${displayIcon} ${typeClasses.iconClass} fa-3x`}></i>
            </div>
            <p className="confirm-message mb-0">
              {message}
            </p>
          </div>
          
          <div className="modal-footer justify-content-center gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              <i className="fas fa-times me-2"></i>
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn ${typeClasses.buttonClass}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <i className={`fas ${type === 'danger' ? 'fa-trash-alt' : 'fa-check'} me-2`}></i>
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .confirm-modal-backdrop {
          backdrop-filter: blur(2px);
          animation: fadeIn 0.15s ease-out;
        }
        
        .confirm-modal {
          animation: slideIn 0.2s ease-out;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          border: none;
          border-radius: 15px;
          overflow: hidden;
        }
        
        .modal-header {
          border-bottom: none;
          padding: 1.5rem;
          border-radius: 15px 15px 0 0;
        }
        
        .modal-body {
          padding: 2rem 1.5rem;
        }
        
        .confirm-icon {
          opacity: 0.8;
        }
        
        .confirm-message {
          font-size: 1.1rem;
          color: #6c757d;
          line-height: 1.5;
        }
        
        .modal-footer {
          border-top: none;
          padding: 1.5rem;
          background-color: #f8f9fa;
        }
        
        .modal-footer .btn {
          border-radius: 25px;
          padding: 0.75rem 2rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .modal-footer .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Dark theme support */
        [data-theme="dark"] .modal-content {
          background-color: #2d3748;
          color: #e2e8f0;
        }
        
        [data-theme="dark"] .modal-footer {
          background-color: #1a202c;
        }
        
        [data-theme="dark"] .confirm-message {
          color: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal; 