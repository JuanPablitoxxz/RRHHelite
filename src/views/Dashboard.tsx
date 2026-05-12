import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  Video, 
  MapPin, 
  Sparkles,
  UserPlus
} from 'lucide-react';
import { Activity, Interview } from '../types';

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Sofia Martínez',
    description: 'Aplicó para UX Lead',
    time: 'Hace 15 min',
    user: { name: 'Sofia Martínez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    type: 'postulation'
  },
  {
    id: '2',
    title: 'Lucas Varela',
    description: 'Entrevista agendada con Equipo Técnico',
    time: 'Hace 2 horas',
    user: { name: 'Lucas Varela', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    type: 'interview'
  },
  {
    id: '3',
    title: 'Evaluación Técnica',
    description: 'Completada por Javier Gomez (Puntaje: 92/100)',
    time: 'Hace 4 horas',
    user: { name: 'Javier Gomez', initials: 'JG' },
    type: 'evaluation'
  }
];

const INTERVIEWS: Interview[] = [
  {
    id: '1',
    candidateName: 'Sofia Martínez',
    candidateId: 'sm1',
    position: 'Candidata a UX Lead',
    time: '14:00 - 15:00',
    type: 'video',
    initials: 'SM',
    status: 'confirmed'
  },
  {
    id: '2',
    candidateName: 'Daniel Rivera',
    candidateId: 'dr1',
    position: 'Candidato a DevOps',
    time: '16:30 - 17:30',
    type: 'in-person',
    initials: 'DR',
    status: 'pending'
  }
];

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content-area"
    >
      <div className="page-title-section">
        <div>
          <h2>Panel de Control</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Bienvenido de nuevo, revisa el progreso de tus procesos hoy.</p>
        </div>
        <button className="new-job-btn" style={{ padding: '12px 24px', background: 'var(--secondary)' }}>
          <UserPlus size={20} />
          Crear Candidato
        </button>
      </div>

      {/* Stats */}
      <div className="stats-container">
        {[
          { label: 'Vacantes Activas', val: '24', change: '+12% vs mes anterior', icon: Briefcase, color: 'var(--primary)' },
          { label: 'Total Candidatos', val: '1,284', change: '+48 nuevos', icon: Users, color: 'var(--secondary)' },
          { label: 'Entrevistas Hoy', val: '8', change: 'Próxima en 45 min', icon: Calendar, color: '#F59E0B' }
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="card-top">
              <div className="icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={26} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: stat.color, background: `${stat.color}10`, padding: '4px 10px', borderRadius: '20px' }}>
                {stat.change}
              </span>
            </div>
            <div className="stat-info">
              <p className="label">{stat.label}</p>
              <h3 className="value">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="funnel-card">
        <div className="funnel-header">
          <h4 style={{ fontSize: '18px', fontWeight: 800 }}>Embudo de Reclutamiento</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
            Global <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
          </div>
        </div>
        <div className="funnel-bars">
          {[
            { label: 'Postulación', count: 450, h: '100%', c: 'var(--primary)' },
            { label: 'Preselección', count: 210, h: '75%', c: '#14B8A6' },
            { label: 'Entrevista', count: 84, h: '50%', c: '#5EEAD4' },
            { label: 'Evaluación', count: 32, h: '30%', c: '#CCFBF1' },
            { label: 'Contratado', count: 12, h: '15%', c: 'var(--secondary)' }
          ].map((bar, i) => (
            <div key={i} className="funnel-bar-wrapper">
              <div className="bar" style={{ height: bar.h, background: bar.c }}>
                <span style={{ color: i > 2 ? 'var(--primary)' : 'white' }}>{bar.count}</span>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{bar.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="activity-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h4 style={{ fontWeight: 800 }}>Actividad Reciente</h4>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Ver todas</span>
          </div>
          <div className="activity-list">
            {ACTIVITIES.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-left">
                  {act.user.avatar ? (
                    <img src={act.user.avatar} className="activity-avatar" alt="" />
                  ) : (
                    <div className="activity-avatar" style={{ background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {act.user.initials}
                    </div>
                  )}
                  <div className="activity-details">
                    <h5>{act.user.name}</h5>
                    <p>{act.description}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge ${act.type === 'postulation' ? 'badge-primary' : 'badge-secondary'}`}>
                    {act.type === 'postulation' ? 'Nueva Postulación' : act.type === 'interview' ? 'Entrevista' : 'Completado'}
                  </span>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 700 }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="interviews-card">
           <h4 style={{ fontWeight: 800, marginBottom: '24px' }}>Próximas Entrevistas</h4>
           <div className="interview-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {INTERVIEWS.map(int => (
               <div key={int.id} style={{ padding: '16px', borderRadius: '12px', background: 'var(--surface)', borderLeft: `4px solid ${int.status === 'confirmed' ? 'var(--secondary)' : 'var(--primary)'}` }}>
                 <p style={{ fontSize: '10px', fontWeight: 800, color: int.status === 'confirmed' ? 'var(--secondary)' : 'var(--primary)', marginBottom: '4px' }}>{int.time}</p>
                 <h6 style={{ fontWeight: 700, fontSize: '14px' }}>{int.candidateName}</h6>
                 <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{int.position}</p>
               </div>
             ))}
           </div>
           
           <div style={{ marginTop: '24px', padding: '20px', background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', borderRadius: '16px', border: '1px solid #C7D2FE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4F46E5', marginBottom: '8px' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>TalentHub Insights</span>
              </div>
              <p style={{ fontSize: '12px', color: '#1E1B4B', lineHeight: '1.5' }}>
                Tienes <strong>3 perfiles</strong> con alta compatibilidad para Frontend Senior.
              </p>
              <button style={{ marginTop: '12px', width: '100%', padding: '10px', background: 'white', border: '1px solid #C7D2FE', borderRadius: '10px', fontSize: '11px', fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>
                Ver Sugerencias
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
