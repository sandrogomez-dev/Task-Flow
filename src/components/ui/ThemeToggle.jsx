import React from 'react';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <button
      className={`btn btn-outline-secondary theme-toggle ${sizeClasses[size]} ${className}`}
      onClick={toggleTheme}
      title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'} (Ctrl+D)`}
      type="button"
    >
      <div className="theme-toggle-content">
        <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} theme-icon`}></i>
        <span className="theme-text d-none d-md-inline ms-2">
          {isDark ? 'Claro' : 'Oscuro'}
        </span>
      </div>
      
      <style jsx>{`
        .theme-toggle {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border-radius: 25px;
        }
        
        .theme-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .theme-toggle-content {
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        
        .theme-icon {
          transition: all 0.4s ease;
          font-size: 1.1em;
        }
        
        .theme-toggle:hover .theme-icon {
          transform: ${isDark ? 'rotate(180deg)' : 'rotate(-30deg)'};
        }
        
        .theme-text {
          font-weight: 500;
          font-size: 0.9em;
        }
        
        /* Efecto de ondas en el click */
        .theme-toggle::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: ${isDark ? 'rgba(255,193,7,0.3)' : 'rgba(108,117,125,0.3)'};
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
          z-index: 1;
        }
        
        .theme-toggle:active::after {
          width: 100px;
          height: 100px;
        }
        
        /* Estilos para tema oscuro */
        [data-theme="dark"] .theme-toggle {
          border-color: #6c757d;
          color: #ffc107;
        }
        
        [data-theme="dark"] .theme-toggle:hover {
          background-color: rgba(255,193,7,0.1);
          border-color: #ffc107;
        }
        
        /* Estilos para tema claro */
        [data-theme="light"] .theme-toggle {
          border-color: #6c757d;
          color: #495057;
        }
        
        [data-theme="light"] .theme-toggle:hover {
          background-color: rgba(108,117,125,0.1);
          border-color: #495057;
        }
      `}</style>
    </button>
  );
};

export default ThemeToggle; 