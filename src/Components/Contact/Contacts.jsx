import React, { useRef, useState } from "react";
import "./Contacts.scss";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import {mySvg} from "../images"

const variants = {
  initial: {
    y: 500,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const Contacts = () => {
  const ref = useRef();
  const formRef = useRef();
  const isInView = useInView(ref, { margin: "-100px" });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_7v9issa",
        "template_h33shkh",
        formRef.current,
        "PIa8s3CHrbdRoplwU"
      )
      .then(
        (result) => {
          setSuccess(true);
        },
        (error) => {
          setError(true);
          setSuccess(false);
        }
      );
  };

  return (
    <motion.div
      ref={ref}
      className="contact lg:w-[1366px] w-[100%] h-[100%] m-auto lg:flex lg:items-center lg:gap-[50px]"
      variants={variants}
      initial="initial"
      whileInView="animate"
    >
      <motion.div
        className="textContainer flex-1 flex flex-col lg:gap-[40px] gap-6 my-6"
        variants={variants}
      >
        <h1
          variants={variants}
          className="lg:text-[80px] text-[30px] lg:mt-0 mt-20 lg:text-start lg:ml-0 ml-7 "
        >
          Let's <span className="text-red-700">Work </span>together
        </h1>
        <hr className="border-b-4 border-spacing-2 border-yellow-400 lg:w-[50%] lg:m-0 m-auto w-[90%]" />

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold text-orange-600">Mail</h2>
          <sapn>sanketkedare200@gmail.com</sapn>
        </motion.div>

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold text-orange-600">Address</h2>
          <sapn>Hyderabad, Telangana, India</sapn>
        </motion.div>

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold text-orange-600">Phone</h2>
          <sapn>8624851910</sapn>
        </motion.div>
      </motion.div>

      <motion.div className="formContainer flex items-center lg:w-[100%] w-[90%] m-auto flex-1 relative">
        <motion.form
          action=""
          onSubmit={sendEmail}
          ref={formRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="my-4"
        >
          <input type="text" name="name" required placeholder="Name" />
          <input type="text" name="email" required placeholder="Email" />
          <input
            type="textarea"
            name="message"
            required
            placeholder="Massage"
          />
          <motion.button type="submit" className="w-[100%]">
            Submit
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
            strokewith={0.2}
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
