import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/common/Spinner';

// Lazy loaded page components
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Trips = lazy(() => import('./pages/Trips'));
const AIPlanner = lazy(() => import('./pages/AIPlanner'));
const Explore = lazy(() => import('./pages/Explore'));
const GraphPage = lazy(() => import('./pages/GraphPage'));
const Maps = lazy(() => import('./pages/Maps'));
const Budget = lazy(() => import('./pages/Budget'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Settings = lazy(() => import('./pages/Settings'));
const SharedTrip = lazy(() => import('./pages/SharedTrip'));

// Route guard requiring authenticated user session
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const LoadingFallback = () => (
  <div className="min-h-screen bg-navy flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shared/:token" element={<SharedTrip />} />

        {/* Authenticated Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/trips"
          element={
            <ProtectedRoute>
              <Trips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/planner"
          element={
            <ProtectedRoute>
              <AIPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ai-planner"
          element={
            <ProtectedRoute>
              <AIPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/graph"
          element={
            <ProtectedRoute>
              <GraphPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/maps"
          element={
            <ProtectedRoute>
              <Maps />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/budget"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
