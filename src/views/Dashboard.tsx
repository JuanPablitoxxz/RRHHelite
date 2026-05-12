import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  ChevronRight, 
  Video, 
  MapPin, 
  Sparkles,
  UserPlus
} from 'lucide-react';
import { Activity, Interview } from '../types';

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Sofia Martínez',
    description: 'Aplicó para UX Lead',
    time: 'Hace 15 min',
    user: { name: 'Sofia Martínez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    type: 'postulation'
  },
  {
    id: '2',
    title: 'Evaluación Técnica',
    description: 'Completada por Javier Gomez (Puntaje: 92/100)',
    time: 'Hace 2 horas',
    user: { name: 'Javier Gomez', initials: 'JG' },
    type: 'evaluation'
  },
  {
    id: '3',
    title: 'Lucas Varela',
    description: 'Entrevista agendada con Equipo Técnico',
    time: 'Hace 4 horas',
    user: { name: 'Lucas Varela', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    type: 'interview'
  }
];

const INTERVIEWS: Interview[] = [
  {
    id: '1',
    candidateName: 'Sofia Martínez',
    candidateId: 'sm1',
    position: 'Candidata a UX Lead',
    time: '14:00 - 15:00',
    type: 'video',
    initials: 'SM',
    status: 'confirmed'
  },
  {
    id: '2',
    candidateName: 'Daniel Rivera',
    candidateId: 'dr1',
    position: 'Candidato a DevOps',
    time: '16:30 - 17:30',
    type: 'in-person',
    initials: 'DR',
    status: 'pending'
  }
];

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Panel de Control</h2>
          <p className="text-slate-500 font-medium">Bienvenido de nuevo, revisa el progreso de tus procesos hoy.</p>
        </div>
        <button className="secondary-btn shadow-sm">
          <UserPlus size={20} />
          Crear Candidato
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Vacantes Activas', val: '24', change: '+12% vs mes anterior', icon: Briefcase, color: 'bg-primary/10 text-primary' },
          { label: 'Total Candidatos', val: '1,284', change: '+48 nuevos', icon: Users, color: 'bg-secondary/10 text-secondary' },
          { label: 'Entrevistas Hoy', val: '8', change: 'Próxima en 45 min', icon: Calendar, color: 'bg-orange-50 text-orange-600' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4 }}
            className="dashboard-card flex flex-col justify-between h-44"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color}`}>{stat.change}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-extrabold text-slate-900">{stat.val}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recruitment Funnel */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-10">
          <h4 className="text-xl font-bold text-slate-900">Embudo de Reclutamiento</h4>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            Global
            <ChevronRight size={16} className="rotate-90" />
          </div>
        </div>
        <div className="flex items-end justify-between gap-1 h-48">
          {[
            { label: 'Postulación', count: 450, color: 'bg-primary', height: '100%' },
            { label: 'Preselección', count: 210, color: 'bg-primary/80', height: '75%' },
            { label: 'Entrevista', count: 84, countColor: 'text-white', color: 'bg-primary/60', height: '50%' },
            { label: 'Evaluación', count: 32, countColor: 'text-slate-900', color: 'bg-primary/30', height: '30%' },
            { label: 'Contratado', count: 12, countColor: 'text-white', color: 'bg-secondary', height: '15%' }
          ].map((stage, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: stage.height }}
                className={`w-full ${stage.color} rounded-t-2xl flex items-center justify-center relative overflow-hidden group-hover:brightness-110 transition-all`}
              >
                <span className={`font-bold text-lg z-10 ${stage.countColor || 'text-white'}`}>{stage.count}</span>
              </motion.div>
              <p className="mt-4 text-xs font-bold text-slate-500 text-center">{stage.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 dashboard-card !p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900">Actividad Reciente</h4>
            <button className="text-sm font-bold text-primary hover:underline transition-all">Ver todas</button>
          </div>
          <div className="divide-y divide-slate-50">
            {ACTIVITIES.map((activity) => (
              <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  {activity.user.avatar ? (
                    <img src={activity.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
                      {activity.user.initials}
                    </div>
                  )}
                  <div>
                    <h5 className="font-bold text-slate-900 leading-tight">{activity.title}</h5>
                    <p className="text-sm text-slate-500 font-medium">
                      {activity.description.includes('UX Lead') ? (
                        <>Aplicó para <span className="text-secondary font-bold">UX Lead</span></>
                      ) : activity.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    activity.type === 'postulation' ? 'bg-primary/10 text-primary' :
                    activity.type === 'interview' ? 'bg-secondary/10 text-secondary' :
                    activity.type === 'evaluation' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {activity.type === 'postulation' ? 'Nueva Postulación' :
                     activity.type === 'interview' ? 'Entrevista' :
                     activity.type === 'evaluation' ? 'Completado' : 'Sistema'}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-tighter opacity-70">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="space-y-6">
          <div className="dashboard-card">
            <h4 className="text-lg font-bold text-slate-900 mb-6 underline decoration-primary/20 underline-offset-8">Próximas Entrevistas</h4>
            <div className="space-y-4">
              {INTERVIEWS.map((interview) => (
                <div key={interview.id} className={`p-4 rounded-2xl border-l-4 ${interview.status === 'confirmed' ? 'border-secondary bg-secondary/5' : 'border-primary bg-primary/5'} shadow-sm`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${interview.status === 'confirmed' ? 'text-secondary' : 'text-primary'}`}>
                      {interview.time}
                    </span>
                    {interview.type === 'video' ? <Video size={14} className="text-slate-400" /> : <MapPin size={14} className="text-slate-400" />}
                  </div>
                  <h6 className="font-bold text-slate-900">{interview.candidateName}</h6>
                  <p className="text-xs font-medium text-slate-500">{interview.position}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-indigo-100/50 border border-indigo-100/50 relative overflow-hidden group transition-all hover:shadow-lg hover:shadow-indigo-50">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles size={40} className="text-indigo-600" />
              </div>
              <div className="flex items-center gap-2 mb-2 text-indigo-600">
                <Sparkles size={18} />
                <h6 className="text-xs font-bold uppercase tracking-wider">TalentFlow Insights</h6>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                Tienes <strong className="text-indigo-600">3 perfiles</strong> con alta compatibilidad para la vacante de Frontend Senior. ¡Revísalos ahora!
              </p>
              <button className="mt-4 w-full py-2.5 bg-white text-indigo-600 text-xs font-bold rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                Ver Sugerencias
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
