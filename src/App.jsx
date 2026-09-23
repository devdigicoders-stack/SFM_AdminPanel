import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers & Guards
import { AdminAuthProvider, ProtectedAdminRoute, PublicAdminRoute } from './context/AdminAuthContext';
import { AdminDataProvider } from './context/AdminDataContext';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageEnquiry from './pages/ManageEnquiry';
import ManageBlog from './pages/ManageBlog';
import ViewBlog from './pages/ViewBlog';
import ManageBlogCategory from './pages/ManageBlogCategory';
import ManageBanner from './pages/ManageBanner';
import ManageHomepage from './pages/ManageHomepage';
import ManageServices from './pages/ManageServices';
import ManageSocialLinks from './pages/ManageSocialLinks';
import AdminProfile from './pages/AdminProfile';
import ChangePassword from './pages/ChangePassword';

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <Router>
          <Routes>
            {/* Public Login Route with Guard */}
            <Route
              path="/login"
              element={
                <PublicAdminRoute>
                  <AdminLogin />
                </PublicAdminRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/enquiries"
              element={
                <ProtectedAdminRoute>
                  <ManageEnquiry />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/blogs"
              element={
                <ProtectedAdminRoute>
                  <ManageBlog />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <ProtectedAdminRoute>
                  <ViewBlog />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedAdminRoute>
                  <ManageBlogCategory />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/banners"
              element={
                <ProtectedAdminRoute>
                  <ManageBanner />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/homepage-content"
              element={
                <ProtectedAdminRoute>
                  <ManageHomepage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedAdminRoute>
                  <ManageServices />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/social-links"
              element={
                <ProtectedAdminRoute>
                  <ManageSocialLinks />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedAdminRoute>
                  <AdminProfile />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedAdminRoute>
                  <ChangePassword />
                </ProtectedAdminRoute>
              }
            />

            {/* Fallback to Dashboard / Login */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}
