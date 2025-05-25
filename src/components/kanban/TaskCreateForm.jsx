import React, { useState } from 'react';

const TaskCreateForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    tags: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    onSubmit(taskData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      tags: ''
    });
    setIsExpanded(false);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({ title: formData.title });
    setFormData(prev => ({ ...prev, title: '' }));
  };

  return (
    <div className="task-create-form card border-0 shadow-sm">
      <div className="card-body p-3">
        <form onSubmit={isExpanded ? handleSubmit : handleQuickAdd}>
          {/* Campo título (siempre visible) */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Escribe el título de la tarea..."
              autoFocus
              required
            />
          </div>

          {/* Campos expandidos */}
          {isExpanded && (
            <div className="expanded-fields fade-in">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción de la tarea (opcional)"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small text-muted">Prioridad</label>
                  <select
                    className="form-select form-select-sm"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label small text-muted">Fecha límite</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Asignado a</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  placeholder="Nombre de la persona asignada"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Tags</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="desarrollo, frontend, urgente"
                />
                <div className="form-text">Separa los tags con comas</div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {!isExpanded && (
                <button
                  type="button"
                  className="btn btn-link btn-sm text-muted p-0"
                  onClick={() => setIsExpanded(true)}
                >
                  <i className="fas fa-plus me-1"></i>
                  Más opciones
                </button>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onCancel}
              >
                Cancelar
              </button>
              
              {isExpanded ? (
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!formData.title.trim()}
                >
                  <i className="fas fa-plus me-1"></i>
                  Crear Tarea
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!formData.title.trim()}
                >
                  <i className="fas fa-plus me-1"></i>
                  Agregar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateForm; 