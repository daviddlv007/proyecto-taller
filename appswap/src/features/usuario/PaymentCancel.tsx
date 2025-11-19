import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
        <CancelIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Pago Cancelado
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Has cancelado el proceso de pago. Puedes volver a intentarlo cuando quieras.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/usuario/apps')}
          sx={{ mt: 2 }}
        >
          Volver a Tienda
        </Button>
      </Paper>
    </Box>
  );
}
