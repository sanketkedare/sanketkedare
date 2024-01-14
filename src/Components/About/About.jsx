import React, { useRef } from "react";
import {sanket} from "../images"
import "./About.scss";

import { motion, useInView } from "framer-motion";

const textVarients = {
  initial: {
    x: -300,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 10,
    transition: {
      duration: 1,
      staggerChildren: 0.5,
    },
  },

  initial1: {
    x: -600,
    opacity: 0,
  },
  animate1: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 2,
      staggerChildren: 0.5,
    },
  },

  initial2: {
    x: 600,
    opacity: 0,
  },
  animate2: {
    x: 0,
    opacity: 10,
    transition: {
      duration: 1,
      staggerChildren: 0.5,
    },
  },
};

const About = () => {

  const ref = useRef();
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <div ref={ref} className="about lg:flex grid justify-between items-center w-[100%] m-auto h-[100%] gap-[80px] p-4 border-y-2 bg-inherit border-y-white overflow-x-hidden">

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
            Sanket Kedare
          </h1>
          <span className="bg-green-950  font-light lg:text-xl text-sm p-2 px-5 border-y-2 border-white my-3 rounded-r-full ">
            MERN Full Stack Web Dev
          </span>
        </motion.div>
      </motion.div>

      <motion.div className="paragraph lg:w-[65vw] w-[90vw] lg:h-[90%] h-[60vh]  p-4 border-2 bg-slate-300 border-white rounded-b-[50px] mx-auto shadow-red-600 shadow-inner"
      variants={textVarients}
      initial="initial2"
      whileInView="animate2"
      >
        <h1 className="font-bold lg:text-2xl lg:my-4 my-2 text-yellow-800 ml-9 bg-inherit">
          About Me
        </h1>
        <hr />
        <div className="h-[90%] overflow-y-auto p-3 py-6  w-[100%] bg-slate-300 text-black  ">
          <p className="text-justify w-[90%] mb-8  text-sm m-auto bg-slate-300 text-black">
            With a Bachelor of Engineering as my foundational qualification, I
            honed my expertise in full-stack web development through an
            intensive program at Almabeter Institute, specializing in the MERN
            stack. My comprehensive skill set extends to encompassing Next.js
            for server and client-side rendering, leveraging this knowledge to
            optimize user experiences. Proficient in Data Structures and
            Algorithms (DSA), I bring a meticulous approach to problem-solving
            within the web development sphere. My proficiency spans a wide
            spectrum, including web hosting utilizing MongoDB and AWS, alongside
            a deep understanding of MySQL, MariaDB, and the intricacies of
            normalization and transition management. Tailwind CSS stands as a
            cornerstone in my frontend development toolkit, enabling rapid and
            efficient styling solutions while maintaining scalability and code
            maintainability.{" "}
          </p>

          <p className="text-justify w-[90%] my-8 text-sm m-auto bg-slate-300 text-black">
            Crafting robust Rest APIs with Express.js and implementing
            middleware has been a pivotal part of my project work, ensuring
            seamless functionality and heightened security measures.
            Additionally, I possess adeptness in Java and Spring Boot, enabling
            me to fortify applications through robust security protocols,
            including JWT implementation. My journey in web development has seen
            hands-on involvement in projects utilizing React.js, where I've
            cultivated a keen eye for detail and a commitment to delivering
            top-notch solutions. Well-versed in unit testing methodologies, I
            ensure the reliability and performance of my work.
          </p>
          <p className="text-justify w-[90%] my-8 text-sm m-auto bg-slate-300 text-black">
            Eager and open to new opportunities, I am seeking to channel my
            expertise and passion as a MERN full-stack web developer,
            contributing innovative solutions and driving digital experiences to
            new heights.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
