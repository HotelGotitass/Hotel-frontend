import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Si el rol guardado no está en la lista de permitidos
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }
  
  return <Outlet />;
}
