// App.js

import "./App.scss";
import About from "./Components/About/About";
import Contacts from "./Components/Contact/Contacts";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Parallax from "./Components/Parallax/Parallax";
import Skills from "./Components/Skills/Skills";

function App() {
  return (
    <div>
     
      <section id="home" className="bg-gradient-to-t from-[#3e3e7e] to-[#111132]">
        <Navbar />
        <Home />
      </section>

      <section id="about"><About/></section>

      <section id="projects">
        <Parallax type="projects" />
      </section>

      <section>Projects</section>

      <section id="skills">
        <Skills />
      </section>

      <section id="resume">Resume</section>

      <section id="contact">
        <Contacts />
      </section>

    </div>
  );
}

export default App;
