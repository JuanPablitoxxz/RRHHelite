import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  Target
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { View, UserRole } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  userRole: UserRole;
}

export default function Sidebar({ currentView, onNavigate, userRole }: SidebarProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'interviewer'] },
    { id: 'candidates', icon: Users, label: 'Candidatos', roles: ['admin', 'interviewer'] },
    { id: 'jobs', icon: Briefcase, label: 'Vacantes', roles: ['admin', 'interviewer', 'user', 'applicant'] },
    { id: 'interviews', icon: Calendar, label: 'Entrevistas', roles: ['admin', 'interviewer'] },
    { id: 'evaluations', icon: FileText, label: 'Evaluaciones', roles: ['admin', 'interviewer'] },
    { id: 'settings', icon: Settings, label: 'Ajustes', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Target size={24} color="white" />
        </div>
        <h1>RRHH elite</h1>
      </div>

      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as View)}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
