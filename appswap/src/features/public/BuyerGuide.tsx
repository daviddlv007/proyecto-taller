import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentIcon from '@mui/icons-material/Payment';
import RateReviewIcon from '@mui/icons-material/RateReview';

const BuyerGuide: React.FC = () => {
  const sections = [
    {
      icon: <HomeIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Inicio - Dashboard del Usuario',
      content: [
        'Al iniciar sesión, verás tu dashboard personal con dos secciones principales:',
        '• Mis Compras Recientes: Las últimas apps que has adquirido',
        '• Recomendaciones Inteligentes: Sugerencias personalizadas basadas en tus compras anteriores',
        'Desde aquí puedes navegar rápidamente a la tienda o ver tus compras completas.',
      ],
    },
    {
      icon: <ShoppingBagIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Tienda de Aplicaciones',
      content: [
        'En la sección "Mis Aplicaciones", encontrarás el catálogo completo de apps disponibles.',
        'Cada app muestra:',
        '• Nombre y descripción',
        '• Precio y categoría',
        '• Calificación promedio (estrellas)',
        '• Botón "Probar Demo" para acceder a una versión de prueba',
        '• Botón "Comprar" para adquirir la aplicación',
        'Filtra por categorías o busca apps específicas para encontrar lo que necesitas.',
      ],
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Proceso de Compra',
      content: [
        '1. Haz clic en "Comprar" en la app que deseas',
        '2. Se abrirá un modal de confirmación con el resumen de la compra',
        '3. Revisa el precio y confirma la compra',
        '4. ¡Listo! El pago se procesa automáticamente y recibirás las credenciales al instante',
        'No necesitas escanear códigos QR ni esperar confirmaciones manuales.',
      ],
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Mis Compras y Credenciales',
      content: [
        'En "Mis Compras" puedes ver todas las aplicaciones que has adquirido.',
        'Para cada compra verás:',
        '• Información de la app',
        '• Fecha de compra y precio pagado',
        '• Credenciales de acceso en formato JSON (usuario, contraseña, API keys, etc.)',
        '• Opción para copiar las credenciales fácilmente',
        '• Botón para acceder a la aplicación directamente',
        'Puedes abrir/cerrar la vista de credenciales con un clic.',
      ],
    },
    {
      icon: <RateReviewIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Reseñas y Calificaciones',
      content: [
        'Después de comprar una app, puedes dejar tu opinión.',
        'En la sección "Mis Compras", debajo de cada app que hayas comprado, encontrarás:',
        '• Un formulario para calificar con estrellas (1-5)',
        '• Un campo de texto para escribir tu reseña',
        '• Botón "Enviar Reseña" para publicar tu opinión',
        'Tus reseñas ayudan a otros usuarios y a los desarrolladores a mejorar sus apps.',
        'Si ya dejaste una reseña, verás tu calificación y comentario guardados.',
      ],
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Navegación',
      content: [
        'El menú lateral izquierdo tiene las siguientes opciones:',
        '• Inicio: Dashboard con resumen y recomendaciones',
        '• Mis Aplicaciones: Catálogo completo de apps disponibles',
        '• Mis Compras: Historial de compras con credenciales y reseñas',
        'En la barra superior puedes cambiar entre modo claro y oscuro, y cerrar sesión.',
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Manual del Usuario
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Guía completa para aprovechar al máximo AppSwap como usuario
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {sections.map((section, index) => (
          <Grid size={{ xs: 12 }} key={index}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {section.icon}
                  <Typography variant="h5" fontWeight={600}>
                    {section.title}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <List>
                  {section.content.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          variant: 'body1',
                          color: 'text.secondary',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Consejos Útiles
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="• Prueba las demos antes de comprar para asegurarte de que la app cumple tus expectativas" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Lee las reseñas de otros usuarios para tomar decisiones informadas" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Guarda las credenciales en un lugar seguro después de la compra" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Las recomendaciones inteligentes mejoran con cada compra que realizas" />
          </ListItem>
          <ListItem>
            <ListItemText primary="• Deja reseñas honestas para ayudar a la comunidad y a los desarrolladores" />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
};

export default BuyerGuide;
