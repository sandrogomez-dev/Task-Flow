import { useState } from 'react';

const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    show: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger',
    icon: null,
    loading: false,
    onConfirm: null,
    onCancel: null
  });

  const showConfirm = ({
    title = 'Confirmar acción',
    message = '¿Estás seguro de que quieres continuar?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger',
    icon = null
  }) => {
    return new Promise((resolve, reject) => {
      setConfirmState({
        show: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        icon,
        loading: false,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, loading: true }));
          setTimeout(() => {
            hideConfirm();
            resolve(true);
          }, 300);
        },
        onCancel: () => {
          hideConfirm();
          resolve(false);
        }
      });
    });
  };

  const hideConfirm = () => {
    setConfirmState(prev => ({
      ...prev,
      show: false,
      loading: false
    }));
  };

  // Funciones de conveniencia para diferentes tipos
  const confirmDelete = (itemName = 'este elemento') => {
    return showConfirm({
      title: 'Eliminar elemento',
      message: `¿Estás seguro de que quieres eliminar ${itemName}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      icon: 'fa-trash-alt'
    });
  };

  const confirmAction = (actionName, description = '') => {
    return showConfirm({
      title: `Confirmar ${actionName}`,
      message: description || `¿Estás seguro de que quieres ${actionName.toLowerCase()}?`,
      confirmText: actionName,
      cancelText: 'Cancelar',
      type: 'warning',
      icon: 'fa-exclamation-triangle'
    });
  };

  const confirmReset = (itemName = 'los datos') => {
    return showConfirm({
      title: 'Reiniciar datos',
      message: `¿Estás seguro de que quieres reiniciar ${itemName}? Se perderán todos los cambios no guardados.`,
      confirmText: 'Reiniciar',
      cancelText: 'Cancelar',
      type: 'warning',
      icon: 'fa-redo-alt'
    });
  };

  return {
    confirmState,
    showConfirm,
    hideConfirm,
    confirmDelete,
    confirmAction,
    confirmReset
  };
};

export default useConfirm; 