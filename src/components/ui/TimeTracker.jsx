import React, { useState, useEffect, useCallback } from 'react';

/**
 * Componente: TimeTracker
 * Props:
 * - taskId: string
 * - initialTime: number (segundos)
 * - isActive: boolean
 * - onStart: function()
 * - onPause: function()
 * - onSave: function(timeSpent)
 * 
 * Requerimientos:
 * - Cronómetro con inicio/pausa
 * - Visualización de tiempo acumulado
 * - Formulario para registrar tiempo manual
 * - Integración con la API de tareas
 */
const TimeTracker = ({ 
  taskId, 
  initialTime = 0, 
  isActive = false, 
  onStart, 
  onPause, 
  onSave 
}) => {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(isActive);
  const [startTime, setStartTime] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualTime, setManualTime] = useState({ hours: 0, minutes: 0 });

  // Efecto para el cronómetro
  useEffect(() => {
    let interval = null;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setCurrentTime(initialTime + elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, initialTime]);

  // Formatear tiempo para mostrar
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Formatear tiempo para mostrar de forma legible
  const formatTimeReadable = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  // Iniciar cronómetro
  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    if (onStart) onStart();
  };

  // Pausar cronómetro
  const handlePause = () => {
    setIsRunning(false);
    setStartTime(null);
    if (onPause) onPause();
  };

  // Guardar tiempo
  const handleSave = () => {
    if (onSave) {
      onSave(currentTime);
    }
    // Reset del cronómetro
    setCurrentTime(0);
    setIsRunning(false);
    setStartTime(null);
  };

  // Agregar tiempo manual
  const handleManualTimeSubmit = (e) => {
    e.preventDefault();
    const additionalSeconds = (manualTime.hours * 3600) + (manualTime.minutes * 60);
    const newTime = currentTime + additionalSeconds;
    setCurrentTime(newTime);
    setManualTime({ hours: 0, minutes: 0 });
    setShowManualEntry(false);
    
    if (onSave) {
      onSave(newTime);
    }
  };

  // Reset del cronómetro
  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar el cronómetro?')) {
      setCurrentTime(0);
      setIsRunning(false);
      setStartTime(null);
    }
  };

  return (
    <div className="time-tracker">
      <div className="text-center mb-4">
        <h5 className="text-dark-custom mb-3">
          <i className="fas fa-stopwatch me-2"></i>
          Seguimiento de Tiempo
        </h5>
        
        {/* Display principal del tiempo */}
        <div className="time-display mb-3">
          {formatTime(currentTime)}
        </div>

        {/* Tiempo acumulado legible */}
        {currentTime > 0 && (
          <div className="text-muted small mb-3">
            Tiempo total: {formatTimeReadable(currentTime)}
          </div>
        )}
      </div>

      {/* Controles del cronómetro */}
      <div className="timer-controls">
        {!isRunning ? (
          <button
            className="btn btn-success"
            onClick={handleStart}
            disabled={showManualEntry}
          >
            <i className="fas fa-play me-2"></i>
            {currentTime > 0 ? 'Continuar' : 'Iniciar'}
          </button>
        ) : (
          <button
            className="btn btn-warning"
            onClick={handlePause}
          >
            <i className="fas fa-pause me-2"></i>
            Pausar
          </button>
        )}

        {currentTime > 0 && (
          <>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isRunning}
            >
              <i className="fas fa-save me-2"></i>
              Guardar
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={handleReset}
              disabled={isRunning}
            >
              <i className="fas fa-redo me-2"></i>
              Reiniciar
            </button>
          </>
        )}
      </div>

      {/* Botón para entrada manual */}
      <div className="text-center mt-3">
        <button
          className="btn btn-link btn-sm"
          onClick={() => setShowManualEntry(!showManualEntry)}
          disabled={isRunning}
        >
          <i className="fas fa-edit me-1"></i>
          {showManualEntry ? 'Cancelar entrada manual' : 'Agregar tiempo manual'}
        </button>
      </div>

      {/* Formulario de entrada manual */}
      {showManualEntry && (
        <div className="manual-time-entry mt-3 fade-in">
          <div className="card border-0 bg-light">
            <div className="card-body p-3">
              <h6 className="card-title">Agregar Tiempo Manual</h6>
              <form onSubmit={handleManualTimeSubmit}>
                <div className="row">
                  <div className="col-6">
                    <label className="form-label small">Horas</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min="0"
                      max="23"
                      value={manualTime.hours}
                      onChange={(e) => setManualTime(prev => ({ 
                        ...prev, 
                        hours: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small">Minutos</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min="0"
                      max="59"
                      value={manualTime.minutes}
                      onChange={(e) => setManualTime(prev => ({ 
                        ...prev, 
                        minutes: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowManualEntry(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={manualTime.hours === 0 && manualTime.minutes === 0}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      {taskId && (
        <div className="mt-3 text-center">
          <small className="text-muted">
            <i className="fas fa-tasks me-1"></i>
            Tarea: {taskId}
          </small>
        </div>
      )}
    </div>
  );
};

export default TimeTracker; 