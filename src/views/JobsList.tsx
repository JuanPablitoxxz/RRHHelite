import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  Clock, 
  Plus, 
  Search, 
  MoreVertical,
  Loader2,
  CheckCircle2,
  XCircle,
  PauseCircle
} from 'lucide-react';
import { Job } from '../types';

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([newJob]);
      
      if (error) throw error;
      setIsModalOpen(false);
      setNewJob({ title: '', department: '', location: '', type: 'Full-time', description: '' });
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.department.toLowerCase().includes(searchTerm.toLowerCase())
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content-area"
    >
      <div className="page-title-section">
        <div>
          <h2>Gestión de Vacantes</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Publica y administra las oportunidades laborales de tu empresa</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="new-job-btn">
          <Plus size={20} />
          Nueva Vacante
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div className="search-bar" style={{ maxWidth: '400px' }}>
          <Search size={18} color="#64748B" />
          <input 
            type="text" 
            placeholder="Buscar por título o departamento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
          <div key={job.id} className="dashboard-card" style={{ padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px' }}>
                <Briefcase size={24} />
              </div>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{job.title}</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                <Building2 size={14} /> {job.department}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                <MapPin size={14} /> {job.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                <Clock size={14} /> {job.type}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {job.status === 'Abierta' ? <CheckCircle2 size={16} color="#10B981" /> : job.status === 'Cerrada' ? <XCircle size={16} color="#EF4444" /> : <PauseCircle size={16} color="#F59E0B" />}
                <span style={{ fontSize: '12px', fontWeight: 800, color: job.status === 'Abierta' ? '#10B981' : job.status === 'Cerrada' ? '#EF4444' : '#F59E0B' }}>
                  {job.status}
                </span>
              </div>
              <button className="secondary-btn" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Ver Candidatos
              </button>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', padding: '100px', textAlign: 'center', background: 'var(--surface)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
            <Briefcase size={48} color="var(--border)" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>No hay vacantes activas</h4>
            <p style={{ color: 'var(--text-muted)' }}>Empieza publicando tu primera oferta de empleo.</p>
            <button onClick={() => setIsModalOpen(true)} className="new-job-btn" style={{ marginTop: '24px', marginInline: 'auto' }}>
              Publicar Vacante
            </button>
          </div>
        )}
      </div>

      {/* Modal Nueva Vacante */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="dashboard-card" 
            style={{ width: '100%', maxWidth: '500px', padding: '32px' }}
          >
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Nueva Vacante</h3>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Título del Cargo</label>
                <input 
                  className="auth-input" 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }}
                  required
                  value={newJob.title}
                  onChange={e => setNewJob({...newJob, title: e.target.value})}
                  placeholder="Ej. Senior React Developer" 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Departamento</label>
                  <input 
                    className="auth-input" 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }}
                    required
                    value={newJob.department}
                    onChange={e => setNewJob({...newJob, department: e.target.value})}
                    placeholder="Ej. Ingeniería" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Ubicación</label>
                  <input 
                    className="auth-input" 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }}
                    required
                    value={newJob.location}
                    onChange={e => setNewJob({...newJob, location: e.target.value})}
                    placeholder="Ej. Remoto / Bogotá" 
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Tipo de Contrato</label>
                <select 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none', background: 'white' }}
                  value={newJob.type}
                  onChange={e => setNewJob({...newJob, type: e.target.value})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Freelance</option>
                  <option>Prácticas</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="secondary-btn" style={{ flex: 1, padding: '14px', justifyContent: 'center' }}>Cancelar</button>
                <button type="submit" className="primary-btn" style={{ flex: 2, padding: '14px', justifyContent: 'center' }}>Publicar Vacante</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
