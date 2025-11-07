import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  CircularProgress,
  CardMedia,
  Chip,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InfoIcon from '@mui/icons-material/Info';
import type { App } from '../../types/types';

interface Purchase {
  id: number;
  app_id: number;
  app_name: string;
  app_category: string;
  app_description: string;
  app_url: string;
  cover_image?: string;
  price: number;
  credentials: string;
  purchase_date: string;
}

export default function Home() {
  const navigate = useNavigate();

  // Obtener usuario actual
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Recomendaciones ML personalizadas
  const { data: mlRecommendations = [], isLoading: loadingML } = useQuery<App[]>({
    queryKey: ['mlRecommendations', user.id],
    queryFn: async () => {
      try {
        return await api.getMLRecommendations(user.id, 6);
      } catch (error) {
        console.error('Error loading ML recommendations:', error);
        return [];
      }
    },
    enabled: !!user.id,
  });

  const { data: recommendations = [], isLoading: loadingRecs } = useQuery<App[]>({
    queryKey: ['buyerRecommendations'],
    queryFn: async () => {
      const result = await api.getBuyerRecommendations();
      return Array.isArray(result) ? result : [];
    },
  });

  const { data: purchases = [], isLoading: loadingPurchases } = useQuery<Purchase[]>({
    queryKey: ['buyerPurchases'],
    queryFn: api.getBuyerPurchases,
  });

  const handleOpenApp = (url: string) => {
    window.open(url, '_blank');
  };

  const isLoading = loadingRecs || loadingPurchases || loadingML;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const recentPurchases = purchases.slice(0, 3);

  return (
    <Box p={3}>
      {/* Encabezado */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <HomeIcon sx={{ fontSize: 40 }} color="primary" />
        <div>
          <Typography variant="h5" fontWeight={600}>
            Bienvenido a AppSwap
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tu plataforma de aplicaciones web
          </Typography>
        </div>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/buyer/purchases')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Apps Compradas
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {purchases.length}
                  </Typography>
                </Box>
                <ShoppingBagIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/buyer/apps')}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Tienda de Apps
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    Ver
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Apps recientes */}
      {recentPurchases.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <ShoppingBagIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Últimas Apps Compradas
              </Typography>
            </Box>
            <Button variant="text" onClick={() => navigate('/buyer/purchases')} size="small">
              Ver todas
            </Button>
          </Box>

          <Grid container spacing={2}>
            {recentPurchases.map((purchase) => (
              <Grid size={{ xs: 12, sm: 4 }} key={purchase.app_id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={purchase.cover_image || 'https://via.placeholder.com/300x140?text=App'}
                    alt={purchase.app_name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" noWrap>
                      {purchase.app_name}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<OpenInNewIcon />}
                      onClick={() => handleOpenApp(purchase.app_url)}
                      sx={{ mt: 1 }}
                    >
                      Abrir App
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Recomendaciones ML Personalizadas */}
      {mlRecommendations.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.dark', color: 'primary.contrastText' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <PsychologyIcon />
              <Typography variant="h6" fontWeight={600}>
                Recomendadas Para Ti (ML)
              </Typography>
              <Tooltip title="Sugerencias personalizadas basadas en tus compras y preferencias usando Machine Learning">
                <InfoIcon sx={{ fontSize: 18, cursor: 'help', opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/buyer/apps')}
              size="small"
              sx={{ color: 'inherit', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Ver todas
            </Button>
          </Box>

          <Grid container spacing={2}>
            {mlRecommendations.map((app: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={app.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                  }}
                  onClick={() => navigate('/buyer/apps')}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={app.cover_image || 'https://via.placeholder.com/300x140?text=App'}
                    alt={app.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" noWrap>
                      {app.name}
                    </Typography>
                    <Chip label={app.category} size="small" color="primary" sx={{ mb: 1 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1, height: 40, overflow: 'hidden' }}
                    >
                      {app.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        ${app.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Recomendaciones */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <LightbulbIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Apps Destacadas
            </Typography>
          </Box>
          <Button variant="text" onClick={() => navigate('/buyer/apps')} size="small">
            Ver todas las apps
          </Button>
        </Box>

        {recommendations.length === 0 ? (
          <Box textAlign="center" py={4}>
            <LightbulbIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No hay recomendaciones disponibles
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {recommendations.slice(0, 6).map((app) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={app.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                  }}
                  onClick={() => navigate('/buyer/apps')}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={app.cover_image || 'https://via.placeholder.com/300x140?text=App'}
                    alt={app.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" noWrap>
                      {app.name}
                    </Typography>
                    <Chip label={app.category} color="primary" size="small" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
