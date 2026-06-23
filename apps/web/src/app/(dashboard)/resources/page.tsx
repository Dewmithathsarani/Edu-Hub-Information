'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Search, Filter, Download, FileText, UploadCloud, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useResources, useMyUploads, useUploadResource } from '@/hooks/queries/useResources';
import toast from 'react-hot-toast';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<'explore' | 'my-uploads'>('explore');
  const [search, setSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const { data: resources, isLoading: isLoadingExplore } = useResources({ search });
  const { data: myUploads, isLoading: isLoadingMy } = useMyUploads();
  const uploadResource = useUploadResource();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formFormData = new FormData(formElement);
    
    const file = fileInputRef.current?.files?.[0];
    const title = formFormData.get('title') as string;
    const subject = formFormData.get('subject') as string;
    const description = formFormData.get('description') as string;

    if (file && title && subject) {
      const data = new FormData();
      data.append('file', file);
      data.append('title', title);
      data.append('type', file.type.includes('pdf') ? 'pdf' : 'image');
      data.append('subject', subject);
      data.append('description', description);
      
      try {
        await uploadResource.mutateAsync(data);
        toast.success('Resource uploaded successfully!');
        setIsUploadModalOpen(false);
        setActiveTab('my-uploads');
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload resource');
      }
    } else {
      toast.error('Please select a file to upload');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Study Resources</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Access notes, past papers, and study guides shared by the community.</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="shadow-glow-primary">
          <UploadCloud className="w-5 h-5 mr-2" />
          Upload Resource
        </Button>
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <Card className="w-full max-w-md border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] shadow-xl relative animate-scale-up">
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            >
              ✕
            </button>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Upload Study Material</h2>
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Title</label>
                  <Input name="title" required placeholder="e.g. Physics 2021 Past Paper" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Subject</label>
                  <Input name="subject" required placeholder="e.g. Physics" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Description</label>
                  <Input name="description" placeholder="Briefly describe the content..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">File</label>
                  <Input type="file" ref={fileInputRef} required accept=".pdf,.doc,.docx,.jpg,.png" className="cursor-pointer" />
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="shadow-glow-primary" disabled={uploadResource.isPending}>
                    {uploadResource.isPending ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 p-1 bg-[var(--color-bg-secondary)] rounded-xl w-fit border border-[var(--color-border-subtle)] shadow-sm">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'explore' 
                ? 'bg-[var(--color-primary-base)] text-white shadow-md shadow-[var(--color-primary-light)]' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('my-uploads')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'my-uploads' 
                ? 'bg-[var(--color-primary-base)] text-white shadow-md shadow-[var(--color-primary-light)]' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            My Uploads
          </button>
        </div>

        {activeTab === 'explore' && (
          <div className="flex gap-2 w-full md:w-auto">
            <Input 
              placeholder="Search resources..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="w-full md:w-64 h-10"
            />
            <Button variant="outline" className="h-10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        )}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeTab === 'explore' ? (
          isLoadingExplore ? <div className="col-span-full text-center py-10">Loading resources...</div> : 
          resources?.length > 0 ? resources.map((r: any) => (
            <motion.div key={r._id} variants={itemVariants} className="h-full">
              <ResourceCard resource={r} isMyUpload={false} />
            </motion.div>
          )) : <div className="col-span-full text-center py-10 text-[var(--color-text-tertiary)]">No resources found.</div>
        ) : (
          isLoadingMy ? <div className="col-span-full text-center py-10">Loading your uploads...</div> : 
          myUploads?.length > 0 ? myUploads.map((r: any) => (
            <motion.div key={r._id} variants={itemVariants} className="h-full">
              <ResourceCard resource={r} isMyUpload={true} />
            </motion.div>
          )) : <div className="col-span-full text-center py-10 text-[var(--color-text-tertiary)]">You haven't uploaded any resources yet.</div>
        )}
      </motion.div>
    </div>
  );
}

function ResourceCard({ resource, isMyUpload }: { resource: any, isMyUpload: boolean }) {
  const isPdf = resource.type === 'pdf';
  
  // Assign a subtle colored top border based on subject hash
  const getSubjectColor = (subject: string) => {
    if (!subject) return 'from-slate-400 to-slate-500';
    const hash = subject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-emerald-400 to-emerald-600',
      'from-orange-400 to-orange-600'
    ];
    return colors[hash % colors.length];
  };

  const subjectGradient = getSubjectColor(resource.subject);
  
  return (
    <Card className="premium-card flex flex-col h-full border-0 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${subjectGradient}`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-secondary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
      
      {/* Decorative background pattern */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--color-primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      
      <CardContent className="p-6 flex flex-col flex-1 relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className={`p-3 rounded-2xl shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 ${isPdf ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}`}>
            {isPdf ? <FileText className="w-6 h-6 drop-shadow-sm" /> : <ImageIcon className="w-6 h-6 drop-shadow-sm" />}
          </div>
          
          {isMyUpload ? (
            <Badge variant={resource.status === 'approved' ? 'success' : 'default'} className={resource.status === 'approved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}>
              {resource.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />} {resource.status || 'Pending'}
            </Badge>
          ) : (
            <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest bg-[var(--color-bg-tertiary)] px-2 py-1 rounded-full">{resource.subject}</span>
          )}
        </div>
        
        <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary-base)] transition-colors line-clamp-2">
          {resource.title}
        </h3>
        
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3">
            {!isMyUpload && <Image width={28} height={28} src={`https://api.dicebear.com/7.x/initials/svg?seed=${resource.uploadedBy?.name || 'U'}`} className="w-7 h-7 rounded-full bg-slate-100 ring-2 ring-[var(--color-bg-primary)]" alt="Uploader" />}
            <span className="text-xs font-semibold text-[var(--color-text-tertiary)]">{resource.size ? (resource.size / 1024 / 1024).toFixed(1) + ' MB' : 'PDF'}</span>
          </div>
          
          <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 shadow-sm font-bold bg-[var(--color-primary-base)] text-white hover:bg-[var(--color-primary-hover)]" onClick={() => window.open(resource.url, '_blank')}>
            <Download className="w-4 h-4 mr-2" />
            Get
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
