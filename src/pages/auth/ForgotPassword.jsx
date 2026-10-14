import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, ArrowLeft, Hotel } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient, BASE_URL } from '../../utils/apiClient'; // or fetch if unauthenticated

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/client/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al solicitar recuperacion');
      }

      setSuccess('Te enviamos un codigo de seguridad a tu correo para restablecer tu contraseña.');
      // Give them a moment to read, then navigate to reset password page
      setTimeout(() => navigate('/reset-password', { state: { email } }), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      <div className="absolute top-8 left-8">
        <Link to="/login" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver a Iniciar Sesion</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[#eca8d6] mb-6">
          <img src="/logo.png" alt="Gotitas Logo" className="h-16 object-contain" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
          Recuperar Contraseña
        </h2>
        <p className="text-center text-sm text-white/50">
          Ingresa tu correo para recibir un codigo de seguridad.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0a0a0a] border border-white/10 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6 flex items-center">
              <CheckCircle size={18} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Correo Electronico</label>
              <input 
                type="email" 
                required 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-[#eca8d6] hover:bg-white focus:outline-none transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? 'Enviando...' : 'Enviar Codigo'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
