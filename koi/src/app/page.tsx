import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Statistics from '@/components/Statistics';
import SocialEngineering from '@/components/SocialEngineering';
import VulnerableGroups from '@/components/VulnerableGroups';
import Solutions from '@/components/Solutions';
import Team from '@/components/Team';
import QRSection from '@/components/QRSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Statistics />
      <SocialEngineering />
      <VulnerableGroups />
      <Solutions />
      <Team />
      <QRSection />
      <Footer />
    </main>
  );
}
