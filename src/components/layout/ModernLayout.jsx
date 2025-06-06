import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import useTheme from '../../hooks/useTheme';
import { useApp } from '../../contexts/AppContext';

const ModernLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toggleTheme } = useTheme();
  const { state } = useApp();
  const { currentProject, user } = state;

  const navigationItems = [
    {
      path: '/',
      icon: 'fas fa-th-large',
      label: 'Dashboard',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      path: '/projects',
      icon: 'fas fa-folder-open',
      label: 'Proyectos',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      path: '/kanban',
      icon: 'fas fa-columns',
      label: 'Kanban',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      path: '/reports',
      icon: 'fas fa-chart-line',
      label: 'Reportes',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      path: '/settings',
      icon: 'fas fa-cog',
      label: 'Configuración',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  // Configurar atajos de teclado
  useKeyboardShortcuts({
    onToggleTheme: toggleTheme,
  });

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="modern-app">
      {/* Sidebar */}
      <aside className={`sidebar-modern ${!sidebarOpen ? 'collapsed' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fas fa-tasks text-gradient"></i>
            </div>
            <div className="logo-text">
              <h2 className="text-gradient animate-gradient">TaskFlow</h2>
              <span className="text-xs opacity-60">Modern Task Management</span>
            </div>
          </div>
        </div>

        {/* Current Project Card */}
        {currentProject && (
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
                <div 
                  className="progress-fill animate-gradient" 
                  style={{ width: '70%' }}
                ></div>
              </div>
              <span className="progress-text">70% Completado</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <div 
                    className="nav-icon"
                    style={{ background: item.gradient }}
                  >
                    <i className={item.icon}></i>
                  </div>
                  <span className="nav-label">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="active-indicator animate-pulse-glow"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="user-card glass-subtle">
            <div className="user-avatar">
              <div className="avatar-image">
                <i className="fas fa-user"></i>
              </div>
              <div className="status-indicator online"></div>
            </div>
            <div className="user-info">
              <h6 className="user-name">{user?.name || 'Usuario Demo'}</h6>
              <span className="user-status">En línea</span>
            </div>
            <div className="user-actions">
              <ThemeToggle size="sm" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="header-modern">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="sidebar-toggle btn-glass"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="fas fa-bars"></i>
              </button>
              
              <div className="page-title">
                <h1 className="title-text">
                  {navigationItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                </h1>
                <div className="breadcrumb">
                  <span className="breadcrumb-item">TaskFlow</span>
                  <i className="fas fa-chevron-right breadcrumb-separator"></i>
                  <span className="breadcrumb-item current">
                    {navigationItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                  </span>
                </div>
              </div>
            </div>

            <div className="header-right">
              <div className="search-container">
                <div className="search-box glass-subtle">
                  <i className="fas fa-search search-icon"></i>
                  <input 
                    type="text" 
                    placeholder="Buscar tareas, proyectos..."
                    className="search-input"
                  />
                  <kbd className="search-kbd">⌘K</kbd>
                </div>
              </div>

              <div className="header-actions">
                <button className="action-btn glass-subtle">
                  <i className="fas fa-bell"></i>
                  <span className="notification-badge">3</span>
                </button>
                
                <button className="action-btn glass-subtle">
                  <i className="fas fa-question-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fab animate-float">
        <i className="fas fa-plus"></i>
      </button>

      <style jsx>{`
        .modern-app {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
        }

        /* ===== SIDEBAR STYLES ===== */
        .sidebar-modern {
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
        }

        .sidebar-modern.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: var(--space-8) var(--space-6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: var(--space-3);
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
        }

        .logo-text h2 {
          font-size: var(--font-2xl);
          font-weight: 700;
          margin: 0;
        }

        .current-project-card {
          margin: var(--space-6);
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

        /* Navigation Styles */
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

        .sidebar-nav-item {
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
        }

        .nav-label {
          font-weight: 500;
          font-size: var(--font-sm);
        }

        .sidebar-nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--gray-800);
          transform: translateX(4px);
        }

        .sidebar-nav-item.active {
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

        /* User Section */
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

        /* ===== MAIN CONTENT ===== */
        .main-content {
          flex: 1;
          margin-left: 320px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: all var(--duration-300) var(--ease-out);
        }

        .header-modern {
          background: var(--bg-glass);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-6) var(--space-8);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        .sidebar-toggle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--duration-200) var(--ease-out);
        }

        .title-text {
          font-size: var(--font-3xl);
          font-weight: 700;
          margin: 0;
          color: var(--gray-800);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-1);
        }

        .breadcrumb-item {
          font-size: var(--font-sm);
          color: var(--gray-500);
        }

        .breadcrumb-item.current {
          color: var(--primary-solid);
        }

        .breadcrumb-separator {
          font-size: var(--font-xs);
          color: var(--gray-400);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-full);
          min-width: 320px;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: var(--font-sm);
          color: var(--gray-700);
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
        }

        .header-actions {
          display: flex;
          gap: var(--space-2);
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all var(--duration-200) var(--ease-out);
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
        }

        .page-content {
          flex: 1;
          padding: var(--space-8);
        }

        /* Dark theme adjustments */
        [data-theme="dark"] .project-name,
        [data-theme="dark"] .user-name,
        [data-theme="dark"] .title-text {
          color: var(--gray-200);
        }

        [data-theme="dark"] .search-input {
          color: var(--gray-200);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar-modern {
            transform: translateX(-100%);
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .search-box {
            min-width: 200px;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            padding: var(--space-4);
          }
          
          .page-content {
            padding: var(--space-4);
          }
          
          .search-box {
            display: none;
          }
          
          .title-text {
            font-size: var(--font-xl);
          }
        }
      `}</style>
    </div>
  );
};

export default ModernLayout; 