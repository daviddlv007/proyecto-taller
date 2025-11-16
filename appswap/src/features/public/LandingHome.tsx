import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Card, CardContent, Grid, Container } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CodeIcon from '@mui/icons-material/Code';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';

const LandingHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Compra Fácil',
      description: 'Explora y compra aplicaciones de forma rápida y segura.',
    },
    {
      icon: <CodeIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Publica tus Apps',
      description: 'Publica tus aplicaciones y alcanza a miles de usuarios.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Análisis Detallados',
      description: 'Visualiza estadísticas de ventas y comportamiento de usuarios.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Transacciones Seguras',
      description: 'Procesamiento seguro de pagos y entrega automática de credenciales.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Acceso Instantáneo',
      description: 'Recibe las credenciales de tu compra inmediatamente.',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Soporte Continuo',
      description: 'Guías y recomendaciones inteligentes para optimizar tu experiencia.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
          Bienvenido a AppSwap
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
          La plataforma líder para comprar y publicar aplicaciones. Conecta desarrolladores con
          usuarios de forma simple y segura.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/for-buyers')}
            sx={{ px: 4, py: 1.5 }}
          >
            Soy Usuario
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/for-vendors')}
            sx={{ px: 4, py: 1.5 }}
          >
            Soy Desarrollador
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={600} sx={{ mb: 5 }}>
          ¿Por qué elegir AppSwap?
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', flex: 1 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom fontWeight={600}>
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Únete a miles de desarrolladores y usuarios que confían en AppSwap
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ px: 4, py: 1.5 }}
          >
            Crear Cuenta Gratis
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingHome;
