// components/AppStatsModal.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Stats } from '../../../types/types';
import { api } from '../../../services/api';

interface AppStatsModalProps {
  open: boolean;
  onClose: () => void;
  appId: number;
}

export const AppStatsModal = ({ open, onClose, appId }: AppStatsModalProps) => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!appId) return;
    (async () => {
      try {
        const data = await api.getAppStats(appId);
        setStats(data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    })();
  }, [appId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Estadísticas de la app
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {stats ? (
          <Box>
            <Typography variant="body2">Descargas: {stats.downloads}</Typography>
            <Typography variant="body2">Reseñas: {stats.reviews}</Typography>
            <Typography variant="body2">Rating promedio: {stats.average_rating}</Typography>
            <Typography variant="body2">
              Pagos recibidos: ${stats.payments_received.toLocaleString()}
            </Typography>
          </Box>
        ) : (
          <Typography>Cargando estadísticas...</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};
