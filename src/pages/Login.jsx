import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Login = ({ onLogin }) => {
  const { updateUser, addNotification } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear usuario mock
      const user = {
        id: 'user-1',
        name: 'Usuario Demo',
        email: formData.email,
        avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=0d6efd&color=fff',
        role: 'admin',
        timezone: 'America/Mexico_City',
        language: 'es'
      };

      updateUser(user);
      addNotification('¡Bienvenido a TaskFlow!', 'success');
      
      if (onLogin) {
        onLogin(user);
      }
    } catch (error) {
      addNotification('Error al iniciar sesión', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@taskflow.com',
      password: 'demo123',
      rememberMe: false
    });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Logo y título */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="fas fa-tasks fa-3x text-primary"></i>
                  </div>
                  <h2 className="h4 text-dark mb-1">TaskFlow</h2>
                  <p className="text-muted">Gestión de proyectos inteligente</p>
                </div>

                {/* Formulario de login */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Recordarme
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner me-2"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </form>

                {/* Demo login */}
                <div className="text-center">
                  <hr className="my-3" />
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleDemoLogin}
                  >
                    <i className="fas fa-play me-1"></i>
                    Usar datos de demo
                  </button>
                </div>

                {/* Links adicionales */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    <a href="#" className="text-decoration-none me-3">
                      ¿Olvidaste tu contraseña?
                    </a>
                    <a href="#" className="text-decoration-none">
                      Crear cuenta
                    </a>
                  </small>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="text-center mt-4">
              <small className="text-muted">
                <i className="fas fa-shield-alt me-1"></i>
                Tus datos están seguros con nosotros
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 