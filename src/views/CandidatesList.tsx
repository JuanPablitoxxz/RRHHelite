import { motion } from 'motion/react';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Candidate, View } from '../types';

const CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Elena Rodríguez',
    email: 'elena.rod@example.com',
    position: 'Senior UX Designer',
    stage: 'Entrevista',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '2',
    name: 'Javier Torres',
    email: 'j.torres@techflow.io',
    position: 'Lead Backend Engineer',
    stage: 'Contratado',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '3',
    name: 'Marta Silva',
    email: 'marta.silva@hrpro.com',
    position: 'Data Analyst',
    stage: 'Pruebe Técnica',
    rating: 3,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '4',
    name: 'Carlos Méndez',
    email: 'carlos.m@devstudio.com',
    position: 'Product Owner',
    stage: 'Entrevista',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
  }
];

interface CandidatesListProps {
  onSelectCandidate: (view: View) => void;
}

export default function CandidatesList({ onSelectCandidate }: CandidatesListProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Candidatos</h2>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-4xl lg:ml-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar candidatos por nombre, correo..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none cursor-pointer">
              <option>Etapa</option>
              <option>Postulación</option>
              <option>Preselección</option>
              <option>Entrevista</option>
              <option>Contratado</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none cursor-pointer">
              <option>Posición</option>
              <option>UX Designer</option>
              <option>Developer</option>
              <option>Analyst</option>
            </select>
          </div>
        </div>

        <button className="primary-btn shrink-0">
          <UserPlus size={20} />
          Añadir Candidato
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    Candidato <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Etapa</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posición</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Calificación</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {CANDIDATES.map((candidate) => (
                <tr 
                  key={candidate.id} 
                  onClick={() => onSelectCandidate('detail')}
                  className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={candidate.avatar} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-105" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{candidate.name}</p>
                        <p className="text-xs font-medium text-slate-400">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-flex items-center gap-2 ${
                      candidate.stage === 'Contratado' ? 'bg-emerald-50 text-emerald-600' :
                      candidate.stage === 'Entrevista' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        candidate.stage === 'Contratado' ? 'bg-emerald-500' :
                        candidate.stage === 'Entrevista' ? 'bg-indigo-500' : 'bg-slate-400'
                      }`} />
                      {candidate.stage}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700">{candidate.position}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < candidate.rating ? 'fill-primary text-primary' : 'text-slate-200'} 
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Mostrando 1 a 4 de 128 candidatos</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:text-slate-900 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">1</button>
            <button className="w-10 h-10 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-white transition-all">2</button>
            <button className="w-10 h-10 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-white transition-all">3</button>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:text-slate-900 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
