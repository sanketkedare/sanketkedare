import emailjs from "@emailjs/browser";

// Animation variants
export const variants = {
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

// Email sending utility
export const sendEmail = (e, formRef, setSuccess, setError, setMessage) => {
  e.preventDefault();
  emailjs
    .sendForm(
      process.env.REACT_APP_SERVICE_VISA,
      process.env.REACT_APP_TEMPLATE,
      formRef.current,
      process.env.REACT_APP_PI
    )
    .then(
      () => {
        setSuccess(true);
        setMessage("Email sent successfully...");
      },
      () => {
        setError(true);
        setSuccess(false);
        setMessage("Something went wrong...");
      }
    );
};
