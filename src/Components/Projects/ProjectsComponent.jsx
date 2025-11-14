import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import SingleProject from "./SingleProject.jsx";

const ProjectList = require("./ProjectList.json");

const ProjectsComponent = () => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="projects relative">
      <div className="progress lg:pt-7 pt-4 sticky top-0 left-0 text-center text-[#ffa500] z-10 font-bold
                      lg:text-[36px] ">
        My Projects

        <motion.div
          style={{ scaleX: scaleX }}
          className="progressBar lg:h-[10px] h-[5px] my-2 bg-white">
        </motion.div>

      </div>

      {ProjectList.map((item) => (<SingleProject item={item} key={item.id} />))}

    </div>
  );
};

export default ProjectsComponent;
