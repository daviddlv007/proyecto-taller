import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { App } from '../../../types/types';

interface AppEmbedModalProps {
  open: boolean;
  onClose: () => void;
  app: App & { cover_image?: string };
}

export const AppEmbedModal = ({ open, onClose, app }: AppEmbedModalProps) => {
  if (!app) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {app.name}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, height: '80vh' }}>
        <Box
          component="iframe"
          src={app.app_url}
          width="100%"
          height="100%"
          sx={{ border: 'none' }}
          title={app.name}
        />
      </DialogContent>
    </Dialog>
  );
};
