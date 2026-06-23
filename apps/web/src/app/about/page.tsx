import { MeshBackground } from '@/components/layout/MeshBackground';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <MeshBackground>
      <TopNav />
      <main className="pt-32 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black font-display text-[var(--color-text-primary)] mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)]">Edu Hub</span>
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
              We're on a mission to revolutionize education for Sri Lankan Advanced Level students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Our Story</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Founded with the vision to bridge the gap in digital learning for A/L students in Sri Lanka, Edu Hub started as a simple idea to make quality education accessible to everyone.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                We observed that students struggled with organizing their study materials, tracking past paper progress, and finding reliable peers for group studies. Edu Hub was born out of these exact needs.
              </p>
            </div>
            <div className="bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-subtle)] rounded-3xl p-8 backdrop-blur-sm shadow-glow-primary">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-4xl font-black text-[var(--color-primary-base)] mb-2">10k+</div>
                  <div className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Active Users</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-[var(--color-accent-teal)] mb-2">50k+</div>
                  <div className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Resources</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-[var(--color-status-success)] mb-2">95%</div>
                  <div className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Success Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-[var(--color-accent-purple)] mb-2">24/7</div>
                  <div className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Support</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-mesh-gradient rounded-3xl p-12 text-center relative overflow-hidden border border-[var(--color-border-subtle)] shadow-glow-accent">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-base)]/20 to-transparent pointer-events-none" />
            <h2 className="text-3xl font-bold font-display text-[var(--color-text-primary)] mb-6 relative z-10">Our Vision</h2>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto relative z-10 leading-relaxed">
              To empower every student in Sri Lanka to achieve their dream university admission through personalized, AI-driven, and collaborative learning.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </MeshBackground>
  );
}
