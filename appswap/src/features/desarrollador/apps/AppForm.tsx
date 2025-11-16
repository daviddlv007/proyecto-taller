import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';
import { api } from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import type { App } from '../../../types/types';

interface AppFormState {
  name: string;
  description: string;
  category: string;
  app_url: string;
  cover_image?: string;
  price: number;
  demo_url?: string;
  credentials_template?: string;
}

export const AppForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<AppFormState>({
    name: '',
    description: '',
    category: '',
    app_url: '',
    cover_image: '',
    price: 0,
    demo_url: '',
    credentials_template: '',
  });
  const [loading, setLoading] = useState(false);

  // Cargar datos si es edición
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const apps = await api.getApps();
          const app = apps.find((a) => a.id === Number(id));
          if (app) {
            setForm({
              name: app.nombre,
              description: app.descripcion,
              category: app.categoria,
              app_url: app.url_aplicacion,
              cover_image: app.imagen_portada ?? '',
              price: app.precio ?? 0,
              demo_url: app.url_video ?? '',
              credentials_template: '',
            });
          } else {
            alert('App no encontrada');
          }
        } catch (err) {
          console.error(err);
          alert('Error al cargar la app');
        }
      })();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.nombre]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (id) await api.updateApp(Number(id), form);
      else await api.createApp(form);
      navigate('/desarrollador/apps');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la app');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>
        {id ? 'Editar App' : 'Nueva App'}
      </Typography>

      <TextField
        fullWidth
        label="Nombre"
        name="name"
        value={form.nombre}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Descripción"
        name="description"
        value={form.descripcion}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Categoría"
        name="category"
        value={form.categoria}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="URL de la app"
        name="app_url"
        value={form.url_aplicacion}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="URL de la imagen de portada"
        name="cover_image"
        value={form.imagen_portada}
        onChange={handleChange}
        margin="normal"
        helperText="Opcional: una imagen para mostrar en la lista de apps"
      />

      <TextField
        fullWidth
        label="Precio (USD)"
        name="price"
        type="number"
        value={form.precio}
        onChange={handleChange}
        margin="normal"
        helperText="Ingresa 0 para apps gratuitas"
        inputProps={{ min: 0, step: 0.01 }}
      />

      <TextField
        fullWidth
        label="URL de Demo (opcional)"
        name="demo_url"
        value={form.url_video}
        onChange={handleChange}
        margin="normal"
        helperText="Opcional: URL de una versión demo de tu app"
      />

      <TextField
        fullWidth
        label="Credentials Template (opcional)"
        name="credentials_template"
        value={form.credentials_template}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
        helperText="Opcional: JSON template para credenciales personalizadas"
      />

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {id ? 'Actualizar' : 'Crear'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </Stack>
    </Box>
  );
};
