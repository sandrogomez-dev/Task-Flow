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
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4">
          {/* Breadcrumb / Título de página */}
          <div className="navbar-brand mb-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <i className="fas fa-home me-1"></i>
                  TaskFlow
                </li>
                {currentProject && (
                  <li className="breadcrumb-item active" aria-current="page">
                    {currentProject.name}
                  </li>
                )}
              </ol>
            </nav>
          </div>

          {/* Barra de búsqueda */}
          <div className="navbar-search flex-grow-1 mx-4">
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <span className="input-group-text bg-light border-end-0">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Buscar tareas, proyectos... (Ctrl+K)"
                title="Presiona Ctrl+K para enfocar"
              />
            </div>
          </div>

          {/* Acciones de la navbar */}
          <div className="navbar-nav flex-row align-items-center">
            {/* Toggle de tema */}
            <div className="me-3">
              <ThemeToggle size="sm" />
            </div>

            {/* Botón de nueva tarea */}
            <div className="me-3">
              <button 
                type="button"
                className={`btn ${currentProject ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleNewTask}
                style={{ 
                  cursor: currentProject ? 'pointer' : 'not-allowed',
                  pointerEvents: 'auto'
                }}
                title={!currentProject ? 'Selecciona un proyecto primero' : 'Crear nueva tarea (Ctrl+N)'}
              >
                <i className="fas fa-plus me-2"></i>
                <span className="d-none d-sm-inline">Nueva Tarea</span>
              </button>
            </div>

            {/* Notificaciones */}
            <div className="nav-item dropdown me-3">
              <button
                className="btn btn-outline-secondary position-relative"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-expanded={showNotifications}
              >
                <i className="fas fa-bell"></i>
                {unreadNotifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadNotifications}
                    <span className="visually-hidden">notificaciones no leídas</span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ width: '320px' }}>
                  <div className="dropdown-header d-flex justify-content-between align-items-center">
                    <span>Notificaciones</span>
                    {unreadNotifications > 0 && (
                      <button className="btn btn-link btn-sm p-0">
                        Marcar como leídas
                      </button>
                    )}
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  {notifications.length > 0 ? (
                    <div className="notification-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.slice(0, 5).map((notification) => (
                        <div key={notification.id} className="dropdown-item-text p-3 border-bottom">
                          <div className="d-flex">
                            <div className={`notification-icon me-3 text-${
                              notification.type === 'success' ? 'success' :
                              notification.type === 'error' ? 'danger' :
                              notification.type === 'warning' ? 'warning' : 'info'
                            }`}>
                              <i className={`fas fa-${
                                notification.type === 'success' ? 'check-circle' :
                                notification.type === 'error' ? 'exclamation-circle' :
                                notification.type === 'warning' ? 'exclamation-triangle' : 'info-circle'
                              }`}></i>
                            </div>
                            <div className="notification-content">
                              <div className="notification-message small">
                                {notification.message}
                              </div>
                              <div className="notification-time text-muted" style={{ fontSize: '0.75rem' }}>
                                Hace 5 minutos
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="dropdown-item-text text-center py-4 text-muted">
                      <i className="fas fa-bell-slash fa-2x mb-2 d-block"></i>
                      No hay notificaciones
                    </div>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item text-center">
                    <button className="btn btn-link btn-sm">Ver todas las notificaciones</button>
                  </div>
                </div>
              )}
            </div>

            {/* Menú de usuario */}
            <div className="nav-item dropdown">
              <button
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
              >
                <div className="user-avatar me-2">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                       style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}>
                    <i className="fas fa-user"></i>
                  </div>
                </div>
                <span className="d-none d-md-inline">Usuario Demo</span>
                <i className="fas fa-chevron-down ms-2"></i>
              </button>

              {showUserMenu && (
                <div className="dropdown-menu dropdown-menu-end show">
                  <div className="dropdown-header">
                    <div className="fw-medium">Usuario Demo</div>
                    <small className="text-muted">demo@taskflow.com</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item">
                    <i className="fas fa-user me-2"></i>
                    Mi Perfil
                  </button>
                  <button className="dropdown-item">
                    <i className="fas fa-cog me-2"></i>
                    Configuración
                  </button>
                  <button className="dropdown-item">
                    <i className="fas fa-question-circle me-2"></i>
                    Ayuda
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Cerrar Sesión
                  </button>
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
    </>
  );
};

export default Navbar; 