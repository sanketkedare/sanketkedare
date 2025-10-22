'use client'

import About from "../src/Components/About/About";
import Contacts from "../src/Components/Contact/Contacts";
import Footer from "../src/Components/Footer/Footer";
import Home from "../src/Components/Home/Home";
import Navbar from "../src/Components/Navbar/Navbar";
import ProjectsComponent from "../src/Components/Projects/ProjectsComponent";
import Resume from "../src/Components/Resume/Resume";
import Skills from "../src/Components/Skills/Skills";

export default function Page() {
  return (
    <div>
      <section
        id="home"
        className="bg-gradient-to-l from-[#3e3e7e] to-[#111132]"
      >
        <Navbar />
        <Home />
      </section>

      <section id="about">
        <About />
      </section>

      <section
        id="skills"
        className=" border-t-2 border-white bg-gradient-to-t from-blue-400 via-red-300 to-yellow-300"
      >
        <Skills />
      </section>

      <div id="projects">
        <ProjectsComponent />
      </div>

      <section id="resume"><Resume/></section>

      <section id="contact">
        <Contacts />
      </section>

      <Footer />
    </div>
  );
}
