import { useRef } from "react";
import { dsa, githubImage, java, js } from "../images";
import { motion } from "framer-motion";

const textVarients = {
  initial1: {
    x: 500,
    opacity: 0,
  },
  animate1: {
    x: 10,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.5,
    },
  },
};

const ProgramingSkills = () => {
  const ref = useRef();
  return (
    <motion.div ref={ref} className="programming lg:mb-8 mb-10 m-auto p-4 py-7 rounded-3xl">
      <motion.span className=" lg:w-[80%] lg:m-auto lg:text-center border-2 border-red-200 bg-green-300 text-black px-4 p-1 font-bold lg:rounded-3xl rounded-r-3xl"
              variants={textVarients}
              initial="initial1"
              whileInView="animate1"
              >
        Programming Skills and more
      </motion.span>

      <motion.div
        className="lg:flex lg:justify-center lg:gap-6 p-2
                            grid grid-cols-4 gap-7 bg-transparent"
        variants={textVarients}
        initial="initial1"
        whileInView="animate1"
      >
        <motion.div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={js}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="js"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            JavaScript
          </h1>
        </motion.div>

        <motion.div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={java}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="java"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">Java</h1>
        </motion.div>

        <motion.div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={dsa}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="dsa"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">DSA</h1>
        </motion.div>
        <motion.div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={githubImage}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="github"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            Github
          </h1>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProgramingSkills;
