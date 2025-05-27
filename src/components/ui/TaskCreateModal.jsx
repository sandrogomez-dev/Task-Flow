import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const TaskCreateModal = ({ show, onClose, projectId, columnId = 'todo' }) => {
  const { state, dispatch, actionTypes, addNotification } = useApp();
  const { columns } = state;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
    columnId: columnId
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTask = {
        id: `task-${Date.now()}`,
        ...formData,
        projectId: projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeSpent: 0,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null
      };

      dispatch({
        type: actionTypes.ADD_TASK,
        payload: newTask
      });

      addNotification('Tarea creada exitosamente', 'success');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        assignee: '',
        priority: 'medium',
        dueDate: '',
        tags: '',
        columnId: columnId
      });
      
      onClose();
    } catch (error) {
      addNotification('Error al crear la tarea', 'error');
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
              Crear Nueva Tarea
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
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">Título de la tarea *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ej: Implementar nueva funcionalidad"
                    required
                  />
                </div>
                
                <div className="col-md-4 mb-3">
                  <label className="form-label">Prioridad</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe los detalles de la tarea..."
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Asignado a</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.assignee}
                    onChange={(e) => handleChange('assignee', e.target.value)}
                    placeholder="Nombre del responsable"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha límite</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Estado inicial</label>
                  <select
                    className="form-select"
                    value={formData.columnId}
                    onChange={(e) => handleChange('columnId', e.target.value)}
                  >
                    {columns.map(column => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Etiquetas</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="frontend, urgente, bug (separadas por comas)"
                  />
                  <div className="form-text">Separa las etiquetas con comas</div>
                </div>
              </div>

              {/* Preview de la tarea */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-2">Vista previa:</h6>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{formData.title || 'Título de la tarea'}</h6>
                    <p className="text-muted small mb-2">
                      {formData.description || 'Descripción de la tarea'}
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      {formData.assignee && (
                        <span className="badge bg-light text-dark">
                          <i className="fas fa-user me-1"></i>
                          {formData.assignee}
                        </span>
                      )}
                      {formData.dueDate && (
                        <span className="badge bg-light text-dark">
                          <i className="fas fa-calendar me-1"></i>
                          {new Date(formData.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {formData.tags && formData.tags.split(',').map((tag, index) => (
                        <span key={index} className="badge bg-secondary">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ms-3">
                    <span className={`badge bg-${
                      formData.priority === 'high' ? 'danger' :
                      formData.priority === 'medium' ? 'warning' : 'success'
                    }`}>
                      {formData.priority === 'high' ? 'Alta' :
                       formData.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
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
                disabled={isSubmitting || !formData.title.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner me-2"></span>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus me-2"></i>
                    Crear Tarea
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

export default TaskCreateModal; 