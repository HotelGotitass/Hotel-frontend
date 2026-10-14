import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Hotel, ArrowLeft } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentType: 'DNI',
    documentNumber: '',
    email: '',
    phone: '',
    password: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms || !acceptPrivacy) {
      setError(t('auth.must_accept_terms', 'Debes aceptar los términos y la política de privacidad.'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await apiClient('/client/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, acceptedTerms: acceptTerms, acceptedPrivacy: acceptPrivacy })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t('auth.error_generic'));
      }

      // Go to verify OTP
      navigate('/verify-otp', { state: { email: formData.email } });
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

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        
        <div className="flex justify-center text-[#eca8d6] mb-6">
          <img src="/logo.png" alt="Gotitas Logo" className="h-16 object-contain" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
          {t("auth.register")}
        </h2>
        <p className="text-center text-sm text-white/50">
          Gotitas Hotel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-[#0a0a0a] border border-white/10 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('auth.first_name')}</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName}
                  required 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('auth.last_name')}</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName}
                  required 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-white/70 mb-1">{t('auth.doc_type')}</label>
                <select 
                  name="documentType" 
                  value={formData.documentType}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors appearance-none" 
                  onChange={(e) => setFormData({...formData, documentType: e.target.value, documentNumber: ''})}
                >
                  <option value="DNI">DNI</option>
                  <option value="PASSPORT">Pasaporte</option>
                  <option value="CE">C.E.</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-1">{t('auth.doc_number')}</label>
                <input 
                  type="text" 
                  name="documentNumber" 
                  required 
                  value={formData.documentNumber}
                  maxLength={formData.documentType === 'DNI' ? 8 : formData.documentType === 'CE' ? 9 : 20}
                  minLength={formData.documentType === 'DNI' ? 8 : formData.documentType === 'CE' ? 9 : 6}
                  pattern={formData.documentType === 'DNI' ? "[0-9]{8}" : formData.documentType === 'CE' ? "[0-9]{9}" : "[A-Za-z0-9]{6,20}"}
                  title={formData.documentType === 'DNI' ? "DNI debe tener exactamente 8 dígitos numéricos" : formData.documentType === 'CE' ? "C.E. debe tener exactamente 9 dígitos numéricos" : "El pasaporte debe tener entre 6 y 20 caracteres"}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                  onChange={(e) => {
                    let val = e.target.value;
                    if (formData.documentType !== 'PASSPORT') {
                      val = val.replace(/\D/g, ''); // DNI y CE solo permiten números
                    }
                    setFormData({...formData, documentNumber: val.toUpperCase()});
                  }} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">{t('auth.email')}</label>
              <input 
                type="email" name="email" pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$" title="Ingrese un correo electronico valido, por ejemplo: usuario@correo.com" 
                value={formData.email}
                required 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">{t('auth.phone')}</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">{t('auth.password')}</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                required 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                onChange={handleChange} 
              />
            </div>

            {/* Checkboxes para Términos y Condiciones */}
            <div className="pt-2 space-y-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1a1a1a] border-white/20 accent-[#eca8d6] focus:ring-[#eca8d6] focus:ring-offset-black"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-white/70">
                    {t('auth.accept_terms', 'Acepto los')} <Link to="/terminos" target="_blank" className="text-[#eca8d6] hover:underline font-medium">{t('footer.terms', 'Términos y Condiciones')}</Link>
                  </label>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="privacy"
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1a1a1a] border-white/20 accent-[#eca8d6] focus:ring-[#eca8d6] focus:ring-offset-black"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="privacy" className="text-white/70">
                    {t('auth.accept_privacy', 'Acepto la')} <Link to="/privacidad" target="_blank" className="text-[#eca8d6] hover:underline font-medium">{t('footer.privacy', 'Política de Privacidad')}</Link>
                  </label>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !acceptTerms || !acceptPrivacy}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-[#eca8d6] hover:bg-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? t('auth.registering') : t('auth.btn_register')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link to="/login" className="text-sm text-white/50 hover:text-white transition-colors">
              {t('auth.have_account')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




