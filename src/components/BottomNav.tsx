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
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id || (currentView === 'detail' && item.id === 'candidates');

        if (item.isSpecial) {
          return (
            <div key={item.id} style={{ position: 'relative', top: '-24px' }}>
              <button 
                style={{ 
                  width: '56px', 
                  height: '56px', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  borderRadius: '16px', 
                  border: 'none',
                  boxShadow: '0 8px 16px rgba(13, 148, 136, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={28} />
              </button>
            </div>
          );
        }

        return (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as View)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
