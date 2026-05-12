import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { X, Send, Loader2 } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail: string;
  recipientEmail: string;
  recipientName: string;
}

interface Message {
  id: string;
  sender_email: string;
  receiver_email: string;
  content: string;
  created_at: string;
}

export default function ChatModal({ isOpen, onClose, currentUserEmail, recipientEmail, recipientName }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `receiver_email=eq.${currentUserEmail}` // Solo escucha si te envían a ti, igual volvemos a cargar para todo
          }, (payload) => {
            const newMsg = payload.new as Message;
            // Solo añadir si pertenece a esta conversación
            if (
              (newMsg.sender_email === currentUserEmail && newMsg.receiver_email === recipientEmail) ||
              (newMsg.sender_email === recipientEmail && newMsg.receiver_email === currentUserEmail)
            ) {
              setMessages(prev => [...prev, newMsg]);
            }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, currentUserEmail, recipientEmail]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_email.eq.${currentUserEmail},receiver_email.eq.${recipientEmail}),and(sender_email.eq.${recipientEmail},receiver_email.eq.${currentUserEmail})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      // Optimizacion optimista: agregarlo a la UI antes de la DB
      const tempMsg: Message = {
        id: Math.random().toString(),
        sender_email: currentUserEmail,
        receiver_email: recipientEmail,
        content: newMessage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      const currentContent = newMessage;
      setNewMessage('');

      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_email: currentUserEmail,
          receiver_email: recipientEmail,
          content: currentContent
        }]);

      if (error) throw error;
      
      // Recargar para tener el ID real si es necesario (el websocket puede duplicar, mejor refetch o depender solo de WS)
      fetchMessages(); 
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="dashboard-card" 
        style={{ width: '100%', maxWidth: '450px', height: '600px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', zIndex: 10 }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{recipientName}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{recipientEmail}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#F8FAFC' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>Inicia una conversación con {recipientName}</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_email === currentUserEmail;
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '80%', 
                    padding: '12px 16px', 
                    borderRadius: '16px', 
                    background: isMine ? 'var(--primary)' : 'white', 
                    color: isMine ? 'white' : 'var(--text-main)',
                    border: isMine ? 'none' : '1px solid var(--border)',
                    borderBottomRightRadius: isMine ? '4px' : '16px',
                    borderBottomLeftRadius: isMine ? '16px' : '4px',
                  }}>
                    <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{msg.content}</p>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', marginHorizontal: '4px' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'white' }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="auth-input"
              style={{ flex: 1, padding: '14px 20px', borderRadius: '24px' }}
              disabled={sending}
            />
            <button 
              type="submit" 
              className="primary-btn" 
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={!newMessage.trim() || sending}
            >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
