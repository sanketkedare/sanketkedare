import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { githubImage } from "../images";

const SingleProject = ({ item }) => {
  const ref = useRef();

  const { scrollYProgress } = useScroll({ target: ref });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 100]);

  return (
    <section>
      <div className="container m-auto flex justify-center items-center w-[100%] h-[100%] overflow-hidden">
        <div className="wrapper w-[80%] h-[100%] m-auto lg:flex justify-center items-center gap-[50px]">
          <div className="imageContainer flex-1 lg:h-[50%]" ref={ref}>
            <img
              src={item.img}
              alt={item.title}
              className="flex-1 w-[100%] object-cover m-auto shadow-white hover:shadow-xl border border-white rounded-xl"
            />
          </div>
          <motion.div
            className="textContainer flex-1 flex flex-col lg:gap-[30px] gap-3"
            style={{ y }}
          >
            <h2 className="lg:text-[50px] text-[30px] py-2 hover:text-sky-400">
              {item.title}
            </h2>
            <p className="text-gray-500 lg:text-[20px] text-sm">{item.des}</p>
            <h1 className="grid lg:grid-cols-4 grid-cols-2">
              {item.skills.map((i) => (
                <span className="w-[120px] my-2 text-center p-1 px-3 border-2 rounded-3xl shadow-inner bg-sky-300 text-black font-bold">
                  {i}
                </span>
              ))}
            </h1>
            <div className="flex items-center justify-evenly gap-2">
              
              <a href={item.git} className="flex items-center font-bold text-lg border px-2 p-1 h-full rounded-xl hover:bg-white hover:text-black">

              <img src={githubImage} className="bg-transparent mr-2 lg:w-[40px] w-[20px]"/>
              Code
              </a>
              

              <div className="w-[200px] rounded-lg bg-yellow-500 text-black font-bold text-lg text-center p-2">
                Live
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SingleProject;
