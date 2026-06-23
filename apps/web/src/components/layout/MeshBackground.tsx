import React from 'react';

export function MeshBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[var(--color-bg-primary)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary-base)]/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent-teal)]/10 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-[var(--color-primary-light)]/15 blur-[100px] mix-blend-screen" />
        
        {/* Subtle grid overlay for texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
