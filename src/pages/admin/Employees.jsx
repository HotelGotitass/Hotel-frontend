import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Edit2, Trash2 } from 'lucide-react';

export default function Employees() {
  const { user: currentUser } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'RECEPCIONISTA' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

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

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold text-white/70">ID</th>
              <th className="px-6 py-4 font-semibold text-white/70">Correo Electrónico</th>
              <th className="px-6 py-4 font-semibold text-white/70">Rol de Sistema</th>
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
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(emp)} className="p-2 text-white/50 hover:text-white" title="Editar"><Edit2 size={18} /></button>
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
