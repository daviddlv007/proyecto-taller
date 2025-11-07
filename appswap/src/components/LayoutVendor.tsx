// components/LayoutVendor.tsx
import React from 'react';
import GenericLayout from './GenericLayout';
import { vendorRoutes } from '../features/vendor/routes';

export default function LayoutVendor() {
  return <GenericLayout routes={vendorRoutes[0].children || []} basePath="/vendor" />;
}
