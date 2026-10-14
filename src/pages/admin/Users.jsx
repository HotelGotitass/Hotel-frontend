import { apiClient } from '../../utils/apiClient';
import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, User } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient('/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <p className="text-white/60">Registra y administra al personal del hotel (Admins y Recepcionistas).</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-white/90 transition-all">
          <UserPlus size={16} /> Registrar Usuario
        </button>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[#161616]">
              <th className="p-4 text-sm font-medium text-white/40 uppercase tracking-wider">ID</th>
              <th className="p-4 text-sm font-medium text-white/40 uppercase tracking-wider">Email</th>
              <th className="p-4 text-sm font-medium text-white/40 uppercase tracking-wider">Rol (Acceso)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-white/40">No hay usuarios registrados.</td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-white/50">{user.id}</td>
                <td className="p-4 font-medium">{user.email}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md ${
                    user.role === 'ADMIN' ? 'bg-[#eca8d6]/20 text-[#eca8d6]' : 'bg-blue-400/20 text-blue-400'
                  }`}>
                    {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
