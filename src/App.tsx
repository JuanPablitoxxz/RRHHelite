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
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <div className="main-wrapper">
        <Header />
        
        <main>
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'candidates' && <CandidatesList onSelectCandidate={setCurrentView} />}
          {currentView === 'detail' && <CandidateDetail />}
          
          {/* Fallback for other menu items in this demo */}
          {(currentView === 'jobs' || currentView === 'interviews' || currentView === 'evaluations') && (
            <div className="content-area">
              <div style={{ display: 'flex', flexDirection: 'column', items: 'center', justifyContent: 'center', py: '100px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>Próximamente</h3>
                <p style={{ color: 'var(--text-muted)' }}>Esta sección está en desarrollo. Selecciona Dashboard o Candidatos.</p>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="new-job-btn"
                  style={{ marginTop: '24px', marginInline: 'auto' }}
                >
                  Volver al Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <BottomNav currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}
