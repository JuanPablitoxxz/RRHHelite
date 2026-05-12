import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Search, Filter, MoreHorizontal, Star, MapPin, Mail, Phone, Loader2, UserPlus } from 'lucide-react';
import { Candidate, View } from '../types';

interface CandidatesListProps {
  onSelectCandidate: (view: View) => void;
}

export default function CandidatesList({ onSelectCandidate }: CandidatesListProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        <button className="new-job-btn">
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
          <tbody style={{ divideY: '1px solid var(--border)' }}>
            {filteredCandidates.length > 0 ? filteredCandidates.map((c) => (
              <tr 
                key={c.id} 
                onClick={() => onSelectCandidate('detail')}
                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '20px 24px' }}>
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
                <td style={{ padding: '20px 24px' }}>
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
                <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {c.position}
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= (c.rating || 0) ? '#F59E0B' : 'transparent'} color={s <= (c.rating || 0) ? '#F59E0B' : '#CBD5E1'} />
                    ))}
                  </div>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {searchTerm ? 'No se encontraron candidatos para esta búsqueda.' : 'No hay candidatos registrados aún.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div style={{ padding: '16px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Mostrando {filteredCandidates.length} candidatos
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '12px' }} disabled>Anterior</button>
            <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '12px' }} disabled>Siguiente</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
