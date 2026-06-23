import { MeshBackground } from '@/components/layout/MeshBackground';
import { TopNav } from '@/components/layout/TopNav';
import { LandingPage } from '@/components/layout/LandingPage';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <MeshBackground>
      <TopNav />
      <main>
        <LandingPage />
      </main>
      <Footer />
    </MeshBackground>
  );
}
