'use client';

import { useState } from 'react';
import { Search, Plus, Users, MessageSquare, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useGroups, useMyGroups, useCreateGroup, useJoinGroup } from '@/hooks/queries/useGroups';
import { useAuthStore } from '@/stores/auth-store';

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover'>('my-groups');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMainStream, setIsMainStream] = useState(false);
  
  const { user } = useAuthStore();
  const { data: discoverGroups, isLoading: isLoadingDiscover } = useGroups();
  const { data: myGroups, isLoading: isLoadingMy } = useMyGroups();
  const { mutateAsync: createGroup } = useCreateGroup();
  const { mutate: joinGroup } = useJoinGroup();

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;

    if (name && subject) {
      await createGroup({ name, subject, description, maxMembers: 10, isMainStream });
      setIsCreateModalOpen(false);
      setIsMainStream(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Study Groups</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Join study groups, collaborate on notes, and prepare for exams together.</p>
        </div>
        <Button 
          className="shadow-glow-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Group
        </Button>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4">
          <Card className="w-full max-w-lg premium-card border border-[var(--color-border-subtle)] shadow-2xl shadow-black/50 relative animate-scale-up overflow-hidden">
            {/* Modal decorative gradient */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-primary-base)] blur-[100px] opacity-30 rounded-full"></div>
            
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors z-20"
            >
              ✕
            </button>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-[var(--color-primary-base)]/20 text-[var(--color-primary-base)] rounded-xl mr-4">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black font-display text-[var(--color-text-primary)]">Create Study Group</h2>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">Form a squad to tackle the syllabus together.</p>
                </div>
              </div>
              <form onSubmit={handleCreateGroup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-text-secondary)]">Group Name</label>
                  <Input name="name" required placeholder="e.g. A/L Physics Masters" className="h-12 bg-[var(--color-bg-tertiary)]/50 border-transparent focus:border-[var(--color-primary-base)] transition-colors rounded-xl font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-text-secondary)]">Subject focus</label>
                  <Input name="subject" required placeholder="e.g. Physics" className="h-12 bg-[var(--color-bg-tertiary)]/50 border-transparent focus:border-[var(--color-primary-base)] transition-colors rounded-xl font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-text-secondary)]">Description (Optional)</label>
                  <Input name="description" placeholder="What is this group about?" className="h-12 bg-[var(--color-bg-tertiary)]/50 border-transparent focus:border-[var(--color-primary-base)] transition-colors rounded-xl font-medium" />
                </div>
                {user?.role === 'admin' && (
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="isMainStream" 
                      className="w-4 h-4 rounded border-[var(--color-border-medium)] bg-[var(--color-bg-tertiary)] text-[var(--color-primary-base)] focus:ring-[var(--color-primary-base)]"
                      checked={isMainStream} 
                      onChange={(e) => setIsMainStream(e.target.checked)} 
                    />
                    <label htmlFor="isMainStream" className="text-sm font-bold text-[var(--color-text-secondary)]">Is this a Main Stream Group?</label>
                  </div>
                )}
                <div className="pt-6 flex justify-end gap-3 border-t border-[var(--color-border-subtle)]">
                  <Button type="button" variant="ghost" className="font-bold h-12 px-6 rounded-xl" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="font-bold h-12 px-8 rounded-xl shadow-glow-primary bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)]">Create Group</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 p-1 bg-[var(--color-bg-secondary)] rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('my-groups')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-groups' 
                ? 'bg-[var(--color-primary-base)] text-white shadow-sm' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            My Groups
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'discover' 
                ? 'bg-[var(--color-primary-base)] text-white shadow-sm' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            Discover
          </button>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search groups..." 
            icon={<Search className="w-4 h-4" />}
            className="w-full md:w-64 h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'my-groups' ? (
          isLoadingMy ? <p>Loading your groups...</p> : 
          myGroups?.length > 0 ? myGroups.map((g: any) => (
            <GroupCard key={g._id} id={g._id} isMember={true} title={g.name} members={g.members.length} subject={g.subject} isPrivate={g.isPrivate} />
          )) : <p>You haven't joined any groups yet.</p>
        ) : (
          isLoadingDiscover ? <p>Loading groups...</p> : 
          discoverGroups?.length > 0 ? discoverGroups.map((g: any) => (
            <GroupCard key={g._id} id={g._id} isMember={false} title={g.name} members={g.members.length} subject={g.subject} isPrivate={g.isPrivate} onJoin={() => joinGroup(g._id)} />
          )) : <p>No public groups found.</p>
        )}
      </div>
    </div>
  );
}

function GroupCard({ id, isMember, title, members, subject, isPrivate, onJoin }: any) {
  return (
    <Card className="premium-card flex flex-col h-full border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80 hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
      {/* Decorative Gradient Background */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-20 transition-opacity group-hover:opacity-40 rounded-full ${isPrivate ? 'bg-[var(--color-accent-purple)]' : 'bg-[var(--color-primary-base)]'}`}></div>
      
      <CardContent className="p-6 flex flex-col flex-1 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3.5 bg-gradient-to-br from-[var(--color-primary-base)]/20 to-[var(--color-accent-teal)]/20 text-[var(--color-primary-base)] rounded-2xl shadow-sm border border-[var(--color-primary-base)]/10 group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6" />
          </div>
          {isPrivate && (
            <Badge variant="default" className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-medium)] px-3 py-1 font-bold">
              <Lock className="w-3 h-3 mr-1.5" /> Private
            </Badge>
          )}
        </div>
        
        <h3 className="text-2xl font-black font-display text-[var(--color-text-primary)] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--color-primary-light)] group-hover:to-[var(--color-accent-teal)] transition-all line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm font-bold text-[var(--color-text-secondary)] mb-6 flex-1">
          <div className="flex items-center bg-[var(--color-bg-tertiary)]/50 px-3 py-1.5 rounded-lg">
            <BookOpen className="w-4 h-4 mr-2 text-[var(--color-primary-base)]" />
            {subject}
          </div>
          <div className="flex items-center bg-[var(--color-bg-tertiary)]/50 px-3 py-1.5 rounded-lg">
            <Users className="w-4 h-4 mr-2 text-[var(--color-accent-purple)]" />
            {members} / 10
          </div>
        </div>
        
        <div className="pt-4 border-t border-[var(--color-border-subtle)]">
          {isMember ? (
            <Link href={`/groups/${id}`} className="w-full block">
              <Button className="w-full justify-between h-12 text-base font-bold bg-[var(--color-bg-tertiary)] border-[var(--color-border-medium)] hover:border-[var(--color-primary-base)]/50 transition-all hover:bg-[var(--color-bg-tertiary)]" variant="outline">
                Enter Chat Room
                <MessageSquare className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <Button className={`w-full h-12 text-base font-bold ${isPrivate ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]' : 'bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] text-white shadow-glow-primary hover:scale-[1.02]'}`} variant={isPrivate ? "outline" : "primary"} onClick={onJoin}>
              {isPrivate ? 'Request to Join' : 'Join Group'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
