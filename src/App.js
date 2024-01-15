import "./App.scss";
import About from "./Components/About/About";
import Contacts from "./Components/Contact/Contacts";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import ProjectsComponent from "./Components/Projects/ProjectsComponent";
import Resume from "./Components/Resume/Resume";
import Skills from "./Components/Skills/Skills";

function App() {
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

export default App;
