import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  MoreVertical, 
  Loader2,
  ExternalLink,
  User,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function InterviewsList() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      // Fetch interviews joined with candidate info
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          candidates (
            full_name,
            position
          )
        `)
        .order('scheduled_at', { ascending: true });
      
      if (error) throw error;
      setInterviews(data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteInterview = async (id: string, candidateId: string) => {
    try {
      // 1. Mark interview as completed
      await supabase.from('interviews').update({ status: 'Realizada' }).eq('id', id);
      // 2. Advance candidate to 'Evaluación'
      await supabase.from('candidates').update({ stage: 'Evaluación' }).eq('id', candidateId);
      
      fetchInterviews();
    } catch (error) {
      console.error('Error completing interview:', error);
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="content-area">
      <div className="page-title-section">
        <div>
          <h2>Agenda de Entrevistas</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Sigue y gestiona tus encuentros con el talento</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        {interviews.length > 0 ? interviews.map((int) => (
          <div key={int.id} className="dashboard-card" style={{ padding: '24px', opacity: int.status === 'Realizada' ? 0.7 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {int.type === 'Video' ? <Video size={28} /> : <MapPin size={28} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{int.candidates.full_name}</h3>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary)' }}>{int.candidates.position}</p>
                </div>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', background: int.status === 'Realizada' ? 'var(--primary-light)' : 'var(--secondary-light)', color: int.status === 'Realizada' ? 'var(--primary)' : 'var(--secondary)' }}>
                {int.status}
              </span>
            </div>

            <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                <Calendar size={16} color="var(--primary)" /> 
                {new Date(int.scheduled_at).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                <Clock size={16} color="var(--primary)" /> 
                {new Date(int.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <ExternalLink size={16} /> 
                <span style={{ color: 'var(--secondary)', textDecoration: 'underline', cursor: 'pointer' }}>{int.location}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {int.status === 'Pendiente' && (
                <button 
                  onClick={() => handleCompleteInterview(int.id, int.candidate_id)}
                  className="primary-btn" 
                  style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                >
                  <CheckCircle2 size={18} /> Marcar Realizada
                </button>
              )}
              <button className="secondary-btn" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>
                Ver Perfil <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', padding: '100px', textAlign: 'center', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
            <Calendar size={48} color="var(--border)" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontWeight: 800 }}>No hay entrevistas programadas</h4>
            <p style={{ color: 'var(--text-muted)' }}>Las entrevistas aparecerán aquí cuando agendes una desde el perfil del candidato.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
