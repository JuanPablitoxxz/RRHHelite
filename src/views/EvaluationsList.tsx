import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { FileText, Loader2, Star, User, Calendar, CheckCircle2 } from 'lucide-react';

interface Evaluation {
  id: string;
  candidate_id: string;
  interviewer_name: string;
  score: number;
  observations: string;
  created_at: string;
  candidate_name?: string; // We'll join this
}

import { UserRole } from '../types';

interface Evaluation {
  id: string;
  candidate_id: string;
  interviewer_name: string;
  score: number;
  observations: string;
  created_at: string;
  candidate_name?: string;
}

interface EvaluationsListProps {
  userRole?: UserRole | string;
  userEmail?: string;
  userName?: string;
}

export default function EvaluationsList({ userRole = 'admin', userEmail = '', userName = '' }: EvaluationsListProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [myCandidateId, setMyCandidateId] = useState<string | null>(null);
  
  // Applicant form state
  const [testAnswers, setTestAnswers] = useState({ q1: '', q2: '' });
  const [hasCompletedTest, setHasCompletedTest] = useState(false);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('evaluations')
        .select(`
          *,
          candidates!inner (
            id,
            full_name,
            email
          )
        `);

      if (userRole === 'applicant') {
        query = query.eq('candidates.email', userEmail);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      const formatted = (data || []).map(item => ({
        ...item,
        candidate_name: item.candidates?.full_name || 'Candidato Eliminado'
      }));
      
      setEvaluations(formatted);

      if (userRole === 'applicant') {
        const completed = formatted.some(e => e.interviewer_name === 'Prueba Automatizada');
        setHasCompletedTest(completed);
        
        // Fetch candidate ID for submitting
        const { data: candData } = await supabase.from('candidates').select('id').eq('email', userEmail).single();
        if (candData) setMyCandidateId(candData.id);
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myCandidateId) return;
    
    setLoading(true);
    try {
      // Calculate a random score for the demo
      const score = Math.floor(Math.random() * 2) + 4; // 4 or 5
      const obs = `Q1: ${testAnswers.q1}\nQ2: ${testAnswers.q2}`;
      
      const { error } = await supabase.from('evaluations').insert([{
        candidate_id: myCandidateId,
        interviewer_name: 'Prueba Automatizada',
        score: score,
        observations: obs
      }]);

      if (error) throw error;
      
      // Upgrade stage to Contratado or wait for Admin to do it? 
      // The user just said "eso generar unos puntajes que le saldran al reclutador"
      
      alert('¡Evaluación completada con éxito!');
      fetchEvaluations();
    } catch (err) {
      console.error('Error submitting test:', err);
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
          <h2>{userRole === 'applicant' ? 'Tu Evaluación' : 'Evaluaciones de Candidatos'}</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
            {userRole === 'applicant' 
              ? 'Completa esta prueba para avanzar en tu proceso de selección.'
              : 'Revisa el desempeño de los candidatos en sus entrevistas.'
            }
          </p>
        </div>
      </div>

      {userRole === 'applicant' ? (
        <div className="dashboard-card" style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
          {hasCompletedTest ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: '80px', height: '80px', background: '#D1FAE5', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>¡Prueba Completada!</h3>
              <p style={{ color: 'var(--text-muted)' }}>Tus resultados han sido enviados al equipo de reclutamiento. Te notificaremos los siguientes pasos muy pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTest} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ padding: '16px', background: 'var(--primary-light)', borderRadius: '12px', border: '1px solid var(--primary)', color: 'var(--primary)', marginBottom: '8px' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '4px' }}>Prueba de Habilidades</h4>
                <p style={{ fontSize: '13px' }}>Por favor, responde a las siguientes preguntas con honestidad. Tómate tu tiempo.</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>1. Describe una situación donde tuviste que resolver un problema complejo bajo presión.</label>
                <textarea 
                  required
                  value={testAnswers.q1}
                  onChange={e => setTestAnswers({...testAnswers, q1: e.target.value})}
                  className="auth-input"
                  style={{ width: '100%', height: '120px', resize: 'none', padding: '16px' }}
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>2. ¿Qué valor principal crees que aportarías a nuestro equipo?</label>
                <textarea 
                  required
                  value={testAnswers.q2}
                  onChange={e => setTestAnswers({...testAnswers, q2: e.target.value})}
                  className="auth-input"
                  style={{ width: '100%', height: '120px', resize: 'none', padding: '16px' }}
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>

              <button type="submit" className="primary-btn" style={{ justifyContent: 'center', padding: '16px', fontSize: '16px', marginTop: '12px' }}>
                Enviar Evaluación
              </button>
            </form>
          )}
        </div>
      ) : (
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
      )}
    </motion.div>
  );
}
