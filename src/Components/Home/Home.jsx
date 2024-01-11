import React from "react";
import "./Home.scss";
import scroll from "../../images/scroll.png";
import { motion } from "framer-motion";

const textVarients = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
  scrollButton: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

const sliderVarients = {
  initial: {
    x: 5,
  },
  animate: {
    x: "-200%",
    transition: {
      repeat: Infinity,
      repeateType: "mirror",
      duration: 10,
    },
  },
};

const Home = () => {
  return (
    <div className="home">
      <div className="wrapper lg:w-[1366px] w-[90vw] h-[100%] lg:m-auto absolute top-0 right-0">
        <motion.div
          className="textcontainer h-[100%] flex flex-col justify-center gap-[30px] absolute lg:w-[50%] w-[100%]"
          variants={textVarients}
          initial="initial"
          animate="animate"
          
        >
          <motion.h2 variants={textVarients}
                     className="lg:text-[60px] text-[30px] text-[rgb(102,51,153)] overflow-hidden"
                     >Sanket Kedare</motion.h2>
          <motion.h1 variants={textVarients} className="lg:text-[88px] text-[40px] lg:w-[100%] w-[80vw]">
            Full Stack Web Developer
          </motion.h1>
          <motion.div variants={textVarients} className="buttons">
            <motion.button variants={textVarients} className="p-[20px] lg:my-2 my-4">
              See the Letest Works
            </motion.button>
            <motion.button variants={textVarients}>Contact Me</motion.button>
          </motion.div>
          <motion.img
            animate="scrollButton"
            variants={textVarients}
            src={scroll}
            alt="scroll"
          />
        </motion.div>
      </div>

      {/* <div className="imageContainer">
        <img src="" alt="hero" />
      </div> */}

      <motion.div
        variants={sliderVarients}
        className="slidingTextContainer text-[50vh] bottom-[-140px]"
        initial="initial"
        animate="animate"
      >
        MERN Full Stack Web Devloper
      </motion.div>
    </div>
  );
};

export default Home;
