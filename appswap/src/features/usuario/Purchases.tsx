import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  CardActions,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyIcon from '@mui/icons-material/Key';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { Review as ReviewType } from '../../types/types';
import { API_BASE_URL } from '../../config/api';

interface Purchase {
  id: number;
  app_id: number;
  app_name: string;
  app_category: string;
  app_description: string;
  app_url: string;
  cover_image?: string;
  imagen_portada?: string;
  price: number;
  credentials?: string;
  purchase_date: string;
}

function Purchases() {
  const queryClient = useQueryClient();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  
  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: ['buyerPurchases'],
    queryFn: api.getBuyerPurchases,
  });

  const { data: myReviews = [] } = useQuery<ReviewType[]>({
    queryKey: ['myReviews'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/usuario/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error fetching reviews');
      return response.json();
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: { app_id: number; rating: number; comment: string }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/usuario/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error creating review');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Reseña creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      setReviewDialogOpen(false);
      setRating(5);
      setComment('');
      setSelectedPurchase(null);
    },
    onError: () => {
      toast.error('Error al crear la reseña');
    },
  });

  const handleOpenApp = (url: string) => {
    window.open(url, '_blank');
  };

  const handleOpenReviewDialog = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedPurchase(null);
    setRating(5);
    setComment('');
  };

  const handleOpenCredentials = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setCredentialsDialogOpen(true);
  };

  const handleCloseCredentials = () => {
    setCredentialsDialogOpen(false);
    setSelectedPurchase(null);
  };

  const handleOpenDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedPurchase(null);
  };

  const handleSubmitReview = () => {
    if (!selectedPurchase || rating === null || rating === 0) {
      toast.error('Por favor proporciona una calificación');
      return;
    }
    createReviewMutation.mutate({
      app_id: selectedPurchase.app_id,
      rating: rating,
      comment: comment.trim(),
    });
  };

  const hasReview = (appId: number) => {
    return (myReviews as ReviewType[]).some((review: ReviewType) => review.aplicacion_id === appId);
  };

  // Filtrado y búsqueda
  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase: Purchase) => {
      // Filtro de búsqueda
      const matchesSearch = searchTerm === '' || 
        purchase.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.app_description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de categoría
      const matchesCategory = categoryFilter === 'all' || purchase.app_category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [purchases, searchTerm, categoryFilter]);

  // Obtener categorías únicas
  const uniqueCategories = useMemo(() => {
    const categories = purchases.map((p: Purchase) => p.app_category);
    return Array.from(new Set(categories));
  }, [purchases]);

  return (
    <Box p={3}>
      {/* Encabezado */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <ShoppingBagIcon sx={{ fontSize: 40 }} color="primary" />
        <div>
          <Typography variant="h5" fontWeight={600}>
            Mis Compras
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {purchases.length} aplicaciones adquiridas
          </Typography>
        </div>
      </Box>

      {/* Búsqueda y filtros */}
      <Box mb={3} display="flex" gap={2} flexWrap="wrap">
        <TextField
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Categoría"
          >
            <MenuItem value="all">Todas las categorías</MenuItem>
            {uniqueCategories.map((cat: string) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Contador de resultados */}
      {(searchTerm || categoryFilter !== 'all') && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          Mostrando {filteredPurchases.length} de {purchases.length} compras
        </Typography>
      )}

      {purchases.length === 0 ? (
        <Box textAlign="center" py={8}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes apps compradas aún
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explora la tienda y adquiere tus primeras aplicaciones
          </Typography>
        </Box>
      ) : filteredPurchases.length === 0 ? (
        <Box textAlign="center" py={8}>
          <SearchIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron compras
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta con otros términos de búsqueda o filtros
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredPurchases.map((purchase: Purchase) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={purchase.id}>
              <Card
                sx={{
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={purchase.cover_image || 'https://via.placeholder.com/300x180?text=App'}
                  alt={purchase.app_name}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleOpenApp(purchase.app_url)}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {purchase.app_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {purchase.app_category}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    {purchase.app_description?.substring(0, 80)}...
                  </Typography>
                </CardContent>
                <CardActions sx={{ flexDirection: 'column', gap: 1.5, p: 2, pt: 0 }}>
                  {/* Botón principal - Abrir App */}
                  <Button
                    onClick={() => handleOpenApp(purchase.app_url)}
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<OpenInNewIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    Abrir App
                  </Button>

                  {/* Botones secundarios como iconos */}
                  <Box display="flex" gap={1} width="100%" justifyContent="center">
                    {purchase.credentials && (
                      <Tooltip title="Ver Credenciales" arrow>
                        <IconButton
                          onClick={() => handleOpenCredentials(purchase)}
                          color="secondary"
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'secondary.main',
                              bgcolor: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'secondary.dark'
                                  : 'secondary.light',
                            },
                          }}
                        >
                          <LockOpenIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip
                      title={hasReview(purchase.app_id) ? 'Ya dejaste una review' : 'Dejar Review'}
                      arrow
                    >
                      <span>
                        <IconButton
                          onClick={() => handleOpenReviewDialog(purchase)}
                          color={hasReview(purchase.app_id) ? 'success' : 'primary'}
                          disabled={hasReview(purchase.app_id)}
                          sx={{
                            border: '1px solid',
                            borderColor: hasReview(purchase.app_id) ? 'success.main' : 'divider',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: (theme) =>
                                theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
                            },
                            '&.Mui-disabled': {
                              borderColor: 'success.main',
                              color: 'success.main',
                            },
                          }}
                        >
                          {hasReview(purchase.app_id) ? <CheckCircleIcon /> : <RateReviewIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Ver Detalles de la App" arrow>
                      <IconButton
                        onClick={() => handleOpenDetails(purchase)}
                        color="info"
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            borderColor: 'info.main',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark' ? 'info.dark' : 'info.light',
                          },
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Credentials Dialog */}
      <Dialog open={credentialsDialogOpen} onClose={handleCloseCredentials} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <KeyIcon color="primary" />
            <Typography variant="h6" component="span">
              Credenciales de Acceso
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPurchase?.credentials && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Alert severity="info" sx={{ mb: 1 }}>
                Haz clic en el texto para seleccionarlo y copiarlo fácilmente.
              </Alert>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                  fontWeight={600}
                >
                  Usuario
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'text',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      fontWeight: 500,
                      userSelect: 'all',
                    }}
                  >
                    {JSON.parse(selectedPurchase.credentials).username}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mb={0.5}
                  fontWeight={600}
                >
                  Contraseña
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'text',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      fontWeight: 500,
                      userSelect: 'all',
                    }}
                  >
                    {JSON.parse(selectedPurchase.credentials).password}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCredentials} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Dejar Reseña para {selectedPurchase?.app_name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography component="legend" gutterBottom>
                Calificación
              </Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                size="large"
              />
            </Box>
            <TextField
              label="Comentario (opcional)"
              multiline
              rows={4}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia con esta aplicación..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={!rating || rating === 0}
          >
            Enviar Reseña
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <InfoIcon color="info" />
              <Typography variant="h6" component="span">
                Detalles de la Aplicación
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDetails} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPurchase && (
            <Box>
              {/* Imagen de la app */}
              {selectedPurchase.imagen_portada && (
                <Box
                  component="img"
                  src={selectedPurchase.imagen_portada}
                  alt={selectedPurchase.app_name}
                  sx={{
                    width: '100%',
                    height: 250,
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
              )}

              {/* Nombre y categoría */}
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {selectedPurchase.app_name}
              </Typography>

              <Box display="flex" gap={1} mb={2}>
                <Chip label={selectedPurchase.app_category} color="primary" />
                <Chip
                  label={`$${(selectedPurchase.price || 0).toFixed(2)}`}
                  color="success"
                  variant="outlined"
                />
                <Chip label="Comprada" color="success" />
              </Box>

              {/* Descripción */}
              <Typography variant="body1" paragraph>
                {selectedPurchase.app_description}
              </Typography>

              {/* Información adicional */}
              <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1, mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Información de Compra
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha:</strong>{' '}
                  {new Date(selectedPurchase.purchase_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
                <Typography variant="body2">
                  <strong>URL:</strong>{' '}
                  <a
                    href={selectedPurchase.app_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit' }}
                  >
                    {selectedPurchase.app_url}
                  </a>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Cerrar</Button>
          <Button
            variant="contained"
            startIcon={<OpenInNewIcon />}
            onClick={() => selectedPurchase && handleOpenApp(selectedPurchase.app_url)}
          >
            Abrir App
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Purchases;
