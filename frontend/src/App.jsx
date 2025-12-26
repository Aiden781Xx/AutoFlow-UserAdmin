import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoutes from './modules/auth/auth.routes';
import Dashboard from './pages/Dashboard';
import Profile from './modules/profile/pages/Profile';
import ProtectedRoute from './shared/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {AuthRoutes}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
