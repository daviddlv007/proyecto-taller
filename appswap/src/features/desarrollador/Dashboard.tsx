import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Chip,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import TimelineIcon from '@mui/icons-material/Timeline';
import PriceSuggestions from './PriceSuggestions';
import type { App, Payment, Review } from '../../types/types';

interface SalesData {
  total_apps: number;
  total_sales: number;
  total_revenue: number;
  sales: Payment[];
}

interface DashboardStats {
  totalApps: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  allApps: App[];
  topApps: Array<{ app: App; sales: number; revenue: number }>;
  recentReviews: Review[];
  salesByApp: Map<number, { sales: number; revenue: number }>;
}

export default function Dashboard() {
  const theme = useTheme();
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredApp, setHoveredApp] = useState<number | null>(null);
  
  // Estados para filtros interactivos
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sales' | 'revenue'>('revenue');
  const [topN, setTopN] = useState<number>(6);

  // Obtener datos de ventas con auto-refetch cada 30 segundos
  const { data: salesData, isLoading: salesLoading } = useQuery<SalesData>({
    queryKey: ['vendor-sales'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/desarrollador/sales', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error fetching sales');
      return response.json();
    },
    refetchInterval: 30000, // Refetch cada 30 segundos
    staleTime: 10000, // Considerar datos stale después de 10 segundos
  });

  // Obtener apps del vendor con auto-refetch
  const { data: apps, isLoading: appsLoading } = useQuery<App[]>({
    queryKey: ['vendor-apps'],
    queryFn: api.getApps,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // Obtener todas las reviews con auto-refetch
  const { data: allReviewsData, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ['vendor-reviews', apps?.map((a) => a.id)],
    queryFn: async () => {
      if (!apps || apps.length === 0) return [];
      
      const reviewsPromises = apps.map(async (app) => {
        try {
          return await api.getAppReviews(app.id);
        } catch (err) {
          console.error(`Error fetching reviews for app ${app.id}:`, err);
          return [];
        }
      });
      
      const reviewsArrays = await Promise.all(reviewsPromises);
      return reviewsArrays.flat();
    },
    enabled: !!apps && apps.length > 0,
    refetchInterval: 60000, // Refetch reviews cada 60 segundos
    staleTime: 30000,
  });

  // Procesar datos para estadísticas
  const stats: DashboardStats | null = (() => {
    if (!apps || !salesData) return null;

    // salesData.sales ya contiene solo ventas confirmadas del vendor
    const vendorSales = salesData.sales;
    
    // Calcular ventas y revenue por app
    const salesByApp = new Map<number, { sales: number; revenue: number }>();
    vendorSales.forEach((sale: any) => {
      const current = salesByApp.get(sale.app_id) || { sales: 0, revenue: 0 };
      // Usar el precio que viene en la venta (histórico)
      const price = sale.price || 0; // Backend envía 'price', no 'precio'
      
      salesByApp.set(sale.app_id, {
        sales: current.sales + 1,
        revenue: current.revenue + price,
      });
    });

    // Top apps por ventas
    const topApps = apps
      .map((app: App) => {
        const appData = salesByApp.get(app.id) || { sales: 0, revenue: 0 };
        return {
          app,
          sales: appData.sales,
          revenue: appData.revenue,
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Reviews recientes
    const recentReviews = (allReviewsData || [])
      .sort((a, b) => b.id - a.id) // Ordenar por ID (más reciente primero)
      .slice(0, 5);

    const averageRating =
      allReviewsData && allReviewsData.length > 0
        ? allReviewsData.reduce((sum, r) => sum + r.calificacion, 0) / allReviewsData.length
        : 0;

    return {
      totalApps: apps.length,
      totalSales: salesData.total_sales,
      totalRevenue: salesData.total_revenue,
      averageRating,
      allApps: apps,
      topApps,
      recentReviews,
      salesByApp,
    };
  })();

  if (salesLoading || appsLoading || reviewsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error">
          Error al cargar el dashboard
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Encabezado */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <DashboardIcon sx={{ fontSize: 40 }} color="primary" />
        <div>
          <Typography variant="h5" fontWeight={600}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resumen de tu rendimiento
          </Typography>
        </div>
      </Box>

      {/* Tarjetas de estadísticas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Apps
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalApps}
                  </Typography>
                </Box>
                <AppsIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Ventas Totales
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalSales}
                  </Typography>
                </Box>
                <ShoppingCartIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Calificación Promedio
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.averageRating.toFixed(1)}
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Tendencia
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />+
                    {Math.round(stats.totalSales / Math.max(stats.totalApps, 1))}%
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Apps más vendidas */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TrendingUpIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Apps Más Vendidas
              </Typography>
            </Box>

            {stats.topApps.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No hay ventas aún
              </Typography>
            ) : (
              <Box>
                {stats.topApps.map(({ app, sales }, index) => (
                  <Box
                    key={app.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    py={2}
                    borderBottom={index < stats.topApps.length - 1 ? '1px solid' : 'none'}
                    borderColor="divider"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="h6" color="text.secondary" fontWeight="bold">
                        #{index + 1}
                      </Typography>
                      <Box
                        component="img"
                        src={app.imagen_portada || 'https://via.placeholder.com/60'}
                        alt={app.nombre}
                        sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {app.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {app.categoria}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {sales}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ventas
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Reviews recientes */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <StarIcon color="warning" />
              <Typography variant="h6" fontWeight={600}>
                Reviews Recientes
              </Typography>
            </Box>

            {stats.recentReviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No hay reviews aún
              </Typography>
            ) : (
              <Box>
                {stats.recentReviews.map((review) => (
                  <Box key={review.id} py={2} borderBottom="1px solid" borderColor="divider">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Box display="flex" gap={0.5}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            sx={{
                              fontSize: 16,
                              color: i < review.calificacion ? 'warning.main' : 'grey.300',
                            }}
                          />
                        ))}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        App #{review.app_id}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {review.comentario.length > 80
                        ? `${review.comentario.substring(0, 80)}...`
                        : review.comentario}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos de Análisis */}
      <Grid container spacing={3} mt={2}>
        {/* Gráfico de Barras - Ventas por Categoría */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <CategoryIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Ventas por Categoría
                </Typography>
              </Box>
              {/* Control de ordenamiento */}
              <Box display="flex" gap={1}>
                <Chip
                  label="Por Ventas"
                  size="small"
                  color={sortBy === 'sales' ? 'primary' : 'default'}
                  onClick={() => setSortBy('sales')}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Por Revenue"
                  size="small"
                  color={sortBy === 'revenue' ? 'primary' : 'default'}
                  onClick={() => setSortBy('revenue')}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>

            {(() => {
              // Agrupar apps por categoría usando el Map de salesByApp
              const salesByCategory = stats.allApps.reduce(
                (acc, app) => {
                  const appData = stats.salesByApp.get(app.id) || { sales: 0, revenue: 0 };
                  if (!acc[app.categoria]) {
                    acc[app.categoria] = { sales: 0, revenue: 0, count: 0 };
                  }
                  acc[app.categoria].sales += appData.sales;
                  acc[app.categoria].revenue += appData.revenue;
                  acc[app.categoria].count += 1;
                  return acc;
                },
                {} as Record<string, { sales: number; revenue: number; count: number }>
              );

              const categories = Object.entries(salesByCategory)
                .sort(([, a], [, b]) => {
                  if (sortBy === 'sales') {
                    return b.sales - a.sales;
                  }
                  return b.revenue - a.revenue;
                })
                .slice(0, 6);

              const maxValue = Math.max(
                ...categories.map(([, data]) => (sortBy === 'sales' ? data.sales : data.revenue)),
                1
              );
              const chartHeight = 220;
              const barWidth = 40;
              const gap = 20;
              const chartWidth = categories.length * (barWidth + gap);
              const topPadding = 30;

              return categories.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No hay ventas registradas aún
                </Typography>
              ) : (
                <Box>
                  {/* Gráfico SVG de Barras Interactivo */}
                  <Box sx={{ overflowX: 'auto', mb: 2 }}>
                    <svg
                      width={chartWidth}
                      height={chartHeight + topPadding + 60}
                      style={{ display: 'block' }}
                    >
                      {/* Grid lines */}
                      {[0, 25, 50, 75, 100].map((percent) => (
                        <g key={percent}>
                          <line
                            x1={0}
                            y1={topPadding + chartHeight - (chartHeight * percent) / 100}
                            x2={chartWidth}
                            y2={topPadding + chartHeight - (chartHeight * percent) / 100}
                            stroke={theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'}
                            strokeWidth={1}
                            strokeDasharray="4,4"
                          />
                          <text
                            x={-5}
                            y={topPadding + chartHeight - (chartHeight * percent) / 100 + 4}
                            fill={theme.palette.mode === 'dark' ? '#999' : '#666'}
                            fontSize={11}
                            textAnchor="end"
                          >
                            {sortBy === 'sales'
                              ? Math.round((maxValue * percent) / 100)
                              : `$${Math.round((maxValue * percent) / 100)}`}
                          </text>
                        </g>
                      ))}

                      {/* Barras Interactivas */}
                      {categories.map(([category, data], index) => {
                        const value = sortBy === 'sales' ? data.sales : data.revenue;
                        const barHeight = (value / maxValue) * chartHeight;
                        const x = index * (barWidth + gap) + gap / 2;
                        const y = topPadding + chartHeight - barHeight;
                        const isHovered = hoveredBar === category;

                        return (
                          <g key={category}>
                            {/* Barra con hover effect */}
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={barHeight}
                              fill={isHovered ? '#1565c0' : 'url(#gradient-primary)'}
                              rx={4}
                              style={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                filter: isHovered ? 'brightness(1.1)' : 'none',
                              }}
                              onMouseEnter={() => setHoveredBar(category)}
                              onMouseLeave={() => setHoveredBar(null)}
                            >
                              <title>
                                {`${category}\n${data.sales} ventas\n$${data.revenue.toFixed(2)} revenue\n${data.count} apps`}
                              </title>
                            </rect>

                            {/* Valor encima con animación */}
                            <text
                              x={x + barWidth / 2}
                              y={y - 8}
                              fill={isHovered ? '#0d47a1' : '#1976d2'}
                              fontSize={isHovered ? 15 : 13}
                              fontWeight="bold"
                              textAnchor="middle"
                              style={{ transition: 'all 0.3s ease' }}
                            >
                              {sortBy === 'sales' ? data.sales : `$${data.revenue.toFixed(0)}`}
                            </text>

                            {/* Categoría debajo */}
                            <text
                              x={x + barWidth / 2}
                              y={topPadding + chartHeight + 20}
                              fill={
                                isHovered
                                  ? theme.palette.primary.main
                                  : theme.palette.mode === 'dark'
                                    ? '#fff'
                                    : '#666'
                              }
                              fontSize={11}
                              fontWeight={isHovered ? 600 : 500}
                              textAnchor="middle"
                              style={{ transition: 'all 0.3s ease' }}
                            >
                              {category.substring(0, 10)}
                            </text>

                            {/* Métrica secundaria debajo */}
                            <text
                              x={x + barWidth / 2}
                              y={topPadding + chartHeight + 35}
                              fill={
                                isHovered
                                  ? theme.palette.primary.main
                                  : theme.palette.mode === 'dark'
                                    ? '#bbb'
                                    : '#999'
                              }
                              fontSize={isHovered ? 11 : 10}
                              fontWeight={isHovered ? 600 : 400}
                              textAnchor="middle"
                              style={{ transition: 'all 0.3s ease' }}
                            >
                              {sortBy === 'sales'
                                ? `$${data.revenue.toFixed(0)}`
                                : `${data.sales} ventas`}
                            </text>
                          </g>
                        );
                      })}

                      {/* Gradiente */}
                      <defs>
                        <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#1976d2" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#1976d2" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </Box>

                  {/* Leyenda Interactiva */}
                  <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
                    {categories.map(([category, data]) => (
                      <Chip
                        key={category}
                        label={`${category}: ${data.count} app${data.count > 1 ? 's' : ''}`}
                        size="small"
                        variant={hoveredBar === category ? 'filled' : 'outlined'}
                        color={hoveredBar === category ? 'primary' : 'default'}
                        onMouseEnter={() => setHoveredBar(category)}
                        onMouseLeave={() => setHoveredBar(null)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })()}
          </Paper>
        </Grid>

        {/* Gráfico de Barras Horizontales - Performance por App */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <TimelineIcon color="success" />
                <Typography variant="h6" fontWeight={600}>
                  Revenue por App
                </Typography>
              </Box>
              {/* Controles */}
              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Mostrar:
                </Typography>
                {[3, 6, 10].map((n) => (
                  <Chip
                    key={n}
                    label={`Top ${n}`}
                    size="small"
                    color={topN === n ? 'success' : 'default'}
                    onClick={() => setTopN(n)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Filtro por categoría */}
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip
                label="Todas"
                size="small"
                color={selectedCategory === 'all' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('all')}
                sx={{ cursor: 'pointer' }}
              />
              {[
                ...new Set(stats.allApps.map((app) => app.categoria)),
              ].map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  size="small"
                  color={selectedCategory === cat ? 'primary' : 'default'}
                  onClick={() => setSelectedCategory(cat)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>

            {stats.allApps.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No hay apps publicadas
              </Typography>
            ) : (
              <Box>
                {(() => {
                  // Filtrar por categoría si está seleccionada
                  const filteredApps =
                    selectedCategory === 'all'
                      ? stats.allApps
                      : stats.allApps.filter((app) => app.categoria === selectedCategory);

                  const appsWithSales = filteredApps
                    .map((app) => {
                      const appData = stats.salesByApp.get(app.id) || { sales: 0, revenue: 0 };
                      return {
                        app,
                        sales: appData.sales,
                        revenue: appData.revenue,
                      };
                    })
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, topN);

                  const maxRevenue = Math.max(...appsWithSales.map((a) => a.revenue), 1);
                  const barHeight = 36;
                  const gap = 12;
                  const chartHeight = appsWithSales.length * (barHeight + gap);
                  const chartWidth = 500; // Ancho fijo más grande para evitar cortes

                  return (
                    <Box sx={{ overflowX: 'auto' }}>
                      <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                        {appsWithSales.map((item, index) => {
                          const barWidth = Math.max(
                            (item.revenue / maxRevenue) * (chartWidth - 180), // Más espacio para labels
                            2
                          );
                          const y = index * (barHeight + gap);
                          const isHovered = hoveredApp === item.app.id;

                          // Colores diferentes por índice con efecto hover
                          const colors = [
                            { normal: '#2e7d32', hover: '#1b5e20' },
                            { normal: '#388e3c', hover: '#2e7d32' },
                            { normal: '#43a047', hover: '#388e3c' },
                            { normal: '#4caf50', hover: '#43a047' },
                            { normal: '#66bb6a', hover: '#4caf50' },
                            { normal: '#81c784', hover: '#66bb6a' },
                            { normal: '#a5d6a7', hover: '#81c784' },
                            { normal: '#c8e6c9', hover: '#a5d6a7' },
                            { normal: '#1b5e20', hover: '#0d3d14' },
                            { normal: '#2e7d32', hover: '#1b5e20' },
                          ];
                          const colorSet = colors[index % colors.length];
                          const color = isHovered ? colorSet.hover : colorSet.normal;

                          return (
                            <g
                              key={item.app.id}
                              onMouseEnter={() => setHoveredApp(item.app.id)}
                              onMouseLeave={() => setHoveredApp(null)}
                              style={{ cursor: 'pointer' }}
                            >
                              {/* Nombre de la app con hover effect */}
                              <text
                                x={0}
                                y={y + barHeight / 2 + 5}
                                fill={
                                  isHovered
                                    ? theme.palette.primary.main
                                    : theme.palette.mode === 'dark'
                                      ? '#fff'
                                      : '#333'
                                }
                                fontSize={isHovered ? 13 : 12}
                                fontWeight={isHovered ? 600 : 500}
                                style={{ transition: 'all 0.3s ease' }}
                              >
                                {item.app.nombre.substring(0, 15)}
                                {item.app.nombre.length > 15 ? '...' : ''}
                              </text>

                              {/* Barra con hover effect y animación */}
                              <rect
                                x={130}
                                y={y + 2}
                                width={barWidth}
                                height={barHeight - 4}
                                fill={color}
                                rx={4}
                                style={{
                                  transition: 'all 0.3s ease',
                                  opacity: isHovered ? 1 : 0.85,
                                  filter: isHovered ? 'brightness(1.1)' : 'none',
                                }}
                              >
                                <title>
                                  {`${item.app.nombre}\n${item.sales} ventas\n$${item.revenue.toFixed(2)} revenue`}
                                </title>
                              </rect>

                              {/* Revenue con hover effect */}
                              <text
                                x={135 + barWidth + 5}
                                y={y + barHeight / 2 + 5}
                                fill={color}
                                fontSize={isHovered ? 14 : 13}
                                fontWeight="bold"
                                style={{ transition: 'all 0.3s ease' }}
                              >
                                ${item.revenue.toFixed(2)}
                              </text>

                              {/* Ventas dentro de la barra */}
                              {item.sales > 0 && barWidth > 60 && (
                                <text
                                  x={135}
                                  y={y + barHeight / 2 + 5}
                                  fill="#fff"
                                  fontSize={10}
                                  fontWeight="600"
                                  textAnchor="start"
                                  style={{ pointerEvents: 'none' }}
                                >
                                  {`  ${item.sales} venta${item.sales > 1 ? 's' : ''}`}
                                </text>
                              )}

                              {/* Badge de categoría en hover */}
                              {isHovered && (
                                <text
                                  x={0}
                                  y={y + barHeight / 2 + 20}
                                  fill={theme.palette.text.secondary}
                                  fontSize={9}
                                  fontStyle="italic"
                                >
                                  {item.app.categoria} • ${item.app.precio}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>

                      {/* Resumen estadístico */}
                      <Box
                        mt={2}
                        p={1.5}
                        bgcolor={theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.08)'}
                        borderRadius={1}
                      >
                        <Typography variant="caption" color="text.secondary">
                          <strong>Total Revenue:</strong> $
                          {appsWithSales.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}
                          {' • '}
                          <strong>Apps con ventas:</strong>{' '}
                          {appsWithSales.filter((item) => item.sales > 0).length} de{' '}
                          {stats.allApps.length}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })()}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Optimización de Precios ML */}
      <Box mt={4}>
        <PriceSuggestions apps={stats.allApps} />
      </Box>
    </Box>
  );
}
