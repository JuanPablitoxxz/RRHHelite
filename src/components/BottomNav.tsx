import { LayoutDashboard, Briefcase, Plus, Users, CalendarClock } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  const items = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'jobs', label: 'Vacantes', icon: Briefcase },
    { id: 'add', label: 'Nuevo', icon: Plus, isSpecial: true },
    { id: 'candidates', label: 'Candidatos', icon: Users },
    { id: 'interviews', label: 'Eventos', icon: CalendarClock },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 h-20 px-4 flex items-center justify-around z-50">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id || (currentView === 'detail' && item.id === 'candidates');

        if (item.isSpecial) {
          return (
            <div key={item.id} className="relative -top-6">
              <button className="w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform">
                <Icon size={28} />
              </button>
            </div>
          );
        }

        return (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as View)}
            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-slate-400'}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
