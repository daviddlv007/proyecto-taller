// components/AppCard.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Badge,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoIcon from '@mui/icons-material/Info';
import RateReviewIcon from '@mui/icons-material/RateReview';
import BarChartIcon from '@mui/icons-material/BarChart';
import type { App } from '../../../types/types';
import { AppEmbedModal } from './AppEmbedModal';
import { AppDetailsModal } from './AppDetailsModal';
import { AppReviewsModal } from './AppReviewsModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { AppStatsModal } from './AppStatsModal';

interface AppCardProps {
  app: App & { cover_image?: string; reviewCount?: number };
  onEdit: (app: App) => void;
  onDelete: (id: number) => void;
}

export const AppCard = ({ app, onEdit, onDelete }: AppCardProps) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openEmbed, setOpenEmbed] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          component="img"
          src={app.imagen_portada || 'https://via.placeholder.com/300x180?text=No+Image'}
          alt={app.nombre}
          sx={{ width: '100%', height: 180, objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{app.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">
            {app.categoria}
          </Typography>
          <Typography variant="body2">{app.descripcion}</Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 1, py: 0 }}>
          <Box display="flex" gap={0}>
            <Tooltip title="Abrir App">
              <IconButton color="primary" onClick={() => setOpenEmbed(true)}>
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Detalles">
              <IconButton color="primary" onClick={() => setOpenDetails(true)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Estadísticas">
              <IconButton color="info" onClick={() => setOpenStats(true)}>
                <BarChartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar App">
              <IconButton color="secondary" onClick={() => onEdit(app)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Reseñas">
              <IconButton color="secondary" onClick={() => setOpenReviews(true)}>
                <Badge badgeContent={app.reviewCount} color="primary">
                  <RateReviewIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar App">
              <IconButton color="error" onClick={() => setConfirmDelete(true)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>

      {/* Modales */}
      {openDetails && (
        <AppDetailsModal open={openDetails} onClose={() => setOpenDetails(false)} app={app} />
      )}
      {openEmbed && (
        <AppEmbedModal open={openEmbed} onClose={() => setOpenEmbed(false)} app={app} />
      )}
      {openReviews && (
        <AppReviewsModal open={openReviews} onClose={() => setOpenReviews(false)} appId={app.id} />
      )}
      {openStats && (
        <AppStatsModal open={openStats} onClose={() => setOpenStats(false)} appId={app.id} />
      )}
      {confirmDelete && (
        <ConfirmDeleteModal
          open={confirmDelete}
          itemName={`la app "${app.nombre}"`}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            onDelete(app.id);
            setConfirmDelete(false);
          }}
        />
      )}
    </>
  );
};
