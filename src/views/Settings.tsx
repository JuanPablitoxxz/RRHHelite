import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Shield, Mail, Bell, Globe, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Configuración guardada exitosamente.');
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content-area"
    >
      <div className="page-title-section">
        <div>
          <h2>Ajustes del Sistema</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Configura los parámetros generales de la plataforma RRHH elite.</p>
        </div>
        <button onClick={handleSave} className="primary-btn" disabled={isSaving}>
          <Save size={20} />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        {/* Sidebar Nav para Ajustes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'general', label: 'General', icon: SettingsIcon },
            { id: 'security', label: 'Seguridad y Roles', icon: Shield },
            { id: 'notifications', label: 'Notificaciones', icon: Bell },
            { id: 'email', label: 'Plantillas de Correo', icon: Mail },
            { id: 'company', label: 'Datos de Empresa', icon: Globe },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de Ajustes */}
        <div className="dashboard-card" style={{ padding: '32px', minHeight: '500px' }}>
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                Configuración General
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Nombre de la Plataforma</label>
                  <input type="text" className="auth-input" defaultValue="RRHH elite" style={{ maxWidth: '400px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Zona Horaria Principal</label>
                  <select className="auth-input" style={{ maxWidth: '400px', background: 'white' }}>
                    <option>America/Bogota (GMT-5)</option>
                    <option>America/Mexico_City (GMT-6)</option>
                    <option>America/Argentina/Buenos_Aires (GMT-3)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Moneda Base (Salarios)</label>
                  <select className="auth-input" style={{ maxWidth: '400px', background: 'white' }}>
                    <option>USD ($)</option>
                    <option>COP ($)</option>
                    <option>MXN ($)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                Seguridad y Roles
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Administra las reglas de acceso a la plataforma.</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '14px' }}>Autenticación de Dos Pasos (2FA)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Requerir 2FA para todos los administradores.</p>
                </div>
                <div style={{ width: '44px', height: '24px', background: 'var(--border)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--primary)' }}>Registro de Aspirantes</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Permitir la creación automática de cuentas al aplicar a vacantes.</p>
                </div>
                <div style={{ width: '44px', height: '24px', background: 'var(--primary)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'general' && activeTab !== 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
              <SettingsIcon size={48} color="var(--border)" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Sección en Construcción</h4>
              <p style={{ color: 'var(--text-muted)' }}>Esta área de ajustes estará disponible en la próxima actualización.</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
