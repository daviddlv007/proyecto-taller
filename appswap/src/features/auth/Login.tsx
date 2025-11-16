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
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    correo: '',
    contrasena: '',
    role: 'usuario' as 'desarrollador' | 'usuario',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        <Box display="flex" gap={1} justifyContent="center">
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickLogin('vendor@example.com', '123456', 'desarrollador')}
            disabled={loading}
          >
            Desarrollador Demo
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleQuickLogin('buyer@example.com', '123456', 'usuario')}
            disabled={loading}
          >
            Usuario Demo
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
