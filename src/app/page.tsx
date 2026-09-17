import Home from '@/components/Home/Home';
import About from '@/components/About/About';
import Experience from '@/components/Experience/Experience';
import Skills from '@/components/Skills/Skills';
import CognitiveFingerprint from '@/components/CognitiveFingerprint/CognitiveFingerprint';
import ProjectsComponent from '@/components/Projects/ProjectsComponent';
import Resume from '@/components/Resume/Resume';
import Contacts from '@/components/Contact/Contacts';

export default function Page() {
  return (
    <main className="w-full bg-transparent dark:bg-[#050511] transition-colors duration-300">
      <Home />
      <About />
      <Experience />
      <Skills />
      <CognitiveFingerprint />
      <ProjectsComponent />
      <Resume />
      <Contacts />
    </main>
  );
}
