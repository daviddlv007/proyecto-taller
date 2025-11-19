// components/AppDetailsModal.tsx
import {
  Dialog, DialogContent, DialogTitle, Typography, Box, IconButton } from '@mui/material';
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
        {app.nombre}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ width: '100%', height: 300, borderRadius: 1, mb: 2, overflow: 'hidden' }}>
          <video
            src={app.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'}
            controls
            autoPlay
            muted
            loop
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {app.categoria}
        </Typography>
        <Typography variant="body1">{app.descripcion}</Typography>
      </DialogContent>
    </Dialog>
  );
};
