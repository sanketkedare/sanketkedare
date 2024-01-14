import { useRef } from "react";
import "./Parallax.scss";
import { motion, useScroll, useTransform } from "framer-motion";
import {mountain, stars, sun} from "../images";

const Parallax = ({ type }) => {
  const ref = useRef();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "500%"]);
  const yBg = useTransform(scrollYProgress, [0, 10], ["0%", "100%"]);

  return (
    <motion.div
      className="parallax"
      ref={ref}
      style={{
        background:
          type === "projects"
            ? "linear-gradient(180deg, #111132, #0c0c1d)"
            : "linear-gradient(180deg, #111132, #505064)",
            
      }}
     
    >
      <motion.h1 style={{ y: yText }} className="lg:text-[100px] text-[40px] z-[19] bg-transparent">
        {type === "projects" ? "What I did ?" : "How am I ?"}
      </motion.h1>

      <motion.div className="flex items-end mountains absolute w-[100%] h-[100%] bg-transparent z-20 overflow-hidden">
        <img src={mountain} alt="mountain"
             className="lg:w-[100%] lg:h-[100%] h-[40%] w-[1000px]  bg-inherit"/>
      </motion.div>

      <motion.div className="flex items-start mountains absolute w-[100%] h-[100%] bg-transparent z-20 overflow-hidden">
      <img src={sun} alt="planets"
             className="lg:w-[90%] lg:h-[100%] h-[40%] w-auto bg-inherit"/>
      </motion.div>


      <motion.div style={{ x: yBg }} className="flex stars overflow-hidden absolute lg:w-[100%]  h-full bg-transparent z-15">
      <img src={stars} alt="starts"
             className="lg:w-[90%] lg:h-[100%] h-[50%] w-auto bg-inherit"/>
            
      </motion.div>
      
    </motion.div>
  );
};

export default Parallax;
