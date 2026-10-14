import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Hotel } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/apiClient';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnverified(false);
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message && data.message.toLowerCase().includes("verificado")) {
          setIsUnverified(true);
        }
        throw new Error(data.message || t("auth.error_generic"));
      }

      login(data.token, data.role, email);

      if (data.role === 'CLIENT') {
        navigate(from && !from.startsWith('/admin') ? from : '/client/reservations');
      } else {
        navigate(from && from.startsWith('/admin') ? from : '/admin/dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">{t('nav.home') || 'Volver al inicio'}</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[#eca8d6] mb-6">
          <img src="/logo.png" alt="Gotitas Logo" className="h-16 object-contain" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
          {t("auth.login")}
        </h2>
        <p className="text-center text-sm text-white/50">
          Gotitas Hotel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0a0a0a] border border-white/10 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex flex-col">
              <div className="flex items-center mb-2">
                <AlertCircle size={18} className="mr-2" />
                <span className="text-sm">{error}</span>
              </div>
              {isUnverified && (
                 <button 
                    type="button"
                    onClick={() => navigate('/verify-otp', { state: { email } })} 
                    className="mt-2 text-sm bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 self-start transition-colors"
                 >
                    {t("auth.verify_now")}
                 </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">{t('auth.email')}</label>
              <input 
                type="email" 
                required 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-white/70">{t('auth.password')}</label>
                <Link to="/forgot-password" className="text-sm text-[#eca8d6] hover:text-white transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input 
                type="password" 
                required 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-[#eca8d6] hover:bg-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? t('auth.login_btn_loading', 'Iniciando...') : t('auth.btn_login')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link to="/register" className="text-sm text-white/50 hover:text-white transition-colors">
              {t('auth.no_account')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


