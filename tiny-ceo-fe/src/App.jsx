import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Workspace from './pages/Workspace';
import Auth from './pages/Auth';

// Protected Route component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:workspaceId"
          element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;