import { motion } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowLeftRight, 
  Check, 
  FileText, 
  Download, 
  MessageSquare, 
  Star,
  BookOpen,
  Users,
  Briefcase
} from 'lucide-react';
import { Candidate } from '../types';

const CANDIDATE: Candidate = {
  id: '1',
  name: 'Ana Martínez',
  email: 'ana.mtz@uxdesign.com',
  position: 'Senior UX Designer',
  stage: 'Evaluación',
  rating: 4.8,
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  location: 'Madrid, España',
  phone: '+34 612 345 678'
};

const NOTES = [
  {
    id: '1',
    user: 'Javier López',
    role: 'Senior Recruiter',
    time: 'Hace 2 días',
    initials: 'JL',
    rating: 5,
    content: 'Ana demostró un conocimiento profundo sobre metodologías ágiles y sistemas de diseño complejos. Su portafolio refleja una gran capacidad analítica.'
  },
  {
    id: '2',
    user: 'Marta Ruiz',
    role: 'Design Manager',
    time: 'Hace 5 días',
    initials: 'MR',
    rating: 4,
    content: 'Muy buena comunicación técnica. Sabe defender sus decisiones de diseño con datos de usuario reales. Recomendada para el rol de Senior.'
  }
];

export default function CandidateDetail() {
  const steps = [
    { label: 'Postulación', status: 'completed' },
    { label: 'Preselección', status: 'completed' },
    { label: 'Entrevista', status: 'completed' },
    { label: 'Evaluación', status: 'current' },
    { label: 'Contratado', status: 'pending' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto space-y-10"
    >
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
            <img 
              src={CANDIDATE.avatar} 
              alt={CANDIDATE.name} 
              className="relative w-40 h-40 rounded-3xl object-cover border-4 border-white shadow-xl"
            />
          </div>
          <div className="pt-2">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{CANDIDATE.name}</h2>
            <p className="text-xl font-bold text-primary mb-6">{CANDIDATE.position}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              {[
                { icon: MapPin, text: CANDIDATE.location },
                { icon: Mail, text: CANDIDATE.email },
                { icon: Phone, text: CANDIDATE.phone },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <item.icon size={16} className="text-slate-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none secondary-btn bg-white">
            <Send size={20} />
            Enviar Mensaje
          </button>
          <button className="flex-1 lg:flex-none primary-btn bg-secondary shadow-lg shadow-secondary/20">
            <ArrowLeftRight size={20} />
            Cambiar de Etapa
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="dashboard-card overflow-hidden">
        <div className="flex justify-between items-center relative py-4">
          <div className="absolute h-1 bg-slate-100 left-8 right-8 top-1/2 -translate-y-1/2" />
          <div className="absolute h-1 bg-primary left-8 w-[65%] top-1/2 -translate-y-1/2 transition-all duration-1000" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                ${step.status === 'completed' ? 'bg-primary text-white scale-90' : 
                  step.status === 'current' ? 'bg-white text-primary border-4 border-primary shadow-xl scale-110' : 
                  'bg-slate-50 text-slate-300 border-2 border-slate-100'}
              `}>
                {step.status === 'completed' ? <Check size={18} strokeWidth={3} /> : 
                 step.status === 'current' ? <Check size={20} className="invisible" /> : 
                 <Users size={18} />}
              </div>
              <span className={`text-xs font-bold whitespace-nowrap ${step.status === 'completed' ? 'text-slate-700' : step.status === 'current' ? 'text-primary' : 'text-slate-300'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Docs & Skills */}
        <div className="lg:col-span-4 space-y-8">
          <div className="dashboard-card">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              Documentos
            </h3>
            <div className="space-y-4">
              {[
                { name: 'CV_Ana_Martinez.pdf', size: '2.4 MB', type: 'PDF', icon: FileText, color: 'bg-orange-50 text-orange-500' },
                { name: 'Portafolio_UX_2024.pdf', size: '15.8 MB', type: 'PDF', icon: Briefcase, color: 'bg-primary/10 text-primary' }
              ].map((doc, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white cursor-pointer transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.color}`}>
                      <doc.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.size} • {doc.type}</p>
                    </div>
                  </div>
                  <Download size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card !bg-primary/5 border-primary/10">
            <h4 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4">Habilidades Destacadas</h4>
            <div className="flex flex-wrap gap-2">
              {['Figma', 'User Research', 'Prototyping', 'Accessibility', 'Design Systems'].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-white border border-primary/20 text-primary text-xs font-bold rounded-full shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Evaluations */}
        <div className="lg:col-span-8 dashboard-card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Star size={20} className="text-primary" />
              Evaluaciones y Notas
            </h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-extrabold text-slate-900">4.8</span>
              <div className="flex gap-0.5 text-orange-400">
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current opacity-50" />
              </div>
            </div>
          </div>

          <div className="space-y-8 mb-10">
            {NOTES.map((note) => (
              <div key={note.id} className="relative pl-12">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-500">
                  {note.initials}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-slate-900 leading-tight">{note.user}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{note.role} • {note.time}</p>
                  </div>
                  <div className="flex gap-0.5 text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < note.rating ? 'fill-current' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {note.content}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-50">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Añadir nueva nota</label>
            <div className="relative group">
              <textarea 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all resize-none min-h-[120px]" 
                placeholder="Escribe tus comentarios sobre el candidato..."
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-6">
                <div className="flex gap-1 text-slate-200 hover:text-orange-400 transition-colors cursor-pointer">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} />)}
                </div>
                <button className="primary-btn py-2 text-xs shadow-md shadow-primary/20">
                  <MessageSquare size={16} />
                  Publicar Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
