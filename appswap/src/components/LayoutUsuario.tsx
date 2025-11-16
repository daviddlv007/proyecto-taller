// components/LayoutUsuario.tsx
import React from 'react';
import GenericLayout from './GenericLayout';
import { usuarioRoutes } from '../features/usuario/routes';

export default function LayoutUsuario() {
  return <GenericLayout routes={usuarioRoutes[0].children || []} basePath="/usuario" />;
}
