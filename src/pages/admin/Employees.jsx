import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Edit2, Trash2, KeyRound, UserX, UserCheck } from 'lucide-react';

export default function Employees() {
  const { user: currentUser } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'RECEPCIONISTA' });
  const [error, setError] = useState('');
  // Restablecer contrasena de un empleado (solo admin)
  const [resetting, setResetting] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState(null);
  const [tab, setTab] = useState('staff');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await apiClient('/users/clients');
    if (res.ok) setClients(await res.json());
  };

  // Deshabilitar cierra al instante todas las sesiones de esa cuenta (el backend invalida sus tokens)
  const toggleStatus = async (account) => {
    const disabling = account.active !== false;
    if (disabling && !window.confirm(`¿Deshabilitar la cuenta ${account.email}? Su sesión se cerrará de inmediato y no podrá volver a entrar hasta que la habilites.`)) return;
    const res = await apiClient(`/users/${account.id}/status`, { method: 'PATCH', body: JSON.stringify({ active: !disabling }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setResetMsg({ ok: false, text: data.message || 'No se pudo cambiar el estado de la cuenta' });
      return;
    }
    setResetMsg({ ok: true, text: disabling ? `Cuenta ${account.email} deshabilitada y sesión cerrada.` : `Cuenta ${account.email} habilitada. Deberá iniciar sesión nuevamente.` });
    fetchEmployees();
    fetchClients();
  };

  const isSelf = (account) => currentUser?.email && account.email.toLowerCase() === currentUser.email.toLowerCase();

  const StatusBadge = ({ account }) => (account.active === false
    ? <span className="px-2 py-1 rounded-full text-xs font-bold border bg-red-500/15 text-red-400 border-red-500/40">Deshabilitada</span>
    : <span className="px-2 py-1 rounded-full text-xs font-bold border bg-green-500/15 text-green-400 border-green-500/40">Activa</span>);

  const StatusButton = ({ account }) => (isSelf(account)
    ? <span className="p-2 text-white/20 cursor-not-allowed inline-block" title="No puedes deshabilitar tu propia cuenta"><UserX size={18} /></span>
    : account.active === false
      ? <button onClick={() => toggleStatus(account)} className="p-2 text-green-400/70 hover:text-green-400" title="Habilitar cuenta" aria-label={`Habilitar ${account.email}`}><UserCheck size={18} /></button>
      : <button onClick={() => toggleStatus(account)} className="p-2 text-red-400/60 hover:text-red-400" title="Deshabilitar cuenta" aria-label={`Deshabilitar ${account.email}`}><UserX size={18} /></button>);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg(null);
    const res = await apiClient(`/users/${resetting.id}/password`, { method: 'PATCH', body: JSON.stringify({ newPassword }) });
    if (res.ok) {
      setResetting(null);
      setNewPassword('');
      setResetMsg({ ok: true, text: `Contraseña actualizada para ${resetting.email}. Compártela de forma segura.` });
    } else {
      const data = await res.json().catch(() => ({}));
      setResetMsg({ ok: false, text: data.message || 'No se pudo cambiar la contraseña' });
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await apiClient('/users');
      if (res.ok) setEmployees(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = editingId ? '/users/' + editingId : '/users';
      const method = editingId ? 'PUT' : 'POST';

      const body = { ...formData };
      if (editingId && !body.password) {
        delete body.password; // No enviar password si esta vacio al editar
      }

      const res = await apiClient(endpoint, {
        method,
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al guardar empleado');
      }

      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (err) { setError(err.message); }
  };

  const openEdit = (emp) => {
    setFormData({ email: emp.email, password: '', role: emp.role });
    setEditingId(emp.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Eliminar permanentemente este empleado?')) return;
    try {
      const res = await apiClient('/users/' + id, { method: 'DELETE' });
      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Error al eliminar');
      }
      fetchEmployees();
    } catch (err) { alert(err.message); }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', role: 'RECEPCIONISTA' });
    setEditingId(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de Personal</h2>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#eca8d6] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
        >
          <UserPlus size={20} /> Nuevo Empleado
        </button>
      </div>

      <div className="flex gap-2" role="tablist">
        {[{ id: 'staff', label: `Personal (${employees.length})` }, { id: 'clients', label: `Clientes (${clients.length})` }].map((x) => (
          <button key={x.id} role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)}
            className={`px-3 py-1.5 rounded-full text-sm ${tab === x.id ? 'bg-white text-black font-semibold' : 'text-white/60 border border-white/10 hover:text-white'}`}>
            {x.label}
          </button>
        ))}
      </div>

      {resetMsg && (
        <div role="status" className={`px-4 py-3 rounded-xl text-sm border ${resetMsg.ok ? 'bg-green-500/10 border-green-500/40 text-green-300' : 'bg-red-500/10 border-red-500/40 text-red-300'}`}>
          {resetMsg.text}
        </div>
      )}

      {resetting && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
          <form onSubmit={handleResetPassword} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold">Cambiar contraseña</h3>
            <p className="text-sm text-white/50">{resetting.email} · {resetting.role}</p>
            <label className="block">
              <span className="block text-sm text-white/70 mb-1">Nueva contraseña</span>
              <input required autoFocus type="password" autoComplete="new-password" minLength={8} maxLength={72}
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
              <span className="text-xs text-white/40">Mínimo 8 caracteres.</span>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setResetting(null)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5">Cancelar</button>
              <button className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'clients' && (
        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-white/70">ID</th>
                <th className="px-6 py-4 font-semibold text-white/70">Correo Electrónico</th>
                <th className="px-6 py-4 font-semibold text-white/70">Verificada</th>
                <th className="px-6 py-4 font-semibold text-white/70">Estado</th>
                <th className="px-6 py-4 font-semibold text-white/70 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {clients.map((c) => (
                <tr key={c.id} className={`hover:bg-white/5 ${c.active === false ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4 font-mono text-white/50">#{c.id}</td>
                  <td className="px-6 py-4 font-medium">{c.email}</td>
                  <td className="px-6 py-4 text-white/60">{c.verified ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-4"><StatusBadge account={c} /></td>
                  <td className="px-6 py-4 text-right"><StatusButton account={c} /></td>
                </tr>
              ))}
              {clients.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-white/40">No hay cuentas de clientes.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <div className={`bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden ${tab === 'staff' ? '' : 'hidden'}`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-black/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold text-white/70">ID</th>
              <th className="px-6 py-4 font-semibold text-white/70">Correo Electrónico</th>
              <th className="px-6 py-4 font-semibold text-white/70">Rol de Sistema</th>
              <th className="px-6 py-4 font-semibold text-white/70">Estado</th>
              <th className="px-6 py-4 font-semibold text-white/70 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-white/50">#{emp.id}</td>
                <td className="px-6 py-4 font-medium">{emp.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ` + (emp.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-500 border-purple-500/50' : 'bg-blue-500/20 text-blue-400 border-blue-500/50')}>

                    {emp.role}
                  </span>
                </td>
                <td className="px-6 py-4"><StatusBadge account={emp} /></td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <StatusButton account={emp} />
                  <button onClick={() => openEdit(emp)} className="p-2 text-white/50 hover:text-white" title="Editar"><Edit2 size={18} /></button>
                  <button onClick={() => { setResetMsg(null); setNewPassword(''); setResetting(emp); }} className="p-2 text-amber-300/60 hover:text-amber-300" title="Cambiar contraseña" aria-label={`Cambiar contraseña de ${emp.email}`}><KeyRound size={18} /></button>
                  {currentUser?.email && emp.email.toLowerCase() === currentUser.email.toLowerCase() ? (
                    <span className="p-2 text-white/20 cursor-not-allowed inline-block" title="No puedes eliminar tu propia cuenta"><Trash2 size={18} /></span>
                  ) : (
                    <button onClick={() => handleDelete(emp.id)} className="p-2 text-red-500/50 hover:text-red-500" title="Eliminar"><Trash2 size={18} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Correo (Usuario de Acceso)</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Contraseña {editingId && '(Dejar en blanco para no cambiar)'}</label>
                <input required={!editingId} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Rol de Acceso</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                  <option value="RECEPCIONISTA">Recepcionista (Solo Operaciones)</option>
                  <option value="ADMIN">Administrador (Control Total)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors">Cancelar</button>
                <button type="submit" className="bg-[#eca8d6] text-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
