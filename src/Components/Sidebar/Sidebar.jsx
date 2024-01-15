import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { LinkedInImage, githubImage } from "../images";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const textVarients = {
    initial: {
      x: -150,
      opacity: 0,
    },

    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },

    initial1: {
      x: -10,
      opacity: 1,
    },

    animate1: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.1,
        staggerChildren: 0.1,
      },
    },

    initial2: {
      y: -100,
      opacity: 0,
    },

    animate2: {
      y: 0,
      opacity: 0.8,
      transition: {
        duration: 1,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      {!sidebarOpen && (
        <motion.button
          className="closed-sidebar fixed z-30 mt-20 mr-4 right-3 bg-white rounded-full text-black p-4 hover:bg-slate-300 "
          onClick={toggleSidebar}
          variants={textVarients}
          initial="initial"
          animate="animate"
        >
          <IoMenu />
        </motion.button>
      )}

      {sidebarOpen && (
        <motion.div
          className="z-30 relative opened-sidebar inset-0 bg-gray-800 w-auto"
          variants={textVarients}
          initial="initial1"
          animate="animate1"
        >
          <div className="  w-64 h-full fixed right-0 top-0 shadow-lg rounded-l-3xl  bg-inherit">
            <button
              className="flex justify-end items-start p-4"
              onClick={toggleSidebar}
            >
              <IoClose className="text-black w-6 h-6 rounded-full" />
            </button>

            <ul className=" py-4 px-2 bg-opacity-40 bg-inherit gap-4">
              
              <motion.li  
                         className="bg-transparent"
                         variants={textVarients}
                         initial="initial2"
                         animate="animate2">
                <a
                  href={`/`}
                  className="block text-xl border-2 my-4 text-center font-bold hover:text-black text-white py-2 hover:bg-sky-100 bg-inherit rounded-2xl"
                  onClick={toggleSidebar}
                >
                  Home
                </a>
              </motion.li>
              <motion.li  
                         className="bg-transparent"
                         variants={textVarients}
                         initial="initial2"
                         animate="animate2">
                <a
                  href={`#about`}
                  className="block text-xl border-2 my-4 text-center font-bold hover:text-black text-white py-2 hover:bg-sky-100 bg-inherit rounded-2xl"
                  onClick={toggleSidebar}
                >
                  About
                </a>
              </motion.li>

              <motion.li  
                         className="bg-transparent"
                         variants={textVarients}
                         initial="initial2"
                         animate="animate2">
                <a
                  href={`#skills`}
                  className="block text-xl border-2 my-4 text-center font-bold hover:text-black text-white py-2 hover:bg-sky-100 bg-inherit rounded-2xl"
                  onClick={toggleSidebar}
                >
                  Skills
                </a>
              </motion.li>

              <motion.li  
                         className="bg-transparent"
                         variants={textVarients}
                         initial="initial2"
                         animate="animate2">
                <a
                  href={`#projects`}
                  className="block text-xl border-2 my-4 text-center font-bold hover:text-black text-white py-2 hover:bg-sky-100 bg-inherit rounded-2xl"
                  onClick={toggleSidebar}
                >
                  Projects
                </a>
              </motion.li>

              

              <motion.li  
                         className="bg-transparent"
                         variants={textVarients}
                         initial="initial2"
                         animate="animate2">
                <a
                  href={`#resume`}
                  className="block text-xl border-2 my-4 text-center font-bold hover:text-black text-white py-2 hover:bg-sky-100 bg-inherit rounded-2xl"
                  onClick={toggleSidebar}
                >
                  Resume
                </a>
              </motion.li>

              <motion.li className="bg-transparent"
                         variants={textVarients}
                         initial="initial2"
                         animate="animate2">
                <a
                  href={`#contact`}
                  className="block text-xl border-2 my-4 text-center font-bold hover:text-black text-white py-2 hover:bg-sky-100 bg-inherit rounded-2xl"
                  onClick={toggleSidebar}
                >
                  Contact Me
                </a>
              </motion.li>
            </ul>
            <motion.h1 className="bg-transparent text-gray-300 text-center my-7 " variants={textVarients} initial="initial2" animate="animate2">
              Copyrite@2023
            </motion.h1>
            <motion.div className="flex justify-center items-center gap-6 h-[10%] bg-transparent"
                        variants={textVarients}
                        initial="initial2"
                        animate="animate2"
                        >
              <a
                href="https://github.com/sanketkedare"
                className="bg-transparent w-[50px] h-[50px] overflow-hidden p-1 hover:p-0"
              >
                <img
                  src={githubImage}
                  alt="git"
                  className="border-2 border-white rounded-full"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/sanket-kedare-5820401bb/"
                className="bg-transparent w-[50px] h-[50px] overflow-hidden p-1 hover:p-0"
              >
                <img
                  src={LinkedInImage}
                  alt="LinkedIn"
                  className="border-2 border-white rounded-full"
                />
              </a>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Sidebar;
