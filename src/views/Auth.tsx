import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isRecovery) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' });
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registro exitoso. Revisa tu correo para confirmar tu cuenta.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Ocurrió un error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card"
        style={{ width: '100%', maxWidth: '440px', padding: '48px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '16px' }}>
            <Sparkles size={28} />
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>TalentFlow</h1>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
            {isRecovery ? 'Recuperar Contraseña' : isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {isRecovery ? 'Ingresa tu correo para recibir un enlace' : 'Gestiona tu talento con elegancia'}
          </p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              padding: '12px 16px', 
              borderRadius: '12px', 
              fontSize: '13px', 
              fontWeight: 600,
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: message.type === 'error' ? '#FEF2F2' : '#F0FDF4',
              color: message.type === 'error' ? '#991B1B' : '#166534',
              border: `1px solid ${message.type === 'error' ? '#FEE2E2' : '#DCFCE7'}`
            }}
          >
            {message.type === 'error' ? <AlertCircle size={18} /> : <Sparkles size={18} />}
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && !isRecovery && (
            <div className="auth-field">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre Completo</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px', transition: 'all 0.2s' }}
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px' }}
              />
            </div>
          </div>

          {!isRecovery && (
            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contraseña</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={() => setIsRecovery(true)}
                    style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary)', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px' }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="primary-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '10px' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                {isRecovery ? 'Enviar Enlace' : isLogin ? 'Entrar' : 'Registrarse'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {isRecovery ? (
              <button onClick={() => setIsRecovery(false)} style={{ color: 'var(--secondary)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>Volver al inicio de sesión</button>
            ) : isLogin ? (
              <>¿No tienes una cuenta? <button onClick={() => setIsLogin(false)} style={{ color: 'var(--secondary)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>Regístrate gratis</button></>
            ) : (
              <>¿Ya tienes una cuenta? <button onClick={() => setIsLogin(true)} style={{ color: 'var(--secondary)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>Inicia sesión</button></>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
