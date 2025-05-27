import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

const Reports = () => {
  const { state } = useApp();
  const { projects, tasks } = state;
  const [selectedProject, setSelectedProject] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  // Calculate analytics data
  const analytics = useMemo(() => {
    const filteredTasks = selectedProject === 'all' 
      ? tasks 
      : tasks.filter(task => task.projectId === selectedProject);

    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.columnId === 'done').length;
    const inProgressTasks = filteredTasks.filter(task => task.columnId === 'in-progress').length;
    const pendingTasks = filteredTasks.filter(task => task.columnId === 'todo').length;
    
    const totalTimeSpent = filteredTasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
    const avgTimePerTask = totalTasks > 0 ? totalTimeSpent / totalTasks : 0;
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Priority distribution
    const priorityStats = {
      high: filteredTasks.filter(task => task.priority === 'high').length,
      medium: filteredTasks.filter(task => task.priority === 'medium').length,
      low: filteredTasks.filter(task => task.priority === 'low').length
    };

    // Tasks by status for chart
    const statusData = [
      { name: 'Pendientes', value: pendingTasks, color: '#6c757d' },
      { name: 'En Progreso', value: inProgressTasks, color: '#ffc107' },
      { name: 'Completadas', value: completedTasks, color: '#198754' }
    ];

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      totalTimeSpent,
      avgTimePerTask,
      completionRate,
      priorityStats,
      statusData
    };
  }, [tasks, selectedProject]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get recent activity
  const recentActivity = useMemo(() => {
    return tasks
      .filter(task => task.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10);
  }, [tasks]);

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Reportes y Análisis</h1>
          <p className="text-muted mb-0">Visualiza el rendimiento de tus proyectos</p>
        </div>
        
        {/* Filters */}
        <div className="d-flex gap-3">
          <select
            className="form-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">Todos los proyectos</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          
          <select
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <i className="fas fa-tasks text-primary fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="h4 mb-0">{analytics.totalTasks}</div>
                  <div className="text-muted small">Total de Tareas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 rounded p-3">
                    <i className="fas fa-check-circle text-success fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="h4 mb-0">{analytics.completionRate.toFixed(1)}%</div>
                  <div className="text-muted small">Tasa de Completado</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 rounded p-3">
                    <i className="fas fa-clock text-info fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="h4 mb-0">{formatTime(analytics.totalTimeSpent)}</div>
                  <div className="text-muted small">Tiempo Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 rounded p-3">
                    <i className="fas fa-chart-line text-warning fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="h4 mb-0">{formatTime(analytics.avgTimePerTask)}</div>
                  <div className="text-muted small">Promedio por Tarea</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Status Distribution Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Distribución de Tareas por Estado
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                {analytics.statusData.map((item, index) => (
                  <div key={index} className="col-4 mb-3">
                    <div className="position-relative">
                      <div 
                        className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          backgroundColor: item.color + '20',
                          border: `3px solid ${item.color}`
                        }}
                      >
                        <span className="h4 mb-0" style={{ color: item.color }}>
                          {item.value}
                        </span>
                      </div>
                      <div className="fw-bold">{item.name}</div>
                      <div className="text-muted small">
                        {analytics.totalTasks > 0 ? ((item.value / analytics.totalTasks) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress bars */}
              <div className="mt-4">
                {analytics.statusData.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small">{item.name}</span>
                      <span className="small">{item.value} tareas</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${analytics.totalTasks > 0 ? (item.value / analytics.totalTasks) * 100 : 0}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="card-title mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Distribución por Prioridad
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">Alta Prioridad</span>
                  <span className="small text-danger">{analytics.priorityStats.high}</span>
                </div>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-danger" 
                    style={{ width: `${analytics.totalTasks > 0 ? (analytics.priorityStats.high / analytics.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">Media Prioridad</span>
                  <span className="small text-warning">{analytics.priorityStats.medium}</span>
                </div>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${analytics.totalTasks > 0 ? (analytics.priorityStats.medium / analytics.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small">Baja Prioridad</span>
                  <span className="small text-success">{analytics.priorityStats.low}</span>
                </div>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${analytics.totalTasks > 0 ? (analytics.priorityStats.low / analytics.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h5 className="card-title mb-0">
                <i className="fas fa-history me-2"></i>
                Actividad Reciente
              </h5>
            </div>
            <div className="card-body">
              {recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-2x text-muted mb-3"></i>
                  <p className="text-muted">No hay actividad reciente</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Tarea</th>
                        <th>Proyecto</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Última Actualización</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((task) => {
                        const project = projects.find(p => p.id === task.projectId);
                        return (
                          <tr key={task.id}>
                            <td>
                              <div className="fw-bold">{task.title}</div>
                              <div className="text-muted small">{task.description}</div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {project?.name || 'Sin proyecto'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${
                                task.columnId === 'done' ? 'bg-success' :
                                task.columnId === 'in-progress' ? 'bg-warning' : 'bg-secondary'
                              }`}>
                                {task.columnId === 'done' ? 'Completada' :
                                 task.columnId === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${
                                task.priority === 'high' ? 'bg-danger' :
                                task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                              }`}>
                                {task.priority === 'high' ? 'Alta' :
                                 task.priority === 'medium' ? 'Media' : 'Baja'}
                              </span>
                            </td>
                            <td className="text-muted small">
                              {task.updatedAt ? formatDate(task.updatedAt) : 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 