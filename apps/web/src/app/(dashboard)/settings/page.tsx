'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Save, Key, User as UserIcon, Edit2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name || '');
      setSubjects(user.subjects || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await apiClient.put('/users/profile', { name, subjects });
      updateUser({ name: data.data.name, subjects: data.data.subjects });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsPasswordLoading(true);
    try {
      await apiClient.put('/users/password', { currentPassword, newPassword });
      toast.success('Password updated successfully!');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsAvatarLoading(true);
    try {
      const { data } = await apiClient.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateUser({ avatar: data.data.avatar });
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile picture');
    } finally {
      setIsAvatarLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-bg-primary)] shadow-xl relative bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                {isAvatarLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-base)]" />
                ) : (
                  <img 
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                )}
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{user?.name || 'User'}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">{user?.email || ''}</p>
            <div className="w-full text-left space-y-2 pt-4 border-t border-[var(--color-border-subtle)]">
              <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider font-semibold">Stats</p>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Member since</span>
                <span className="text-[var(--color-text-primary)] font-medium">Jan 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Role</span>
                <span className="text-[var(--color-primary-light)] font-medium capitalize">{user?.role || 'Student'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[var(--color-primary-light)]" />
                  Profile Information
                </CardTitle>
                <CardDescription className="mt-1">Update your personal details here.</CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-primary)]">Full Name</label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      disabled={!isEditing} 
                      className={!isEditing ? 'bg-[var(--color-bg-tertiary)]/50' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-primary)]">Email Address</label>
                    <Input value={user?.email || ''} disabled className="bg-[var(--color-bg-tertiary)]/50" />
                    <p className="text-xs text-[var(--color-text-tertiary)]">Email cannot be changed.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Subjects of Interest</label>
                  <Input 
                    value={subjects} 
                    onChange={(e) => setSubjects(e.target.value)} 
                    placeholder="Physics, Chemistry, Combined Maths" 
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-[var(--color-bg-tertiary)]/50' : ''}
                  />
                </div>
                {isEditing && (
                  <div className="pt-4 flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name || '');
                        setSubjects(user?.subjects || '');
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading} className="shadow-glow-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[var(--color-accent-light)]" />
                Change Password
              </CardTitle>
              <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Current Password</label>
                  <Input type="password" name="currentPassword" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-primary)]">New Password</label>
                    <Input type="password" name="newPassword" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-primary)]">Confirm New Password</label>
                    <Input type="password" name="confirmPassword" required />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="secondary" isLoading={isPasswordLoading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
