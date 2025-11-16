// components/LayoutDesarrollador.tsx
import React from 'react';
import GenericLayout from './GenericLayout';
import { desarrolladorRoutes } from '../features/desarrollador/routes';

export default function LayoutDesarrollador() {
  return <GenericLayout routes={desarrolladorRoutes[0].children || []} basePath="/desarrollador" />;
}
