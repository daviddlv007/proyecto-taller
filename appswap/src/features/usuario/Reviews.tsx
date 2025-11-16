import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Rating,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import type { Review } from '../../types/types';

interface PurchasedApp {
  app_id: number;
  name: string;
  app_url: string;
  fecha: string;
  cover_image?: string;
}

export default function Reviews() {
  const [selectedAppId, setSelectedAppId] = useState<number | ''>('');
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const { data: purchasedApps = [] } = useQuery<PurchasedApp[]>({
    queryKey: ['buyerPurchases'],
    queryFn: api.getBuyerPurchases,
  });

  const { data: myReviews = [] } = useQuery<Review[]>({
    queryKey: ['myReviews'],
    queryFn: api.getMyReviews,
  });

  const submitMutation = useMutation({
    mutationFn: (data: { app_id: number; rating: number; comment: string }) =>
      api.createReview(data),
    onSuccess: () => {
      setSelectedAppId('');
      setRating(0);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });

  const handleSubmit = () => {
    if (selectedAppId && rating && comment) {
      submitMutation.mutate({
        app_id: selectedAppId as number,
        rating: rating,
        comment: comment,
      });
    }
  };

  const getAppName = (appId: number) => {
    const app = purchasedApps.find((a) => a.app_id === appId);
    return app?.nombre || `App #${appId}`;
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Reviews
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Escribir Nueva Review
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Seleccionar App</InputLabel>
            <Select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value as number)}
              label="Seleccionar App"
            >
              {purchasedApps.map((app) => (
                <MenuItem key={app.app_id} value={app.app_id}>
                  {app.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Calificación</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comentario"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            margin="normal"
          />

          <Button
            onClick={handleSubmit}
            disabled={!selectedAppId || !rating || !comment || submitMutation.isPending}
            variant="contained"
            sx={{ mt: 2 }}
          >
            {submitMutation.isPending ? 'Enviando...' : 'Enviar Review'}
          </Button>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Mis Reviews
      </Typography>

      {myReviews.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No has escrito reviews aún
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {myReviews.map((review) => (
            <Grid size={{ xs: 12, md: 6 }} key={review.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {getAppName(review.app_id)}
                  </Typography>
                  <Rating value={review.calificacion} readOnly />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {review.comentario}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
