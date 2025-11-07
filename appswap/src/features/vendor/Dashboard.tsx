import { useEffect, useState } from 'react';
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
  sales: any[];
}

interface DashboardStats {
  totalApps: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  allApps: App[];
  topApps: Array<{ app: App; sales: number }>;
  recentReviews: Review[];
  recommendations: string[];
}

export default function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener datos de ventas
  const { data: salesData } = useQuery<SalesData>({
    queryKey: ['vendor-sales'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/vendor/sales', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error fetching sales');
      return response.json();
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [apps, payments] = await Promise.all([api.getApps(), api.getPayments()]);

        // Calcular estadísticas
        const confirmedPayments = payments.filter((p: Payment) => p.status === 'confirmed');
        const totalSales = confirmedPayments.length;

        // Calcular revenue desde salesData si está disponible
        const totalRevenue = salesData?.total_revenue || 0;

        // Top apps por ventas
        const salesByApp = new Map<number, number>();
        confirmedPayments.forEach((payment: Payment) => {
          const count = salesByApp.get(payment.app_id) || 0;
          salesByApp.set(payment.app_id, count + 1);
        });

        const topApps = apps
          .map((app: App) => ({
            app,
            sales: salesByApp.get(app.id) || 0,
          }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        // Obtener reviews recientes
        let allReviews: Review[] = [];
        for (const app of apps.slice(0, 5)) {
          try {
            const reviews = await api.getAppReviews(app.id);
            allReviews = [...allReviews, ...reviews];
          } catch (err) {
            console.error(`Error fetching reviews for app ${app.id}:`, err);
          }
        }

        const recentReviews = allReviews.slice(0, 5);
        const averageRating =
          allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : 0;

        setStats({
          totalApps: apps.length,
          totalSales,
          totalRevenue,
          averageRating,
          allApps: apps,
          topApps,
          recentReviews,
          recommendations: [],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [salesData]);

  if (loading) {
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
                        src={app.cover_image || 'https://via.placeholder.com/60'}
                        alt={app.name}
                        sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {app.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {app.category}
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
                              color: i < review.rating ? 'warning.main' : 'grey.300',
                            }}
                          />
                        ))}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        App #{review.app_id}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {review.comment.length > 80
                        ? `${review.comment.substring(0, 80)}...`
                        : review.comment}
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
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <CategoryIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Ventas por Categoría
              </Typography>
            </Box>

            {(() => {
              // Agrupar apps por categoría
              const salesByCategory = stats.allApps.reduce(
                (acc, app) => {
                  const appSales = stats.topApps.find((t) => t.app.id === app.id)?.sales || 0;
                  if (!acc[app.category]) {
                    acc[app.category] = { sales: 0, revenue: 0, count: 0 };
                  }
                  acc[app.category].sales += appSales;
                  acc[app.category].revenue += appSales * app.price;
                  acc[app.category].count += 1;
                  return acc;
                },
                {} as Record<string, { sales: number; revenue: number; count: number }>
              );

              const categories = Object.entries(salesByCategory)
                .sort(([, a], [, b]) => b.sales - a.sales)
                .slice(0, 6);

              const maxSales = Math.max(...categories.map(([, data]) => data.sales), 1);
              const chartHeight = 220;
              const barWidth = 40;
              const gap = 20;
              const chartWidth = categories.length * (barWidth + gap);
              const topPadding = 30; // Espacio superior para los números

              return categories.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No hay ventas registradas aún
                </Typography>
              ) : (
                <Box>
                  {/* Gráfico SVG de Barras */}
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
                            stroke="#e0e0e0"
                            strokeWidth={1}
                            strokeDasharray="4,4"
                          />
                          <text
                            x={-5}
                            y={topPadding + chartHeight - (chartHeight * percent) / 100 + 4}
                            fill="#999"
                            fontSize={11}
                            textAnchor="end"
                          >
                            {Math.round((maxSales * percent) / 100)}
                          </text>
                        </g>
                      ))}

                      {/* Barras */}
                      {categories.map(([category, data], index) => {
                        const barHeight = (data.sales / maxSales) * chartHeight;
                        const x = index * (barWidth + gap) + gap / 2;
                        const y = topPadding + chartHeight - barHeight;

                        return (
                          <g key={category}>
                            {/* Barra */}
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={barHeight}
                              fill="url(#gradient-primary)"
                              rx={4}
                            />

                            {/* Valor encima */}
                            <text
                              x={x + barWidth / 2}
                              y={y - 8}
                              fill="#1976d2"
                              fontSize={13}
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {data.sales}
                            </text>

                            {/* Categoría debajo */}
                            <text
                              x={x + barWidth / 2}
                              y={topPadding + chartHeight + 20}
                              fill={theme.palette.mode === 'dark' ? '#fff' : '#666'}
                              fontSize={11}
                              fontWeight="500"
                              textAnchor="middle"
                            >
                              {category.substring(0, 10)}
                            </text>

                            {/* Revenue debajo */}
                            <text
                              x={x + barWidth / 2}
                              y={topPadding + chartHeight + 35}
                              fill={theme.palette.mode === 'dark' ? '#bbb' : '#999'}
                              fontSize={10}
                              textAnchor="middle"
                            >
                              ${data.revenue.toFixed(0)}
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

                  {/* Leyenda */}
                  <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
                    {categories.map(([category, data]) => (
                      <Chip
                        key={category}
                        label={`${category}: ${data.count} app${data.count > 1 ? 's' : ''}`}
                        size="small"
                        variant="outlined"
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
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <TimelineIcon color="success" />
              <Typography variant="h6" fontWeight={600}>
                Revenue por App
              </Typography>
            </Box>

            {stats.allApps.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No hay apps publicadas
              </Typography>
            ) : (
              <Box>
                {(() => {
                  const appsWithSales = stats.allApps
                    .map((app) => {
                      const sales = stats.topApps.find((t) => t.app.id === app.id)?.sales || 0;
                      const revenue = sales * app.price;
                      return { app, sales, revenue };
                    })
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 6);

                  const maxRevenue = Math.max(...appsWithSales.map((a) => a.revenue), 1);
                  const barHeight = 32;
                  const gap = 16;
                  const chartHeight = appsWithSales.length * (barHeight + gap);
                  const chartWidth = 400;

                  return (
                    <Box sx={{ overflowX: 'auto' }}>
                      <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
                        {appsWithSales.map((item, index) => {
                          const barWidth = (item.revenue / maxRevenue) * (chartWidth - 120);
                          const y = index * (barHeight + gap);

                          // Colores diferentes por índice
                          const colors = [
                            '#2e7d32',
                            '#388e3c',
                            '#43a047',
                            '#4caf50',
                            '#66bb6a',
                            '#81c784',
                          ];
                          const color = colors[index % colors.length];

                          return (
                            <g key={item.app.id}>
                              {/* Nombre de la app */}
                              <text
                                x={0}
                                y={y + barHeight / 2 + 5}
                                fill={theme.palette.mode === 'dark' ? '#fff' : '#333'}
                                fontSize={12}
                                fontWeight="500"
                              >
                                {item.app.name.substring(0, 15)}
                                {item.app.name.length > 15 ? '...' : ''}
                              </text>

                              {/* Barra */}
                              <rect
                                x={120}
                                y={y + 2}
                                width={barWidth || 2}
                                height={barHeight - 4}
                                fill={color}
                                rx={3}
                                opacity={0.85}
                              />

                              {/* Revenue */}
                              <text
                                x={125 + barWidth + 5}
                                y={y + barHeight / 2 + 5}
                                fill={color}
                                fontSize={13}
                                fontWeight="bold"
                              >
                                ${item.revenue.toFixed(2)}
                              </text>

                              {/* Ventas */}
                              <text
                                x={120}
                                y={y + barHeight / 2 + 5}
                                fill="#fff"
                                fontSize={10}
                                fontWeight="600"
                                textAnchor="start"
                                style={{ paddingLeft: '4px' }}
                              >
                                {item.sales > 0
                                  ? `  ${item.sales} venta${item.sales > 1 ? 's' : ''}`
                                  : ''}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
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
