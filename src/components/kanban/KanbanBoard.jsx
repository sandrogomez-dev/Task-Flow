import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { 
  restrictToVerticalAxis,
  restrictToWindowEdges 
} from '@dnd-kit/modifiers';

import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { useApp } from '../../contexts/AppContext';
import useRealTimeUpdates from '../../hooks/useRealTimeUpdates';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Componente: KanbanBoard
 * Props:
 * - projectId: string (ID del proyecto)
 * - columns: Array<{id: string, title: string, tasks: Array<Task>}>
 * - onTaskMove: function(taskId, fromColumnId, toColumnId)
 * - onTaskCreate: function(columnId, taskContent)
 * 
 * Requerimientos:
 * - Drag and drop de tareas entre columnas
 * - Animaciones fluidas al mover tareas
 * - Responsive (debe funcionar en móviles)
 * - Estilo con Bootstrap pero customizado
 */
const KanbanBoard = ({ 
  projectId, 
  onTaskMove, 
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete 
}) => {
  const { state, dispatch, actionTypes } = useApp();
  const { columns, tasks, loading } = state;
  const [activeTask, setActiveTask] = useState(null);
  
  // Hook para tiempo real
  const {
    emitTaskMove,
    emitTaskCreate,
    emitTaskUpdate,
    emitTaskDelete,
    isConnected
  } = useRealTimeUpdates(projectId);

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filtrar tareas por proyecto actual
  const projectTasks = useMemo(() => {
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks, projectId]);

  // Organizar tareas por columnas
  const tasksByColumn = useMemo(() => {
    const organized = {};
    columns.forEach(column => {
      organized[column.id] = projectTasks
        .filter(task => task.columnId === column.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    });
    return organized;
  }, [columns, projectTasks]);

  // Manejar inicio de drag
  const handleDragStart = (event) => {
    const { active } = event;
    const task = projectTasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  // Manejar fin de drag
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = projectTasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    let newColumnId = activeTask.columnId;
    let newIndex = activeTask.order || 0;

    // Determinar si se soltó sobre una columna o una tarea
    const overColumn = columns.find(col => col.id === overId);
    const overTask = projectTasks.find(t => t.id === overId);

    if (overColumn) {
      // Se soltó sobre una columna
      newColumnId = overColumn.id;
      const columnTasks = tasksByColumn[newColumnId];
      newIndex = columnTasks.length;
    } else if (overTask) {
      // Se soltó sobre una tarea
      newColumnId = overTask.columnId;
      const columnTasks = tasksByColumn[newColumnId];
      const overIndex = columnTasks.findIndex(t => t.id === overId);
      newIndex = overIndex >= 0 ? overIndex : columnTasks.length;
    }

    // Solo mover si cambió algo
    if (newColumnId !== activeTask.columnId || newIndex !== activeTask.order) {
      const fromColumnId = activeTask.columnId;
      
      // Actualizar orden de tareas en la columna de destino
      const destinationTasks = tasksByColumn[newColumnId];
      // Reordenar tareas si es necesario (para futuras implementaciones)
      arrayMove(
        destinationTasks.filter(t => t.id !== active.id),
        destinationTasks.findIndex(t => t.id === active.id),
        newIndex
      );

      // Dispatch local inmediato para UX responsiva
      dispatch({
        type: actionTypes.MOVE_TASK,
        payload: {
          taskId: active.id,
          fromColumnId,
          toColumnId: newColumnId,
          newIndex
        }
      });

      // Emitir evento en tiempo real
      emitTaskMove(active.id, fromColumnId, newColumnId, newIndex);

      // Callback opcional
      if (onTaskMove) {
        onTaskMove(active.id, fromColumnId, newColumnId, newIndex);
      }
    }
  };

  // Manejar durante el drag (opcional para feedback visual)
  const handleDragOver = (event) => {
    const { over } = event;
    
    if (!over) return;

    // Aquí se puede agregar lógica adicional para feedback visual
    // durante el drag, como highlight de columnas de destino
  };

  // Manejar creación de nueva tarea
  const handleTaskCreate = (columnId, taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      columnId,
      projectId,
      order: tasksByColumn[columnId].length,
      createdAt: new Date(),
      timeSpent: 0
    };

    // Dispatch local
    dispatch({
      type: actionTypes.ADD_TASK,
      payload: newTask
    });

    // Emitir evento en tiempo real
    emitTaskCreate(newTask);

    // Callback opcional
    if (onTaskCreate) {
      onTaskCreate(columnId, newTask);
    }
  };

  // Manejar actualización de tarea
  const handleTaskUpdate = (taskId, updates) => {
    const updatedTask = {
      ...projectTasks.find(t => t.id === taskId),
      ...updates,
      updatedAt: new Date()
    };

    // Dispatch local
    dispatch({
      type: actionTypes.UPDATE_TASK,
      payload: updatedTask
    });

    // Emitir evento en tiempo real
    emitTaskUpdate(updatedTask);

    // Callback opcional
    if (onTaskUpdate) {
      onTaskUpdate(taskId, updates);
    }
  };

  // Manejar eliminación de tarea
  const handleTaskDelete = (taskId) => {
    // Dispatch local
    dispatch({
      type: actionTypes.DELETE_TASK,
      payload: taskId
    });

    // Emitir evento en tiempo real
    emitTaskDelete(taskId);

    // Callback opcional
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <LoadingSpinner 
          variant="dots" 
          size="lg" 
          text="Cargando tablero..." 
          color="primary"
        />
      </div>
    );
  }

  return (
    <div className="kanban-board-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-dark-custom mb-0">
          Tablero Kanban
        </h2>
        <div className="d-flex align-items-center gap-2">
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className={`badge ${isConnected ? 'bg-success' : 'bg-warning'}`}>
              {isConnected ? 'Conectado' : 'Sin conexión'}
            </span>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <div className="kanban-board">
          {columns.map((column) => (
            <div key={column.id} className="kanban-column-wrapper">
              <KanbanColumn
                column={column}
                tasks={tasksByColumn[column.id] || []}
                onTaskCreate={(taskData) => handleTaskCreate(column.id, taskData)}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="task-drag-overlay">
              <TaskCard
                task={activeTask}
                isDragging={true}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard; 