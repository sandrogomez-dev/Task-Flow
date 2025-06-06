import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ConfirmModal from '../ui/ConfirmModal';
import useConfirm from '../../hooks/useConfirm';

const TaskCard = ({ task, isDragging = false, onUpdate, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { confirmState, confirmDelete } = useConfirm();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const formatTimeSpent = (seconds) => {
    if (!seconds) return '0h';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowDetails(true);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmed = await confirmDelete(`la tarea "${task.title}"`);
    if (confirmed) {
      onDelete(task.id);
    }
  };

  const handleSave = (updates) => {
    onUpdate(task.id, updates);
    setShowDetails(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`task-item task-card ${isDragging || isSortableDragging ? 'dragging' : ''}`}
        onClick={() => setShowDetails(true)}
      >
        {/* Header de la tarea */}
        <div className="task-header d-flex justify-content-between align-items-start mb-2">
          <h6 className="task-title mb-1 text-dark-custom">{task.title}</h6>
          <div className="task-actions">
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={handleEdit}
              title="Editar tarea"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
              title="Eliminar tarea"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>

        {/* Descripción */}
        {task.description && (
          <p className="task-description text-muted small mb-2">
            {task.description.length > 100 
              ? `${task.description.substring(0, 100)}...` 
              : task.description
            }
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="task-tags mb-2">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="badge bg-light text-dark me-1 small">
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="badge bg-secondary small">+{task.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Información adicional */}
        <div className="task-meta">
          <div className="d-flex justify-content-between align-items-center">
            {/* Prioridad */}
            <span className={`badge bg-${getPriorityColor(task.priority)} small`}>
              {task.priority === 'high' ? 'Alta' : 
               task.priority === 'medium' ? 'Media' : 
               task.priority === 'low' ? 'Baja' : 'Normal'}
            </span>

            {/* Tiempo gastado */}
            {task.timeSpent > 0 && (
              <span className="text-muted small">
                <i className="fas fa-clock me-1"></i>
                {formatTimeSpent(task.timeSpent)}
              </span>
            )}
          </div>

          {/* Fecha de vencimiento */}
          {task.dueDate && (
            <div className="mt-2">
              <small className={`text-${new Date(task.dueDate) < new Date() ? 'danger' : 'muted'}`}>
                <i className="fas fa-calendar me-1"></i>
                {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: es })}
              </small>
            </div>
          )}

          {/* Asignado a */}
          {task.assignee && (
            <div className="mt-2 d-flex align-items-center">
              <div className="assignee-avatar me-2">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}>
                  {task.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              </div>
              <small className="text-muted">{task.assignee}</small>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetails && (
        <TaskDetailsModal
          task={task}
          onSave={handleSave}
          onClose={() => setShowDetails(false)}
        />
      )}
      
      {/* Modal de confirmación */}
      <ConfirmModal {...confirmState} />
    </>
  );
};

// Componente modal para editar detalles de la tarea
const TaskDetailsModal = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    assignee: task.assignee || '',
    dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    tags: task.tags ? task.tags.join(', ') : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updates = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSave(updates);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Tarea</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Prioridad</label>
                  <select
                    className="form-select"
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
                  <label className="form-label">Fecha de vencimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Asignado a</label>
                <input
                  type="text"
                  className="form-control"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tags (separados por comas)</label>
                <input
                  type="text"
                  className="form-control"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="desarrollo, frontend, urgente"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 