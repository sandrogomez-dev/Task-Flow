import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const location = useLocation();
  const { state } = useApp();
  const { currentProject } = state;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      description: 'Vista general del proyecto',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      path: '/projects',
      icon: 'fas fa-project-diagram',
      label: 'Proyectos',
      description: 'Gestionar proyectos',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      path: '/reports',
      icon: 'fas fa-chart-bar',
      label: 'Reportes',
      description: 'Análisis y estadísticas',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      path: '/settings',
      icon: 'fas fa-cog',
      label: 'Configuración',
      description: 'Ajustes de la aplicación',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Detect screen size and handle mobile
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (!isMobile) {
        setIsMobileOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest('.modern-sidebar')) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileOpen]);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close mobile menu on navigation
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className={`mobile-overlay ${isMobileOpen ? 'show' : ''}`} />
      
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <i className={`fas fa-${isMobileOpen ? 'times' : 'bars'}`}></i>
      </button>

      <div className={`modern-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'show' : ''}`}>
        {/* Logo y título */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fas fa-tasks"></i>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <h2 className="text-gradient animate-gradient">TaskFlow</h2>
                <span className="subtitle">Gestión de Proyectos</span>
              </div>
            )}
          </div>
          
          {/* Botón de colapsar - solo desktop */}
          <button
            className="collapse-btn glass-subtle desktop-only"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <i className={`fas fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>

        {/* Proyecto actual */}
        {currentProject && !isCollapsed && (
          <div className="current-project-card glass-subtle">
            <div className="project-info">
              <div className="project-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="project-details">
                <h6 className="project-name">{currentProject.name}</h6>
                <span className="project-status">Proyecto Activo</span>
              </div>
            </div>
            <div className="project-progress">
              <div className="progress-bar">
                <div className="progress-fill animate-gradient" style={{ width: '70%' }}></div>
              </div>
              <span className="progress-text">70% Completado</span>
            </div>
          </div>
        )}

        {/* Navegación principal */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <div 
                    className="nav-icon"
                    style={{ background: item.gradient }}
                  >
                    <i className={item.icon}></i>
                  </div>
                  {!isCollapsed && (
                    <div className="nav-text">
                      <span className="nav-label">{item.label}</span>
                      <small className="nav-description">{item.description}</small>
                    </div>
                  )}
                  {isActiveRoute(item.path) && (
                    <div className="active-indicator animate-pulse-glow"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Acciones rápidas */}
        {!isCollapsed && (
          <div className="quick-actions">
            <button className="btn-modern btn-primary">
              <i className="fas fa-plus"></i>
              <span>Nueva Tarea</span>
            </button>
            <button className="btn-modern btn-glass">
              <i className="fas fa-clock"></i>
              <span>Cronómetro</span>
            </button>
          </div>
        )}

        {/* Usuario */}
        <div className="sidebar-footer">
          <div className="user-card glass-subtle">
            <div className="user-avatar">
              <div className="avatar-image">
                <i className="fas fa-user"></i>
              </div>
              <div className="status-indicator online"></div>
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <h6 className="user-name">Usuario Demo</h6>
                <span className="user-status">Administrador</span>
              </div>
            )}
            <div className="user-actions">
              <ThemeToggle size="sm" />
            </div>
          </div>
        </div>

        <style jsx>{`
          /* ===== MOBILE MENU BUTTON ===== */
          .mobile-menu-btn {
            position: fixed;
            top: var(--space-4);
            left: var(--space-4);
            z-index: 250;
            width: var(--touch-target);
            height: var(--touch-target);
            border-radius: var(--radius-lg);
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--gray-700);
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all var(--duration-200) var(--ease-out);
            box-shadow: var(--shadow-lg);
          }

          .mobile-menu-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }

          .mobile-menu-btn:active {
            transform: scale(0.95);
          }

          /* ===== SIDEBAR ===== */
          .modern-sidebar {
            width: 320px;
            height: 100vh;
            background: var(--bg-glass);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
            transition: all var(--duration-300) var(--ease-out);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
          }

          .modern-sidebar.collapsed {
            width: 80px;
          }

          /* ===== HEADER SECTION ===== */
          .sidebar-header {
            padding: var(--space-8) var(--space-6);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            margin-bottom: var(--space-4);
          }

          .logo-icon {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-xl);
            background: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--font-xl);
            color: white;
            box-shadow: var(--shadow-lg);
            flex-shrink: 0;
          }

          .logo-text h2 {
            font-size: var(--font-2xl);
            font-weight: 700;
            margin: 0;
          }

          .subtitle {
            font-size: var(--font-xs);
            color: var(--gray-500);
          }

          .collapse-btn {
            width: 44px;
            height: 44px;
            border: none;
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all var(--duration-200) var(--ease-out);
            margin: 0 auto;
          }

          .collapse-btn:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          /* ===== PROJECT SECTION ===== */
          .current-project-card {
            margin: 0 var(--space-6) var(--space-6) var(--space-6);
            padding: var(--space-4);
            border-radius: var(--radius-xl);
          }

          .project-info {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            margin-bottom: var(--space-3);
          }

          .project-icon {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-lg);
            background: var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
          }

          .project-name {
            font-size: var(--font-sm);
            font-weight: 600;
            margin: 0;
            color: var(--gray-800);
          }

          .project-status {
            font-size: var(--font-xs);
            color: var(--gray-500);
          }

          .progress-bar {
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: var(--radius-full);
            overflow: hidden;
            margin-bottom: var(--space-1);
          }

          .progress-fill {
            height: 100%;
            background: var(--success);
            transition: width var(--duration-500) var(--ease-out);
          }

          .progress-text {
            font-size: var(--font-xs);
            color: var(--gray-500);
          }

          /* ===== NAVIGATION ===== */
          .sidebar-nav {
            flex: 1;
            padding: var(--space-4) 0;
          }

          .nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .nav-item {
            margin-bottom: var(--space-1);
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            padding: var(--space-4) var(--space-6);
            color: var(--gray-600);
            text-decoration: none;
            transition: all var(--duration-200) var(--ease-out);
            position: relative;
            margin: 0 var(--space-4);
            border-radius: var(--radius-xl);
            min-height: var(--touch-target);
          }

          .nav-icon {
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: var(--font-base);
            transition: all var(--duration-200) var(--ease-out);
            flex-shrink: 0;
          }

          .nav-label {
            font-weight: 500;
            font-size: var(--font-sm);
          }

          .nav-description {
            color: var(--gray-500);
            font-size: var(--font-xs);
            display: block;
            margin-top: 2px;
          }

          .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--gray-800);
            transform: translateX(4px);
          }

          .nav-link.active {
            background: rgba(102, 126, 234, 0.1);
            color: var(--primary-solid);
          }

          .active-indicator {
            position: absolute;
            right: var(--space-4);
            width: 8px;
            height: 8px;
            border-radius: var(--radius-full);
            background: var(--primary-solid);
          }

          /* ===== QUICK ACTIONS ===== */
          .quick-actions {
            padding: 0 var(--space-6);
            margin-bottom: var(--space-6);
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
          }

          /* ===== USER SECTION ===== */
          .sidebar-footer {
            padding: var(--space-6);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .user-card {
            padding: var(--space-4);
            border-radius: var(--radius-xl);
            display: flex;
            align-items: center;
            gap: var(--space-3);
          }

          .user-avatar {
            position: relative;
            flex-shrink: 0;
          }

          .avatar-image {
            width: 40px;
            height: 40px;
            border-radius: var(--radius-full);
            background: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .status-indicator {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            border-radius: var(--radius-full);
            border: 2px solid white;
          }

          .status-indicator.online {
            background: var(--success);
          }

          .user-name {
            font-size: var(--font-sm);
            font-weight: 600;
            margin: 0;
            color: var(--gray-800);
          }

          .user-status {
            font-size: var(--font-xs);
            color: var(--gray-500);
          }

          .user-actions {
            margin-left: auto;
          }

          /* ===== DARK THEME ===== */
          [data-theme="dark"] .project-name,
          [data-theme="dark"] .user-name {
            color: var(--gray-200);
          }

          [data-theme="dark"] .subtitle {
            color: var(--gray-400);
          }

          [data-theme="dark"] .mobile-menu-btn {
            color: var(--gray-200);
          }

          /* ===== RESPONSIVE DESIGN ===== */

          /* Desktop */
          @media (min-width: 1024px) {
            .desktop-only {
              display: flex;
            }
          }

          /* Mobile and Tablet */
          @media (max-width: 1023px) {
            .mobile-menu-btn {
              display: flex;
            }

            .desktop-only {
              display: none;
            }

            .modern-sidebar {
              transform: translateX(-100%);
              width: 100vw;
              max-width: 320px;
              z-index: 200;
              box-shadow: var(--shadow-2xl);
            }
            
            .modern-sidebar.show {
              transform: translateX(0);
            }

            .sidebar-header {
              padding: var(--space-6) var(--space-5);
            }

            .logo-text h2 {
              font-size: var(--font-xl);
            }
          }

          /* Tablet specific */
          @media (min-width: 768px) and (max-width: 1023px) {
            .modern-sidebar {
              max-width: 380px;
            }

            .nav-link {
              padding: var(--space-5) var(--space-6);
              min-height: var(--touch-target-lg);
            }

            .nav-icon {
              width: 44px;
              height: 44px;
            }
          }

          /* Mobile specific */
          @media (max-width: 767px) {
            .mobile-menu-btn {
              top: var(--space-3);
              left: var(--space-3);
              width: var(--touch-target);
              height: var(--touch-target);
            }

            .modern-sidebar {
              width: 100vw;
            }

            .sidebar-header {
              padding: var(--space-5) var(--space-4);
            }

            .logo-icon {
              width: 44px;
              height: 44px;
            }

            .logo-text h2 {
              font-size: var(--font-lg);
            }

            .nav-link {
              margin: 0 var(--space-3);
              padding: var(--space-4);
              border-radius: var(--radius-xl);
            }

            .nav-icon {
              width: 36px;
              height: 36px;
            }

            .current-project-card {
              margin: 0 var(--space-4) var(--space-5) var(--space-4);
              padding: var(--space-3);
            }

            .quick-actions {
              padding: 0 var(--space-4);
            }

            .sidebar-footer {
              padding: var(--space-5) var(--space-4);
            }
          }

          /* Small mobile */
          @media (max-width: 480px) {
            .logo-text h2 {
              font-size: var(--font-base);
            }

            .subtitle {
              font-size: 10px;
            }

            .nav-description {
              display: none;
            }
          }

          /* Landscape mobile */
          @media (max-height: 600px) and (orientation: landscape) {
            .sidebar-header {
              padding: var(--space-4);
            }

            .current-project-card {
              margin-bottom: var(--space-4);
            }

            .sidebar-footer {
              padding: var(--space-4);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar; 