// components/AppsList.tsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import type { App } from '../../../types/types';
import { AppCard } from './AppCard';

export const AppsList = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState<App[]>([]);

  const fetchApps = async () => {
    try {
      const data = await api.getApps();
      setApps(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.deleteApp(id);
      fetchApps();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  const handleEdit = (app: App) => {
    navigate(`/desarrollador/apps/${app.id}/edit`);
  };

  return (
    <Box p={3}>
      {/* Encabezado con título y acción de creación */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={600}>
          Mis Apps
        </Typography>
        <Tooltip title="Crear nueva app">
          <IconButton color="primary" onClick={() => navigate('/desarrollador/apps/new')}>
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Grid responsivo con tarjetas uniformes */}
      <Grid container spacing={2} alignItems="stretch">
        {apps.map((app) => (
          <Grid key={app.id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
            <AppCard app={app} onEdit={handleEdit} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
