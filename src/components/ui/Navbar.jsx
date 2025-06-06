import React, { useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import TaskCreateModal from './TaskCreateModal';
import ThemeToggle from './ThemeToggle';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import useTheme from '../../hooks/useTheme';

const Navbar = () => {
  const { state } = useApp();
  const { currentProject, notifications } = state;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const searchInputRef = useRef(null);
  const { toggleTheme } = useTheme();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  function handleNewTask(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Botón Nueva Tarea clickeado');
    console.log('Proyecto actual:', currentProject);
    
    if (!currentProject) {
      alert('Selecciona un proyecto primero para crear una tarea');
      return;
    }
    
    console.log('Abriendo modal de tarea');
    setShowTaskModal(true);
  }

  // Configurar atajos de teclado
  useKeyboardShortcuts({
    onNewTask: handleNewTask,
    onToggleTheme: toggleTheme,
    onSearchFocus: () => searchInputRef.current?.focus(),
    isModalOpen: showTaskModal
  });

  const handleCloseTaskModal = () => {
    console.log('Cerrando modal de tarea');
    setShowTaskModal(false);
  };

  return (
    <>
      <nav className="modern-navbar">
        <div className="navbar-content">
          {/* Breadcrumb / Título de página */}
          <div className="navbar-brand">
            <div className="breadcrumb-container">
              <span className="breadcrumb-item">
                <i className="fas fa-home"></i>
                TaskFlow
              </span>
              {currentProject && (
                <>
                  <i className="fas fa-chevron-right breadcrumb-separator"></i>
                  <span className="breadcrumb-item current">
                    {currentProject.name}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="search-container">
            <div className="search-box glass-subtle">
              <i className="fas fa-search search-icon"></i>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Buscar tareas, proyectos..."
                title="Presiona Ctrl+K para enfocar"
              />
              <kbd className="search-kbd">⌘K</kbd>
            </div>
          </div>

          {/* Acciones de la navbar */}
          <div className="navbar-actions">
            {/* Toggle de tema */}
            <ThemeToggle size="sm" />

            {/* Botón de nueva tarea */}
            <button 
              type="button"
              className={`btn-modern ${currentProject ? 'btn-primary' : 'btn-glass'}`}
              onClick={handleNewTask}
              disabled={!currentProject}
              title={!currentProject ? 'Selecciona un proyecto primero' : 'Crear nueva tarea (Ctrl+N)'}
            >
              <i className="fas fa-plus"></i>
              <span className="button-text">Nueva Tarea</span>
            </button>

            {/* Notificaciones */}
            <div className="action-item">
              <button
                className="action-btn glass-subtle"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-expanded={showNotifications}
              >
                <i className="fas fa-bell"></i>
                {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </button>

              {showNotifications && (
                <div className="dropdown-menu notifications-dropdown glass">
                  <div className="dropdown-header">
                    <span>Notificaciones</span>
                    {unreadNotifications > 0 && (
                      <button className="btn-link">
                        Marcar como leídas
                      </button>
                    )}
                  </div>
                  
                  {notifications.length > 0 ? (
                    <div className="notification-list">
                      {notifications.slice(0, 5).map((notification) => (
                        <div key={notification.id} className="notification-item">
                          <div className={`notification-icon ${notification.type}`}>
                            <i className={`fas fa-${
                              notification.type === 'success' ? 'check-circle' :
                              notification.type === 'error' ? 'exclamation-circle' :
                              notification.type === 'warning' ? 'exclamation-triangle' : 'info-circle'
                            }`}></i>
                          </div>
                          <div className="notification-content">
                            <div className="notification-message">
                              {notification.message}
                            </div>
                            <div className="notification-time">
                              Hace 5 minutos
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-notifications">
                      <i className="fas fa-bell-slash"></i>
                      <span>No hay notificaciones</span>
                    </div>
                  )}
                  
                  <div className="dropdown-footer">
                    <button className="btn-link">Ver todas las notificaciones</button>
                  </div>
                </div>
              )}
            </div>

            {/* Menú de usuario */}
            <div className="action-item">
              <button
                className="user-menu-btn glass-subtle"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
              >
                <div className="user-avatar">
                  <div className="avatar-image">
                    <i className="fas fa-user"></i>
                  </div>
                </div>
                <span className="user-name">Usuario Demo</span>
                <i className="fas fa-chevron-down"></i>
              </button>

              {showUserMenu && (
                <div className="dropdown-menu user-dropdown glass">
                  <div className="user-info">
                    <div className="user-details">
                      <div className="name">Usuario Demo</div>
                      <small className="email">demo@taskflow.com</small>
                    </div>
                  </div>
                  
                  <div className="menu-items">
                    <button className="menu-item">
                      <i className="fas fa-user"></i>
                      <span>Mi Perfil</span>
                    </button>
                    <button className="menu-item">
                      <i className="fas fa-cog"></i>
                      <span>Configuración</span>
                    </button>
                    <button className="menu-item">
                      <i className="fas fa-question-circle"></i>
                      <span>Ayuda</span>
                    </button>
                    
                    <div className="menu-divider"></div>
                    <button className="menu-item danger">
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal para crear tarea */}
      {showTaskModal && (
        <TaskCreateModal
          show={showTaskModal}
          onClose={handleCloseTaskModal}
          projectId={currentProject?.id}
        />
      )}

      <style jsx>{`
        .modern-navbar {
          background: var(--bg-glass);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-8);
          gap: var(--space-4);
        }

        /* ===== BREADCRUMB ===== */
        .breadcrumb-container {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-shrink: 0;
        }

        .breadcrumb-item {
          font-size: var(--font-sm);
          color: var(--gray-600);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .breadcrumb-item.current {
          color: var(--primary-solid);
          font-weight: 600;
        }

        .breadcrumb-separator {
          font-size: var(--font-xs);
          color: var(--gray-400);
        }

        /* ===== SEARCH ===== */
        .search-container {
          flex: 1;
          max-width: 400px;
          margin: 0 var(--space-6);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-full);
          width: 100%;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: var(--font-sm);
          color: var(--gray-700);
          min-width: 0;
        }

        .search-input::placeholder {
          color: var(--gray-400);
        }

        .search-kbd {
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--radius);
          padding: var(--space-1) var(--space-2);
          font-size: var(--font-xs);
          color: var(--gray-500);
          flex-shrink: 0;
        }

        /* ===== ACTIONS ===== */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-shrink: 0;
        }

        .button-text {
          margin-left: var(--space-2);
        }

        .action-item {
          position: relative;
        }

        .action-btn {
          width: var(--touch-target);
          height: var(--touch-target);
          border: none;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all var(--duration-200) var(--ease-out);
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }

        .action-btn:active {
          transform: scale(0.95);
        }

        .notification-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 16px;
          height: 16px;
          background: var(--danger);
          color: white;
          border-radius: var(--radius-full);
          font-size: var(--font-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--duration-200) var(--ease-out);
          min-height: var(--touch-target);
        }

        .user-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.02);
        }

        .user-avatar .avatar-image {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: var(--font-sm);
        }

        .user-name {
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--gray-700);
        }

        /* ===== DROPDOWNS ===== */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + var(--space-2));
          right: 0;
          min-width: 280px;
          border-radius: var(--radius-xl);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: var(--shadow-2xl);
          z-index: 100;
          max-height: 80vh;
          overflow-y: auto;
        }

        .notifications-dropdown {
          width: 320px;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--primary-solid);
          font-size: var(--font-sm);
          cursor: pointer;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius);
          transition: all var(--duration-200) var(--ease-out);
        }

        .btn-link:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .notification-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background var(--duration-200) var(--ease-out);
          cursor: pointer;
        }

        .notification-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-icon.success { color: var(--success); }
        .notification-icon.error { color: var(--danger); }
        .notification-icon.warning { color: var(--warning); }
        .notification-icon.info { color: var(--accent); }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-message {
          font-size: var(--font-sm);
          color: var(--gray-700);
          line-height: 1.4;
        }

        .notification-time {
          font-size: var(--font-xs);
          color: var(--gray-500);
          margin-top: var(--space-1);
        }

        .empty-notifications {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-8);
          color: var(--gray-500);
          gap: var(--space-2);
        }

        .empty-notifications i {
          font-size: var(--font-2xl);
          opacity: 0.5;
        }

        .dropdown-footer {
          padding: var(--space-4);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .user-info {
          padding: var(--space-4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-details .name {
          font-weight: 600;
          color: var(--gray-800);
        }

        .user-details .email {
          color: var(--gray-500);
        }

        .menu-items {
          padding: var(--space-2);
        }

        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border: none;
          background: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--duration-200) var(--ease-out);
          font-size: var(--font-sm);
          color: var(--gray-700);
          min-height: var(--touch-target);
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .menu-item.danger {
          color: var(--danger);
        }

        .menu-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: var(--space-2) 0;
        }

        /* ===== DARK THEME ===== */
        [data-theme="dark"] .search-input,
        [data-theme="dark"] .user-name,
        [data-theme="dark"] .notification-message,
        [data-theme="dark"] .menu-item,
        [data-theme="dark"] .user-details .name {
          color: var(--gray-200);
        }

        [data-theme="dark"] .breadcrumb-item {
          color: var(--gray-400);
        }

        /* ===== RESPONSIVE DESIGN ===== */

        /* Large devices (1280px and up) */
        @media (min-width: 1280px) {
          .search-container {
            max-width: 500px;
          }
        }

        /* Desktop (1024px to 1279px) */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .search-container {
            max-width: 350px;
          }
        }

        /* Tablet (768px to 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .navbar-content {
            padding: var(--space-4) var(--space-6);
          }

          .search-container {
            max-width: 250px;
            margin: 0 var(--space-4);
          }
          
          .user-name {
            display: none;
          }

          .breadcrumb-item {
            font-size: var(--font-xs);
          }

          .breadcrumb-item.current {
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          /* Larger touch targets for tablet */
          .action-btn {
            width: var(--touch-target-lg);
            height: var(--touch-target-lg);
          }

          .user-menu-btn {
            min-height: var(--touch-target-lg);
            padding: var(--space-3) var(--space-4);
          }

          .dropdown-menu {
            min-width: 320px;
          }

          .notifications-dropdown {
            width: 360px;
          }
        }

        /* Mobile (up to 767px) */
        @media (max-width: 767px) {
          .navbar-content {
            padding: var(--space-3) var(--space-4);
            gap: var(--space-2);
          }
          
          .search-container {
            display: none;
          }
          
          .button-text {
            display: none;
          }

          .breadcrumb-item {
            font-size: var(--font-xs);
          }

          .breadcrumb-item.current {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .user-name {
            display: none;
          }

          .navbar-actions {
            gap: var(--space-2);
          }

          /* Mobile-optimized dropdowns */
          .dropdown-menu {
            position: fixed;
            top: auto;
            bottom: var(--space-4);
            left: var(--space-4);
            right: var(--space-4);
            width: auto;
            min-width: auto;
            max-height: 60vh;
            border-radius: var(--radius-2xl);
          }

          .notifications-dropdown {
            width: auto;
          }

          .notification-item {
            padding: var(--space-5) var(--space-4);
          }

          .menu-item {
            padding: var(--space-4);
            min-height: var(--touch-target-lg);
            font-size: var(--font-base);
          }
        }

        /* Small mobile (up to 480px) */
        @media (max-width: 480px) {
          .navbar-content {
            padding: var(--space-3);
          }

          .breadcrumb-container {
            gap: var(--space-1);
          }

          .breadcrumb-item {
            font-size: 10px;
          }

          .breadcrumb-item.current {
            max-width: 80px;
          }

          .navbar-actions {
            gap: var(--space-1);
          }

          .action-btn {
            width: 40px;
            height: 40px;
          }

          .user-menu-btn {
            padding: var(--space-2);
          }

          .user-avatar .avatar-image {
            width: 28px;
            height: 28px;
          }
        }

        /* Landscape mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .navbar-content {
            padding: var(--space-2) var(--space-4);
          }

          .dropdown-menu {
            max-height: 70vh;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .notification-badge {
            font-size: 10px;
            font-weight: 700;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar; 