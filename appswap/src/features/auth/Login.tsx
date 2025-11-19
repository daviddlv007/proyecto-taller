import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    correo: '',
    contrasena: '',
    role: 'usuario' as 'desarrollador' | 'usuario',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handle = async () => {
    setError('');
    setLoading(true);

    try {
      const success = await login(form.correo, form.contrasena, form.role);
      if (!success) {
        setError('Correo o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, password: string, role: 'desarrollador' | 'usuario') => {
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (!success) {
        setError('Error en login rápido');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('⚠️ ADVERTENCIA: Esto borrará TODOS los datos y regenerará la base de datos con 1000+ ventas. ¿Continuar?')) {
      return;
    }

    setResetting(true);
    setError('');
    setResetSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/reset-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Error al resetear la base de datos');
      }

      const data = await response.json();
      console.log('✅ Reset completo:', data);
      setResetSuccess(true);
      alert(`✅ Reset exitoso!\n\n📊 Base de datos regenerada:\n- ${data.steps_completed['2_data_seeded'].users} usuarios\n- ${data.steps_completed['2_data_seeded'].apps} apps\n- ${data.steps_completed['2_data_seeded'].purchases} compras\n- ${data.steps_completed['2_data_seeded'].reviews} reviews\n\n🤖 Modelos ML entrenados y listos\n\n🔐 Usuarios de prueba:\n- dev@test.com / password (Desarrollador)\n- comprador@test.com / password (Usuario)`);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al resetear la base de datos');
    } finally {
      setResetting(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} display="flex" flexDirection="column" gap={3} p={3}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        AppSwap
      </Typography>
      <Typography variant="h6" textAlign="center" color="text.secondary">
        Iniciar sesión
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <FormControl fullWidth>
        <InputLabel>Tipo de cuenta</InputLabel>
        <Select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as 'desarrollador' | 'usuario' })}
          label="Tipo de cuenta"
        >
          <MenuItem value="usuario">Usuario</MenuItem>
          <MenuItem value="desarrollador">Desarrollador</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Correo electrónico"
        type="email"
        value={form.correo}
        onChange={(e) => setForm({ ...form, correo: e.target.value })}
        fullWidth
        required
      />

      <TextField
        label="Contraseña"
        type="password"
        value={form.contrasena}
        onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
        fullWidth
        required
      />

      <Button
        variant="contained"
        onClick={handle}
        fullWidth
        size="large"
        disabled={loading || !form.correo || !form.contrasena}
      >
        {loading ? 'Iniciando sesión...' : 'Ingresar'}
      </Button>

      <Typography textAlign="center" variant="body2">
        ¿No tienes cuenta?{' '}
        <MuiLink component={Link} to="/register">
          Regístrate aquí
        </MuiLink>
      </Typography>

      {/* Botones de desarrollo rápido */}
      <Box mt={4} pt={3} borderTop="1px solid" borderColor="divider">
        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          display="block"
          mb={2}
        >
          🔧 Acceso Rápido (Desarrollo)
        </Typography>
        
        {resetSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Base de datos reseteada exitosamente con 1000+ ventas
          </Alert>
        )}
        
        <Box display="flex" gap={1} justifyContent="center" mb={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickLogin('dev@test.com', 'password', 'desarrollador')}
            disabled={loading || resetting}
          >
            Desarrollador Demo
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickLogin('comprador@test.com', 'password', 'usuario')}
            disabled={loading || resetting}
          >
            Usuario Demo
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Admin
          </Typography>
        </Divider>
        
        <Button
          variant="contained"
          color="warning"
          size="small"
          fullWidth
          startIcon={resetting ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          onClick={handleResetDatabase}
          disabled={loading || resetting}
        >
          {resetting ? 'Reseteando DB...' : '🔄 Reset DB + Seed + ML Train'}
        </Button>
        
        <Typography variant="caption" display="block" textAlign="center" color="text.secondary" mt={1}>
          Limpia, puebla (1000+ ventas) y entrena modelos ML
        </Typography>
      </Box>
    </Box>
  );
}
