import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Sidebar from './components/ui/Sidebar';
import Navbar from './components/ui/Navbar';
import NotificationContainer from './components/ui/NotificationContainer';
import './App.css';
import './styles/modern-design.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="modern-app-layout">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="main-content-area">
            {/* Top Navbar */}
            <Navbar />
            
            {/* Page Content */}
            <main className="page-content-wrapper">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
          
          {/* Notification Container */}
          <NotificationContainer />
        </div>
        
        <style jsx>{`
          .modern-app-layout {
            display: flex;
            min-height: 100vh;
            background: var(--bg-primary);
            position: relative;
          }

          .main-content-area {
            flex: 1;
            margin-left: 320px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            transition: margin-left var(--duration-300) var(--ease-out);
            position: relative;
          }

          .page-content-wrapper {
            flex: 1;
            padding: var(--space-8);
            background: var(--bg-primary);
            width: 100%;
            overflow-x: auto;
          }

          /* ===== RESPONSIVE LAYOUT ===== */

          /* Large desktop (1280px and up) */
          @media (min-width: 1280px) {
            .page-content-wrapper {
              padding: var(--space-12);
              max-width: 1400px;
              margin: 0 auto;
            }
          }

          /* Desktop (1024px to 1279px) */
          @media (min-width: 1024px) and (max-width: 1279px) {
            .page-content-wrapper {
              padding: var(--space-10);
            }
          }

          /* Tablet and Mobile (up to 1023px) */
          @media (max-width: 1023px) {
            .main-content-area {
              margin-left: 0;
              padding-top: 0;
            }
          }

          /* Tablet (768px to 1023px) */
          @media (min-width: 768px) and (max-width: 1023px) {
            .page-content-wrapper {
              padding: var(--space-8) var(--space-6);
            }
          }

          /* Mobile (up to 767px) */
          @media (max-width: 767px) {
            .page-content-wrapper {
              padding: var(--space-4);
            }
          }

          /* Small mobile (up to 480px) */
          @media (max-width: 480px) {
            .page-content-wrapper {
              padding: var(--space-3);
            }
          }

          /* Landscape mobile optimization */
          @media (max-height: 600px) and (orientation: landscape) {
            .page-content-wrapper {
              padding: var(--space-3) var(--space-4);
            }
          }

          /* Print styles */
          @media print {
            .main-content-area {
              margin-left: 0;
            }
            
            .page-content-wrapper {
              padding: 0;
            }
          }
        `}</style>
      </Router>
    </AppProvider>
  );
}

export default App;
