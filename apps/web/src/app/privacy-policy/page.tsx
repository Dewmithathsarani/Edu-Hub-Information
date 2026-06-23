import { MeshBackground } from '@/components/layout/MeshBackground';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  return (
    <MeshBackground>
      <TopNav />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="text-4xl md:text-5xl font-black font-display text-[var(--color-text-primary)] mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] space-y-6">
          <p>Last updated: June 2026</p>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, such as when you create an account, update your profile, use the interactive features of our Services, participate in contests, promotions or surveys, request customer support or otherwise communicate with us.</p>
          
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8">2. How We Use Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Edu Hub and our users.</p>
          
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8">3. Information Sharing</h2>
          <p>We do not share your personal information with companies, organizations, or individuals outside of Edu Hub except in the following cases: with your consent, for external processing, or for legal reasons.</p>
        </div>
      </main>
      <Footer />
    </MeshBackground>
  );
}
