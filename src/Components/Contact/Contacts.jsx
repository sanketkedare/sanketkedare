import React, { useRef, useState } from "react";
import "./Contacts.scss";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import mySvg from "../../images/contact-phone-talking-svgrepo-com.svg";

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
      className="contact lg:w-[1366px] w-[100vw] h-[100%] m-auto lg:flex lg:items-center lg:gap-[50px]"
      variants={variants}
      initial="initial"
      whileInView="animate"
    >
      <motion.div className="textContainer flex-1 flex flex-col lg:gap-[40px] gap-6 my-6" 
                  variants={variants}>
        <h1 variants={variants}
            className="lg:text-[100px] text-[30px] lg:mt-0 mt-20 lg:text-start lg:ml-0 ml-7"
            >Let's work together</h1>

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold">Mail</h2>
          <sapn>sanketkedare200@gmail.com</sapn>
        </motion.div>

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold">Address</h2>
          <sapn>Hyderabad, Telangana, India</sapn>
        </motion.div>

        <motion.div className="item lg:ml-0 ml-7">
          <h2 className="font-bold">Phone</h2>
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
          transition={{ delay: 2, duration: 0.5 }}
        >
          <input type="text" name="name" required placeholder="Name" />
          <input type="text" name="email" required placeholder="Email" />
          <input
            type="textarea"
            name="message"
            required
            placeholder="Massage"
          />
          <button type="submit" className="w-[100%] font-bold">Submit</button>
        </motion.form>
        
        <motion.div
          className="phoneSvg flex justify-center items-center m-auto"
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.img
            src={mySvg}
            className="h-[400px] m-auto "
            strokeWith={0.2}
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
