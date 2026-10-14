import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, ArrowLeft, Hotel } from 'lucide-react';
import { BASE_URL } from '../../utils/apiClient';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/client/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al restablecer contraseña');
      }

      setSuccess('Contraseña restablecida correctamente. Redirigiendo al inicio de sesion...');
      setTimeout(() => navigate('/login'), 2500);

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
          Nueva Contraseña
        </h2>
        <p className="text-center text-sm text-white/50">
          Ingresa el codigo que te enviamos y tu nueva contraseña.
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
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed outline-none" 
                value={email}
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Codigo OTP</label>
              <input 
                type="text" 
                required
                maxLength={6}
                placeholder="Ej: 123456"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-center tracking-widest text-lg focus:border-[#eca8d6]/50 outline-none transition-colors" 
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Nueva Contraseña</label>
              <input 
                type="password" 
                required 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-[#eca8d6] hover:bg-white focus:outline-none transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? 'Restableciendo...' : 'Guardar y Entrar'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
