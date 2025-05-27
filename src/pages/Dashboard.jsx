import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import KanbanBoard from '../components/kanban/KanbanBoard';
import GanttChart from '../components/gantt/GanttChart';
import TimeTracker from '../components/ui/TimeTracker';
import ProjectCreateModal from '../components/ui/ProjectCreateModal';

const Dashboard = () => {
  const { state, setCurrentProject, dispatch, actionTypes } = useApp();
  const { user, projects, currentProject, tasks, loading } = state;
  const [activeView, setActiveView] = useState('kanban'); // kanban, gantt, overview
  const [selectedTask, setSelectedTask] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Debug logs
  console.log('Dashboard - Estado actual:', {
    projectsCount: projects.length,
    currentProject: currentProject,
    tasksCount: tasks.length
  });

  // Cargar proyecto por defecto al montar
  useEffect(() => {
    if (projects.length === 0 && !currentProject) {
      // Crear un proyecto de ejemplo si no hay ninguno
      const defaultProject = {
        id: 'project-demo-1',
        name: 'Proyecto Demo TaskFlow',
        description: 'Proyecto de demostración de TaskFlow con tareas de ejemplo',
        createdAt: new Date(),
        status: 'active',
        template: 'software'
      };
      
      console.log('Creando proyecto demo automáticamente');
      setCurrentProject(defaultProject);
      
      // También agregarlo a la lista de proyectos
      dispatch({
        type: actionTypes.ADD_PROJECT,
        payload: defaultProject
      });
    } else if (projects.length > 0 && !currentProject) {
      // Si hay proyectos pero no hay uno actual, seleccionar el primero
      console.log('Seleccionando primer proyecto disponible');
      setCurrentProject(projects[0]);
    }
  }, [projects, currentProject, setCurrentProject, dispatch, actionTypes.ADD_PROJECT]);

  // Estadísticas del proyecto actual
  const projectStats = React.useMemo(() => {
    if (!currentProject) return null;

    const projectTasks = tasks.filter(task => task.projectId === currentProject.id);
    const completedTasks = projectTasks.filter(task => task.columnId === 'done');
    const inProgressTasks = projectTasks.filter(task => task.columnId === 'in-progress');
    const totalTimeSpent = projectTasks.reduce((total, task) => total + (task.timeSpent || 0), 0);

    return {
      total: projectTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      pending: projectTasks.filter(task => task.columnId === 'todo').length,
      completionRate: projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0,
      totalTimeSpent
    };
  }, [tasks, currentProject]);

  const formatTimeSpent = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleTaskTimeUpdate = (taskId, timeSpent) => {
    // Aquí se actualizaría el tiempo en la tarea
    console.log(`Actualizando tiempo de tarea ${taskId}: ${timeSpent} segundos`);
  };

  const handleCreateProject = () => {
    setShowProjectModal(true);
  };

  const handleProjectCreated = (newProject) => {
    // El proyecto ya se agrega automáticamente en el modal
    // Aquí podríamos hacer acciones adicionales si es necesario
    console.log('Proyecto creado:', newProject);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="loading-spinner"></div>
        <span className="ms-2">Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header del Dashboard */}
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="text-dark-custom mb-1">
              ¡Bienvenido{user ? `, ${user.name}` : ''}!
            </h1>
            <p className="text-muted mb-0">
              {currentProject ? `Trabajando en: ${currentProject.name}` : 'Selecciona un proyecto para comenzar'}
            </p>
          </div>
          
          {/* Selector de vista */}
          <div className="btn-group" role="group">
            <button
              className={`btn ${activeView === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveView('overview')}
            >
              <i className="fas fa-chart-pie me-1"></i>
              Resumen
            </button>
            <button
              className={`btn ${activeView === 'kanban' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveView('kanban')}
            >
              <i className="fas fa-columns me-1"></i>
              Kanban
            </button>
            <button
              className={`btn ${activeView === 'gantt' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveView('gantt')}
            >
              <i className="fas fa-chart-gantt me-1"></i>
              Gantt
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas del proyecto */}
      {projectStats && activeView === 'overview' && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="display-6 text-primary mb-2">{projectStats.total}</div>
                <h6 className="card-title text-muted">Total de Tareas</h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="display-6 text-success mb-2">{projectStats.completed}</div>
                <h6 className="card-title text-muted">Completadas</h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="display-6 text-warning mb-2">{projectStats.inProgress}</div>
                <h6 className="card-title text-muted">En Progreso</h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="display-6 text-info mb-2">{projectStats.completionRate}%</div>
                <h6 className="card-title text-muted">Completado</h6>
                <div className="progress mt-2" style={{ height: '4px' }}>
                  <div 
                    className="progress-bar bg-info" 
                    style={{ width: `${projectStats.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Resumen */}
      {activeView === 'overview' && (
        <div className="row">
          {/* Gráfico de progreso */}
          <div className="col-lg-8 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Progreso del Proyecto
                </h5>
              </div>
              <div className="card-body">
                {projectStats && (
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="mb-3">
                        <div className="h4 text-secondary">{projectStats.pending}</div>
                        <small className="text-muted">Pendientes</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="mb-3">
                        <div className="h4 text-warning">{projectStats.inProgress}</div>
                        <small className="text-muted">En Progreso</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="mb-3">
                        <div className="h4 text-success">{projectStats.completed}</div>
                        <small className="text-muted">Completadas</small>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <h6>Tiempo Total Invertido</h6>
                  <div className="h5 text-primary">
                    {projectStats ? formatTimeSpent(projectStats.totalTimeSpent) : '0h'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Tracker */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-stopwatch me-2"></i>
                  Cronómetro
                </h5>
              </div>
              <div className="card-body">
                <TimeTracker
                  taskId={selectedTask?.id}
                  initialTime={selectedTask?.timeSpent || 0}
                  onSave={handleTaskTimeUpdate}
                />
                
                {!selectedTask && (
                  <div className="text-center text-muted mt-3">
                    <small>Selecciona una tarea para comenzar a cronometrar</small>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tareas recientes */}
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-tasks me-2"></i>
                  Tareas Recientes
                </h5>
              </div>
              <div className="card-body">
                {tasks.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {tasks.slice(0, 5).map(task => (
                      <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{task.title}</h6>
                          <small className="text-muted">
                            {task.assignee && `Asignado a: ${task.assignee} • `}
                            Columna: {task.columnId}
                          </small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge bg-${
                            task.priority === 'high' ? 'danger' : 
                            task.priority === 'medium' ? 'warning' : 'success'
                          }`}>
                            {task.priority === 'high' ? 'Alta' : 
                             task.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedTask(task)}
                          >
                            <i className="fas fa-play"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
                    <p>No hay tareas en este proyecto</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista Kanban */}
      {activeView === 'kanban' && currentProject && (
        <div className="kanban-view">
          <KanbanBoard
            projectId={currentProject.id}
            onTaskMove={(taskId, fromColumn, toColumn) => {
              console.log(`Tarea ${taskId} movida de ${fromColumn} a ${toColumn}`);
            }}
            onTaskCreate={(columnId, taskData) => {
              console.log(`Nueva tarea creada en ${columnId}:`, taskData);
            }}
          />
        </div>
      )}

      {/* Vista Gantt */}
      {activeView === 'gantt' && currentProject && (
        <div className="gantt-view">
          <GanttChart
            tasks={tasks.filter(task => task.projectId === currentProject.id).map(task => ({
              ...task,
              start: task.createdAt || new Date(),
              end: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días por defecto
              progress: task.columnId === 'done' ? 100 : 
                       task.columnId === 'in-progress' ? 50 : 0
            }))}
            onDateChange={(taskId, newStart, newEnd) => {
              console.log(`Fechas actualizadas para tarea ${taskId}:`, { newStart, newEnd });
            }}
          />
        </div>
      )}

      {/* Mensaje cuando no hay proyecto seleccionado */}
      {!currentProject && (
        <div className="text-center py-5">
          <i className="fas fa-project-diagram fa-4x text-muted mb-4"></i>
          <h3 className="text-muted">No hay proyecto seleccionado</h3>
          <p className="text-muted">Selecciona o crea un proyecto para comenzar a trabajar</p>
          <button 
            className="btn btn-primary"
            onClick={handleCreateProject}
          >
            <i className="fas fa-plus me-2"></i>
            Crear Nuevo Proyecto
          </button>
        </div>
      )}

      {/* Modal para crear proyecto */}
      <ProjectCreateModal
        show={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Dashboard; 