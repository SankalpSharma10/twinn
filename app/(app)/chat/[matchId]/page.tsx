'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export default function ChatRoomPage({ params }: { params: { matchId: string } }) {
  const matchId = params.matchId;
  const supabase = createClient();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<{ display_name: string; photo_url: string | null } | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // 1. Fetch match details to get other user info
      const { data: matchData } = await supabase
        .from('matches')
        .select(`
          user_a, user_b,
          profile_a:profiles!matches_user_a_fkey(id, display_name, photo_url),
          profile_b:profiles!matches_user_b_fkey(id, display_name, photo_url)
        `)
        .eq('id', matchId)
        .single();
        
      if (matchData) {
        const isUserA = matchData.user_a === user.id;
        const profile = isUserA ? matchData.profile_b : matchData.profile_a;
        setOtherUser((Array.isArray(profile) ? profile[0] : profile) as any);
      }

      // 2. Fetch existing messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });
        
      if (msgs) setMessages(msgs);
    }
    
    loadData();

    // 3. Setup Realtime Subscription
    const channel = supabase
      .channel(`chat_${matchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, supabase]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;
    
    const body = newMessage.trim();
    setNewMessage(''); // optimistic clear
    
    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: currentUserId,
        body: body
      });
      
    if (error) {
      console.error('Failed to send message:', error);
    } else {
      // Update the last_message_at in matches table
      await supabase.from('matches').update({ last_message_at: new Date().toISOString() }).eq('id', matchId);
    }
  };

  return (
    <main className="flex flex-col h-[100dvh]" style={{ background: 'var(--ink-950)' }}>
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <Link href="/matches" className="p-2 -ml-2 rounded-full active:bg-ink-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-bone-100" />
        </Link>
        {otherUser && (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border-default">
              {otherUser.photo_url ? (
                 <Image src={otherUser.photo_url} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-ink-700 flex items-center justify-center">
                  <span className="text-bone-400 font-display text-lg">{otherUser.display_name[0]}</span>
                </div>
              )}
            </div>
            <h2 className="text-body font-bold text-bone-50">{otherUser.display_name}</h2>
          </div>
        )}
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] p-3 px-4 rounded-2xl text-body ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                style={{
                  background: isMe ? 'var(--ember-500)' : 'var(--ink-800)',
                  color: isMe ? '#000' : 'var(--bone-100)',
                  border: isMe ? 'none' : '1px solid var(--border-default)'
                }}
              >
                {msg.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-ink-950 border-t" style={{ borderColor: 'var(--border-default)' }}>
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-ink-900 border border-border-default rounded-full px-5 py-3 text-bone-100 placeholder:text-bone-500 focus:outline-none focus:border-ember-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-ember-500 text-black disabled:opacity-50 disabled:bg-ink-800 disabled:text-bone-500 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
