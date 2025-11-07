import os

# Ruta base del proyecto (desde scripts/)
BASE_DIR = os.path.join('..', 'src',  'features', 'vendor', 'apps')

# Contenido de cada archivo
files = {
    'AppsList.tsx': """import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, CircularProgress } from '@mui/material';
import { getApps, deleteApp } from '../../../services/api';
import { AppCard } from './AppCard';
import { useNavigate } from 'react-router-dom';

export const AppsList = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await getApps();
      setApps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta app?')) return;
    try {
      await deleteApp(id);
      fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (app: any) => navigate(`/vendor/apps/${app.id}/edit`);
  const handleNew = () => navigate('/vendor/apps/new');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Mis Apps</Typography>
        <Button variant="contained" onClick={handleNew}>Nueva App</Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {apps.map(app => (
            <Grid item key={app.id}>
              <AppCard app={app} onEdit={handleEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
""",
    'AppForm.tsx': """import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { createApp, updateApp, getApps } from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export const AppForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ name: '', description: '', category: '', app_url: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const apps = await getApps();
          const app = apps.find(a => a.id === Number(id));
          if (app) setForm(app);
          else alert('App no encontrada');
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (id) await updateApp(Number(id), form);
      else await createApp(form);
      navigate('/vendor/apps');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la app');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>{id ? 'Editar App' : 'Nueva App'}</Typography>
      <TextField fullWidth label="Nombre" name="name" value={form.name} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Descripción" name="description" value={form.description} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="Categoría" name="category" value={form.category} onChange={handleChange} margin="normal" />
      <TextField fullWidth label="URL de la app" name="app_url" value={form.app_url} onChange={handleChange} margin="normal" />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading}>
        {id ? 'Actualizar' : 'Crear'}
      </Button>
    </Box>
  );
};
""",
    'AppCard.tsx': """import React from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';

interface AppCardProps {
  app: { id: number; name: string; description: string; category: string; app_url: string };
  onEdit: (app: any) => void;
  onDelete: (id: number) => void;
}

export const AppCard = ({ app, onEdit, onDelete }: AppCardProps) => (
  <Card sx={{ width: 300, m: 1, p: 2 }}>
    <CardContent>
      <Typography variant="h6">{app.name}</Typography>
      <Typography variant="body2" color="text.secondary">{app.category}</Typography>
      <Typography variant="body2">{app.description}</Typography>
      <Stack direction="row" spacing={1} mt={2}>
        <Button size="small" onClick={() => onEdit(app)}>Editar</Button>
        <Button size="small" color="error" onClick={() => onDelete(app.id)}>Eliminar</Button>
        <Button size="small" href={app.app_url} target="_blank">Ver</Button>
      </Stack>
    </CardContent>
  </Card>
);
""",
    'routes.tsx': """import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppsList } from './AppsList';
import { AppForm } from './AppForm';

export const VendorAppsRoutes = () => (
  <Routes>
    <Route path="apps" element={<AppsList />} />
    <Route path="apps/new" element={<AppForm />} />
    <Route path="apps/:id/edit" element={<AppForm />} />
  </Routes>
);
"""
}

def create_folder_structure():
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)
        print(f"Carpeta creada: {BASE_DIR}")
    else:
        print(f"La carpeta ya existe: {BASE_DIR}")

def create_files():
    for filename, content in files.items():
        filepath = os.path.join(BASE_DIR, filename)
        if not os.path.exists(filepath):
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Archivo creado: {filepath}")
        else:
            print(f"El archivo ya existe: {filepath}")

if __name__ == "__main__":
    create_folder_structure()
    create_files()
