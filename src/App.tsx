/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './views/Dashboard';
import CandidatesList from './views/CandidatesList';
import CandidateDetail from './views/CandidateDetail';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <div className="lg:ml-64 flex flex-col min-h-screen pb-24 lg:pb-0">
        <Header />
        
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-[1600px] mx-auto">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'candidates' && <CandidatesList onSelectCandidate={setCurrentView} />}
            {currentView === 'detail' && <CandidateDetail />}
            
            {/* Fallback for other menu items in this demo */}
            {(currentView === 'jobs' || currentView === 'interviews' || currentView === 'evaluations') && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                   <span className="text-4xl font-bold">!</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Próximamente</h3>
                <p className="text-slate-500 max-w-xs">Esta sección está en desarrollo. Selecciona Dashboard o Candidatos para ver los avances actuales.</p>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="mt-8 primary-btn"
                >
                  Volver al Dashboard
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <BottomNav currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}

