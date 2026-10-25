import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';

const AuthContext = createContext();
const SESSION_CHECK_MS = 30000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (token && role) {
      setUser({ token, role, email });
    }
    setLoading(false);
  }, []);

  // Latido de sesion: si el admin deshabilita la cuenta, el backend responde 401 y apiClient
  // cierra la sesion aunque el usuario no este haciendo nada (cada 30 s y al volver a la pestaña).
  useEffect(() => {
    if (!user) return undefined;
    const check = () => {
      if (document.visibilityState === 'visible') apiClient('/auth/session').catch(() => {});
    };
    const id = setInterval(check, SESSION_CHECK_MS);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [user]);

  const login = (token, role, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
    setUser({ token, role, email });
  };

  // Un recepcionista no puede salir con SU caja abierta: se le lleva a Caja para hacer el arqueo.
  // (La caja vive en el servidor: aunque cierre la pestaña, al volver la encuentra abierta.)
  const logout = async () => {
    if (localStorage.getItem('role') === 'RECEPCIONISTA') {
      try {
        const res = await apiClient('/cash/current');
        if (res.status === 200) {
          const session = await res.json();
          const me = (localStorage.getItem('email') || '').toLowerCase();
          if (session.openedBy?.toLowerCase() === me) {
            navigate('/admin/caja', { state: { mustClose: true } });
            return false;
          }
        }
      } catch {
        /* si el backend no responde se permite salir: la caja sigue abierta en el servidor */
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setUser(null);
    navigate('/login');
    return true;
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
