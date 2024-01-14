import { useRef } from "react";
import {
  expressjs,
  mariadb,
  mongoDb,
  mysql,
  nodejs,
  postman,
  springboot,
} from "../images";
import { motion } from "framer-motion";

const textVarients = {
  initial: {
    x: 100,
    opacity: 0,
  },
  animate: {
    x: 10,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.5,
    },
  },
};

const BEDB = () => {
  const ref = useRef();
  return (
    <div ref={ref} className="programming lg:mb-5 mb-10 m-auto p-4 py-7 rounded-3xl">

      <span className=" lg:w-[80%] lg:m-auto lg:text-center border-2 border-red-200 bg-green-300 text-black px-4 p-1 font-bold lg:rounded-3xl rounded-r-3xl">
        Backend & Database
      </span>

      <motion.div
        className="lg:flex lg:justify-center lg:gap-6 p-2 grid grid-cols-4 gap-7 bg-transparent"
        variants={textVarients}
        initial="initial"
        whileInView="animate"
      >
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto bg-transparent">
          <img
            src={nodejs}
            className="h-[100%] m-auto bg-transparent  rounded-xl p-2"
            alt="Node"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            NodeJS
          </h1>
        </div>
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto bg-transparent">
          <img
            src={expressjs}
            className="h-[100%] m-auto bg-transparent p-3"
            alt="Express"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            ExpressJS
          </h1>
        </div>
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto bg-transparent">
          <img
            src={postman}
            className="h-[100%] m-auto bg-transparent p-3"
            alt="Postman Tool"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            Postman
          </h1>
        </div>
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto bg-transparent">
          <img
            src={mongoDb}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="mongo db"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            MongoDB
          </h1>
        </div>
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto bg-transparent">
          <img
            src={mysql}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="mysql"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            MySQL
          </h1>
        </div>
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto bg-transparent">
          <img
            src={mariadb}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="mariadb"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            MariaDB
          </h1>
        </div>
        <div className="lg:w-[80px] w-[50px] lg:h-[80px] h-[50px] mx-2  m-auto bg-transparent">
          <img
            src={springboot}
            className="h-[100%] m-auto bg-transparent p-2"
            alt="spring boot"
          />
          <h1 className="text-center text-sm bg-transparent font-bold">
            SpringBoot
          </h1>
        </div>
      </motion.div>
    </div>
  );
};

export default BEDB;
