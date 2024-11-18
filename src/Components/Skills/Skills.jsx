import { useRef } from "react";
import { motion } from "framer-motion";
import { textVarients } from "./animations";
import { skills } from "./skillsArray";
import SkillTypeComponent from "./SkillTypeComponent";

const Skills = () => {
  const ref = useRef();

  const skillTypes = [
    { type: "Programming Skills and more", arr: skills.filter((skill) => skill.type === "Programming Skills") },
    { type: "Frontend Skills", arr: skills.filter((skill) => skill.type === "Frontend Skills") },
    { type: "Backend & Database", arr: skills.filter((skill) => skill.type === "Backend & Database") },
  ];

  return (
    <motion.div
      ref={ref}
      className="skills w-[100%] bg-transparent h-[100%]"
      variants={textVarients}
      initial="initial"
      whileInView="animate"
    >
      <motion.h1
        className="text-center mt-3 font-bold text-black text-2xl p-1 bg-transparent"
        variants={textVarients}
        initial="initial"
        whileInView="animate2"
      >
        Skill Set
      </motion.h1>
      <motion.hr
        className="border-b-4 rounded-b-full border-black mx-auto w-[20vw]"
        variants={textVarients}
        initial="initial"
        whileInView="animate2"
      />

      <motion.div
        className="lg:w-[80%] lg:mx-auto  lg:mt-8 mt-6 bg-transparent px-2"
        variants={textVarients}
        initial="initial1"
        whileInView="animate1"
      >
        {skillTypes.map((type) =><SkillTypeComponent key={type.type} type={type.type} skillArr={type.arr} />)}
      </motion.div>
    </motion.div>
  );
};

export default Skills;
