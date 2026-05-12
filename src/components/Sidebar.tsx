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
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 w-64 border-r border-slate-100 bg-slate-50/50 py-8">
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-bold text-primary tracking-tight">TalentFlow</h1>
        <p className="text-xs text-slate-500 font-medium opacity-70">Recruitement Suite</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id || (currentView === 'detail' && item.id === 'candidates');
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive 
                ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-slate-400'} />
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
