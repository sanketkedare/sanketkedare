import { useRef } from "react";
import "./Parallax.scss";
import { motion, useScroll, useTransform } from "framer-motion";
import planets from "../../images/planets.png";
import sun from "../../images/planets.png";

const Parallax = ({ type }) => {
  const ref = useRef();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "500%"]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

      <motion.div className="mountains"></motion.div>

      <motion.div
        style={{
          y: yBg,
          backgroundImage: `url(${
            type === "projects"
              ? {planets}
              : {sun}
          })`,
        }}
        className="planets"
      ></motion.div>


      <motion.div style={{ x: yBg }} className="stars"></motion.div>
    </motion.div>
  );
};

export default Parallax;
