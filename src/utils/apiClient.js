export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set default content type to JSON if not uploading a file
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && token) {
    // Token expirado, invalido, cuenta deshabilitada o sesion cerrada por el admin:
    // se guarda el motivo para mostrarlo en el login y se cierra la sesion local.
    const data = await response.clone().json().catch(() => ({}));
    const message = data.message && !data.message.startsWith('No autorizado')
      ? data.message
      : 'Tu sesión expiró. Inicia sesión nuevamente.';
    sessionStorage.setItem('authMessage', message);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    if (window.location.pathname !== '/login') window.location.href = '/login';
    throw new Error(message);
  }

  return response;
};
