import React, { useRef } from "react";
import { textVarients1 } from "./animations";
import { motion } from "framer-motion";

const SkillTypeComponent = ({ type, skillArr }) => {
  const ref = useRef();
  return (
    <motion.div
      ref={ref}
      className="programming lg:mb-8 mb-10 m-auto p-4 py-7 rounded-3xl"
    >
      <motion.span
        className=" lg:w-[80%] lg:m-auto lg:text-center border-2 border-red-200 bg-green-300 
                               text-black px-4 p-1 font-bold lg:rounded-3xl rounded-r-3xl"
        variants={textVarients1}
        initial="initial1"
        whileInView="animate1"
      >
        {type}
      </motion.span>

      <motion.div
        className="lg:flex lg:justify-center lg:gap-6 p-2
                              grid grid-cols-4 gap-7 bg-transparent"
        variants={textVarients1}
        initial="initial1"
        whileInView="animate1"
      >
        {skillArr.map((skill) => (
          <motion.div
            key={skill.skill}
            className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto bg-transparent"
          >
            <img
              src={skill.src}
              className="h-[100%] m-auto bg-transparent p-2"
              alt="js"
            />
            <h1 className="text-center text-sm bg-transparent font-bold">
              {skill.skill}
            </h1>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SkillTypeComponent;
