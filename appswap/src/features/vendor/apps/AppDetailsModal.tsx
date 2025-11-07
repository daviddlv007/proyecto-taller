// components/AppDetailsModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { App } from '../../../types/types';

interface AppDetailsModalProps {
  open: boolean;
  onClose: () => void;
  app: App & { cover_image?: string };
}

export const AppDetailsModal = ({ open, onClose, app }: AppDetailsModalProps) => {
  if (!app) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {app.name}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          component="img"
          src={app.cover_image || 'https://via.placeholder.com/600x300?text=Sin+imagen'}
          alt={app.name}
          sx={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 1, mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary" mb={1}>
          {app.category}
        </Typography>
        <Typography variant="body1">{app.description}</Typography>
      </DialogContent>
    </Dialog>
  );
};
