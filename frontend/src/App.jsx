import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx'; // PHASE 2
import DashboardPage from './pages/DashboardPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx'; // PHASE 2
import ProfilePage from './pages/ProfilePage.jsx'; // PHASE 2
import SkillsPage from './pages/SkillsPage.jsx'; // PHASE 2
import NotFoundPage from './pages/NotFoundPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import StudentLayout from './components/layout/StudentLayout.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> {/* PHASE 2 */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected student app - future phases add more routes under /app */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding is full-screen (no sidebar/navbar chrome), so it
            sits outside StudentLayout but still behind ProtectedRoute. */}
        <Route path="/app/onboarding" element={<OnboardingPage />} /> {/* PHASE 2 */}

        <Route path="/app" element={<StudentLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} /> {/* PHASE 2 */}
          <Route path="skills" element={<SkillsPage />} /> {/* PHASE 2 */}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
