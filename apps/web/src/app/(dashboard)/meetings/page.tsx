'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, ExternalLink, Clock, Users, Video, BrainCircuit, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpcomingMeetings, usePastMeetings, useCreateMeeting } from '@/hooks/queries/useMeetings';
import toast from 'react-hot-toast';

export default function MeetingsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const { data: upcomingMeetings, isLoading: isLoadingUpcoming } = useUpcomingMeetings();
  const { data: pastMeetings, isLoading: isLoadingPast } = usePastMeetings();
  const { mutateAsync: createMeeting } = useCreateMeeting();

  // eslint-disable-next-line
  const now = Date.now();

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const groupId = formData.get('groupId') as string;

    if (title) {
      await createMeeting({ 
        title, 
        scheduledFor: new Date(Date.now() + 86400000).toISOString(), 
        duration: 60, 
        ...(groupId && { groupId }) 
      });
      setIsCreating(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display text-[var(--color-text-primary)] tracking-tight">Live Meetings</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Join Zoom study sessions and view AI transcriptions.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="h-12 px-6 font-bold rounded-xl shadow-glow-primary bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] hover:scale-[1.02] transition-transform text-lg">
          <Plus className="w-5 h-5 mr-2" />
          Schedule Session
        </Button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4">
          <Card className="w-full max-w-lg premium-card border border-[var(--color-border-subtle)] shadow-2xl shadow-black/50 relative animate-scale-up overflow-hidden">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-[var(--color-primary-base)] blur-[100px] opacity-30 rounded-full"></div>
            
            <button 
              onClick={() => setIsCreating(false)}
              className="absolute top-6 right-6 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors z-20"
            >
              ✕
            </button>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[var(--color-primary-base)]/20 text-[var(--color-primary-base)] rounded-xl mr-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black font-display text-[var(--color-text-primary)]">Schedule Session</h2>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">Set up a video call for your study group.</p>
                </div>
              </div>
              <form onSubmit={handleCreateMeeting} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-text-secondary)]">Meeting Title</label>
                  <Input name="title" required placeholder="e.g. Physics Q&A Session" className="h-12 bg-[var(--color-bg-tertiary)]/50 border-transparent focus:border-[var(--color-primary-base)] transition-colors rounded-xl font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-text-secondary)]">Group ID (Optional)</label>
                  <Input name="groupId" placeholder="e.g. 64b8f..." className="h-12 bg-[var(--color-bg-tertiary)]/50 border-transparent focus:border-[var(--color-primary-base)] transition-colors rounded-xl font-medium" />
                </div>
                <div className="pt-6 flex justify-end gap-3 border-t border-[var(--color-border-subtle)]">
                  <Button type="button" variant="ghost" className="font-bold h-12 px-6 rounded-xl" onClick={() => setIsCreating(false)}>Cancel</Button>
                  <Button type="submit" className="font-bold h-12 px-8 rounded-xl shadow-glow-primary bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)]">Schedule</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="premium-card border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold font-display flex items-center">
                <div className="w-2 h-6 bg-[var(--color-primary-base)] rounded-full mr-3"></div>
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingUpcoming ? <p className="text-[var(--color-text-tertiary)] font-bold animate-pulse text-center py-8">Loading upcoming sessions...</p> : 
               upcomingMeetings?.length > 0 ? upcomingMeetings.map((m: any) => (
                <MeetingCard 
                  key={m._id}
                  title={m.title}
                  time={new Date(m.scheduledFor).toLocaleString()}
                  group={m.groupId?.name || 'General'}
                  host={m.hostId?.name || 'Instructor'}
                  isNow={new Date(m.scheduledFor).getTime() < now + 3600000 && new Date(m.scheduledFor).getTime() > now - 3600000}
                />
               )) : (
                 <div className="text-center py-12 border-2 border-dashed border-[var(--color-border-medium)] rounded-2xl bg-[var(--color-bg-tertiary)]/30">
                   <p className="text-[var(--color-text-tertiary)] font-bold">No upcoming sessions scheduled.</p>
                 </div>
               )
              }
            </CardContent>
          </Card>

          <Card className="premium-card border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold font-display flex items-center">
                <div className="w-2 h-6 bg-[var(--color-accent-teal)] rounded-full mr-3"></div>
                Past Recordings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingPast ? <p className="text-[var(--color-text-tertiary)] font-bold animate-pulse text-center py-8">Loading past recordings...</p> : 
               pastMeetings?.length > 0 ? pastMeetings.map((m: any) => (
                <RecordingCard 
                  key={m._id}
                  title={m.title}
                  date={new Date(m.scheduledFor).toLocaleDateString()}
                  duration="1h 30m"
                />
               )) : (
                 <div className="text-center py-12 border-2 border-dashed border-[var(--color-border-medium)] rounded-2xl bg-[var(--color-bg-tertiary)]/30">
                   <p className="text-[var(--color-text-tertiary)] font-bold">No past recordings found.</p>
                 </div>
               )
              }
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="premium-card border-orange-500/30 bg-[var(--color-bg-secondary)]/80 shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            
            <CardContent className="p-8 text-center space-y-6 pt-10 relative z-10">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                {/* Pulsing rings */}
                <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 bg-orange-500/30 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                
                <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                  <Video className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-black font-display text-[var(--color-text-primary)] flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                  Live Now
                </h3>
                <p className="text-base font-bold text-[var(--color-text-secondary)] mt-2 bg-[var(--color-bg-tertiary)]/50 px-4 py-2 rounded-lg inline-block border border-[var(--color-border-subtle)]">Combined Maths Elite Squad</p>
              </div>
              
              <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-glow-primary hover:scale-[1.02] transition-transform rounded-xl" onClick={() => toast.success('Joining Zoom Meeting...')}>
                Join Zoom Meeting
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="premium-card border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary-base)] blur-[60px] opacity-10"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold font-display flex items-center text-[var(--color-text-primary)]">
                <BrainCircuit className="w-5 h-5 mr-2 text-[var(--color-primary-base)]" />
                AI Auto-Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LiveTranscriptionBox meetingId="demo-meeting-123" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Subcomponent to handle SSE for Live Transcription
function LiveTranscriptionBox({ meetingId }: { meetingId: string }) {
  const [transcripts, setTranscripts] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let eventSource: EventSource;

    const startStream = () => {
      setIsActive(true);
      const token = localStorage.getItem('eduHub_token'); // Get auth token for SSE if needed, but EventSource doesn't support headers easily. We'll assume the API handles it or allows demo for now.
      
      // In a real app we'd pass token via query param or use fetch-event-source
      eventSource = new EventSource(`http://localhost:5001/api/v1/meetings/${meetingId}/transcription/stream`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setTranscripts(prev => [...prev, data]);
        } catch (e) {
          console.error("Failed to parse SSE data", e);
        }
      };

      eventSource.onerror = () => {
        setIsActive(false);
        eventSource.close();
      };
    };

    // To simulate joining the meeting, we start the stream after 2 seconds
    const timer = setTimeout(startStream, 2000);

    return () => {
      clearTimeout(timer);
      if (eventSource) eventSource.close();
    };
  }, [meetingId]);

  return (
    <div className="bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border-subtle)] rounded-xl p-4 text-sm text-[var(--color-text-secondary)] leading-relaxed h-48 overflow-y-auto font-medium flex flex-col gap-2">
      {transcripts.length === 0 ? (
        <div className="animate-pulse space-y-3">
          <div className="h-2 bg-[var(--color-border-medium)] rounded w-3/4"></div>
          <div className="h-2 bg-[var(--color-border-medium)] rounded w-full"></div>
          <div className="h-2 bg-[var(--color-border-medium)] rounded w-5/6"></div>
          <div className="flex gap-2 items-center text-xs mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
            <Sparkles className="w-3 h-3 text-[var(--color-primary-base)]" />
            Waiting for active meeting to generate live transcript...
          </div>
        </div>
      ) : (
        <>
          {transcripts.map((t) => (
            <div key={t.id} className="animate-fade-in border-l-2 border-[var(--color-primary-base)] pl-3">
              <span className="text-xs text-[var(--color-text-tertiary)] block mb-1">
                {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className={t.text.startsWith('[System]') || t.text.startsWith('[Action Item]') ? 'text-[var(--color-primary-light)] font-bold' : ''}>
                {t.text}
              </span>
            </div>
          ))}
          {isActive && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] mt-2 italic animate-pulse">
              <div className="w-1.5 h-1.5 bg-[var(--color-primary-base)] rounded-full"></div>
              Listening...
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MeetingCard({ title, time, group, host, isNow }: any) {
  return (
    <div className={`group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-300 ${isNow ? 'border-[var(--color-primary-base)]/50 bg-gradient-to-r from-[var(--color-primary-base)]/10 to-[var(--color-accent-teal)]/10 shadow-glow-primary' : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/50 hover:border-[var(--color-primary-base)]/30 hover:bg-[var(--color-bg-tertiary)]'}`}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {isNow && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-light)] transition-colors">{title}</h4>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[var(--color-text-secondary)]">
          <div className="flex items-center text-[var(--color-primary-base)] bg-[var(--color-primary-base)]/10 px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {time}
          </div>
          <div className="flex items-center bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] px-2 py-1 rounded-md">
            <Users className="w-3.5 h-3.5 mr-1.5 text-[var(--color-accent-purple)]" />
            {group}
          </div>
          <div className="flex items-center px-2 py-1">
            <span className="text-[var(--color-text-tertiary)] mr-1">Host:</span> {host}
          </div>
        </div>
      </div>
      <Button 
        variant={isNow ? 'primary' : 'outline'} 
        className={`md:w-auto w-full flex-shrink-0 h-12 px-6 font-bold rounded-xl transition-all ${isNow ? 'bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] text-white shadow-glow-primary' : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-base)]/50 hover:text-[var(--color-primary-light)]'}`} 
        onClick={() => toast.success(isNow ? 'Joining meeting...' : 'Link copied to clipboard!')}
      >
        {isNow ? 'Join Now' : 'Copy Link'}
      </Button>
    </div>
  );
}

function RecordingCard({ title, date, duration }: any) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/30 hover:bg-[var(--color-bg-tertiary)]/80 hover:border-[var(--color-primary-base)]/30 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center gap-5">
        <div className="p-3.5 bg-red-500/10 text-red-500 rounded-xl group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-orange-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-light)] transition-colors">{title}</h4>
          <p className="text-xs font-bold text-[var(--color-text-tertiary)] mt-1">{date} • {duration}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary-base)] group-hover:bg-[var(--color-primary-base)]/10 transition-colors" onClick={(e) => { e.stopPropagation(); toast.success('Opening recording...'); }}>
        <ExternalLink className="w-5 h-5" />
      </Button>
    </div>
  );
}
