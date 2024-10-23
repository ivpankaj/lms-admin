import { useState, useCallback } from 'react';
import ConfirmationDialog from './ConfirmationDialog'

const useConfirmationDialog = () => {
    
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const openDialog = useCallback((message: string, onConfirm: () => void) => {
    setDialogState({
      isOpen: true,
      message,
      onConfirm,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState(prevState => ({
      ...prevState,
      isOpen: false,
    }));
  }, []);

  const handleConfirm = useCallback(() => {
    dialogState.onConfirm();
    closeDialog();
  }, [dialogState.onConfirm, closeDialog]);

  const Dialog = () => (
    <ConfirmationDialog
      isOpen={dialogState.isOpen}
      onClose={closeDialog}
      onConfirm={handleConfirm}
      message={dialogState.message}
    />
  );

  return { openDialog, Dialog };
};

export default useConfirmationDialog;
