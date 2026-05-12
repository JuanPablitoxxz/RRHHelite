import { Search, Bell, HelpCircle } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  // Get name from user_metadata or fallback to email
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <header className="header">
      <div className="search-bar">
        <Search size={18} color="#64748B" />
        <input type="text" placeholder="Buscar candidatos o vacantes..." />
      </div>

      <div className="user-profile">
        <div style={{ display: 'flex', gap: '16px', marginRight: '24px', color: '#64748B' }}>
          <Bell size={20} style={{ cursor: 'pointer' }} />
          <HelpCircle size={20} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ textAlign: 'right', marginRight: '12px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', textTransform: 'capitalize' }}>{fullName}</p>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>Administrador RRHH</p>
        </div>
        {user.user_metadata?.avatar_url ? (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="Profile" 
            className="user-avatar" 
          />
        ) : (
          <div className="user-avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
            {initials}
          </div>
        )}
      </div>
    </header>
  );
}
