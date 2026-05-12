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
      <div className="sidebar-logo">
        <h1>TalentFlow</h1>
        <p style={{ fontSize: '10px', opacity: 0.6 }}>Recruitement Suite</p>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => {
          const isActive = currentView === item.id || (currentView === 'detail' && item.id === 'candidates');
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 mt-auto space-y-4">
        <button className="primary-btn w-full justify-center py-3 shadow-lg shadow-primary/10">
          <Plus size={20} />
          Nueva Vacante
        </button>

        <div className="pt-4 border-t border-slate-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all">
            <Settings size={20} className="text-slate-400" />
            Configuración
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={20} className="text-slate-400" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
