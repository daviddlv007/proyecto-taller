// components/LayoutBuyer.tsx
import React from 'react';
import GenericLayout from './GenericLayout';
import { buyerRoutes } from '../features/buyer/routes';

export default function LayoutBuyer() {
  return <GenericLayout routes={buyerRoutes[0].children || []} basePath="/buyer" />;
}
