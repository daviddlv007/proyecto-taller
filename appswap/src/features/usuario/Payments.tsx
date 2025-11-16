import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Button, Typography, Card, CardContent, Grid, Chip, Box } from '@mui/material';
import type { Payment } from '../../types/types';

export default function Payments() {
  const queryClient = useQueryClient();

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ['buyerPayments'],
    queryFn: api.getBuyerPayments,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Mis Pagos
      </Typography>

      {payments.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No tienes pagos registrados
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {payments.map((payment) => (
            <Grid size={{ xs: 12, md: 6 }} key={payment.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pago #{payment.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    App ID: {payment.app_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    QR: {payment.qr_code}
                  </Typography>
                  <Box mt={2}>
                    <Chip
                      label={getStatusLabel(payment.status)}
                      color={getStatusColor(payment.status) as any}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
