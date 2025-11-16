import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  Grid,
  Tooltip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InfoIcon from '@mui/icons-material/Info';

interface PriceSuggestion {
  current_price: number;
  suggested_price: number;
  confidence: number;
  impact: string;
  reason: string;
  stats: {
    total_sales: number;
    recent_sales: number;
    avg_rating: number;
    competitor_avg: number;
  };
}

interface PriceSuggestionsProps {
  apps: any[];
}

export default function PriceSuggestions({ apps }: PriceSuggestionsProps) {
  const [selectedAppId, setSelectedAppId] = useState<number | null>(
    apps.length > 0 ? apps[0].id : null
  );

  const {
    data: suggestion,
    isLoading,
    error,
  } = useQuery<PriceSuggestion>({
    queryKey: ['price-suggestion', selectedAppId],
    queryFn: () => api.getPriceSuggestion(selectedAppId!),
    enabled: !!selectedAppId,
  });

  if (apps.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          Publica aplicaciones para recibir sugerencias de precios optimizados con ML
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <PsychologyIcon color="secondary" sx={{ fontSize: 28 }} />
        <Typography variant="h6" fontWeight={600}>
          Optimización de Precios ML
        </Typography>
        <Tooltip title="Sugerencias basadas en análisis de competencia, demanda y ratings con Machine Learning">
          <InfoIcon sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }} />
        </Tooltip>
      </Box>

      {/* Selector de app */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        {apps.map((app) => (
          <Chip
            key={app.id}
            label={app.nombre}
            onClick={() => setSelectedAppId(app.id)}
            color={selectedAppId === app.id ? 'primary' : 'default'}
            variant={selectedAppId === app.id ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {isLoading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} />
        </Box>
      )}

      {error && (
        <Alert severity="warning">
          No se pudieron cargar las sugerencias. Asegúrate de tener suficientes datos de ventas.
        </Alert>
      )}

      {suggestion && !isLoading && (
        <Box>
          {/* Comparación de precios */}
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Precio Actual
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ${suggestion.current_price.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                variant="outlined"
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
              >
                <CardContent>
                  <Typography variant="caption" gutterBottom sx={{ opacity: 0.9 }}>
                    Precio Sugerido ML
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h4" fontWeight="bold">
                      ${suggestion.suggested_price.toFixed(2)}
                    </Typography>
                    {suggestion.suggested_price !== suggestion.current_price && <TrendingUpIcon />}
                  </Box>
                  <Chip
                    label={`${(suggestion.confidence * 100).toFixed(0)}% confianza`}
                    size="small"
                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)' }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                variant="outlined"
                sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}
              >
                <CardContent>
                  <Typography variant="caption" gutterBottom sx={{ opacity: 0.9 }}>
                    Impacto Estimado
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {suggestion.impact}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Razón y estadísticas */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Razón de la recomendación:
            </Typography>
            <Typography variant="body2">{suggestion.reason}</Typography>
          </Alert>

          {/* Estadísticas de contexto */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Contexto del Análisis:
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box textAlign="center" p={1} bgcolor="action.hover" borderRadius={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {suggestion.stats.total_sales}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ventas Totales
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box textAlign="center" p={1} bgcolor="action.hover" borderRadius={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {suggestion.stats.recent_sales}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ventas Mes Actual
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box textAlign="center" p={1} bgcolor="action.hover" borderRadius={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {suggestion.stats.avg_rating.toFixed(1)}⭐
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rating Promedio
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box textAlign="center" p={1} bgcolor="action.hover" borderRadius={1}>
                  <Typography variant="h6" fontWeight="bold">
                    ${suggestion.stats.competitor_avg.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Competencia
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
