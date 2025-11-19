import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { API_BASE_URL } from '../../config/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      fetch(`${API_BASE_URL}/payments/verify-session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'paid') {
            setSuccess(true);
          }
        })
        .catch(() => setSuccess(false))
        .finally(() => setVerifying(false));
    } else {
      setVerifying(false);
    }
  }, [searchParams]);

  if (verifying) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
        {success ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              ¡Pago Exitoso!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Tu compra se ha procesado correctamente. La aplicación ya está disponible en "Mis Compras".
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/usuario/purchases')}
              sx={{ mt: 2 }}
            >
              Ir a Mis Compras
            </Button>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Error en el Pago
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Hubo un problema al procesar tu pago. Por favor intenta nuevamente.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/usuario/apps')}
              sx={{ mt: 2 }}
            >
              Volver a Tienda
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
