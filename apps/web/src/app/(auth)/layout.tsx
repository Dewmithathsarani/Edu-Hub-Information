import { MeshBackground } from '@/components/layout/MeshBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MeshBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] h-auto bg-[var(--color-bg-primary)]/40 backdrop-blur-3xl rounded-[2rem] overflow-hidden flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-[var(--color-border-subtle)]/30 ring-1 ring-white/5">
          <div className="w-full h-full bg-[var(--color-bg-secondary)]/80 flex items-center justify-center p-6 relative z-10">
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </MeshBackground>
  );
}
