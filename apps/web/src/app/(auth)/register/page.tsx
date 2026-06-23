'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    try {
      if (!credentialResponse.credential) {
        toast.error('Google login failed: No credential received.');
        return;
      }
      const response = await apiClient.post('/auth/google', { 
        idToken: credentialResponse.credential 
      });
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        login(user, accessToken, refreshToken);
        toast.success('Login successful!');
        router.push(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google login failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        login(user, accessToken, refreshToken);
        toast.success('Account created successfully!');
        router.push(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-base)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-glow-primary">
            <span className="text-white font-bold font-display text-xl">E</span>
          </div>
          <span className="text-2xl font-bold font-display text-[var(--color-text-primary)]">Edu Hub</span>
        </Link>
      </div>

      <div className="w-full">
        <div className="space-y-0.5 text-center mb-5">
          <h1 className="text-2xl font-black font-display text-[var(--color-text-primary)]">Create an account</h1>
          <p className="text-[var(--color-text-secondary)] text-[13px] font-medium">Join the #1 study platform for A/L students</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Input 
              type="text" 
              placeholder="Full Name" 
              icon={<User className="w-4 h-4 text-[var(--color-text-tertiary)]" />} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="h-10 text-[13px] rounded-xl bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border-subtle)] focus:border-[var(--color-primary-base)] focus:ring-1 focus:ring-[var(--color-primary-base)] transition-all"
            />
          </div>
          <div className="space-y-1">
            <Input 
              type="email" 
              placeholder="name@example.com" 
              icon={<Mail className="w-4 h-4 text-[var(--color-text-tertiary)]" />} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="h-10 text-[13px] rounded-xl bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border-subtle)] focus:border-[var(--color-primary-base)] focus:ring-1 focus:ring-[var(--color-primary-base)] transition-all"
            />
          </div>
          <div className="space-y-1">
            <Input 
              type="password" 
              placeholder="Password (min. 8 characters)" 
              icon={<Lock className="w-4 h-4 text-[var(--color-text-tertiary)]" />} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="h-10 text-[13px] rounded-xl bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border-subtle)] focus:border-[var(--color-primary-base)] focus:ring-1 focus:ring-[var(--color-primary-base)] transition-all"
            />
          </div>
          
          <Button type="submit" className="w-full h-10 text-sm mt-1 font-bold rounded-xl shadow-glow-primary bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] hover:scale-[1.02] transition-transform" isLoading={isLoading}>
            <UserPlus className="w-3.5 h-3.5 mr-2" />
            Create Account
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border-medium)]"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="px-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] font-medium uppercase tracking-widest rounded-full border border-[var(--color-border-subtle)] py-0.5">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center w-full relative z-10">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed.')}
            theme="outline"
            size="large"
            width="320"
            text="continue_with"
            shape="rectangular"
          />
        </div>
        
        <div className="flex flex-col space-y-3 pt-5 text-center">
          <div className="text-[11px] text-[var(--color-text-secondary)] font-medium">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-[var(--color-text-primary)] transition-colors">Terms</Link> and{' '}
            <Link href="/privacy" className="underline hover:text-[var(--color-text-primary)] transition-colors">Privacy Policy</Link>.
          </div>
          <div className="text-[13px] text-[var(--color-text-secondary)] font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[var(--color-primary-base)] hover:text-[var(--color-primary-light)] transition-colors underline decoration-2 underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
