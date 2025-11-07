import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import PublishIcon from '@mui/icons-material/Publish';
import BarChartIcon from '@mui/icons-material/BarChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const ForVendors: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    'Publica tus aplicaciones en minutos',
    'Define precios flexibles para tus productos',
    'Entrega automática de credenciales a usuarios',
    'Visualiza estadísticas detalladas de ventas',
    'Recibe recomendaciones inteligentes para mejorar',
    'Accede a una guía completa para maximizar tus ventas',
  ];

  const features = [
    {
      icon: <PublishIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Publicación Simple',
      description: 'Sube tus apps con nombre, descripción, precio, categoría y URL de demo.',
    },
    {
      icon: <MonetizationOnIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Monetización Directa',
      description: 'Recibe pagos automáticamente cuando los usuarios compran tus aplicaciones.',
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Análisis Completo',
      description: 'Dashboard con estadísticas de ventas, ingresos, apps más vendidas y reseñas.',
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Sugerencias IA',
      description: 'Recomendaciones inteligentes integradas en tu dashboard para optimizar ventas.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Para Desarrolladores
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Publica tus aplicaciones, gestiona ventas y maximiza tus ingresos con herramientas
          profesionales
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ px: 4, py: 1.5 }}
        >
          Comenzar a Publicar
        </Button>
      </Container>

      {/* Benefits Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              ¿Qué puedes hacer como desarrollador?
            </Typography>
            <List>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={600} sx={{ mb: 5 }}>
          Herramientas para Desarrolladores
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Guide Highlight */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <MenuBookIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Guía del Desarrollador
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Accede a documentación completa con mejores prácticas, formato de credenciales en
                JSON, y consejos para optimizar tus publicaciones.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CodeIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Automatización Total
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Los usuarios reciben las credenciales automáticamente al completar la compra. Tú
                solo defines el template, nosotros nos encargamos del resto.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          ¿Listo para publicar tus aplicaciones?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
          Únete a nuestros desarrolladores exitosos
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ px: 4, py: 1.5 }}
        >
          Crear Cuenta Gratis
        </Button>
      </Container>
    </Box>
  );
};

export default ForVendors;
