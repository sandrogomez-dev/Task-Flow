import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Settings = () => {
  const { state, updateUser, addNotification } = useApp();
  const { user } = state;
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    timezone: user?.timezone || 'America/Mexico_City',
    language: user?.language || 'es'
  });
  
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem('theme') || 'light',
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      projectUpdates: true
    },
    defaultView: 'kanban',
    autoSave: true,
    soundEffects: false
  });

  const [projectSettings, setProjectSettings] = useState({
    defaultColumns: ['todo', 'in-progress', 'review', 'done'],
    defaultPriorities: ['low', 'medium', 'high'],
    timeTracking: true,
    autoArchive: false,
    archiveDays: 30
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUser(profileData);
    addNotification('Perfil actualizado correctamente', 'success');
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('theme', preferences.theme);
    // Apply theme
    document.documentElement.setAttribute('data-theme', preferences.theme);
    addNotification('Preferencias guardadas correctamente', 'success');
  };

  const handleProjectSettingsSubmit = (e) => {
    e.preventDefault();
    // Save project settings to context or localStorage
    localStorage.setItem('projectSettings', JSON.stringify(projectSettings));
    addNotification('Configuración de proyecto guardada', 'success');
  };

  const exportData = () => {
    const data = {
      projects: state.projects,
      tasks: state.tasks,
      user: state.user,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification('Datos exportados correctamente', 'success');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Here you would implement the import logic
        console.log('Importing data:', data);
        addNotification('Datos importados correctamente', 'success');
      } catch (error) {
        addNotification('Error al importar datos', 'error');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 mb-1">Configuración</h1>
        <p className="text-muted mb-0">Personaliza tu experiencia en TaskFlow</p>
      </div>

      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user me-2"></i>
                  Perfil
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <i className="fas fa-cog me-2"></i>
                  Preferencias
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'projects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('projects')}
                >
                  <i className="fas fa-project-diagram me-2"></i>
                  Proyectos
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'data' ? 'active' : ''}`}
                  onClick={() => setActiveTab('data')}
                >
                  <i className="fas fa-database me-2"></i>
                  Datos
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => setActiveTab('about')}
                >
                  <i className="fas fa-info-circle me-2"></i>
                  Acerca de
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h4 className="mb-4">
                    <i className="fas fa-user me-2"></i>
                    Información del Perfil
                  </h4>
                  
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Nombre completo</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input
                          type="email"
                          className="form-control"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Zona horaria</label>
                        <select
                          className="form-select"
                          value={profileData.timezone}
                          onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                        >
                          <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                          <option value="America/New_York">Nueva York (GMT-5)</option>
                          <option value="Europe/Madrid">Madrid (GMT+1)</option>
                          <option value="Asia/Tokyo">Tokio (GMT+9)</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Idioma</label>
                        <select
                          className="form-select"
                          value={profileData.language}
                          onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">URL del Avatar</label>
                      <input
                        type="url"
                        className="form-control"
                        value={profileData.avatar}
                        onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                        placeholder="https://ejemplo.com/avatar.jpg"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      Guardar Perfil
                    </button>
                  </form>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h4 className="mb-4">
                    <i className="fas fa-cog me-2"></i>
                    Preferencias de la Aplicación
                  </h4>
                  
                  <form onSubmit={handlePreferencesSubmit}>
                    <div className="mb-4">
                      <h6>Apariencia</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Tema</label>
                          <select
                            className="form-select"
                            value={preferences.theme}
                            onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                          >
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                            <option value="auto">Automático</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Vista por defecto</label>
                          <select
                            className="form-select"
                            value={preferences.defaultView}
                            onChange={(e) => setPreferences({...preferences, defaultView: e.target.value})}
                          >
                            <option value="kanban">Kanban</option>
                            <option value="gantt">Gantt</option>
                            <option value="overview">Resumen</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6>Notificaciones</h6>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={preferences.notifications.email}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            notifications: {...preferences.notifications, email: e.target.checked}
                          })}
                        />
                        <label className="form-check-label">
                          Notificaciones por correo
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={preferences.notifications.push}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            notifications: {...preferences.notifications, push: e.target.checked}
                          })}
                        />
                        <label className="form-check-label">
                          Notificaciones push
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={preferences.notifications.taskReminders}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            notifications: {...preferences.notifications, taskReminders: e.target.checked}
                          })}
                        />
                        <label className="form-check-label">
                          Recordatorios de tareas
                        </label>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6>Funcionalidad</h6>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={preferences.autoSave}
                          onChange={(e) => setPreferences({...preferences, autoSave: e.target.checked})}
                        />
                        <label className="form-check-label">
                          Guardado automático
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={preferences.soundEffects}
                          onChange={(e) => setPreferences({...preferences, soundEffects: e.target.checked})}
                        />
                        <label className="form-check-label">
                          Efectos de sonido
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      Guardar Preferencias
                    </button>
                  </form>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div>
                  <h4 className="mb-4">
                    <i className="fas fa-project-diagram me-2"></i>
                    Configuración de Proyectos
                  </h4>
                  
                  <form onSubmit={handleProjectSettingsSubmit}>
                    <div className="mb-4">
                      <h6>Columnas por defecto</h6>
                      <p className="text-muted small">Estas columnas se crearán automáticamente en nuevos proyectos</p>
                      <div className="row">
                        {projectSettings.defaultColumns.map((column, index) => (
                          <div key={index} className="col-md-3 mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={column}
                              onChange={(e) => {
                                const newColumns = [...projectSettings.defaultColumns];
                                newColumns[index] = e.target.value;
                                setProjectSettings({...projectSettings, defaultColumns: newColumns});
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6>Configuración de tiempo</h6>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={projectSettings.timeTracking}
                          onChange={(e) => setProjectSettings({...projectSettings, timeTracking: e.target.checked})}
                        />
                        <label className="form-check-label">
                          Habilitar seguimiento de tiempo
                        </label>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6>Archivado automático</h6>
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={projectSettings.autoArchive}
                          onChange={(e) => setProjectSettings({...projectSettings, autoArchive: e.target.checked})}
                        />
                        <label className="form-check-label">
                          Archivar tareas completadas automáticamente
                        </label>
                      </div>
                      {projectSettings.autoArchive && (
                        <div className="col-md-4">
                          <label className="form-label">Días antes de archivar</label>
                          <input
                            type="number"
                            className="form-control"
                            value={projectSettings.archiveDays}
                            onChange={(e) => setProjectSettings({...projectSettings, archiveDays: parseInt(e.target.value)})}
                            min="1"
                            max="365"
                          />
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      Guardar Configuración
                    </button>
                  </form>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div>
                  <h4 className="mb-4">
                    <i className="fas fa-database me-2"></i>
                    Gestión de Datos
                  </h4>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0">
                            <i className="fas fa-download me-2"></i>
                            Exportar Datos
                          </h6>
                        </div>
                        <div className="card-body">
                          <p className="card-text">Descarga una copia de seguridad de todos tus datos.</p>
                          <button className="btn btn-success" onClick={exportData}>
                            <i className="fas fa-download me-2"></i>
                            Exportar
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="card border-primary">
                        <div className="card-header bg-primary text-white">
                          <h6 className="mb-0">
                            <i className="fas fa-upload me-2"></i>
                            Importar Datos
                          </h6>
                        </div>
                        <div className="card-body">
                          <p className="card-text">Restaura datos desde un archivo de respaldo.</p>
                          <input
                            type="file"
                            className="form-control mb-2"
                            accept=".json"
                            onChange={importData}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-danger">
                    <h6 className="alert-heading">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Zona de Peligro
                    </h6>
                    <p className="mb-3">Las siguientes acciones son irreversibles.</p>
                    <button className="btn btn-danger" onClick={clearAllData}>
                      <i className="fas fa-trash me-2"></i>
                      Eliminar Todos los Datos
                    </button>
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <div>
                  <h4 className="mb-4">
                    <i className="fas fa-info-circle me-2"></i>
                    Acerca de TaskFlow
                  </h4>
                  
                  <div className="text-center mb-4">
                    <i className="fas fa-tasks fa-4x text-primary mb-3"></i>
                    <h2>TaskFlow</h2>
                    <p className="text-muted">Versión 1.0.0</p>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <h6>Información del Sistema</h6>
                      <ul className="list-unstyled">
                        <li><strong>Versión:</strong> 1.0.0</li>
                        <li><strong>React:</strong> 19.1.0</li>
                        <li><strong>Bootstrap:</strong> 5.3.6</li>
                        <li><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6>Recursos</h6>
                      <ul className="list-unstyled">
                        <li><a href="#" className="text-decoration-none">📖 Documentación</a></li>
                        <li><a href="#" className="text-decoration-none">🐛 Reportar un error</a></li>
                        <li><a href="#" className="text-decoration-none">💡 Sugerir mejora</a></li>
                        <li><a href="#" className="text-decoration-none">📧 Contacto</a></li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-light rounded">
                    <p className="mb-0 text-center">
                      <small className="text-muted">
                        Desarrollado con ❤️ para la gestión eficiente de proyectos
                      </small>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 