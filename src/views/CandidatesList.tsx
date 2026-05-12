import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star, 
  UserPlus, 
  Loader2, 
  Edit2, 
  Trash2,
  X,
  Mail,
  Briefcase
} from 'lucide-react';
import { Candidate, View } from '../types';

interface CandidatesListProps {
  onSelectCandidate: (view: View, candidateId?: string) => void;
}

export default function CandidatesList({ onSelectCandidate }: CandidatesListProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    position: '',
    phone: '',
    stage: 'Postulación',
    rating: 0
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCandidate(null);
    setFormData({ full_name: '', email: '', position: '', phone: '', stage: 'Postulación', rating: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Candidate) => {
    setEditingCandidate(c);
    setFormData({ 
      full_name: c.full_name, 
      email: c.email, 
      position: c.position, 
      phone: c.phone || '', 
      stage: c.stage,
      rating: c.rating || 0 
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este candidato?')) return;
    try {
      const { error } = await supabase.from('candidates').delete().eq('id', id);
      if (error) throw error;
      fetchCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCandidate) {
        const { error } = await supabase.from('candidates').update(formData).eq('id', editingCandidate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('candidates').insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchCandidates();
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="content-area"
    >
      <div className="page-title-section">
        <div>
          <h2>Base de Candidatos</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Gestiona y evalúa el talento de tu organización</p>
        </div>
        <button onClick={handleOpenCreate} className="new-job-btn">
          <UserPlus size={18} />
          Añadir Candidato
        </button>
      </div>

      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
          <div className="search-bar" style={{ flex: 1, margin: 0 }}>
            <Search size={18} color="#64748B" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, cargo o correo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="secondary-btn" style={{ padding: '10px 16px' }}>
            <Filter size={18} />
            Filtros
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Candidato</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Etapa</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Posición</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calificación</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length > 0 ? filteredCandidates.map((c) => (
              <tr 
                key={c.id} 
                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td onClick={() => onSelectCandidate('detail', c.id)} style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {c.full_name?.[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>{c.full_name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.email}</p>
                    </div>
                  </div>
                </td>
                <td onClick={() => onSelectCandidate('detail', c.id)} style={{ padding: '20px 24px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    padding: '6px 12px', 
                    borderRadius: '20px',
                    background: c.stage === 'Contratado' ? 'var(--secondary-light)' : 'var(--primary-light)',
                    color: c.stage === 'Contratado' ? 'var(--secondary)' : 'var(--primary)'
                  }}>
                    {c.stage}
                  </span>
                </td>
                <td onClick={() => onSelectCandidate('detail', c.id)} style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {c.position}
                </td>
                <td onClick={() => onSelectCandidate('detail', c.id)} style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= (c.rating || 0) ? '#F59E0B' : 'transparent'} color={s <= (c.rating || 0) ? '#F59E0B' : '#CBD5E1'} />
                    ))}
                  </div>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right', position: 'relative' }}>
                  <button onClick={() => setActiveMenu(activeMenu === c.id ? null : c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <MoreHorizontal size={20} />
                  </button>
                  <AnimatePresence>
                    {activeMenu === c.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'absolute', right: '40px', top: '10px', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow)', zIndex: 10, width: '140px', overflow: 'hidden' }}>
                        <button onClick={() => handleOpenEdit(c)} style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}><Edit2 size={14} /> Editar</button>
                        <button onClick={() => handleDelete(c.id)} style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', borderTop: '1px solid var(--border)' }}><Trash2 size={14} /> Eliminar</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No hay candidatos.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva/Editar Candidato */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="dashboard-card" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', right: '24px', top: '24px', border: 'none', background: 'var(--surface)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>{editingCandidate ? 'Editar Candidato' : 'Nuevo Candidato'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>NOMBRE COMPLETO</label>
                <input required className="auth-input" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>CORREO ELECTRÓNICO</label>
                <input required type="email" className="auth-input" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>CARGO</label>
                  <input required className="auth-input" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }} value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>ETAPA</label>
                  <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white' }} value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                    <option>Postulación</option>
                    <option>Preselección</option>
                    <option>Entrevista</option>
                    <option>Evaluación</option>
                    <option>Contratado</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="secondary-btn" style={{ flex: 1, padding: '14px' }}>Cancelar</button>
                <button type="submit" className="primary-btn" style={{ flex: 2, padding: '14px' }}>{editingCandidate ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
