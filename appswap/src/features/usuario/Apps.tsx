import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Card,
  CardContent,
  Chip,
  Stack,
  Collapse,
  Button,
  IconButton,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import type { App } from '../../types/types';
import { BuyerAppCard } from './BuyerAppCard';

export default function Apps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: apps = [],
    isLoading,
    error,
  } = useQuery<App[]>({
    queryKey: ['buyerApps'],
    queryFn: async () => {
      console.log('🔍 Obteniendo apps del comprador...');
      const result = await api.getBuyerApps();
      console.log('📦 Apps recibidas:', result);
      return result;
    },
  });

  // Obtener reviews para calcular ratings - deshabilitado porque no hay endpoint público
  // Las reviews se muestran solo después de comprar
  const allReviews: any[] = [];

  // Calcular rating promedio por app
  const appRatings = useMemo(() => {
    const ratings: Record<number, number> = {};
    apps.forEach((app) => {
      // Por defecto 0, se mostrará después de comprar
      ratings[app.id] = 0;
    });
    return ratings;
  }, [apps]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(apps.map((app) => app.categoria))];
    return uniqueCategories.sort();
  }, [apps]);

  // Calcular rango de precios
  const maxPrice = useMemo(() => {
    if (apps.length === 0) return 1000;
    return Math.ceil(Math.max(...apps.map((app) => app.precio)));
  }, [apps]);

  // Filtrar y buscar apps
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Búsqueda por nombre o descripción
      const matchesSearch =
        searchTerm === '' ||
        app.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.descripcion && app.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro por categoría
      const matchesCategory = categoryFilter === 'all' || app.categoria === categoryFilter;

      // Filtro por precio
      const matchesPrice = app.precio >= priceRange[0] && app.precio <= priceRange[1];

      // Filtro por calificación
      const appRating = appRatings[app.id] || 0;
      const matchesRating = appRating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [apps, searchTerm, categoryFilter, priceRange, minRating, appRatings]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPriceRange([0, maxPrice]);
    setMinRating(0);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (categoryFilter !== 'all') count++;
    if (priceRange[0] !== 0 || priceRange[1] !== maxPrice) count++;
    if (minRating > 0) count++;
    return count;
  }, [searchTerm, categoryFilter, priceRange, minRating, maxPrice]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error" gutterBottom>
          Error al cargar las aplicaciones
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {(error as Error).message || 'Error desconocido'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Encabezado */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <StorefrontIcon sx={{ fontSize: 40 }} color="primary" />
        <div>
          <Typography variant="h5" fontWeight={600}>
            Tienda de Apps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explora y adquiere las mejores aplicaciones web
          </Typography>
        </div>
      </Box>

      {/* Barra de búsqueda */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar por nombre o descripción..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
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

      {/* Botón para mostrar/ocultar filtros */}
      <Box display="flex" gap={1} mb={2}>
        <Button
          variant={showFilters ? 'contained' : 'outlined'}
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
        {activeFiltersCount > 0 && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
          >
            Limpiar Filtros
          </Button>
        )}
      </Box>

      {/* Panel de filtros colapsable */}
      <Collapse in={showFilters}>
        <Card sx={{ mb: 3, bgcolor: 'action.hover' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filtrar Resultados
            </Typography>
            <Grid container spacing={3}>
              {/* Filtro por categoría */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Categoría"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="all">Todas las categorías</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Filtro por calificación */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Calificación mínima</InputLabel>
                  <Select
                    value={minRating}
                    label="Calificación mínima"
                    onChange={(e) => setMinRating(e.target.value as number)}
                  >
                    <MenuItem value={0}>Todas</MenuItem>
                    <MenuItem value={4}>⭐ 4+ estrellas</MenuItem>
                    <MenuItem value={3}>⭐ 3+ estrellas</MenuItem>
                    <MenuItem value={2}>⭐ 2+ estrellas</MenuItem>
                    <MenuItem value={1}>⭐ 1+ estrella</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Filtro por precio */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography gutterBottom>
                  Rango de Precio: ${priceRange[0]} - ${priceRange[1]}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={maxPrice}
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>

            {/* Chips de filtros activos */}
            {activeFiltersCount > 0 && (
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Filtros activos:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {searchTerm && (
                    <Chip
                      label={`Búsqueda: "${searchTerm}"`}
                      size="small"
                      onDelete={() => setSearchTerm('')}
                    />
                  )}
                  {categoryFilter !== 'all' && (
                    <Chip
                      label={`Categoría: ${categoryFilter}`}
                      size="small"
                      onDelete={() => setCategoryFilter('all')}
                    />
                  )}
                  {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                    <Chip
                      label={`Precio: $${priceRange[0]}-$${priceRange[1]}`}
                      size="small"
                      onDelete={() => setPriceRange([0, maxPrice])}
                    />
                  )}
                  {minRating > 0 && (
                    <Chip
                      label={`Mín. ${minRating}⭐`}
                      size="small"
                      onDelete={() => setMinRating(0)}
                    />
                  )}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Collapse>

      {/* Resultados */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Mostrando {filteredApps.length} de {apps.length} aplicaciones
        </Typography>
      </Box>

      {filteredApps.length === 0 ? (
        <Box textAlign="center" py={8}>
          <StorefrontIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron aplicaciones
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Intenta ajustar tus filtros de búsqueda
          </Typography>
          {activeFiltersCount > 0 && (
            <Button variant="outlined" onClick={handleClearFilters}>
              Limpiar todos los filtros
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2} alignItems="stretch">
          {filteredApps.map((app) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={app.id} sx={{ display: 'flex' }}>
              <BuyerAppCard app={app} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
