import React from 'react';
import LayoutVendor from '../../components/LayoutVendor';
import Dashboard from './Dashboard';
import { AppsList } from './apps/AppsList';
import { AppForm } from './apps/AppForm';
import Sales from './Sales';
import Guide from './Guide';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import type { RouteObject } from 'react-router-dom';

export const vendorRoutes: RouteObject[] = [
  {
    path: '/vendor',
    element: <LayoutVendor />,
    children: [
      // Dashboard (página principal)
      {
        path: 'dashboard',
        element: <Dashboard />,
        handle: { label: 'Dashboard', icon: <DashboardIcon />, sidebar: true },
      },

      // Lista de apps
      {
        path: 'apps',
        element: <AppsList />,
        handle: { label: 'Mis Aplicaciones', icon: <AppsIcon />, sidebar: true },
      },

      // Crear nueva app → NO aparece en sidebar
      {
        path: 'apps/new',
        element: <AppForm />,
        handle: { sidebar: false },
      },

      // Editar app existente → NO aparece en sidebar
      {
        path: 'apps/:id/edit',
        element: <AppForm />,
        handle: { sidebar: false },
      },

      // Ventas (reemplaza Pagos)
      {
        path: 'sales',
        element: <Sales />,
        handle: { label: 'Mis Ventas', icon: <TrendingUpIcon />, sidebar: true },
      },

      // Guía del desarrollador
      {
        path: 'guide',
        element: <Guide />,
        handle: { label: 'Guía', icon: <MenuBookIcon />, sidebar: true },
      },
    ],
  },
];

export default vendorRoutes;
