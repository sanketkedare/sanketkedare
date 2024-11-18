import React, { useEffect, useRef, useState } from "react";
import "./Contacts.scss";
import { motion, useInView } from "framer-motion";
import { mySvg } from "../images";
import { variants, sendEmail } from "./utils";
import Personal_Info from "../../Personal_Info";

const Contacts = () => {
  const ref = useRef();
  const formRef = useRef();
  const isInView = useInView(ref, { margin: "-100px" });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("Submit");

  // Timeout for resetting the message
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setMessage("Send one more message");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <motion.div
      ref={ref}
      className="contact lg:w-[80%] w-[100%] h-[100%] m-auto lg:flex lg:items-center lg:gap-[50px]"
      variants={variants}
      initial="initial"
      whileInView="animate"
    >
      <motion.div
        className="textContainer flex-1 flex flex-col lg:gap-[40px] gap-6 my-6"
        variants={variants}
      >
        <h1 className="lg:text-[70px] text-[30px] lg:mt-0 lg:text-start lg:ml-0 ml-7 hover:text-sky-400">
          Let's <span className="text-red-700 hover:text-white">Work </span>
          <br />
          together
        </h1>
        <hr className="border-b-4 border-spacing-2 border-yellow-400 lg:w-[50%] lg:m-0 m-auto w-[90%] hover:border-sky-400 " />

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold text-orange-600">Mail</h2>
          <span className="hover:text-sky-400">{Personal_Info.email}</span>
        </motion.div>

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold text-orange-600">Address</h2>
          <span className="hover:text-sky-400">{Personal_Info.email}</span>
        </motion.div>

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold text-orange-600">Phone</h2>
          <span className="hover:text-sky-400">{Personal_Info.mobile}</span>
        </motion.div>
      </motion.div>

      <motion.div className="formContainer flex justify-center items-center lg:w-[90%] w-[90%] m-auto flex-1 relative hover:shadow-lg hover:shadow-yellow-500 p-4 rounded-2xl">
        <motion.form
          onSubmit={(e) =>
            sendEmail(e, formRef, setSuccess, setError, setMessage)
          }
          ref={formRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="my-4 w-[80%] mx-auto"
        >
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            className="w-[90%] m-auto"
          />
          <input
            type="text"
            name="email"
            required
            placeholder="Email"
            className="w-[90%] m-auto"
          />
          <input
            type="textarea"
            name="message"
            required
            placeholder="Message"
            className="w-[90%] m-auto"
          />
          <motion.button
            type="submit"
            className="w-[90%] rounded-b-2xl p-[20px] border-0 bg-[#ffa500]"
          >
            <h1 className="bg-transparent text-black font-bold">{message}</h1>
          </motion.button>
        </motion.form>

        <motion.div
          className="phoneSvg flex justify-center items-center m-auto"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.img
            src={mySvg}
            className="lg:h-[400px] m-auto p-5 bg-transparent"
            strokeWidth={0.2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={isInView && { pathLength: 1 }}
            transition={{ duration: 2 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Contacts;
