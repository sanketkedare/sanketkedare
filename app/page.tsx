import Home from '@/components/Home/Home';
import About from '@/components/About/About';
import Skills from '@/components/Skills/Skills';
import ProjectsComponent from '@/components/Projects/ProjectsComponent';
import Resume from '@/components/Resume/Resume';
import Contacts from '@/components/Contact/Contacts';

export default function Page() {
  return (
    <main className="w-full min-h-screen bg-[#050511] overflow-hidden">
      <Home />
      <About />
      <Skills />
      <ProjectsComponent />
      <Resume />
      <Contacts />
    </main>
  );
}
