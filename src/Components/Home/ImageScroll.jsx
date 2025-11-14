import React from "react";
import { motion } from "framer-motion";
import { sliderVarients } from "./animations";
import { bootstrap, expressjs, java, js, mariadb, mongoDb, nextjs, nodejs, reactImage, springboot, tailwind } from "../images";

const ImageScroll = () => {
  const imageArray = [bootstrap, expressjs, java, js, mariadb, mongoDb, nextjs, nodejs, reactImage, springboot, tailwind ];
  return (
    <motion.div
      variants={sliderVarients}
      className="slidingTextContainer text-[5vh] bottom-[-140px] w-[100%] gap-5 bg-transparent grid justify-end lg:opacity-100 opacity-15 px-6"
      initial="initial"
      animate="animate"
    >
      {
        imageArray.map((i)=>(
            <img className="bg-transparent" src={i} alt="js" />
        ))
      }

    </motion.div>
  );
};

export default ImageScroll;
