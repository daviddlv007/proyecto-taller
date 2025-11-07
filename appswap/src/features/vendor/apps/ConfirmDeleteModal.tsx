// components/ConfirmDeleteModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDeleteModalProps {
  open: boolean;
  itemName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal = ({
  open,
  itemName = 'este elemento',
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Confirmar eliminación</DialogTitle>
    <DialogContent>
      <Typography>¿Estás seguro de que deseas eliminar {itemName}?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="secondary">
        Cancelar
      </Button>
      <Button onClick={onConfirm} color="error">
        Eliminar
      </Button>
    </DialogActions>
  </Dialog>
);
