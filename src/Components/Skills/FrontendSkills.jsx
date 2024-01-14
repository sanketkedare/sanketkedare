import { useRef } from "react";
import { bootstrap, css, html, nextjs, reactImage, tailwind } from "../images";

import { motion } from "framer-motion";

const textVarients = {
  initial: {
    x: 100,
    opacity: 0,
  },
  animate: {
    x: 10,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.5,
    },
  },
};

const FrontendSkills = () => {
  const ref = useRef();
  return (
    <div ref={ref} className="programming lg:mb-8 mb-10 m-auto p-4 py-7 rounded-3xl">
      <span className=" lg:w-[80%] lg:m-auto lg:text-center border-2 border-red-200 bg-green-300 text-black px-4 p-1 font-bold lg:rounded-3xl rounded-r-3xl">
        Frontend Skills
      </span>

      <motion.div
        className="lg:flex lg:justify-center lg:gap-6 p-2 bg-transparent
                          grid grid-cols-4 gap-7"
        variants={textVarients}
        initial="initial"
        whileInView="animate"
      >
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto ">
          <img
            src={html}
            className="h-[100%]m-auto bg-transparent p-2"
            alt="html"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">HTML</h1>
        </div>

        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={css}
            className="h-[100%]m-auto bg-transparent p-2"
            alt="css"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">CSS</h1>
        </div>

        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={reactImage}
            className="h-[100%]m-auto bg-transparent p-2"
            alt="reactjs"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            ReactJS
          </h1>
        </div>

        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={nextjs}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="nextjs"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            NextJS
          </h1>
        </div>

        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={tailwind}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="tailwind"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            Tailwind
          </h1>
        </div>
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto">
          <img
            src={bootstrap}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="bootstrap"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            BootStrap
          </h1>
        </div>
      </motion.div>
    </div>
  );
};

export default FrontendSkills;
