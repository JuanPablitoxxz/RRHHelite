import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Send, Loader2, User, MessageSquare } from 'lucide-react';

interface ChatViewProps {
  userEmail: string;
  userRole: string;
}

interface Message {
  id: string;
  sender_email: string;
  receiver_email: string;
  content: string;
  created_at: string;
}

interface ChatContact {
  email: string;
  full_name: string;
}

export default function ChatView({ userEmail, userRole }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // El admin ve a todos los aspirantes con los que tiene mensajes o perfiles
  // El aspirante ve por defecto al reclutador (admin)
  const RECRUITER_EMAIL = 'samuel@gmail.com'; // Definimos el admin principal como contacto por defecto

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
      
      const channel = supabase
        .channel('chat-room')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages'
        }, (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_email === userEmail && newMsg.receiver_email === selectedContact.email) ||
            (newMsg.sender_email === selectedContact.email && newMsg.receiver_email === userEmail)
          ) {
            setMessages(prev => [...prev, newMsg]);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedContact, userEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      if (userRole === 'applicant') {
        // Para el aspirante, el contacto es el reclutador
        const { data: admin } = await supabase.from('profiles').select('email, full_name').eq('email', RECRUITER_EMAIL).single();
        if (admin) {
          setContacts([admin]);
          setSelectedContact(admin);
        }
      } else {
        // Para el admin, ver todos los perfiles que no sean admin
        const { data: users } = await supabase.from('profiles').select('email, full_name').neq('role', 'admin').limit(20);
        if (users) {
          setContacts(users);
          if (users.length > 0) setSelectedContact(users[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_email.eq.${userEmail},receiver_email.eq.${selectedContact?.email}),and(sender_email.eq.${selectedContact?.email},receiver_email.eq.${userEmail})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const content = newMessage;
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_email: userEmail,
          receiver_email: selectedContact.email,
          content: content
        }]);

      if (error) throw error;
      fetchMessages(); // Refetch to be sure
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading && !selectedContact) {
    return (
      <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="content-area" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="dashboard-card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '100%', overflow: 'hidden', padding: 0 }}>
        
        {/* Sidebar de Contactos */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Mensajes</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.map(contact => (
              <div 
                key={contact.email}
                onClick={() => setSelectedContact(contact)}
                style={{ 
                  padding: '16px 24px', 
                  cursor: 'pointer', 
                  background: selectedContact?.email === contact.email ? 'var(--primary-light)' : 'transparent',
                  borderLeft: selectedContact?.email === contact.email ? '4px solid var(--primary)' : '4px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', border: '1px solid var(--border)' }}>
                  {contact.full_name[0]}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700 }}>{contact.full_name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>En línea</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
          {selectedContact ? (
            <>
              {/* Header */}
              <div style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                  {selectedContact.full_name[0]}
                </div>
                <h4 style={{ fontWeight: 800 }}>{selectedContact.full_name}</h4>
              </div>

              {/* Mensajes */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((msg, i) => {
                  const isMine = msg.sender_email === userEmail;
                  return (
                    <div key={msg.id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '70%', 
                        padding: '12px 16px', 
                        borderRadius: '16px', 
                        background: isMine ? 'var(--primary)' : 'white', 
                        color: isMine ? 'white' : 'var(--text-main)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        border: isMine ? 'none' : '1px solid var(--border)'
                      }}>
                        <p style={{ fontSize: '14px' }}>{msg.content}</p>
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '24px', background: 'white', borderTop: '1px solid var(--border)' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={{ flex: 1, padding: '12px 20px', borderRadius: '24px', border: '1px solid var(--border)', outline: 'none' }}
                  />
                  <button type="submit" className="primary-btn" style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <MessageSquare size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
              <p>Selecciona un contacto para iniciar el chat</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
