import "./App.scss";
import About from "./Components/About/About";
import Contacts from "./Components/Contact/Contacts";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Parallax from "./Components/Parallax/Parallax";
import Skills from "./Components/Skills/Skills";

function App() {
  return (
    <div >
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

      <section id="projects" >
        <Parallax type="projects" />
      </section>

      <section>Projects</section>

      <section id="skills" className="w-[100%] h-[100vh] border-t-2 border-white bg-gradient-to-t from-blue-400 via-red-300 to-yellow-300 overflow-x-hidden">
        <Skills />
      </section>

      <section id="resume">Resume</section>

      <section id="contact">
        <Contacts />
        <Footer />
      </section>
    </div>
  );
}

export default App;
