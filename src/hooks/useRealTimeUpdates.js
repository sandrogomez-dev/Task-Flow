import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useApp } from '../contexts/AppContext';

// URL del servidor Socket.IO (configurar según el entorno)
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

// Flag para habilitar/deshabilitar conexiones WebSocket
const ENABLE_REAL_TIME = process.env.REACT_APP_ENABLE_REAL_TIME === 'true' || false;

const useRealTimeUpdates = (projectId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  
  const { dispatch, actionTypes, showNotification } = useApp();

  // Función helper para obtener el ID del usuario actual
  const getCurrentUserId = useCallback(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 'anonymous';
  }, []);

  // Inicializar conexión Socket.IO
  useEffect(() => {
    // Si no está habilitado el tiempo real o no hay projectId, no intentar conectar
    if (!ENABLE_REAL_TIME || !projectId || maxAttemptsReached) {
      console.log('⏸️ Conexiones en tiempo real deshabilitadas');
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionDelay: 2000,
      reconnectionAttempts: 3,
      maxReconnectionAttempts: 3,
      timeout: 10000,
      query: {
        projectId: projectId
      }
    });

    setSocket(newSocket);

    // Event listeners para conexión
    newSocket.on('connect', () => {
      console.log('🔗 Conectado al servidor Socket.IO');
      setIsConnected(true);
      setConnectionAttempts(0);
      setMaxAttemptsReached(false);
      
      // Unirse al room del proyecto
      newSocket.emit('join-project', {
        projectId: projectId,
        user: JSON.parse(localStorage.getItem('user') || '{}')
      });
      
      showNotification('Conectado al proyecto en tiempo real', 'success');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Desconectado del servidor Socket.IO:', reason);
      setIsConnected(false);
      
      // Solo mostrar notificación si no fue desconexión manual
      if (reason !== 'io client disconnect') {
        showNotification('Conexión perdida - trabajando en modo local', 'warning');
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error);
      setIsConnected(false);
      setConnectionAttempts(prev => prev + 1);
      
      // Solo mostrar error las primeras veces, después deshabilitar
      if (connectionAttempts < 2) {
        showNotification('Error de conexión - trabajando en modo local', 'warning');
      } else if (connectionAttempts >= 2) {
        console.log('🚫 Máximo de intentos de conexión alcanzado. Deshabilitando reconexión.');
        setMaxAttemptsReached(true);
        newSocket.disconnect();
        showNotification('Servidor no disponible - continuando en modo local', 'info');
      }
    });

    newSocket.on('reconnect_failed', () => {
      console.log('🚫 Falló la reconexión después de varios intentos');
      setMaxAttemptsReached(true);
      setIsConnected(false);
      showNotification('No se pudo conectar al servidor - continuando en modo local', 'info');
    });

    // Event listeners para usuarios online
    newSocket.on('users-online', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('user-joined', (user) => {
      setOnlineUsers(prev => [...prev, user]);
      showNotification(`${user.name} se unió al proyecto`, 'info');
    });

    newSocket.on('user-left', (userId) => {
      setOnlineUsers(prev => prev.filter(user => user.id !== userId));
    });

    // Event listeners para tareas
    newSocket.on('task-created', (task) => {
      console.log('📝 Nueva tarea creada:', task);
      dispatch({
        type: actionTypes.ADD_TASK,
        payload: task
      });
      showNotification(`Nueva tarea: ${task.title}`, 'info');
    });

    newSocket.on('task-updated', (updatedTask) => {
      console.log('✏️ Tarea actualizada:', updatedTask);
      dispatch({
        type: actionTypes.UPDATE_TASK,
        payload: updatedTask
      });
    });

    newSocket.on('task-deleted', (taskId) => {
      console.log('🗑️ Tarea eliminada:', taskId);
      dispatch({
        type: actionTypes.DELETE_TASK,
        payload: taskId
      });
      showNotification('Tarea eliminada', 'info');
    });

    newSocket.on('task-moved', ({ taskId, fromColumnId, toColumnId, newIndex, movedBy }) => {
      console.log('🔄 Tarea movida:', { taskId, fromColumnId, toColumnId });
      dispatch({
        type: actionTypes.MOVE_TASK,
        payload: { taskId, fromColumnId, toColumnId, newIndex }
      });
      
      if (movedBy && movedBy !== getCurrentUserId()) {
        showNotification(`${movedBy} movió una tarea`, 'info');
      }
    });

    // Event listeners para columnas
    newSocket.on('column-created', (column) => {
      console.log('📋 Nueva columna creada:', column);
      dispatch({
        type: actionTypes.ADD_COLUMN,
        payload: column
      });
      showNotification(`Nueva columna: ${column.title}`, 'info');
    });

    newSocket.on('column-updated', (updatedColumn) => {
      console.log('✏️ Columna actualizada:', updatedColumn);
      dispatch({
        type: actionTypes.UPDATE_COLUMN,
        payload: updatedColumn
      });
    });

    newSocket.on('column-deleted', (columnId) => {
      console.log('🗑️ Columna eliminada:', columnId);
      dispatch({
        type: actionTypes.DELETE_COLUMN,
        payload: columnId
      });
      showNotification('Columna eliminada', 'warning');
    });

    // Event listeners para proyecto
    newSocket.on('project-updated', (updatedProject) => {
      console.log('🏗️ Proyecto actualizado:', updatedProject);
      dispatch({
        type: actionTypes.UPDATE_PROJECT,
        payload: updatedProject
      });
    });

    // Event listeners para notificaciones
    newSocket.on('notification', (notification) => {
      showNotification(notification.message, notification.type);
    });

    // Event listeners para typing indicators
    newSocket.on('user-typing', ({ userId, taskId, isTyping }) => {
      // Manejar indicadores de escritura
      console.log(`👤 ${userId} está escribiendo en tarea ${taskId}: ${isTyping}`);
    });

    // Cleanup
    return () => {
      console.log('🔌 Cerrando conexión Socket.IO');
      newSocket.disconnect();
    };
  }, [projectId, dispatch, actionTypes, showNotification, getCurrentUserId, ENABLE_REAL_TIME, maxAttemptsReached, connectionAttempts]);

  // Funciones para emitir eventos
  const emitTaskCreate = useCallback((task) => {
    if (socket && isConnected) {
      socket.emit('create-task', {
        ...task,
        createdBy: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitTaskUpdate = useCallback((task) => {
    if (socket && isConnected) {
      socket.emit('update-task', {
        ...task,
        updatedBy: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitTaskDelete = useCallback((taskId) => {
    if (socket && isConnected) {
      socket.emit('delete-task', {
        taskId,
        deletedBy: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitTaskMove = useCallback((taskId, fromColumnId, toColumnId, newIndex) => {
    if (socket && isConnected) {
      socket.emit('move-task', {
        taskId,
        fromColumnId,
        toColumnId,
        newIndex,
        movedBy: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitColumnCreate = useCallback((column) => {
    if (socket && isConnected) {
      socket.emit('create-column', {
        ...column,
        createdBy: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitColumnUpdate = useCallback((column) => {
    if (socket && isConnected) {
      socket.emit('update-column', {
        ...column,
        updatedBy: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitColumnDelete = useCallback((columnId) => {
    if (socket && isConnected) {
      socket.emit('delete-column', {
        columnId,
        deletedBy: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitProjectUpdate = useCallback((project) => {
    if (socket && isConnected) {
      socket.emit('update-project', {
        ...project,
        updatedBy: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitTyping = useCallback((taskId, isTyping) => {
    if (socket && isConnected) {
      socket.emit('typing', {
        taskId,
        isTyping,
        userId: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitJoinTask = useCallback((taskId) => {
    if (socket && isConnected) {
      socket.emit('join-task', {
        taskId,
        userId: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  const emitLeaveTask = useCallback((taskId) => {
    if (socket && isConnected) {
      socket.emit('leave-task', {
        taskId,
        userId: getCurrentUserId()
      });
    }
  }, [socket, isConnected, getCurrentUserId]);

  return {
    // Estado
    socket,
    isConnected,
    onlineUsers,
    
    // Funciones de tareas
    emitTaskCreate,
    emitTaskUpdate,
    emitTaskDelete,
    emitTaskMove,
    
    // Funciones de columnas
    emitColumnCreate,
    emitColumnUpdate,
    emitColumnDelete,
    
    // Funciones de proyecto
    emitProjectUpdate,
    
    // Funciones de colaboración
    emitTyping,
    emitJoinTask,
    emitLeaveTask
  };
};

export default useRealTimeUpdates; 