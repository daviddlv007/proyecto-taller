// components/Recommendations.tsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { api } from '../../../services/api';
import type { Recommendation } from '../../../types/types';

export const RecommendationsList = () => {
  const [ideas, setIdeas] = useState<Recommendation[]>([]);

  const fetchRecommendations = async () => {
    try {
      const data = await api.getRecommendations(101); // user_id de ejemplo
      setIdeas(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Recomendaciones ML
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        {ideas.map((rec) => (
          <Grid
            key={rec.id}
            size={{ xs: 12, sm: 6, md: 4 }} // 🔹 uso de 'size' en MUI v7
            sx={{ display: 'flex' }}
          >
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="body1">{rec.idea}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
