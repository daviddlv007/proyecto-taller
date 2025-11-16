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
import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import RateReviewIcon from '@mui/icons-material/RateReview';
import RecommendIcon from '@mui/icons-material/Recommend';

const ForBuyers: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    'Explora un catálogo amplio de aplicaciones',
    'Compra de forma segura con procesamiento automático',
    'Recibe credenciales al instante después de la compra',
    'Deja reseñas y califica aplicaciones',
    'Obtén recomendaciones personalizadas basadas en tus compras',
    'Accede a demos gratuitos antes de comprar',
  ];

  const steps = [
    {
      icon: <SearchIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: '1. Explora',
      description: 'Busca y descubre aplicaciones que se ajusten a tus necesidades.',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: '2. Compra',
      description: 'Realiza el pago de forma segura y rápida.',
    },
    {
      icon: <VpnKeyIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: '3. Accede',
      description: 'Recibe las credenciales inmediatamente y empieza a usar la app.',
    },
    {
      icon: <RateReviewIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: '4. Opina',
      description: 'Deja tu reseña para ayudar a otros usuarios.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Para Usuarios
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Descubre, compra y disfruta de aplicaciones de calidad de forma instantánea
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ px: 4, py: 1.5 }}
        >
          Empezar Ahora
        </Button>
      </Container>

      {/* Benefits Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              ¿Qué puedes hacer como usuario?
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

      {/* Steps Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={600} sx={{ mb: 5 }}>
          ¿Cómo funciona?
        </Typography>
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{step.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Highlight */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <RecommendIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Recomendaciones Inteligentes
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Nuestro sistema de IA analiza tus compras y preferencias para sugerirte aplicaciones
                que realmente te interesen. Descubre nuevas herramientas perfectas para ti.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <VpnKeyIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Acceso Inmediato
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Olvídate de esperas. Una vez completada la compra, recibirás automáticamente las
                credenciales de acceso para que puedas empezar a usar tu aplicación de inmediato.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          ¿Listo para explorar?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
          Únete a nuestra comunidad de usuarios satisfechos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ px: 4, py: 1.5 }}
          >
            Crear Cuenta Gratis
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ForBuyers;
