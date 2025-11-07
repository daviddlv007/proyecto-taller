import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { publicRoutes } from './features/public/routes';
import { authRoutes } from './features/auth/routes';
import { vendorRoutes } from './features/vendor/routes';
import { buyerRoutes } from './features/buyer/routes';

export default function AppRoutes() {
  const routes = [
    ...publicRoutes,
    { path: '/vendor', element: <Navigate to="/vendor/dashboard" replace /> },
    { path: '/buyer', element: <Navigate to="/buyer/home" replace /> },
    ...authRoutes,
    ...vendorRoutes,
    ...buyerRoutes,
    { path: '*', element: <div>404 - Página no encontrada</div> },
  ];

  return useRoutes(routes);
}
