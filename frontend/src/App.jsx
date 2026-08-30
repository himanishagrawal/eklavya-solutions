import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import StudentLayout from './components/layout/StudentLayout.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected student app - future phases add more routes under /app */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<StudentLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
