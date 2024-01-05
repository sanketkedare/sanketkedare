// App.js

import "./App.scss";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Parallax from "./Components/Parallax/Parallax";

function App() {
  return (
    <div>

      <section id="home">
        <Navbar />
        <Home/>
      </section>

      <section id="projects" ><Parallax type="projects"/></section>

      <section>Projects</section>

      <section id="about"><Parallax type="about"/></section>
    
      <section>About</section>

      <section id="resume">Navbar 6</section>

      <section id="home">Navbar 7</section>

      
    </div>
  );
}

export default App;
