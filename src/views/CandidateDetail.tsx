import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
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
  Calendar,
  Video,
  X,
  Clock
} from 'lucide-react';
import { Candidate } from '../types';
import ChatModal from '../components/ChatModal';

interface CandidateDetailProps {
  candidateId: string | null;
  onBack: () => void;
  userEmail: string;
}

const STAGES = ['Postulación', 'Preselección', 'Entrevista', 'Evaluación', 'Contratado'];

export default function CandidateDetail({ candidateId, onBack, userEmail }: CandidateDetailProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [noteRating, setNoteRating] = useState(5);
  const [savingNote, setSavingNote] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Interview scheduling
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    type: 'Video',
    location: ''
  });

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
    
    const newStageIndex = STAGES.indexOf(newStage);
    const currentStageIndex = STAGES.indexOf(candidate.stage);
    
    // Prevent backward steps
    if (newStageIndex <= currentStageIndex) {
      alert('Las etapas solo pueden avanzar, no se puede retroceder de estado.');
      return;
    }

    if (newStage === 'Entrevista') {
      setIsScheduleModalOpen(true);
      return;
    }
    
    updateStageInDb(newStage);
  };

  const updateStageInDb = async (newStage: string) => {
    if (!candidate) return;
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ stage: newStage })
        .eq('id', candidate.id);
      
      if (error) throw error;
      setCandidate({ ...candidate, stage: newStage });

      // Si la etapa es mayor a Postulación (índice 0), y es Preselección (índice 1) o más, pasarlo a Aspirante
      const newStageIndex = STAGES.indexOf(newStage);
      if (newStageIndex > 0) {
        await supabase
          .from('profiles')
          .update({ role: 'applicant' })
          .eq('email', candidate.email);
      }
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate) return;

    try {
      // 1. Create interview record
      const scheduledAt = `${interviewData.date}T${interviewData.time}:00`;
      const { error: intError } = await supabase
        .from('interviews')
        .insert([{
          candidate_id: candidate.id,
          scheduled_at: scheduledAt,
          type: interviewData.type,
          location: interviewData.location
        }]);

      if (intError) throw intError;

      // 2. Update candidate stage
      await updateStageInDb('Entrevista');
      
      setIsScheduleModalOpen(false);
      fetchCandidateData();
    } catch (error) {
      console.error('Error scheduling interview:', error);
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
          interviewer_name: 'Administrador',
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
                <button onClick={() => setIsChatOpen(true)} className="secondary-btn" style={{ padding: '12px 24px', fontWeight: 700 }}>
                  <MessageSquare size={18} /> Enviar Mensaje
                </button>
                <button 
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="primary-btn" 
                  style={{ padding: '12px 24px', fontWeight: 700, background: 'var(--secondary)' }}
                >
                  <Calendar size={18} /> Agendar Entrevista
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="dashboard-card" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="var(--primary)" /> Documentos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {candidate.cv_url ? (
                <div 
                  onClick={() => window.open(candidate.cv_url, '_blank')}
                  style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ padding: '8px', background: '#FEF2F2', color: '#EF4444', borderRadius: '8px' }}><FileText size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700 }}>CV_{candidate.full_name.replace(' ', '_')}.pdf</p>
                    <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>Ver PDF</p>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6 }}>
                  <div style={{ padding: '8px', background: 'var(--surface)', color: 'var(--text-muted)', borderRadius: '8px' }}><FileText size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700 }}>Sin CV adjunto</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h4 style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={20} color="var(--primary)" /> Evaluaciones y Notas
            </h4>
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
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-main)' }}>{ev.observations}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Añadir nueva nota</h5>
            <textarea 
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Escribe tus comentarios..."
              style={{ width: '100%', height: '100px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px', resize: 'none', marginBottom: '16px' }}
            />
            <button 
              onClick={handleAddNote}
              disabled={savingNote || !newNote}
              className="primary-btn" 
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              {savingNote ? <Loader2 size={18} className="animate-spin" /> : 'Publicar Nota'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Agendar Entrevista */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="dashboard-card" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
              <button onClick={() => setIsScheduleModalOpen(false)} style={{ position: 'absolute', right: '24px', top: '24px', border: 'none', background: 'var(--surface)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Agendar Entrevista</h3>
              <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>FECHA</label>
                    <input type="date" required className="auth-input" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} value={interviewData.date} onChange={e => setInterviewData({...interviewData, date: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>HORA</label>
                    <input type="time" required className="auth-input" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} value={interviewData.time} onChange={e => setInterviewData({...interviewData, time: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>TIPO</label>
                  <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white' }} value={interviewData.type} onChange={e => setInterviewData({...interviewData, type: e.target.value})}>
                    <option>Video</option>
                    <option>Presencial</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>{interviewData.type === 'Video' ? 'LINK DE REUNIÓN' : 'UBICACIÓN'}</label>
                  <input required className="auth-input" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} value={interviewData.location} onChange={e => setInterviewData({...interviewData, location: e.target.value})} placeholder={interviewData.type === 'Video' ? 'Meet, Zoom, etc.' : 'Dirección física'} />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="secondary-btn" style={{ flex: 1, padding: '14px' }}>Cancelar</button>
                  <button type="submit" className="primary-btn" style={{ flex: 2, padding: '14px', background: 'var(--secondary)' }}>Agendar y Cambiar Etapa</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        currentUserEmail={userEmail} 
        recipientEmail={candidate.email} 
        recipientName={candidate.full_name} 
      />
    </motion.div>
  );
}
