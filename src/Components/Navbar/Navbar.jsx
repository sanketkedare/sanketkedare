import React from "react";
import { motion } from "framer-motion";
import { githubImage, LinkedInImage, download } from "../images.js";
import Sidebar from "../Sidebar/Sidebar";
import { navbarAnimations } from "./animations";
import Personal_Info from "../../Personal_Info.js";

const Navbar = () => {
  return (
    <div className="navbar lg:h-[100px] h-[10vh] bg-transparent">
      {/* Sidebar */}
      <Sidebar />

      <div className="wrapper lg:w-[90%] w-[80vw] m-auto flex items-center justify-between h-[100%] bg-transparent">
        <motion.span
          {...navbarAnimations.span}
          className="flex text-sm font-bold text-[rgb(250,235,215)] gap-3 items-center bg-transparent"
        >
          <img src={download} alt="Almabetter" className="w-[30px] lg:ml-20" />
          <h1 className="border-b-2 border-red-600 bg-transparent text-white">
            AlmaBetter
          </h1>
        </motion.span>

        <motion.div
          {...navbarAnimations.social}
          className="social flex gap-[20px] items-center h-[100%] bg-transparent"
        >
          <a href={Personal_Info.github} className="bg-transparent">
            <img
              src={githubImage}
              alt="git"
              className="w-[30px] h-[30px] border-2 border-white rounded-full"
            />
          </a>
          <a href={Personal_Info.linkedIn} className="bg-transparent">
            <img
              src={LinkedInImage}
              alt="LinkedIn"
              className="w-[28px] h-[28px] border-2 border-white rounded-full"
            />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;
