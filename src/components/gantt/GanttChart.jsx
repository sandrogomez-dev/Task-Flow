import React, { useState, useMemo, useRef } from 'react';
import { format, addDays, differenceInDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente: GanttChart
 * Props:
 * - tasks: Array<{
 *     id: string,
 *     title: string,
 *     start: Date,
 *     end: Date,
 *     progress: number,
 *     dependencies?: string[]
 *   }>
 * - onDateChange: function(taskId, newStart, newEnd)
 * 
 * Requerimientos:
 * - Visualización de timeline con barras de progreso
 * - Capacidad de arrastrar para ajustar fechas
 * - Mostrar dependencias entre tareas
 * - Zoom in/out para diferentes escalas de tiempo
 */
const GanttChart = ({ tasks = [], onDateChange }) => {
  const [zoomLevel, setZoomLevel] = useState('week'); // day, week, month
  const [viewStart, setViewStart] = useState(new Date());
  const [draggedTask, setDraggedTask] = useState(null);
  const chartRef = useRef(null);

  // Configuración de zoom
  const zoomConfig = {
    day: { days: 30, cellWidth: 40, format: 'dd MMM' },
    week: { days: 84, cellWidth: 60, format: 'dd MMM' }, // 12 semanas
    month: { days: 365, cellWidth: 80, format: 'MMM yyyy' }
  };

  const config = zoomConfig[zoomLevel];

  // Calcular fechas del timeline
  const timelineDates = useMemo(() => {
    const dates = [];
    const start = zoomLevel === 'week' ? startOfWeek(viewStart) : viewStart;
    
    for (let i = 0; i < config.days; i += (zoomLevel === 'week' ? 7 : 1)) {
      dates.push(addDays(start, i));
    }
    return dates;
  }, [viewStart, zoomLevel, config.days]);

  // Calcular posición y ancho de las barras de tareas
  const getTaskBarStyle = (task) => {
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);
    const timelineStart = timelineDates[0];
    
    const startOffset = differenceInDays(startDate, timelineStart);
    const duration = differenceInDays(endDate, startDate) + 1;
    
    const left = Math.max(0, startOffset * (config.cellWidth / (zoomLevel === 'week' ? 7 : 1)));
    const width = Math.max(20, duration * (config.cellWidth / (zoomLevel === 'week' ? 7 : 1)));
    
    return {
      left: `${left}px`,
      width: `${width}px`,
      backgroundColor: getTaskColor(task),
      opacity: task.progress === 100 ? 0.8 : 1
    };
  };

  // Obtener color de la tarea basado en prioridad o estado
  const getTaskColor = (task) => {
    if (task.progress === 100) return '#198754'; // Verde para completadas
    if (task.priority === 'high') return '#dc3545'; // Rojo para alta prioridad
    if (task.priority === 'medium') return '#fd7e14'; // Naranja para media
    return '#4a6fa5'; // Azul por defecto
  };

  // Manejar inicio de drag
  const handleMouseDown = (e, task, type) => {
    e.preventDefault();
    setDraggedTask(task);
    
    const rect = chartRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    
    const handleMouseMove = (moveEvent) => {
      const currentX = moveEvent.clientX - rect.left;
      const deltaX = currentX - startX;
      const daysDelta = Math.round(deltaX / (config.cellWidth / (zoomLevel === 'week' ? 7 : 1)));
      
      if (daysDelta !== 0) {
        updateTaskDates(task, type, daysDelta);
      }
    };
    
    const handleMouseUp = () => {
      setDraggedTask(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Actualizar fechas de la tarea
  const updateTaskDates = (task, type, daysDelta) => {
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);
    
    let newStart = startDate;
    let newEnd = endDate;
    
    switch (type) {
      case 'move':
        newStart = addDays(startDate, daysDelta);
        newEnd = addDays(endDate, daysDelta);
        break;
      case 'resize-start':
        newStart = addDays(startDate, daysDelta);
        if (newStart >= endDate) {
          newStart = addDays(endDate, -1);
        }
        break;
      case 'resize-end':
        newEnd = addDays(endDate, daysDelta);
        if (newEnd <= startDate) {
          newEnd = addDays(startDate, 1);
        }
        break;
      default:
        // No hacer nada para casos no manejados
        break;
    }
    
    if (onDateChange) {
      onDateChange(task.id, newStart, newEnd);
    }
  };

  // Cambiar nivel de zoom
  const handleZoomChange = (newZoom) => {
    setZoomLevel(newZoom);
  };

  // Navegar en el tiempo
  const navigateTime = (direction) => {
    const days = direction === 'prev' ? -config.days / 4 : config.days / 4;
    setViewStart(prev => addDays(prev, days));
  };

  // Ir a hoy
  const goToToday = () => {
    setViewStart(new Date());
  };

  return (
    <div className="gantt-container">
      {/* Header con controles */}
      <div className="gantt-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0 text-dark-custom">
            <i className="fas fa-chart-gantt me-2"></i>
            Gráfico Gantt
          </h5>
          
          {/* Controles de navegación */}
          <div className="btn-group" role="group">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigateTime('prev')}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={goToToday}
            >
              Hoy
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigateTime('next')}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Controles de zoom */}
        <div className="btn-group" role="group">
          {Object.keys(zoomConfig).map(zoom => (
            <button
              key={zoom}
              className={`btn btn-sm ${zoomLevel === zoom ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleZoomChange(zoom)}
            >
              {zoom === 'day' ? 'Día' : zoom === 'week' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="gantt-content" style={{ overflowX: 'auto' }}>
        <div className="gantt-grid" ref={chartRef}>
          {/* Header del timeline */}
          <div className="gantt-timeline-header d-flex border-bottom bg-light">
            <div className="gantt-task-column" style={{ minWidth: '250px', padding: '10px' }}>
              <strong>Tarea</strong>
            </div>
            <div className="gantt-timeline-dates d-flex">
              {timelineDates.map((date, index) => (
                <div
                  key={index}
                  className="gantt-date-cell border-start text-center py-2"
                  style={{ minWidth: `${config.cellWidth}px` }}
                >
                  <small>{format(date, config.format, { locale: es })}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Filas de tareas */}
          {tasks.map((task, taskIndex) => (
            <div key={task.id} className="gantt-task-row d-flex border-bottom">
              {/* Columna de información de la tarea */}
              <div className="gantt-task-info" style={{ minWidth: '250px', padding: '10px' }}>
                <div className="d-flex align-items-center">
                  <div className="task-info-content">
                    <div className="fw-medium">{task.title}</div>
                    <div className="small text-muted">
                      {format(new Date(task.start), 'dd/MM/yyyy')} - {format(new Date(task.end), 'dd/MM/yyyy')}
                    </div>
                    {task.progress !== undefined && (
                      <div className="progress mt-1" style={{ height: '4px' }}>
                        <div
                          className="progress-bar"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline de la tarea */}
              <div className="gantt-task-timeline position-relative" style={{ minHeight: '60px' }}>
                {/* Grid de fechas */}
                <div className="gantt-timeline-grid d-flex h-100">
                  {timelineDates.map((date, index) => (
                    <div
                      key={index}
                      className="gantt-grid-cell border-start"
                      style={{ minWidth: `${config.cellWidth}px` }}
                    ></div>
                  ))}
                </div>

                {/* Barra de la tarea */}
                <div
                  className="gantt-task-bar position-absolute d-flex align-items-center"
                  style={{
                    ...getTaskBarStyle(task),
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '24px',
                    cursor: 'move',
                    zIndex: draggedTask?.id === task.id ? 10 : 1
                  }}
                  onMouseDown={(e) => handleMouseDown(e, task, 'move')}
                >
                  {/* Handle de redimensión izquierdo */}
                  <div
                    className="resize-handle resize-handle-left"
                    style={{
                      position: 'absolute',
                      left: '-3px',
                      top: '0',
                      width: '6px',
                      height: '100%',
                      cursor: 'ew-resize',
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, task, 'resize-start');
                    }}
                  ></div>

                  {/* Contenido de la barra */}
                  <div className="task-bar-content px-2 text-white small text-truncate">
                    {task.title}
                  </div>

                  {/* Barra de progreso dentro de la tarea */}
                  {task.progress !== undefined && task.progress > 0 && (
                    <div
                      className="task-progress-overlay"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${task.progress}%`,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 'inherit'
                      }}
                    ></div>
                  )}

                  {/* Handle de redimensión derecho */}
                  <div
                    className="resize-handle resize-handle-right"
                    style={{
                      position: 'absolute',
                      right: '-3px',
                      top: '0',
                      width: '6px',
                      height: '100%',
                      cursor: 'ew-resize',
                      backgroundColor: 'rgba(255,255,255,0.8)'
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, task, 'resize-end');
                    }}
                  ></div>
                </div>

                {/* Líneas de dependencias (simplificado) */}
                {task.dependencies && task.dependencies.length > 0 && (
                  <div className="task-dependencies">
                    {/* Aquí se pueden agregar líneas SVG para mostrar dependencias */}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Línea de hoy */}
          <div
            className="today-line position-absolute"
            style={{
              left: `${250 + (differenceInDays(new Date(), timelineDates[0]) * (config.cellWidth / (zoomLevel === 'week' ? 7 : 1)))}px`,
              top: '0',
              bottom: '0',
              width: '2px',
              backgroundColor: '#dc3545',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          ></div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="gantt-legend p-3 border-top bg-light">
        <div className="d-flex gap-4 small">
          <div className="d-flex align-items-center">
            <div className="legend-color me-2" style={{ width: '12px', height: '12px', backgroundColor: '#4a6fa5' }}></div>
            Normal
          </div>
          <div className="d-flex align-items-center">
            <div className="legend-color me-2" style={{ width: '12px', height: '12px', backgroundColor: '#fd7e14' }}></div>
            Prioridad Media
          </div>
          <div className="d-flex align-items-center">
            <div className="legend-color me-2" style={{ width: '12px', height: '12px', backgroundColor: '#dc3545' }}></div>
            Prioridad Alta
          </div>
          <div className="d-flex align-items-center">
            <div className="legend-color me-2" style={{ width: '12px', height: '12px', backgroundColor: '#198754' }}></div>
            Completada
          </div>
          <div className="d-flex align-items-center">
            <div style={{ width: '2px', height: '12px', backgroundColor: '#dc3545' }} className="me-2"></div>
            Hoy
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart; 