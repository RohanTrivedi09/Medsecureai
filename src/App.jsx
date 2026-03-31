import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Records from './pages/Records';
import Logs from './pages/Logs';

import CinematicLanding from './pages/CinematicLanding';
import UserManagement from './pages/UserManagement';
import AdminPatients from './pages/AdminPatients';
import SecurityAlerts from './pages/SecurityAlerts';
import Settings from './pages/Settings';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Wait for cookie session restore
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// Dashboard Dispatcher
const Dashboard = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboard /> : <DoctorDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CinematicLanding />} />
            
            <Route element={<Layout />}>
              <Route path="landing" element={<Landing />} />
              <Route path="login" element={<Login />} />

              {/* Protected Routes */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Specific Routes */}
              <Route path="admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="admin/patients" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPatients />
                </ProtectedRoute>
              } />
              <Route path="admin/alerts" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SecurityAlerts />
                </ProtectedRoute>
              } />
              <Route path="admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="records" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Records />
                </ProtectedRoute>
              } />
              <Route path="logs" element={
                <ProtectedRoute>
                  <Logs />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
