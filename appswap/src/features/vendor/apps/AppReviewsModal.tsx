// components/AppReviewsModal.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Review } from '../../../types/types';
import { api } from '../../../services/api';

interface AppReviewsModalProps {
  open: boolean;
  onClose: () => void;
  appId: number;
}

export const AppReviewsModal = ({ open, onClose, appId }: AppReviewsModalProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const data = await api.getAppReviews(appId);
      setReviews(data);
    })();
  }, [open, appId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Reseñas
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {reviews.length === 0 ? (
          <Typography>No hay reseñas aún</Typography>
        ) : (
          reviews.map((r) => (
            <Box key={r.id} mb={2} p={1} sx={{ borderBottom: '1px solid #eee' }}>
              <Typography variant="subtitle2">Usuario {r.userId}</Typography>
              <Typography variant="body2">Rating: {r.rating} / 5</Typography>
              <Typography variant="body2">{r.comment}</Typography>
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};
