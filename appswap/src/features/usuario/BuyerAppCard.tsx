import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/api';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import type { App } from '../../types/types';

interface BuyerAppCardProps {
  app: App;
}

export const BuyerAppCard = ({ app }: BuyerAppCardProps) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const handleExecuteApp = () => {
    setOpenPreview(true);
  };

  // Mutación para crear el pago con Stripe
  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ app_id: app.id })
      });
      
      if (!response.ok) {
        throw new Error('Error al crear sesión de pago');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Redirigir a Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error('No se pudo obtener la URL de pago');
      }
    },
    onError: (error) => {
      toast.error(`Error al procesar el pago: ${(error as Error).message}`);
    },
  });

  const handleOpenPurchaseModal = () => {
    // Directamente iniciar el proceso de compra
    toast.info('Redirigiendo a Stripe Checkout...');
    createPaymentMutation.mutate();
  };

  return (
    <>
      <Card
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
      >
        <Box
          component="img"
          src={app.imagen_portada || 'https://via.placeholder.com/300x180?text=No+Image'}
          alt={app.nombre}
          sx={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={handleExecuteApp}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {app.nombre}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Chip label={app.categoria} size="small" color="primary" />
            <Typography variant="h6" color="success.main" fontWeight="bold">
              ${app.precio?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
          <Box display="flex" gap={0.5}>
            <Tooltip title="Ver detalles">
              <IconButton size="small" color="primary" onClick={() => setOpenDetails(true)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Probar app">
              <IconButton size="small" color="primary" onClick={handleExecuteApp}>
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Tooltip title="Comprar">
            <IconButton
              color="success"
              onClick={handleOpenPurchaseModal}
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'success.dark',
                },
              }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      {/* Modal de Detalles */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon color="primary" />
            {app.nombre}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={2} sx={{ width: '100%', height: 300, borderRadius: 1, overflow: 'hidden' }}>
            <video
              src={app.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'}
              controls
              autoPlay
              muted
              loop
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Chip label={app.categoria} color="primary" sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph>
            {app.descripcion}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            URL:{' '}
            <a href={app.url_aplicacion} target="_blank" rel="noopener noreferrer">
              {app.url_aplicacion}
            </a>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Cerrar</Button>
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={handleExecuteApp}>
            Probar App
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Vista Previa (iframe) */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <PlayArrowIcon color="primary" />
            Probando: {app.nombre}
          </Box>
          <IconButton onClick={() => setOpenPreview(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '80vh' }}>
          <Box
            component="iframe"
            src={app.url_aplicacion}
            width="100%"
            height="100%"
            sx={{ border: 'none' }}
            title={app.nombre}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
