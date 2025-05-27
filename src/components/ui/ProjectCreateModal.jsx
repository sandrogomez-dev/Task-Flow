import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const ProjectCreateModal = ({ show, onClose, onProjectCreated }) => {
  const { addProject, setCurrentProject } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    startDate: '',
    endDate: '',
    template: 'blank'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTemplates = [
    {
      id: 'blank',
      name: 'Proyecto en Blanco',
      description: 'Comienza desde cero',
      icon: 'fas fa-file-alt'
    },
    {
      id: 'software',
      name: 'Desarrollo de Software',
      description: 'Incluye columnas para desarrollo ágil',
      icon: 'fas fa-code'
    },
    {
      id: 'marketing',
      name: 'Campaña de Marketing',
      description: 'Optimizado para campañas y contenido',
      icon: 'fas fa-bullhorn'
    },
    {
      id: 'design',
      name: 'Proyecto de Diseño',
      description: 'Flujo de trabajo para diseñadores',
      icon: 'fas fa-palette'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newProject = {
        id: `project-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        template: formData.template,
        tasks: [],
        members: [],
        progress: 0
      };

      // Agregar columnas según la plantilla
      if (formData.template === 'software') {
        newProject.columns = [
          { id: 'backlog', title: 'Backlog', color: '#6c757d' },
          { id: 'todo', title: 'Por Hacer', color: '#6c757d' },
          { id: 'in-progress', title: 'En Desarrollo', color: '#ffc107' },
          { id: 'testing', title: 'Testing', color: '#fd7e14' },
          { id: 'done', title: 'Completado', color: '#198754' }
        ];
      } else if (formData.template === 'marketing') {
        newProject.columns = [
          { id: 'ideas', title: 'Ideas', color: '#6c757d' },
          { id: 'planning', title: 'Planificación', color: '#ffc107' },
          { id: 'creation', title: 'Creación', color: '#fd7e14' },
          { id: 'review', title: 'Revisión', color: '#17a2b8' },
          { id: 'published', title: 'Publicado', color: '#198754' }
        ];
      } else if (formData.template === 'design') {
        newProject.columns = [
          { id: 'brief', title: 'Brief', color: '#6c757d' },
          { id: 'research', title: 'Investigación', color: '#ffc107' },
          { id: 'design', title: 'Diseño', color: '#fd7e14' },
          { id: 'feedback', title: 'Feedback', color: '#17a2b8' },
          { id: 'final', title: 'Final', color: '#198754' }
        ];
      }

      addProject(newProject);
      setCurrentProject(newProject);
      
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        status: 'active',
        startDate: '',
        endDate: '',
        template: 'blank'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-plus me-2"></i>
              Crear Nuevo Proyecto
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isSubmitting}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Información básica */}
              <div className="mb-4">
                <h6 className="mb-3">Información del Proyecto</h6>
                
                <div className="mb-3">
                  <label className="form-label">Nombre del proyecto *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ej: Rediseño de la aplicación web"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe el objetivo y alcance del proyecto..."
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                    >
                      <option value="active">Activo</option>
                      <option value="planning">En Planificación</option>
                      <option value="paused">Pausado</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Fecha de inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Fecha de finalización</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      min={formData.startDate}
                    />
                  </div>
                </div>
              </div>

              {/* Plantillas */}
              <div className="mb-4">
                <h6 className="mb-3">Selecciona una Plantilla</h6>
                <div className="row">
                  {projectTemplates.map(template => (
                    <div key={template.id} className="col-md-6 mb-3">
                      <div 
                        className={`card h-100 cursor-pointer ${
                          formData.template === template.id ? 'border-primary bg-primary bg-opacity-10' : ''
                        }`}
                        onClick={() => handleChange('template', template.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body text-center">
                          <i className={`${template.icon} fa-2x mb-2 ${
                            formData.template === template.id ? 'text-primary' : 'text-muted'
                          }`}></i>
                          <h6 className="card-title">{template.name}</h6>
                          <p className="card-text small text-muted">
                            {template.description}
                          </p>
                          {formData.template === template.id && (
                            <i className="fas fa-check-circle text-primary"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vista previa */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-2">Vista previa del proyecto:</h6>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{formData.name || 'Nombre del proyecto'}</h6>
                    <p className="text-muted small mb-2">
                      {formData.description || 'Descripción del proyecto'}
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className={`badge bg-${
                        formData.status === 'active' ? 'success' :
                        formData.status === 'planning' ? 'warning' : 'secondary'
                      }`}>
                        {formData.status === 'active' ? 'Activo' :
                         formData.status === 'planning' ? 'En Planificación' : 'Pausado'}
                      </span>
                      {formData.startDate && (
                        <span className="badge bg-light text-dark">
                          <i className="fas fa-calendar me-1"></i>
                          Inicio: {new Date(formData.startDate).toLocaleDateString()}
                        </span>
                      )}
                      {formData.endDate && (
                        <span className="badge bg-light text-dark">
                          <i className="fas fa-flag me-1"></i>
                          Fin: {new Date(formData.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ms-3">
                    <i className={`${projectTemplates.find(t => t.id === formData.template)?.icon} fa-2x text-primary`}></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !formData.name.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner me-2"></span>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus me-2"></i>
                    Crear Proyecto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreateModal; 