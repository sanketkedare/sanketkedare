import React, { useRef } from "react";
import {sanket} from "../images"
import "./About.scss";
import { motion, useInView } from "framer-motion";
import { passage_1, passage_2, passage_3 } from "./description";
import Personal_Info from "../../Personal_Info";
import { textVarients } from "./animations";

const About = () => {

  const ref = useRef();
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <div ref={ref} className="about lg:flex grid justify-between items-center m-auto h-[100%] gap-[80px] p-4 border-y-2 bg-inherit border-y-white overflow-x-hidden">

      <motion.div className="flex items-center bg-transparent lg:my-10 lg:mt-0 mt-10  lg:w-[30vw]"
       variants={textVarients}
       initial="initial"
       whileInView="animate"
       >
        <div className="image flex items-center justify-center overflow-hidden rounded-full  p-2 border-2 border-white z-10">
          <img src={sanket} alt="sanket" className="rounded-full lg:w-52 w-36 bg-slate-800 " />
        </div>
        <motion.div className="w-[100%] bg-inherit h-[100%] flex-col"
                variants={textVarients}
                initial="initial1"
                animate={isInView && 'animate1'}
                strokeWith={0.2}
                transition={{ duration: 2 }}

                >
          <h1 className="bg-red-950 font-bold lg:text-3xl text-lg p-3 px-5 border-y-2 border-white rounded-r-full ">
            {Personal_Info.name}
          </h1>
          <span className="bg-green-950  font-light lg:text-xl text-sm p-2 px-5 border-y-2 border-white my-3 rounded-r-full ">
            {Personal_Info.role2}
          </span>
        </motion.div>
      </motion.div>

      <motion.div className="paragraph lg:w-[65vw] w-[90vw] lg:h-[90%] h-[60vh]  p-4 border-2 bg-slate-300 border-white overflow-hidden rounded-b-[50px] mx-auto shadow-red-600 shadow-inner"
      variants={textVarients}
      initial="initial2"
      whileInView="animate2"
      >
        <h1 className="font-bold lg:text-2xl lg:my-4 my-2 text-yellow-800 ml-9 bg-inherit">
          About Me
        </h1>
        <hr />
        <div className="h-[90%] overflow-y-auto p-3 py-6  w-[100%] bg-transparent text-black">
          <p className="text-justify w-[90%] mb-8  text-sm m-auto bg-slate-300 text-black p-3">
           {passage_1}
          </p>

          <p className="text-justify w-[90%] my-8 text-sm m-auto bg-slate-300 text-black p-3">
            {passage_2}
          </p>
          <p className="text-justify w-[90%] my-8 text-sm m-auto bg-slate-300 text-black p-3">
            {passage_3}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
