import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link as MuiLink,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    correo: '',
    contrasena: '',
    nombre: '',
    role: 'buyer' as 'vendor' | 'buyer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError('');
    setLoading(true);

    if (!form.correo || !form.contrasena || !form.nombre) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const success = await register(
        { correo: form.correo, contrasena: form.contrasena, nombre: form.nombre },
        form.role
      );

      if (!success) {
        setError('Error al registrar usuario');
      }
    } catch (err) {
      setError('Error al registrar usuario');
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
        Crear cuenta
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <FormControl fullWidth>
        <InputLabel>Tipo de cuenta</InputLabel>
        <Select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as 'vendor' | 'buyer' })}
          label="Tipo de cuenta"
        >
          <MenuItem value="buyer">Usuario</MenuItem>
          <MenuItem value="vendor">Desarrollador</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Nombre completo"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        fullWidth
        required
      />

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
        disabled={loading || !form.correo || !form.contrasena || !form.nombre}
      >
        {loading ? 'Registrando...' : 'Registrar'}
      </Button>

      <Typography textAlign="center" variant="body2">
        ¿Ya tienes cuenta?{' '}
        <MuiLink component={Link} to="/login">
          Inicia sesión aquí
        </MuiLink>
      </Typography>
    </Box>
  );
}
