import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Projects = () => {
  const { state, addProject, updateProject, deleteProject } = useApp();
  const { projects, currentProject } = state;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, formData);
      setEditingProject(null);
    } else {
      addProject({
        ...formData,
        id: `project-${Date.now()}`,
        createdAt: new Date(),
        tasks: []
      });
    }
    setFormData({ name: '', description: '', status: 'active', startDate: '', endDate: '' });
    setShowCreateForm(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate || '',
      endDate: project.endDate || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      deleteProject(projectId);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'bg-success', text: 'Activo' },
      completed: { class: 'bg-primary', text: 'Completado' },
      paused: { class: 'bg-warning', text: 'Pausado' },
      cancelled: { class: 'bg-danger', text: 'Cancelado' }
    };
    return statusConfig[status] || statusConfig.active;
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Gestión de Proyectos</h1>
          <p className="text-muted mb-0">Administra todos tus proyectos desde aquí</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Nuevo Proyecto
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingProject(null);
                    setFormData({ name: '', description: '', status: 'active', startDate: '', endDate: '' });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre del Proyecto</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Estado</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="active">Activo</option>
                        <option value="completed">Completado</option>
                        <option value="paused">Pausado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Fecha de Inicio</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha de Finalización</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingProject(null);
                      setFormData({ name: '', description: '', status: 'active', startDate: '', endDate: '' });
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProject ? 'Actualizar' : 'Crear'} Proyecto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="row">
        {projects.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No hay proyectos</h4>
              <p className="text-muted">Crea tu primer proyecto para comenzar</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Crear Proyecto
              </button>
            </div>
          </div>
        ) : (
          projects.map((project) => {
            const statusBadge = getStatusBadge(project.status);
            const isCurrentProject = currentProject?.id === project.id;
            
            return (
              <div key={project.id} className="col-lg-4 col-md-6 mb-4">
                <div className={`card h-100 ${isCurrentProject ? 'border-primary' : ''}`}>
                  {isCurrentProject && (
                    <div className="card-header bg-primary text-white py-2">
                      <small><i className="fas fa-star me-1"></i>Proyecto Actual</small>
                    </div>
                  )}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{project.name}</h5>
                      <span className={`badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                    <p className="card-text text-muted small mb-3">
                      {project.description || 'Sin descripción'}
                    </p>
                    
                    {/* Project Stats */}
                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <div className="small text-muted">Tareas</div>
                        <div className="fw-bold">{project.tasks?.length || 0}</div>
                      </div>
                      <div className="col-4">
                        <div className="small text-muted">Progreso</div>
                        <div className="fw-bold">75%</div>
                      </div>
                      <div className="col-4">
                        <div className="small text-muted">Días</div>
                        <div className="fw-bold">12</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress mb-3" style={{ height: '4px' }}>
                      <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
                    </div>

                    <div className="small text-muted mb-3">
                      <i className="fas fa-calendar me-1"></i>
                      Creado: {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="card-footer bg-transparent">
                    <div className="btn-group w-100">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(project)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => window.location.href = '/dashboard'}
                      >
                        <i className="fas fa-eye me-1"></i>
                        Ver
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Projects; 