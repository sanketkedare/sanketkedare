import React from "react";
import { motion } from "framer-motion";

import githubImage from "../../images/github.png"
import LinkedInImage from "../../images/linkedin.png";

import "./Navbar.scss";
import Sidebar from "../Sidebar/Sidebar";

const Navbar = () => {
  return (
    <div className="navbar">
      {/* Sidebar */}
      <Sidebar/>
      <div className="wrapper">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
         
        >
         
        </motion.span>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="social"
        >
          <a href="https://github.com/sanketkedare">
            <img src={githubImage} alt="git" />
          </a>
          <a href="https://www.linkedin.com/in/sanket-kedare-5820401bb/">
            <img src={LinkedInImage} alt="LinkedIn" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;
