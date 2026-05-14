import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Building2, 
  Clock, 
  Briefcase, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  Loader2, 
  X,
  Upload
} from 'lucide-react';
import { Job, UserRole } from '../types';

interface JobsListProps {
  userRole?: UserRole | string;
  userEmail?: string;
  userName?: string;
}

export default function JobsList({ userRole = 'admin', userEmail = '', userName = '' }: JobsListProps) {
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

  // Apply form state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyPhone, setApplyPhone] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isApplying, setIsApplying] = useState(false);

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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    if (!cvFile) {
      alert('Por favor adjunta tu Hoja de Vida en PDF.');
      return;
    }

    setIsApplying(true);
    try {
      // 1. Upload CV to storage
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${Date.now()}_${userName?.replace(/\s+/g, '_')}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('cvs')
        .upload(fileName, cvFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);

      // 3. Insert Candidate
      const { error } = await supabase
        .from('candidates')
        .insert([{
          full_name: userName || 'Usuario',
          email: userEmail || 'user@example.com',
          phone: applyPhone,
          position: selectedJob.title,
          stage: 'Postulación',
          cv_url: publicUrlData.publicUrl
        }]);

      if (error) throw error;
      
      alert('¡Aplicación enviada con éxito! Revisa la sección de Entrevistas pronto.');
      setIsApplyModalOpen(false);
      setApplyPhone('');
      setCvFile(null);
    } catch (error: any) {
      console.error('Error applying to job:', error);
      const message = error.message || 'Error desconocido';
      alert(`Hubo un error al enviar tu aplicación: ${message}`);
    } finally {
      setIsApplying(false);
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
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
            {userRole === 'user' || userRole === 'applicant' 
              ? 'Explora nuestras oportunidades laborales y postúlate.' 
              : 'Publica y administra las oportunidades laborales de tu empresa'
            }
          </p>
        </div>
        {(userRole === 'admin' || userRole === 'interviewer') && (
          <button onClick={handleOpenCreate} className="new-job-btn">
            <Plus size={20} />
            Nueva Vacante
          </button>
        )}
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
                {(userRole === 'admin' || userRole === 'interviewer') && (
                  <>
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
                  </>
                )}
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
              {(userRole === 'admin' || userRole === 'interviewer') ? (
                <button className="secondary-btn" style={{ padding: '8px 16px', fontSize: '12px' }}>
                  Ver Candidatos
                </button>
              ) : (
                <button 
                  onClick={() => { setSelectedJob(job); setIsApplyModalOpen(true); }}
                  className="primary-btn" 
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                  disabled={job.status !== 'Abierta'}
                >
                  Postularme
                </button>
              )}
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

      {/* Modal para Aplicar (Usuario) */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ background: 'white', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>Postular a: {selectedJob.title}</h3>
                <button onClick={() => setIsApplyModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>Nombre Completo</label>
                  <input type="text" value={userName || 'Usuario'} disabled className="auth-input" style={{ opacity: 0.7 }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>Correo Electrónico</label>
                  <input type="text" value={userEmail || ''} disabled className="auth-input" style={{ opacity: 0.7 }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>Teléfono</label>
                  <input 
                    type="tel" 
                    value={applyPhone}
                    onChange={(e) => setApplyPhone(e.target.value)}
                    required
                    placeholder="+57 300 000 0000"
                    className="auth-input" 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>Hoja de Vida (PDF)</label>
                  <div style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      required
                    />
                    <Upload size={24} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>
                      {cvFile ? cvFile.name : 'Haz clic o arrastra tu PDF aquí'}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Solo archivos .pdf (Max 5MB)</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsApplyModalOpen(false)} className="secondary-btn" style={{ flex: 1, padding: '14px', justifyContent: 'center' }} disabled={isApplying}>Cancelar</button>
                  <button type="submit" className="primary-btn" style={{ flex: 2, padding: '14px', justifyContent: 'center' }} disabled={isApplying || !cvFile}>
                    {isApplying ? <Loader2 size={18} className="animate-spin" /> : 'Enviar Aplicación'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
