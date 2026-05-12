import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Star, 
  Send,
  Loader2,
  Share2,
  ChevronRight
} from 'lucide-react';
import { Candidate } from '../types';

interface CandidateDetailProps {
  candidateId: string | null;
  onBack: () => void;
}

const STAGES = ['Postulación', 'Preselección', 'Entrevista', 'Evaluación', 'Contratado'];

export default function CandidateDetail({ candidateId, onBack }: CandidateDetailProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [noteRating, setNoteRating] = useState(5);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (candidateId) fetchCandidateData();
  }, [candidateId]);

  const fetchCandidateData = async () => {
    setLoading(true);
    try {
      const { data: cand, error: candError } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', candidateId)
        .single();
      
      if (candError) throw candError;
      setCandidate(cand);

      const { data: evals } = await supabase
        .from('evaluations')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });
      
      setEvaluations(evals || []);
    } catch (error) {
      console.error('Error fetching candidate detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStage = async (newStage: string) => {
    if (!candidate) return;
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ stage: newStage })
        .eq('id', candidate.id);
      
      if (error) throw error;
      setCandidate({ ...candidate, stage: newStage });
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote || !candidate) return;
    setSavingNote(true);
    try {
      const { error } = await supabase
        .from('evaluations')
        .insert([{
          candidate_id: candidate.id,
          interviewer_name: 'Administrador', // Mocked for now
          score: noteRating,
          observations: newNote
        }]);
      
      if (error) throw error;
      setNewNote('');
      fetchCandidateData();
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  if (!candidate) return <div className="content-area">No se encontró el candidato.</div>;

  const currentStageIndex = STAGES.indexOf(candidate.stage);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="content-area">
      <div style={{ marginBottom: '32px' }}>
        <button onClick={onBack} className="secondary-btn" style={{ padding: '8px 16px', gap: '8px' }}>
          <ArrowLeft size={18} /> Volver a la lista
        </button>
      </div>

      {/* Header Info */}
      <div className="dashboard-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '24px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 800, color: 'var(--primary)' }}>
            {candidate.full_name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>{candidate.full_name}</h2>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '18px' }}>{candidate.position}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="secondary-btn" style={{ padding: '12px 24px', fontWeight: 700 }}>Enviar Mensaje</button>
                <button className="primary-btn" style={{ padding: '12px 24px', fontWeight: 700, background: 'var(--secondary)' }}>
                  <Share2 size={18} /> Cambiar de Etapa
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> Madrid, España</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> {candidate.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> {candidate.phone || 'Sin teléfono'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="dashboard-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
          {STAGES.map((stage, i) => {
            const isCompleted = i < currentStageIndex;
            const isCurrent = i === currentStageIndex;
            return (
              <div 
                key={stage} 
                onClick={() => handleUpdateStage(stage)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 1, cursor: 'pointer', flex: 1 }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--primary-light)' : 'white',
                  border: `2px solid ${isCurrent || isCompleted ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCurrent ? 'white' : 'var(--primary)',
                  transition: 'all 0.3s'
                }}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <span style={{ fontWeight: 800 }}>{i + 1}</span>}
                </div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: isCurrent ? 'var(--text-main)' : 'var(--text-muted)' }}>{stage}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Left Col: Docs & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="dashboard-card" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="var(--primary)" /> Documentos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: `CV_${candidate.full_name.replace(' ', '_')}.pdf`, size: '2.4 MB' },
                { name: 'Portafolio_Diseño.pdf', size: '15.8 MB' }
              ].map((doc, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px' }}><FileText size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700 }}>{doc.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '16px' }}>Habilidades Destacadas</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['React', 'TypeScript', 'UI Design', 'Supabase', 'Figma', 'Node.js'].map(skill => (
                <span key={skill} style={{ padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Evaluations */}
        <div className="dashboard-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h4 style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={20} color="var(--primary)" /> Evaluaciones y Notas
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800 }}>4.8</span>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
            {evaluations.map((ev) => (
              <div key={ev.id} style={{ padding: '20px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>{ev.interviewer_name[0]}</div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700 }}>{ev.interviewer_name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(ev.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= ev.score ? '#F59E0B' : 'transparent'} color={s <= ev.score ? '#F59E0B' : '#CBD5E1'} />)}
                  </div>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)' }}>{ev.observations}</p>
              </div>
            ))}
          </div>

          {/* New Note Form */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Añadir nueva nota</h5>
            <textarea 
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Escribe tus comentarios sobre el candidato..."
              style={{ width: '100%', height: '100px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px', resize: 'none', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Calificación:</span>
                {[1,2,3,4,5].map(s => (
                  <Star 
                    key={s} 
                    size={20} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setNoteRating(s)}
                    fill={s <= noteRating ? '#F59E0B' : 'transparent'} 
                    color={s <= noteRating ? '#F59E0B' : '#CBD5E1'} 
                  />
                ))}
              </div>
              <button 
                onClick={handleAddNote}
                disabled={savingNote || !newNote}
                className="primary-btn" 
                style={{ padding: '10px 24px', background: '#065F46' }}
              >
                {savingNote ? <Loader2 size={18} className="animate-spin" /> : 'Publicar Nota'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
