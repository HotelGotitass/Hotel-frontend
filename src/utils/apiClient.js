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

  if (response.status === 401) {
    // Token expiro o es invalido
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
  }

  return response;
};
