import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Sidebar = () => {
  const location = useLocation();
  const { state } = useApp();
  const { currentProject } = state;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      description: 'Vista general del proyecto'
    },
    {
      path: '/projects',
      icon: 'fas fa-project-diagram',
      label: 'Proyectos',
      description: 'Gestionar proyectos'
    },
    {
      path: '/reports',
      icon: 'fas fa-chart-bar',
      label: 'Reportes',
      description: 'Análisis y estadísticas'
    },
    {
      path: '/settings',
      icon: 'fas fa-cog',
      label: 'Configuración',
      description: 'Ajustes de la aplicación'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content h-100 d-flex flex-column">
        {/* Logo y título */}
        <div className="sidebar-header p-3 border-bottom border-light border-opacity-25">
          <div className="d-flex align-items-center">
            <div className="logo-container me-3">
              <div className="logo bg-white text-primary rounded d-flex align-items-center justify-content-center"
                   style={{ width: '40px', height: '40px' }}>
                <i className="fas fa-tasks"></i>
              </div>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <h5 className="text-white mb-0">TaskFlow</h5>
                <small className="text-light opacity-75">Gestión de Proyectos</small>
              </div>
            )}
          </div>
          
          {/* Botón de colapsar */}
          <button
            className="btn btn-link text-white p-0 mt-2 d-block w-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <i className={`fas fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>

        {/* Proyecto actual */}
        {currentProject && (
          <div className="current-project p-3 border-bottom border-light border-opacity-25">
            {!isCollapsed ? (
              <div>
                <small className="text-light opacity-75 d-block">Proyecto Actual</small>
                <div className="text-white fw-medium">{currentProject.name}</div>
                <small className="text-light opacity-75">{currentProject.description}</small>
              </div>
            ) : (
              <div className="text-center">
                <i className="fas fa-folder text-white" title={currentProject.name}></i>
              </div>
            )}
          </div>
        )}

        {/* Navegación principal */}
        <nav className="sidebar-nav flex-grow-1 p-3">
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item mb-2">
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center p-3 rounded text-decoration-none transition-all ${
                    isActiveRoute(item.path)
                      ? 'bg-white bg-opacity-25 text-white'
                      : 'text-light hover-bg-white-10'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <i className={`${item.icon} ${isCollapsed ? 'text-center' : 'me-3'}`}
                     style={{ width: isCollapsed ? '100%' : 'auto' }}></i>
                  {!isCollapsed && (
                    <div className="nav-text">
                      <div className="nav-label">{item.label}</div>
                      <small className="nav-description opacity-75">{item.description}</small>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Acciones rápidas */}
        {!isCollapsed && (
          <div className="sidebar-footer p-3 border-top border-light border-opacity-25">
            <div className="d-grid gap-2">
              <button className="btn btn-light btn-sm">
                <i className="fas fa-plus me-2"></i>
                Nueva Tarea
              </button>
              <button className="btn btn-outline-light btn-sm">
                <i className="fas fa-clock me-2"></i>
                Cronómetro
              </button>
            </div>
          </div>
        )}

        {/* Usuario (simplificado) */}
        <div className="sidebar-user p-3 border-top border-light border-opacity-25">
          {!isCollapsed ? (
            <div className="d-flex align-items-center">
              <div className="user-avatar me-3">
                <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '32px', height: '32px' }}>
                  <i className="fas fa-user"></i>
                </div>
              </div>
              <div className="user-info">
                <div className="text-white small">Usuario Demo</div>
                <small className="text-light opacity-75">Administrador</small>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto"
                   style={{ width: '32px', height: '32px' }}>
                <i className="fas fa-user"></i>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 