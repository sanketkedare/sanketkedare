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
            className="textContainer flex-1 flex flex-col lg:gap-[30px]  gap-3"
            style={{ y }}
          >
            <a href={item.git} className="flex items-center">
              <h2 className="lg:text-[30px] text-[20px] py-2 hover:text-sky-400 flex  gap-2">
                <img
                  src={githubImage}
                  alt="gitcode"
                  className="bg-transparent mr-2 lg:w-[60px] w-[20px] h-full  my-auto"
                />
                {item.title}
              </h2>
            </a>

            <p className="text-gray-500 lg:text-[15px] text-sm">{item.des}</p>
            <div className="flex flex-wrap items-center justify-evenly">
              {item.skills.map((i) => (
                <span className="w-[120px] my-2 text-center p-1 px-3 border-2 rounded-3xl shadow-inner bg-sky-300 text-black font-bold">
                  {i}
                </span>
              ))}
            </div>
            {item.live.length > 0 && (
              <a
                href={item.live}
                className="my-2 text-center p-3 border rounded-2xl font-bold bg-gray-200 text-black hover:bg-red-600 hover:text-white"
              >
                Go Live
              </a>
            )}

            <hr />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SingleProject;
