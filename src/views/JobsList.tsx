import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
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
  PauseCircle,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { Job } from '../types';

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'Abierta' as 'Abierta' | 'Cerrada' | 'En Pausa',
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

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({ title: '', department: '', location: '', type: 'Full-time', status: 'Abierta', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({ 
      title: job.title, 
      department: job.department, 
      location: job.location, 
      type: job.type, 
      status: job.status,
      description: job.description || '' 
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta vacante?')) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update(formData)
          .eq('id', editingJob.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
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
        <button onClick={handleOpenCreate} className="new-job-btn">
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
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setActiveMenu(activeMenu === job.id ? null : job.id)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                >
                  <MoreVertical size={20} />
                </button>
                
                <AnimatePresence>
                  {activeMenu === job.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      style={{ position: 'absolute', right: 0, top: '32px', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow)', zIndex: 10, width: '160px', overflow: 'hidden' }}
                    >
                      <button onClick={() => handleOpenEdit(job)} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <Edit2 size={14} /> Editar
                      </button>
                      <button onClick={() => handleDeleteJob(job.id)} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', borderTop: '1px solid var(--border)' }}>
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
            <button onClick={handleOpenCreate} className="new-job-btn" style={{ marginTop: '24px', marginInline: 'auto' }}>
              Publicar Vacante
            </button>
          </div>
        )}
      </div>

      {/* Modal Nueva/Editar Vacante */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="dashboard-card" 
            style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', right: '24px', top: '24px', border: 'none', background: 'var(--surface)', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>
              {editingJob ? 'Editar Vacante' : 'Nueva Vacante'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Título del Cargo</label>
                <input 
                  className="auth-input" 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }}
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
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
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    placeholder="Ej. Ingeniería" 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Ubicación</label>
                  <input 
                    className="auth-input" 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none' }}
                    required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="Ej. Remoto / Bogotá" 
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Tipo de Contrato</label>
                  <select 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none', background: 'white' }}
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Freelance</option>
                    <option>Prácticas</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Estado</label>
                  <select 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none', background: 'white' }}
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option>Abierta</option>
                    <option>En Pausa</option>
                    <option>Cerrada</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="secondary-btn" style={{ flex: 1, padding: '14px', justifyContent: 'center' }}>Cancelar</button>
                <button type="submit" className="primary-btn" style={{ flex: 2, padding: '14px', justifyContent: 'center' }}>
                  {editingJob ? 'Guardar Cambios' : 'Publicar Vacante'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
