import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminLayout from '../components/AdminLayout';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Articles from '../pages/articles/Articles';
import NewArticle from '../pages/articles/NewArticle';
import Events from '../pages/events/Events';
import NewEvent from '../pages/events/NewEvent';
import Volunteers from '../pages/volunteers/Volunteers';
import Sponsors from '../pages/sponsors/Sponsors';
import VideosPage from '../pages/videos';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminEvents from '../pages/admin/Events';
import AdminUsers from '../pages/admin/Users';
import AdminArticles from '../pages/admin/Articles';
import AdminVolunteers from '../pages/admin/Volunteers';
import AdminSponsors from '../pages/admin/Sponsors';
import ProtectedRoute from '../components/ProtectedRoute';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// Dashboard redirect component
const DashboardRedirect = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  
  // For now, redirect non-admin users to home
  return <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public and User Routes */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<DashboardRedirect />} />
        <Route path="articles">
          <Route index element={<Articles />} />
          <Route path="new" element={
            <ProtectedRoute allowedRoles={['admin', 'editor']}>
              <NewArticle />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="events">
          <Route index element={<Events />} />
          <Route path="new" element={
            <ProtectedRoute allowedRoles={['admin', 'editor']}>
              <NewEvent />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="videos" element={<VideosPage />} />
        <Route path="volunteers" element={<Volunteers />} />
        <Route path="sponsors" element={<Sponsors />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="volunteers" element={<AdminVolunteers />} />
        <Route path="sponsors" element={<AdminSponsors />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 