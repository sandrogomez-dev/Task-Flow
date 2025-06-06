import { useEffect, useCallback } from 'react';

const useKeyboardShortcuts = ({ 
  onNewTask, 
  onToggleTheme, 
  onSearchFocus,
  isModalOpen = false 
}) => {
  const handleKeyPress = useCallback((event) => {
    // No ejecutar atajos si hay un modal abierto o se está escribiendo en un input
    if (isModalOpen || 
        event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' ||
        event.target.contentEditable === 'true') {
      return;
    }

    const { ctrlKey, metaKey, key, shiftKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    switch (true) {
      // Ctrl/Cmd + N: Nueva tarea
      case isCtrlOrCmd && key === 'n':
        event.preventDefault();
        if (onNewTask) onNewTask();
        break;

      // Ctrl/Cmd + D: Toggle tema oscuro/claro
      case isCtrlOrCmd && key === 'd':
        event.preventDefault();
        if (onToggleTheme) onToggleTheme();
        break;

      // Ctrl/Cmd + K: Enfocar búsqueda
      case isCtrlOrCmd && key === 'k':
        event.preventDefault();
        if (onSearchFocus) onSearchFocus();
        break;

      // Escape: Cerrar modales (se maneja en cada componente)
      case key === 'Escape':
        // Esto se puede usar para cerrar modales
        break;

      // ? : Mostrar ayuda de atajos
      case key === '?' && !shiftKey:
        event.preventDefault();
        showShortcutsHelp();
        break;

      default:
        break;
    }
  }, [onNewTask, onToggleTheme, onSearchFocus, isModalOpen]);

  const showShortcutsHelp = () => {
    const shortcuts = [
      'Ctrl/Cmd + N: Nueva tarea',
      'Ctrl/Cmd + D: Cambiar tema',
      'Ctrl/Cmd + K: Buscar',
      'Escape: Cerrar modal',
      '?: Mostrar esta ayuda'
    ];
    
    alert(`🚀 Atajos de Teclado:\n\n${shortcuts.join('\n')}`);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    showShortcutsHelp
  };
};

export default useKeyboardShortcuts; 