import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import TaskCard from './TaskCard';
import TaskCreateForm from './TaskCreateForm';

const KanbanColumn = ({ 
  column, 
  tasks, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id: column.id,
  });

  const handleCreateTask = (taskData) => {
    onTaskCreate(taskData);
    setShowCreateForm(false);
  };

  const taskIds = tasks.map(task => task.id);

  return (
    <div 
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'column-drag-over' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header de la columna */}
      <div className="kanban-column-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div 
            className="column-indicator me-2"
            style={{ backgroundColor: column.color || '#6c757d' }}
          ></div>
          <h5 className="mb-0 text-dark-custom">{column.title}</h5>
          <span className="badge bg-light text-dark ms-2">{tasks.length}</span>
        </div>
        
        <div className="column-actions">
          <button
            className={`btn btn-outline-primary btn-sm ${isHovered ? 'visible' : 'invisible'}`}
            onClick={() => setShowCreateForm(true)}
            title="Agregar tarea"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {/* Formulario de creación de tarea */}
      {showCreateForm && (
        <div className="mb-3 fade-in">
          <TaskCreateForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Lista de tareas */}
      <div className="task-list scrollable-container">
        <SortableContext 
          items={taskIds} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          ))}
        </SortableContext>

        {/* Mensaje cuando no hay tareas */}
        {tasks.length === 0 && !showCreateForm && (
          <div className="empty-column text-center py-4">
            <div className="text-muted">
              <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
              <p className="mb-2">No hay tareas aquí</p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowCreateForm(true)}
              >
                <i className="fas fa-plus me-1"></i>
                Agregar primera tarea
              </button>
            </div>
          </div>
        )}

        {/* Zona de drop visual */}
        {isOver && (
          <div className="drop-zone-indicator">
            <div className="drop-zone-content">
              <i className="fas fa-arrow-down"></i>
              <span>Soltar aquí</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer de la columna */}
      <div className="kanban-column-footer mt-auto pt-2">
        {!showCreateForm && (
          <button
            className="btn btn-link text-muted btn-sm w-100"
            onClick={() => setShowCreateForm(true)}
          >
            <i className="fas fa-plus me-1"></i>
            Agregar otra tarea
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn; 