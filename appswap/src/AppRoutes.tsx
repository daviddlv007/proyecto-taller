import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { publicRoutes } from './features/public/routes';
import { authRoutes } from './features/auth/routes';
import { desarrolladorRoutes } from './features/desarrollador/routes';
import { usuarioRoutes } from './features/usuario/routes';

export default function AppRoutes() {
  const routes = [
    ...publicRoutes,
    { path: '/desarrollador', element: <Navigate to="/desarrollador/dashboard" replace /> },
    { path: '/usuario', element: <Navigate to="/usuario/home" replace /> },
    ...authRoutes,
    ...desarrolladorRoutes,
    ...usuarioRoutes,
    { path: '*', element: <div>404 - Página no encontrada</div> },
  ];

  return useRoutes(routes);
}
