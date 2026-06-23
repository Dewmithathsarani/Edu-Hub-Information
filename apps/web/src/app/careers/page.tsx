import { MeshBackground } from '@/components/layout/MeshBackground';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';

export default function CareersPage() {
  return (
    <MeshBackground>
      <TopNav />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-4xl md:text-5xl font-black font-display text-[var(--color-text-primary)] mb-8">Careers at Edu Hub</h1>
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)]">
          <p className="text-xl mb-8">Join us in our mission to revolutionize education for Sri Lankan students.</p>
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl p-8 text-center mt-12">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">No open positions right now</h3>
            <p>We are not actively hiring at the moment, but we are always looking for passionate educators and engineers. Check back later!</p>
          </div>
        </div>
      </main>
      <Footer />
    </MeshBackground>
  );
}
