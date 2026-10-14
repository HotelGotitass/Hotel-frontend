import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Lock, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

export default function ClientProfile() {
  const { t } = useTranslation();
  
  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password State
  const [passwordState, setPasswordState] = useState('IDLE'); // IDLE, OTP_SENT
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    // In a real app we'd fetch the current profile. For now, since user info isn't returned fully except token/role/email in AuthContext,
    // we'll leave fields blank or fetch them if there's a GET /client/profile endpoint.
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiClient('/client/profile');
      if (res.ok) {
        const data = await res.json();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await apiClient('/client/profile', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName })
      });
      if (!res.ok) throw new Error('Error al actualizar perfil');
      setProfileMsg({ type: 'success', text: 'Datos actualizados correctamente.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleRequestPasswordChange = async () => {
    setLoadingPwd(true);
    setPwdMsg({ type: '', text: '' });
    try {
      const res = await apiClient('/client/profile/password-request', { method: 'POST' });
      if (!res.ok) throw new Error('Error al solicitar cambio');
      setPasswordState('OTP_SENT');
      setPwdMsg({ type: 'success', text: 'Te enviamos un codigo al correo para confirmar el cambio.' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message });
    } finally {
      setLoadingPwd(false);
    }
  };

  const handleConfirmPasswordChange = async (e) => {
    e.preventDefault();
    setLoadingPwd(true);
    setPwdMsg({ type: '', text: '' });
    try {
      const res = await apiClient('/client/profile/password-change', {
        method: 'POST',
        body: JSON.stringify({ otp, newPassword })
      });
      if (!res.ok) {
         const d = await res.json();
         throw new Error(d.message || 'Error al cambiar contraseña');
      }
      setPwdMsg({ type: 'success', text: 'Contraseña actualizada correctamente.' });
      setPasswordState('IDLE');
      setOtp('');
      setNewPassword('');
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message });
    } finally {
      setLoadingPwd(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Mis Datos Personales</h1>
        <p className="text-white/50 text-sm">Actualiza tu información y administra tu seguridad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Update Profile Form */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-3 bg-[#eca8d6]/10 rounded-xl">
              <User className="text-[#eca8d6]" size={24} />
            </div>
            <h2 className="text-xl font-semibold">Información Basica</h2>
          </div>

          {profileMsg.text && (
            <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 $`}>
              {profileMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              <span className="text-sm font-medium">{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Nombre(s)</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Apellidos</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={e => setLastName(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
              />
            </div>
            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {loadingProfile ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-3 bg-[#eca8d6]/10 rounded-xl">
              <Lock className="text-[#eca8d6]" size={24} />
            </div>
            <h2 className="text-xl font-semibold">Cambiar Contraseña</h2>
          </div>

          {pwdMsg.text && (
            <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 $`}>
              {pwdMsg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              <span className="text-sm font-medium">{pwdMsg.text}</span>
            </div>
          )}

          {passwordState === 'IDLE' ? (
            <div className="space-y-4">
              <p className="text-sm text-white/60 leading-relaxed">
                Para proteger tu cuenta, te enviaremos un codigo de seguridad a tu correo electronico registrado. Deberas ingresar ese codigo junto con tu nueva contraseña.
              </p>
              <button
                type="button"
                onClick={handleRequestPasswordChange}
                disabled={loadingPwd}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#eca8d6] hover:bg-white text-black font-bold transition-colors disabled:opacity-50"
              >
                {loadingPwd ? 'Solicitando...' : 'Solicitar Codigo de Cambio'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmPasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Codigo de Seguridad (OTP)</label>
                <input 
                  type="text" 
                  value={otp} 
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  required
                  placeholder="Ej: 123456"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center tracking-widest text-lg focus:border-[#eca8d6]/50 outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Minimo 8 caracteres, 1 mayuscula y 1 numero"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#eca8d6]/50 outline-none transition-colors" 
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordState('IDLE');
                    setPwdMsg({type: '', text: ''});
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingPwd}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#eca8d6] hover:bg-white text-black font-bold transition-colors disabled:opacity-50"
                >
                  {loadingPwd ? 'Cambiando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}


