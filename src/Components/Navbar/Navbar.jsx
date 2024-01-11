import React from "react";
import { motion } from "framer-motion";

import githubImage from "../../images/github.png";
import LinkedInImage from "../../images/linkedin.png";

import Sidebar from "../Sidebar/Sidebar";

const Navbar = () => {
  return (
    <div className="navbar lg:h-[100px] h-[10vh] w-[100vw]">

      {/* Sidebar */}
      <Sidebar />

      <div className="wrapper lg:w-[1366px] w-[80vw] m-auto flex items-end justify-end h-[100%]">
        {/* <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-bold text-[rgb(250,235,215)]"
        >
          <h1 className="lg:ml-20">Portfollio Created by heart</h1>
        </motion.span> */}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="social flex gap-[20px] items-center h-[100%]"
        >
          <a href="https://github.com/sanketkedare">
            <img src={githubImage} alt="git" className="w-[30px] h-[30px] border-2 border-white rounded-full"/>
          </a>
          <a href="https://www.linkedin.com/in/sanket-kedare-5820401bb/">
            <img src={LinkedInImage} alt="LinkedIn" className="w-[28px] h-[28px] border-2 border-white rounded-full"/>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;
