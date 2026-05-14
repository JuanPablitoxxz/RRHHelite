import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  UserPlus,
  Loader2
} from 'lucide-react';
import { Activity, Interview } from '../types';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 24, // Mock for now
    interviewsToday: 0
  });
  const [funnel, setFunnel] = useState([
    { label: 'Postulación', count: 0, h: '0%', c: 'var(--primary)' },
    { label: 'Preselección', count: 0, h: '0%', c: '#14B8A6' },
    { label: 'Entrevista', count: 0, h: '0%', c: '#5EEAD4' },
    { label: 'Evaluación', count: 0, h: '0%', c: '#CCFBF1' },
    { label: 'Contratado', count: 0, h: '0%', c: 'var(--secondary)' }
  ]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Total Candidates
      const { count: totalCount } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true });

      // 2. Active Jobs
      const { count: activeJobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Abierta');

      // 3. Interviews Today/Pending
      const { count: pendingInterviews } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendiente');

      // 4. Funnel Data (Grouped by stage)
      const { data: candidates } = await supabase
        .from('candidates')
        .select('stage');

      const stageCounts = {
        'Postulación': 0,
        'Preselección': 0,
        'Entrevista': 0,
        'Evaluación': 0,
        'Contratado': 0
      };

      candidates?.forEach(c => {
        if (stageCounts.hasOwnProperty(c.stage)) {
          stageCounts[c.stage as keyof typeof stageCounts]++;
        }
      });

      const maxCount = Math.max(...Object.values(stageCounts), 1);
      const newFunnel = funnel.map(f => ({
        ...f,
        count: stageCounts[f.label as keyof typeof stageCounts],
        h: `${(stageCounts[f.label as keyof typeof stageCounts] / maxCount) * 100}%`
      }));

      // 5. Recent Activities
      const { data: recentCandidates } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      const activities: Activity[] = (recentCandidates || []).map(c => ({
        id: c.id,
        title: c.full_name,
        description: `Se postuló para ${c.position}`,
        time: new Date(c.created_at).toLocaleDateString(),
        user: { name: c.full_name, initials: c.full_name[0] },
        type: 'postulation'
      }));

      setStats({
        totalCandidates: totalCount || 0,
        activeJobs: activeJobsCount || 0,
        interviewsToday: pendingInterviews || 0
      });
      setFunnel(newFunnel);
      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
          { label: 'Vacantes Activas', val: stats.activeJobs, change: '+0% vs mes anterior', icon: Briefcase, color: 'var(--primary)' },
          { label: 'Total Candidatos', val: stats.totalCandidates.toLocaleString(), change: 'Actualizado', icon: Users, color: 'var(--secondary)' },
          { label: 'Entrevistas Hoy', val: stats.interviewsToday, change: 'Próxima pronto', icon: Calendar, color: '#F59E0B' }
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
          {funnel.map((bar, i) => (
            <div key={i} className="funnel-bar-wrapper">
              <div className="bar" style={{ height: bar.h || '10px', background: bar.c, minHeight: '10px' }}>
                <span style={{ color: i > 2 ? 'var(--primary)' : 'white', display: bar.count > 0 ? 'block' : 'none' }}>{bar.count}</span>
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
            {recentActivities.length > 0 ? recentActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-left">
                  <div className="activity-avatar" style={{ background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {act.user.initials}
                  </div>
                  <div className="activity-details">
                    <h5>{act.user.name}</h5>
                    <p>{act.description}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge badge-primary`}>
                    Postulación
                  </span>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 700 }}>{act.time}</p>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>No hay actividad reciente.</p>
            )}
          </div>
        </div>


      </div>
    </motion.div>
  );
}
