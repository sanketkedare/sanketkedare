import React from "react";
import { LinkedInImage, githubImage } from "../images";
import { motion } from "framer-motion";
import { textVariants } from "./sidebarAnimations";
import Personal_Info from "../../Personal_Info";

const social = [
    {
      name: "github",
      src: githubImage,
      link: Personal_Info.github,
    },
    {
      name: "linkedIn",
      src: LinkedInImage,
      link: Personal_Info.linkedIn,
    },
  ];

const SidebarFoot = () => {
  return (
    <>
      <motion.h1
        className="bg-transparent text-gray-300 text-center my-7"
        variants={textVariants}
        initial="initial2"
        animate="animate2"
      >
        Copyrite@2024
      </motion.h1>

      <motion.div
        className="flex justify-center items-center gap-6 h-[10%] bg-transparent"
        variants={textVariants}
        initial="initial2"
        animate="animate2"
      >
        {social.map((i) => (
          <a
            href={i.link}
            className="bg-transparent w-[50px] h-[50px] overflow-hidden p-1 hover:p-0"
          >
            <img
              src={i.src}
              alt={i.name}
              className="border-2 border-white rounded-full"
            />
          </a>
        ))}
      </motion.div>
    </>
  );
};

export default SidebarFoot;
