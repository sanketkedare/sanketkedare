import React from "react";
import "./Home.scss";

import { motion } from "framer-motion";
import Personal_Info from "../../Personal_Info";
import { textVarients } from "./animations";
import { scroll } from "../images";
import ImageScroll from "./ImageScroll";

const Home = () => {
  return (
    <div className="home bg-transparent">
      <div className="wrapper lg:w-[90%] w-[90vw] h-[100%] lg:m-auto absolute top-0 right-0 bg-transparent z-10">
        <motion.div
          className="textcontainer h-[100%] flex flex-col justify-center gap-[30px] absolute lg:w-[50%] w-[100%] bg-transparent"
          variants={textVarients}
          initial="initial"
          animate="animate"
        >
          <motion.h2
            variants={textVarients}
            className="lg:text-[60px] text-[30px] text-[rgb(122,75,171)]  overflow-hidden bg-transparent"
          >
            {Personal_Info.name}
          </motion.h2>
          <motion.h1
            variants={textVarients}
            className="lg:text-[88px] text-[40px] lg:w-[100%] w-[80vw] bg-transparent text-white "
          >
            {Personal_Info.role}
          </motion.h1>
          <motion.div
            variants={textVarients}
            className="buttons bg-transparent"
          >
            <a href={`#projects`} className="bg-transparent">
              <motion.button
                variants={textVarients}
                className="p-[20px] lg:my-2 my-4"
              >
                See the Letest Works
              </motion.button>
            </a>

            <a href={`#contact`} className="bg-transparent">
              <motion.button variants={textVarients}>Contact Me</motion.button>
            </a>
          </motion.div>

          <a href={`#about`} className="bg-transparent">
            <motion.img
              animate="scrollButton"
              variants={textVarients}
              src={scroll}
              alt="scroll"
              className="p-1 rounded-full"
            />
          </a>
        </motion.div>
        <ImageScroll/>
      </div>
    </div>
  );
};

export default Home;
