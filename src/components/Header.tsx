import { Search, Bell, HelpCircle, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar candidatos, vacantes..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hideen lg:flex items-center gap-8 mr-4">
          <button className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">Métricas</button>
          <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Informes</button>
          <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Ajustes</button>
        </nav>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full relative transition-all">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
            <HelpCircle size={20} />
          </button>
          
          <div className="flex items-center gap-3 ml-2 pl-2 cursor-pointer hover:bg-slate-50 p-1 pr-3 rounded-2xl transition-all">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
                alt="User"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">Alex Thompson</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Senior HR</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
