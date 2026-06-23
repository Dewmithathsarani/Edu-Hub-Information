import { MeshBackground } from '@/components/layout/MeshBackground';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';

export default function TermsOfServicePage() {
  return (
    <MeshBackground>
      <TopNav />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-4xl md:text-5xl font-black font-display text-[var(--color-text-primary)] mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] space-y-6">
          <p>Last updated: June 2026</p>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8">1. Acceptance of Terms</h2>
          <p>By accessing and using Edu Hub, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Edu Hub's website for personal, non-commercial transitory viewing only.</p>
          
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8">3. Disclaimer</h2>
          <p>The materials on Edu Hub's website are provided on an 'as is' basis. Edu Hub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </div>
      </main>
      <Footer />
    </MeshBackground>
  );
}
