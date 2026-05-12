/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './views/Dashboard';
import CandidatesList from './views/CandidatesList';
import CandidateDetail from './views/CandidateDetail';
import JobsList from './views/JobsList';
import InterviewsList from './views/InterviewsList';
import Auth from './views/Auth';
import { View } from './types';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (view: View, id?: string) => {
    setCurrentView(view);
    if (id) setSelectedCandidateId(id);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
      else setUserRole('user');
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (data) {
      setUserRole(data.role);
      // Redirect based on role if needed
      if (data.role === 'user' || data.role === 'applicant') {
        setCurrentView('jobs');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} userRole={userRole} />
      
      <div className="main-wrapper">
        <Header user={session.user} />
        
        <main>
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'candidates' && <CandidatesList onSelectCandidate={handleNavigate} />}
          {currentView === 'jobs' && <JobsList />}
          {currentView === 'interviews' && <InterviewsList />}
          {currentView === 'detail' && <CandidateDetail candidateId={selectedCandidateId} onBack={() => setCurrentView('candidates')} />}
          
          {/* Fallback for other menu items in this demo */}
          {currentView === 'evaluations' && (
            <div className="content-area">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', textAlign: 'center' }}>
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
