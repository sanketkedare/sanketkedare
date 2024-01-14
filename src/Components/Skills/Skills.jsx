import { useRef } from "react";
import BEDB from "./BEDB";
import FrontendSkills from "./FrontendSkills";
import ProgramingSkills from "./ProgramingSkills";
import { motion} from "framer-motion";

const textVarients = {
  initial: {
    x: -150,
    opacity: 0,
  },
  initial1: {
    x: -100,
    opacity: 1,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
    
  },
  animate1: {
    x: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      staggerChildren: 0.1,
    },
  },

  animate2: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1.5,
      staggerChildren: 0.1,
    },
    
  },
 
 
};

const Skills = () => {
  const ref = useRef();

  return (
    <motion.div
      ref={ref}
      className="skills w-[100%] bg-transparent h-[100%]"
      variants={textVarients}
      initial="initial"
      whileInView="animate"
    >
      <motion.h1
        className="text-center mt-3 font-bold text-black text-2xl p-1 bg-transparent"
        variants={textVarients}
        initial="initial"
        whileInView="animate2"
      >
        Skill Set
      </motion.h1>
      <motion.hr
        className="border-b-4 rounded-b-full border-black mx-auto w-[20vw]"
        variants={textVarients}
        initial="initial"
        whileInView="animate2"
      />

      <motion.div
        className="lg:w-[80%] lg:mx-auto  lg:mt-8 mt-6 bg-transparent px-2"
        variants={textVarients}
        initial="initial1"
        whileInView="animate1"
      >
        <ProgramingSkills />
        <FrontendSkills />
        <BEDB />
      </motion.div>

    </motion.div>
  );
};

export default Skills;
