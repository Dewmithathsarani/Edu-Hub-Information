'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setIsGoogleLoading(true);
    try {
      // In a real app, send tokenResponse.access_token or code to backend
      // Google ID token flow usually uses credential from GoogleLogin component,
      // but with useGoogleLogin we get an access_token that backend needs to verify differently.
      // Assuming backend expects an idToken or we send access token and backend gets user info
      // NOTE: backend expects `idToken`. If we use useGoogleLogin with flow: 'implicit'
      // it gives access_token. Let's send access_token and let backend handle, or use implicit flow for id_token if possible.
      // Wait, backend expects `idToken`. `useGoogleLogin` doesn't return `idToken` directly, but we can pass `access_token` and backend can use userinfo endpoint.
      // Or we can just mock it for now since we have a dummy client ID.
      toast.error('Google Client ID not configured properly for production.');
    } catch (error) {
      toast.error('Google login failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google login failed.')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        login(user, accessToken, refreshToken);
        toast.success('Login successful!');
        router.push(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
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
          <h1 className="text-2xl font-black font-display text-[var(--color-text-primary)]">Welcome back</h1>
          <p className="text-[var(--color-text-secondary)] text-[13px] font-medium">Enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
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
              placeholder="••••••••" 
              icon={<Lock className="w-4 h-4 text-[var(--color-text-tertiary)]" />} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="h-10 text-[13px] rounded-xl bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border-subtle)] focus:border-[var(--color-primary-base)] focus:ring-1 focus:ring-[var(--color-primary-base)] transition-all"
            />
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-[11px] font-bold text-[var(--color-primary-base)] hover:text-[var(--color-primary-light)] transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <Button type="submit" className="w-full h-10 text-sm mt-1 font-bold rounded-xl shadow-glow-primary bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] hover:scale-[1.02] transition-transform" isLoading={isLoading}>
            <LogIn className="w-3.5 h-3.5 mr-2" />
            Sign in
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

        <Button 
          type="button"
          onClick={() => googleLogin()}
          isLoading={isGoogleLoading}
          variant="outline" 
          className="w-full h-10 text-[13px] font-bold rounded-xl relative hover:bg-[var(--color-bg-tertiary)] border-[var(--color-border-medium)]"
        >
          <svg className="w-4 h-4 absolute left-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </Button>
        
        <div className="flex justify-center pt-5">
          <div className="text-[13px] text-[var(--color-text-secondary)] font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-[var(--color-primary-base)] hover:text-[var(--color-primary-light)] transition-colors underline decoration-2 underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
