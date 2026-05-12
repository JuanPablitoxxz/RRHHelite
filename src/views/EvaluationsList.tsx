import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { FileText, Loader2, Star, User, Calendar } from 'lucide-react';

interface Evaluation {
  id: string;
  candidate_id: string;
  interviewer_name: string;
  score: number;
  observations: string;
  created_at: string;
  candidate_name?: string; // We'll join this
}

export default function EvaluationsList() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      // Usamos inner join manual simulado o consulta directa si hay relación en Supabase
      // En Supabase, para hacer join con foreign key:
      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          *,
          candidates (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formatted = (data || []).map(item => ({
        ...item,
        candidate_name: item.candidates?.full_name || 'Candidato Eliminado'
      }));
      
      setEvaluations(formatted);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < score ? "#F59E0B" : "transparent"} 
        color={i < score ? "#F59E0B" : "var(--border)"} 
      />
    ));
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
          <h2>Evaluaciones de Candidatos</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Revisa el desempeño de los candidatos en sus entrevistas.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {evaluations.length > 0 ? evaluations.map((evaluation) => (
          <div key={evaluation.id} className="dashboard-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px' }}>
                <FileText size={24} />
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {renderStars(evaluation.score)}
              </div>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
              {evaluation.candidate_name}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <User size={14} /> Evaluado por: {evaluation.interviewer_name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Calendar size={14} /> Fecha: {new Date(evaluation.created_at).toLocaleDateString()}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', fontSize: '14px', color: 'var(--text-main)', fontStyle: 'italic', border: '1px solid var(--border)' }}>
              "{evaluation.observations || 'Sin observaciones detalladas.'}"
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', padding: '100px', textAlign: 'center', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
            <FileText size={48} color="var(--border)" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>No hay evaluaciones registradas</h4>
            <p style={{ color: 'var(--text-muted)' }}>Las evaluaciones aparecerán aquí una vez que los entrevistadores califiquen a los candidatos.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
