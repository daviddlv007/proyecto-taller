import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppsIcon from '@mui/icons-material/Apps';
import { api } from '../../services/api';

interface Sale {
  app_id: number;
  app_name: string;
  buyer_id: number;
  buyer_name: string;
  buyer_email: string;
  purchase_date: string;
  price: number;
}

interface SalesData {
  total_apps: number;
  total_sales: number;
  total_revenue: number;
  sales: Sale[];
}

function Sales() {
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

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <TrendingUpIcon sx={{ fontSize: 40 }} color="primary" />
        <div>
          <Typography variant="h5" fontWeight={600}>
            Historial de Ventas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registro detallado de todas tus ventas
          </Typography>
        </div>
      </Box>

      {/* Sales Table */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Historial de Ventas
          </Typography>
          {!salesData || salesData.sales.length === 0 ? (
            <Box textAlign="center" py={6}>
              <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes ventas aún
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tus ventas aparecerán aquí cuando los usuarios compren tus aplicaciones
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ color: 'text.primary' }}>
                      <strong>Aplicación</strong>
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      <strong>Usuario</strong>
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'text.primary' }}>
                      <strong>Precio</strong>
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'text.primary' }}>
                      <strong>Fecha</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesData.sales.map((sale, index) => (
                    <TableRow
                      key={`${sale.app_id}-${sale.buyer_id}-${index}`}
                      hover
                      sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AppsIcon fontSize="small" color="primary" />
                          <Typography variant="body2" fontWeight={500}>
                            {sale.app_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                            <PersonIcon sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Typography variant="body2">{sale.buyer_name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {sale.buyer_email}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={formatCurrency(sale.price)} color="success" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(sale.purchase_date)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Sales;
