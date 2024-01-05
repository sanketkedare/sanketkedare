import { useRef } from "react";
import "./Parallax.scss";
import { motion, useScroll, useTransform } from "framer-motion";
import sun from "../../images/sun.png";
import Mountain from "../../images/mountains.png";
import Starts from "../../images/stars.png";

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
      <motion.h1 style={{ y: yText }}>
        {type === "projects" ? "What I did ?" : "How am I ?"}
      </motion.h1>

      <motion.div className="mountains absolute w-[100%] h-[100%] bg-transparent z-20">
        <img src={Mountain} alt="mountain"
             className="w-[100%] h-[100%] bg-inherit"/>
      </motion.div>

      <motion.div  className="planets absolute w-full h-full bg-transparent z-20">
      <img src={sun} alt="planets"
             className="w-full h-full bg-cover bg-inherit"/>
      </motion.div>


      <motion.div style={{ x: yBg }} className="stars absolute w-[100%] h-full bg-transparent z-15 bg-repeat-x">
      <img src={Starts} alt="starts"
             className="w-[100%] h-[100%] bg-inherit bg-cover "/>
      </motion.div>
    </motion.div>
  );
};

export default Parallax;
