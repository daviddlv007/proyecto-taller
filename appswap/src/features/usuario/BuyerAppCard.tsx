import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { App } from '../../types/types';

interface BuyerAppCardProps {
  app: App;
}

export const BuyerAppCard = ({ app }: BuyerAppCardProps) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openPurchase, setOpenPurchase] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [_generatedQR, setGeneratedQR] = useState('');
  const [_paymentId, setPaymentId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const handleExecuteApp = () => {
    setOpenPreview(true);
  };

  // Mutación para crear el pago (instantáneo, sin necesidad de confirmación)
  const createPaymentMutation = useMutation({
    mutationFn: () => {
      const qr = `QR${Date.now()}${Math.floor(Math.random() * 10000)}`;
      return api.createPayment({ app_id: app.id, qr_code: qr });
    },
    onSuccess: (data) => {
      setGeneratedQR(data.qr_code);
      setPaymentId(data.id);
      queryClient.invalidateQueries({ queryKey: ['buyerPurchases'] });
      queryClient.invalidateQueries({ queryKey: ['buyerPayments'] });
      toast.success('¡Compra confirmada! La app ya está disponible en "Mis Compras"');
      setTimeout(() => {
        setOpenPurchase(false);
        setGeneratedQR('');
        setPaymentId(null);
      }, 2000);
    },
    onError: (error) => {
      toast.error(`Error al procesar el pago: ${(error as Error).message}`);
    },
  });

  const handleOpenPurchaseModal = () => {
    setOpenPurchase(true);
  };

  const handleConfirmPurchase = () => {
    createPaymentMutation.mutate();
  };

  const handleClosePurchaseModal = () => {
    setOpenPurchase(false);
    setGeneratedQR('');
    setPaymentId(null);
    createPaymentMutation.reset();
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
              ${app.precio.toFixed(2)}
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
          <Box mb={2}>
            <img
              src={app.imagen_portada || 'https://via.placeholder.com/400x200?text=No+Image'}
              alt={app.nombre}
              style={{ width: '100%', borderRadius: 8 }}
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

      {/* Modal de Compra */}
      <Dialog open={openPurchase} onClose={handleClosePurchaseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartIcon color="primary" />
            Comprar: {app.nombre}
          </Box>
        </DialogTitle>
        <DialogContent>
          {createPaymentMutation.isPending && (
            <Box display="flex" flexDirection="column" alignItems="center" py={4}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Procesando compra...
              </Typography>
            </Box>
          )}

          {createPaymentMutation.isError && (
            <Box display="flex" flexDirection="column" alignItems="center" py={4}>
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                Error al procesar la compra. Por favor, intenta nuevamente.
              </Alert>
            </Box>
          )}

          {createPaymentMutation.isSuccess && (
            <Box display="flex" flexDirection="column" alignItems="center" py={4}>
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
              <Typography variant="h6" sx={{ mt: 2, color: 'success.main' }}>
                ¡Compra confirmada!
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'center' }}
              >
                La aplicación ya está disponible en "Mis Compras" con tus credenciales de acceso
              </Typography>
            </Box>
          )}

          {!createPaymentMutation.isPending &&
            !createPaymentMutation.isSuccess &&
            !createPaymentMutation.isError && (
              <Box py={2}>
                <Typography variant="body1" gutterBottom>
                  Confirma la compra de esta aplicación:
                </Typography>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, my: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {app.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {app.descripcion}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label={app.categoria} color="primary" size="small" />
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      ${app.precio.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <Alert severity="info">
                  Al confirmar, se procesará el pago y recibirás credenciales de acceso
                  instantáneamente.
                </Alert>
              </Box>
            )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {!createPaymentMutation.isSuccess ? (
            <>
              <Button onClick={handleClosePurchaseModal}>Cancelar</Button>
              <Button
                onClick={handleConfirmPurchase}
                disabled={createPaymentMutation.isPending}
                variant="contained"
                startIcon={
                  createPaymentMutation.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    <ShoppingCartIcon />
                  )
                }
                color="success"
              >
                {createPaymentMutation.isPending ? 'Procesando...' : 'Confirmar Compra'}
              </Button>
            </>
          ) : (
            <Button onClick={handleClosePurchaseModal} variant="contained">
              Cerrar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
