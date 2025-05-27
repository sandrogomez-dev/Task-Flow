import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Estado inicial
const initialState = {
  user: null,
  projects: [],
  currentProject: null,
  tasks: [],
  columns: [
    { id: 'todo', title: 'Por Hacer', color: '#6c757d' },
    { id: 'in-progress', title: 'En Progreso', color: '#ffc107' },
    { id: 'review', title: 'En Revisión', color: '#fd7e14' },
    { id: 'done', title: 'Completado', color: '#198754' }
  ],
  loading: false,
  error: null,
  notifications: [],
  settings: {
    theme: 'light',
    notifications: true,
    autoSave: true
  }
};

// Tipos de acciones
export const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_PROJECTS: 'SET_PROJECTS',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  MOVE_TASK: 'MOVE_TASK',
  SET_COLUMNS: 'SET_COLUMNS',
  ADD_COLUMN: 'ADD_COLUMN',
  UPDATE_COLUMN: 'UPDATE_COLUMN',
  DELETE_COLUMN: 'DELETE_COLUMN',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case actionTypes.SET_USER:
      return { ...state, user: action.payload };

    case actionTypes.LOGOUT:
      return { 
        ...initialState,
        settings: state.settings 
      };

    case actionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload };

    case actionTypes.ADD_PROJECT:
      return { 
        ...state, 
        projects: [...state.projects, action.payload] 
      };

    case actionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
        currentProject: state.currentProject?.id === action.payload.id 
          ? action.payload 
          : state.currentProject
      };

    case actionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload 
          ? null 
          : state.currentProject
      };

    case actionTypes.SET_CURRENT_PROJECT:
      return { ...state, currentProject: action.payload };

    case actionTypes.SET_TASKS:
      return { ...state, tasks: action.payload };

    case actionTypes.ADD_TASK:
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload] 
      };

    case actionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };

    case actionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case actionTypes.MOVE_TASK:
      const { taskId, toColumnId, newIndex } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === taskId 
            ? { ...task, columnId: toColumnId, order: newIndex }
            : task
        )
      };

    case actionTypes.SET_COLUMNS:
      return { ...state, columns: action.payload };

    case actionTypes.ADD_COLUMN:
      return { 
        ...state, 
        columns: [...state.columns, action.payload] 
      };

    case actionTypes.UPDATE_COLUMN:
      return {
        ...state,
        columns: state.columns.map(column =>
          column.id === action.payload.id ? action.payload : column
        )
      };

    case actionTypes.DELETE_COLUMN:
      return {
        ...state,
        columns: state.columns.filter(column => column.id !== action.payload)
      };

    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };

    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };

    case actionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    default:
      return state;
  }
};

// Contexto
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Efectos para persistencia local
  useEffect(() => {
    const savedSettings = localStorage.getItem('taskflow-settings');
    if (savedSettings) {
      dispatch({
        type: actionTypes.UPDATE_SETTINGS,
        payload: JSON.parse(savedSettings)
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskflow-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    state.notifications.forEach(notification => {
      if (notification.autoRemove !== false) {
        setTimeout(() => {
          dispatch({
            type: actionTypes.REMOVE_NOTIFICATION,
            payload: notification.id
          });
        }, 5000);
      }
    });
  }, [state.notifications]);

  // Funciones helper
  const showNotification = (message, type = 'info', autoRemove = true) => {
    dispatch({
      type: actionTypes.ADD_NOTIFICATION,
      payload: { message, type, autoRemove }
    });
  };

  const setLoading = (loading) => {
    dispatch({
      type: actionTypes.SET_LOADING,
      payload: loading
    });
  };

  const setError = (error) => {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: error
    });
    
    if (error) {
      showNotification(error, 'error');
    }
  };

  const clearError = () => {
    dispatch({
      type: actionTypes.CLEAR_ERROR
    });
  };

  // Funciones de proyectos
  const setCurrentProject = (project) => {
    dispatch({
      type: actionTypes.SET_CURRENT_PROJECT,
      payload: project
    });
    
    if (project) {
      // Cargar tareas del proyecto
      const projectTasks = state.tasks.filter(task => task.projectId === project.id);
      if (projectTasks.length === 0) {
        // Aquí se cargarían las tareas desde la API
        loadProjectTasks(project.id);
      }
    }
  };

  const addProject = (project) => {
    dispatch({
      type: actionTypes.ADD_PROJECT,
      payload: project
    });
    showNotification('Proyecto creado exitosamente', 'success');
  };

  const updateProject = (projectId, updatedData) => {
    dispatch({
      type: actionTypes.UPDATE_PROJECT,
      payload: { id: projectId, ...updatedData }
    });
    showNotification('Proyecto actualizado exitosamente', 'success');
  };

  const deleteProject = (projectId) => {
    dispatch({
      type: actionTypes.DELETE_PROJECT,
      payload: projectId
    });
    showNotification('Proyecto eliminado exitosamente', 'success');
  };

  // Funciones de usuario
  const updateUser = (userData) => {
    dispatch({
      type: actionTypes.SET_USER,
      payload: userData
    });
    showNotification('Perfil actualizado exitosamente', 'success');
  };

  // Alias para showNotification para compatibilidad
  const addNotification = (message, type = 'info', autoRemove = true) => {
    showNotification(message, type, autoRemove);
  };

  const loadProjectTasks = async (projectId) => {
    setLoading(true);
    try {
      // Simular carga de tareas (aquí iría la llamada a la API)
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Configurar proyecto',
          description: 'Configurar la estructura inicial del proyecto',
          columnId: 'done',
          projectId: projectId,
          assignee: 'John Doe',
          priority: 'medium',
          dueDate: new Date('2024-01-15'),
          createdAt: new Date('2024-01-01'),
          timeSpent: 7200, // 2 horas en segundos
          tags: ['setup', 'inicial']
        },
        {
          id: 'task-2',
          title: 'Implementar tablero Kanban',
          description: 'Crear componente de tablero Kanban con drag and drop',
          columnId: 'in-progress',
          projectId: projectId,
          assignee: 'Jane Smith',
          priority: 'high',
          dueDate: new Date('2024-01-20'),
          createdAt: new Date('2024-01-05'),
          timeSpent: 14400, // 4 horas en segundos
          tags: ['desarrollo', 'kanban']
        },
        {
          id: 'task-3',
          title: 'Diseñar gráfico Gantt',
          description: 'Crear componente de gráfico Gantt interactivo',
          columnId: 'todo',
          projectId: projectId,
          assignee: 'Bob Johnson',
          priority: 'medium',
          dueDate: new Date('2024-01-25'),
          createdAt: new Date('2024-01-10'),
          timeSpent: 0,
          tags: ['diseño', 'gantt']
        }
      ];

      dispatch({
        type: actionTypes.SET_TASKS,
        payload: mockTasks
      });
    } catch (error) {
      setError('Error al cargar las tareas del proyecto');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    state,
    dispatch,
    // Helper functions
    showNotification,
    addNotification,
    setLoading,
    setError,
    clearError,
    setCurrentProject,
    loadProjectTasks,
    addProject,
    updateProject,
    deleteProject,
    updateUser,
    // Action types for external use
    actionTypes
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

export default AppContext; 