import React from "react";
import "./Home.scss";
import { bootstrap, expressjs, java, js, mariadb, mongoDb, nextjs, nodejs, reactImage, scroll, springboot, tailwind } from "../images";
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
    y: 100,
  },
  animate: {
    y: "-110%",
    transition: {
      repeat: Infinity,
      repeateType: "mirror",
      duration: 15,
    },
  },
};

const Home = () => {
  return (
    <div className="home bg-transparent">
      <div className="wrapper lg:w-[1366px] w-[90vw] h-[100%] lg:m-auto absolute top-0 right-0 bg-transparent z-10">
        <motion.div
          className="textcontainer h-[100%] flex flex-col justify-center gap-[30px] absolute lg:w-[50%] w-[100%] bg-transparent"
          variants={textVarients}
          initial="initial"
          animate="animate"
        >
          <motion.h2
            variants={textVarients}
            className="lg:text-[60px] text-[30px] text-[rgb(122,75,171)] overflow-hidden bg-transparent"
          >
            Sanket Kedare
          </motion.h2>
          <motion.h1
            variants={textVarients}
            className="lg:text-[88px] text-[40px] lg:w-[100%] w-[80vw] bg-transparent text-white"
          >
            Full Stack Web Developer
          </motion.h1>
          <motion.div
            variants={textVarients}
            className="buttons bg-transparent"
          >
            <motion.button
              variants={textVarients}
              className="p-[20px] lg:my-2 my-4"
            >
              See the Letest Works
            </motion.button>
            <motion.button variants={textVarients}>Contact Me</motion.button>
          </motion.div>
          <motion.img
            animate="scrollButton"
            variants={textVarients}
            src={scroll}
            alt="scroll"
            className="p-1 rounded-full"
          />
        </motion.div>
      </div>
      
      <motion.div
        variants={sliderVarients}
        className="slidingTextContainer text-[5vh] bottom-[-140px] w-[100%] gap-5 bg-transparent grid justify-end lg:opacity-100 opacity-15 px-6"
        initial="initial"
        animate="animate"
      >
        <img className= "bg-transparent" src={js} alt="js"/>
        <img className= "bg-transparent" src={mongoDb} alt="mongo" /> 
        <img className= "bg-transparent" src= {mariadb} alt="tailwind"/>
        <img className= "bg-transparent mx-auto" src={reactImage} alt="react" />
        <img className= "bg-transparent" src={nodejs} alt="nodejs"/>
        <img className= "bg-transparent" src= {expressjs} alt="tailwind"/>

        <img className= "bg-transparent" src={nextjs} alt="nextjs"/>
        <img className= "bg-transparent" src= {tailwind} alt="tailwind"/>
        <img className= "bg-transparent" src= {bootstrap} alt="bootstrap"/>
        


        <img className= "bg-transparent" src= {java} alt="java"/>

        <img className= "bg-transparent" src= {springboot} alt="springboot"/>

        

      </motion.div>
    </div>
  );
};

export default Home;
