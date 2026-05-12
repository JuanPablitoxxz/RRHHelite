import { Search, Bell, HelpCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="search-bar">
        <Search size={18} color="#64748B" />
        <input type="text" placeholder="Buscar candidatos o vacantes..." />
      </div>

      <div className="header-tabs">
        <div className="tab-item active">Métricas</div>
        <div className="tab-item">Informes</div>
        <div className="tab-item">Ajustes</div>
      </div>

      <div className="user-profile">
        <div style={{ display: 'flex', gap: '16px', marginRight: '24px', color: '#64748B' }}>
          <Bell size={20} style={{ cursor: 'pointer' }} />
          <HelpCircle size={20} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ textAlign: 'right', marginRight: '12px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>Alex Thompson</p>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>Senior HR</p>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
          alt="Profile" 
          className="user-avatar" 
        />
      </div>
    </header>
  );
}
