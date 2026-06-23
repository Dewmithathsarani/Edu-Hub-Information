'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import io, { Socket } from 'socket.io-client';

export default function GroupChatPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string; timestamp: string; isMe: boolean }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io('http://localhost:5001');
    // eslint-disable-next-line
    setSocket(newSocket);

    newSocket.emit('join_group', params.id);

    newSocket.on('receive_message', (data: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: data.timestamp + Math.random(),
          text: data.message,
          sender: data.sender.name,
          timestamp: data.timestamp,
          isMe: data.sender.id === user?.id,
        },
      ]);
    });

    return () => {
      newSocket.emit('leave_group', params.id);
      newSocket.close();
    };
  }, [params.id, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const data = {
      groupId: params.id,
      message: newMessage,
      sender: { id: user?.id, name: user?.name || 'Unknown' },
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', data);
    setNewMessage('');
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-[var(--color-text-primary)] tracking-tight">Study Group Chat</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium flex items-center gap-2">
            <Users className="w-4 h-4" /> Room: {params.id.slice(0, 8)}...
          </p>
        </div>
        <Button className="h-10 px-5 font-bold rounded-xl shadow-glow-primary bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-[1.02] transition-transform">
          <Video className="w-4 h-4 mr-2" />
          Start Call
        </Button>
      </div>

      <Card className="flex-1 premium-card border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80 relative overflow-hidden flex flex-col min-h-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary-base)] blur-[100px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-accent-teal)] blur-[100px] opacity-10"></div>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[var(--color-text-tertiary)] font-medium">
              No messages yet. Say hello!
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">{msg.isMe ? 'You' : msg.sender}</span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)]">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.isMe ? 'bg-[var(--color-primary-base)] text-white rounded-br-sm shadow-glow-primary/20' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-bl-sm border border-[var(--color-border-subtle)]'}`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 bg-[var(--color-bg-tertiary)]/50 border-t border-[var(--color-border-subtle)] relative z-10">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 h-12 bg-[var(--color-bg-secondary)] border-[var(--color-border-medium)] focus:border-[var(--color-primary-base)] rounded-xl"
            />
            <Button type="submit" size="icon" className="h-12 w-12 rounded-xl bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-light)] text-white shadow-glow-primary flex-shrink-0">
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
