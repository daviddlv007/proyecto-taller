import React from 'react';
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
