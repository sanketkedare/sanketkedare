import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { githubImage } from "../images";

const SingleProject = ({ item }) => {
  const ref = useRef();

  const { scrollYProgress } = useScroll({ target: ref });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section>
      <div className="container m-auto flex justify-center items-center w-[100%] h-[100%] overflow-hidden">
        <div className="wrapper w-[80%] h-[100%] m-auto lg:flex justify-center items-center gap-[50px]">
          <div className="imageContainer flex-1 lg:h-[50%]" ref={ref}>
            <img
              src={item.img}
              alt={item.title}
              className="flex-1 h-[100%] object-cover"
            />
          </div>
          <motion.div
            className="textContainer flex-1 flex flex-col lg:gap-[30px] gap-3"
            style={{ y }}
          >
            <h2 className="lg:text-[50px] text-[30px] py-2 hover:text-sky-400">{item.title}</h2>
            <p className="text-gray-500 lg:text-[20px]">{item.des}</p>
            <h1 className="grid lg:grid-cols-4 grid-cols-2">
            {item.skills.map((i)=><span className="w-[120px] my-2 text-center p-1 px-3 border-2 rounded-3xl shadow-inner bg-sky-300 text-black font-bold">{i}</span>)}</h1>
            <div className="flex items-center gap-2">
              <button className="bg-[#ffa500]  b-0 rounded-xl lg:p-3 p-2 px-3 lg:w-[200px] cursor-pointer text-black font-bold">
                Videos
              </button>
              <button className=" b-0 rounded-xl p-2 px-3 w-[200px] cursor-pointer bg-slate-300 font-bold flex justify-center items-center  text-black gap-2 hover:bg-sky-300">
                <img src={githubImage} alt="git" className="lg:w-[30px] w-[25px] bg-transparent" />
                Source Code
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SingleProject;
