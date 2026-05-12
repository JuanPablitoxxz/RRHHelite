import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  CalendarClock, 
  ClipboardCheck, 
  Settings, 
  LogOut,
  Plus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Vacantes', icon: Briefcase },
    { id: 'candidates', label: 'Candidatos', icon: Users },
    { id: 'interviews', label: 'Entrevistas', icon: CalendarClock },
    { id: 'evaluations', label: 'Evaluaciones', icon: ClipboardCheck },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h1>TalentFlow</h1>
        <p>Recruitement Suite</p>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => {
          const isActive = currentView === item.id || (currentView === 'detail' && item.id === 'candidates');
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button className="new-job-btn">
          <Plus size={20} />
          Nueva Vacante
        </button>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
          <button className="nav-link">
            <Settings size={20} />
            Configuración
          </button>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="nav-link" 
            style={{ color: '#EF4444' }}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
