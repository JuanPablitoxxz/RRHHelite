import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Users, Loader2, ShieldAlert, Edit2, Check, X } from 'lucide-react';
import { Profile, UserRole } from '../types';

export default function UsersList() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('user');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: Profile) => {
    setEditingId(user.id);
    setEditRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveRole = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: editRole })
        .eq('id', id);

      if (error) throw error;
      
      setUsers(users.map(u => u.id === id ? { ...u, role: editRole } : u));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol. Verifica los permisos de la base de datos.');
    }
  };

  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content-area"
    >
      <div className="page-title-section">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Administra los roles y permisos de todas las cuentas registradas.</p>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>Usuario</th>
              <th style={{ padding: '16px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '16px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>Rol Actual</th>
              <th style={{ padding: '16px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                    {user.full_name || 'Sin Nombre'}
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{user.email}</td>
                <td style={{ padding: '16px' }}>
                  {editingId === user.id ? (
                    <select 
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      className="auth-input"
                      style={{ padding: '6px 12px', width: '140px', marginTop: 0 }}
                    >
                      <option value="admin">Admin</option>
                      <option value="interviewer">Entrevistador</option>
                      <option value="user">Usuario</option>
                      <option value="applicant">Aspirante</option>
                    </select>
                  ) : (
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: 700,
                      background: user.role === 'admin' ? '#FEF2F2' : user.role === 'interviewer' ? '#EFF6FF' : 'var(--surface)',
                      color: user.role === 'admin' ? '#EF4444' : user.role === 'interviewer' ? '#3B82F6' : 'var(--text-muted)'
                    }}>
                      {user.role.toUpperCase()}
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  {editingId === user.id ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleSaveRole(user.id)} style={{ background: '#10B981', color: 'white', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}>
                        <Check size={16} />
                      </button>
                      <button onClick={handleCancelEdit} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEditClick(user)}
                      style={{ background: 'transparent', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}
                    >
                      <Edit2 size={14} /> Modificar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ShieldAlert size={32} color="var(--border)" style={{ margin: '0 auto 12px' }} />
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
