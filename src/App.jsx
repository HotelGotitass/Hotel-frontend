import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import HabitacionesPage from './pages/HabitacionesPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Rooms from './pages/admin/Rooms';
import RoomCategories from './pages/admin/RoomCategories';
import Amenities from './pages/admin/Amenities';
import Reception from './pages/admin/Reception';
import Refunds from './pages/admin/Refunds';
import Guests from './pages/admin/Guests';
import Reservations from './pages/admin/Reservations';
import ExtraServices from './pages/admin/ExtraServices';
import Invoices from './pages/admin/Invoices';
import Employees from './pages/admin/Employees';
import Complaints from './pages/admin/Complaints';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import ComplaintsBook from './pages/public/ComplaintsBook';

import Checkout from './pages/client/Checkout';
import PaymentGatewayMock from './pages/client/PaymentGatewayMock';
import ClientReservations from './pages/client/ClientReservations';
import ClientProfile from './pages/client/ClientProfile';
import ClientDashboardLayout from './pages/client/ClientDashboardLayout';
import Navbar from './components/Navbar';

// Layout basico para las rutas de cliente que necesiten navbar
function ClientLayout({ children }) {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="pt-20 pb-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/habitaciones" element={<HabitacionesPage />} />
        <Route path="/login" element={<ClientLayout><Login /></ClientLayout>} />
        <Route path="/register" element={<ClientLayout><Register /></ClientLayout>} />
        <Route path="/verify-otp" element={<ClientLayout><VerifyOtp /></ClientLayout>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/terminos" element={<Terms />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route path="/libro-reclamaciones" element={<ClientLayout><ComplaintsBook /></ClientLayout>} />
        
        {/* Client Routes */}
        <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
          <Route path="/checkout" element={<ClientLayout><Checkout /></ClientLayout>} />
          <Route element={<ClientDashboardLayout />}>
            <Route path="/client/reservations" element={<ClientReservations />} />
            <Route path="/client/profile" element={<ClientProfile />} />
          </Route>
          {/* El Gateway simulado se accede logueado (simulando que esta en un frame externo) */}
          <Route path="/payment-gateway" element={<PaymentGatewayMock />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPCIONISTA']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="recepcion" element={<Reception />} />
            <Route path="reembolsos" element={<Refunds />} />
            <Route path="habitaciones" element={<Rooms />} />
            <Route path="categorias" element={<RoomCategories />} />
            <Route path="huespedes" element={<Guests />} />
            <Route path="reservas" element={<Reservations />} />
            <Route path="servicios" element={<ExtraServices />} />
            <Route path="facturas" element={<Invoices />} />
            <Route path="personal" element={<Employees />} />
            <Route path="comodidades" element={<Amenities />} />
            <Route path="reclamaciones" element={<Complaints />} />
          </Route>
        </Route>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


