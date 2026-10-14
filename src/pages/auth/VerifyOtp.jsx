import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, ArrowLeft, Hotel } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../utils/apiClient';

export default function VerifyOtp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient('/client/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.trim() })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Código inválido o expirado');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Botón regresar al inicio */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">{t('nav.home') || 'Volver al inicio'}</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[#eca8d6] mb-6">
          <Hotel size={48} />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
          {t("auth.verify")}
        </h2>
        <p className="text-center text-sm text-white/50">
          Gotitas Hotel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0a0a0a] border border-white/10 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          
          <p className="text-sm text-white/70 mb-8 text-center bg-white/5 p-4 rounded-xl border border-white/10">
            {t("auth.enter_code")} <span className="text-[#eca8d6] font-bold block mt-1">{email}</span>
          </p>
          
          {success ? (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-xl mb-4 flex flex-col items-center justify-center text-center">
              <CheckCircle size={32} className="mb-3" />
              <span className="font-semibold">Cuenta verificada.</span>
              <span className="text-sm opacity-80 mt-1">Redirigiendo a Login...</span>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center">
                  <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    maxLength="6" 
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required 
                    className="block w-full text-center text-3xl tracking-[1em] rounded-xl bg-[#1a1a1a] border border-white/10 shadow-sm focus:border-[#eca8d6]/50 text-white p-4 outline-none transition-colors" 
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-[#eca8d6] hover:bg-white focus:outline-none transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? t('common.loading') : t('auth.btn_verify')}
                </button>
              </form>
            </>
          )}

          {!success && (
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <Link to="/login" className="text-sm text-white/50 hover:text-white transition-colors">
                {t('auth.have_account')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

