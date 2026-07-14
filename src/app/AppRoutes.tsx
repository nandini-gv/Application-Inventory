import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardShell } from '../shared/layouts/DashboardShell';
import { Login } from './Login';
import { MSLoginPopup } from './MSLoginPopup';
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { Inventory } from '../features/applications/pages/Inventory';
import { AppDetails } from '../features/applications/pages/AppDetails';
import { RegisterApp } from '../features/applications/pages/RegisterApp';
import { Insights } from '../features/insights/pages/Insights';
import { Settings } from '../features/settings/pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & Login screen */}
      <Route path="/login" element={<Login />} />
      
      {/* Standalone simulated Microsoft Azure AD popup window */}
      <Route path="/ms-login" element={<MSLoginPopup />} />

      {/* Protected Master Layout (Dashboard Shell) */}
      <Route path="/" element={<DashboardShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="applications" element={<Inventory />} />
        <Route path="applications/:id" element={<AppDetails />} />
        <Route path="register" element={<RegisterApp />} />
        <Route path="insights" element={<Insights />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Wildcard redirects back to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
