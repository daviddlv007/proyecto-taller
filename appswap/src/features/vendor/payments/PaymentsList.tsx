// components/PaymentsList.tsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { api } from '../../../services/api';
import type { Payment } from '../../../types/types';

export const PaymentsList = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      const data = await api.getPayments();
      setPayments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleConfirm = async (id: number) => {
    setLoading(true);
    try {
      await api.confirmPayment(id);
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert('Error al confirmar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Pagos
      </Typography>
      <Grid container spacing={2} alignItems="stretch">
        {payments.map((payment) => (
          <Grid key={payment.id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1">Pago #{payment.id}</Typography>
                <Typography variant="body2">App ID: {payment.app_id}</Typography>
                <Typography variant="body2">Buyer ID: {payment.buyer_id}</Typography>
                <Typography variant="body2" mb={1}>
                  Estado:{' '}
                  <Chip
                    label={payment.status}
                    color={payment.status === 'confirmed' ? 'success' : 'warning'}
                    size="small"
                  />
                </Typography>
                <Typography variant="body2" mb={1}>
                  QR: {payment.qr_code}
                </Typography>
                {payment.status === 'pending' && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleConfirm(payment.id)}
                    disabled={loading}
                  >
                    Confirmar
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
