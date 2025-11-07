import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import type { App } from '../../types/types';
import { BuyerAppCard } from './BuyerAppCard';

export default function Recommendations() {
  // Obtener recomendaciones (que ahora devuelven apps completas)
  const {
    data: apps = [],
    isLoading,
    error,
  } = useQuery<App[]>({
    queryKey: ['buyerRecommendations'],
    queryFn: async () => {
      console.log('🔍 Obteniendo recomendaciones...');
      const result = await api.getBuyerRecommendations();
      console.log('📦 Recomendaciones recibidas:', result);
      // Asegurar que siempre retornamos un array
      return Array.isArray(result) ? result : [];
    },
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error" gutterBottom>
          Error al cargar las recomendaciones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {(error as Error).message || 'Error desconocido'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Encabezado */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <LightbulbIcon sx={{ fontSize: 40 }} color="primary" />
        <div>
          <Typography variant="h5" fontWeight={600}>
            Recomendaciones Inteligentes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Apps sugeridas especialmente para ti
          </Typography>
        </div>
      </Box>

      {apps.length === 0 ? (
        <Box textAlign="center" py={8}>
          <LightbulbIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay recomendaciones disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vuelve pronto para descubrir nuevas sugerencias
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} alignItems="stretch">
          {Array.isArray(apps) &&
            apps.map((app) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={app.id} sx={{ display: 'flex' }}>
                <BuyerAppCard app={app} />
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
}
