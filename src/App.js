import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/ui/Sidebar';
import Navbar from './components/ui/Navbar';
import NotificationContainer from './components/ui/NotificationContainer';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App main-container d-flex">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="main-content flex-grow-1 d-flex flex-column">
            {/* Top Navbar */}
            <Navbar />
            
            {/* Page Content */}
            <main className="content-wrapper flex-grow-1">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<div>Proyectos (En desarrollo)</div>} />
                <Route path="/reports" element={<div>Reportes (En desarrollo)</div>} />
                <Route path="/settings" element={<div>Configuración (En desarrollo)</div>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
          
          {/* Notification Container */}
          <NotificationContainer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
