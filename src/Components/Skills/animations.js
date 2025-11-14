const commonTransition = {
    duration: 1,
    staggerChildren: 0.5,
  };
  
  export const textVarients = {
    initial: {
      x: -150,
      opacity: 0,
    },
    initial1: {
      x: -100,
      opacity: 1,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        ...commonTransition,
        duration: 1,
      },
    },
    animate1: {
      x: 1,
      opacity: 1,
      transition: {
        ...commonTransition,
        duration: 1.5,
      },
    },
    animate2: {
      x: 0,
      opacity: 1,
      transition: {
        ...commonTransition,
        duration: 1.5,
      },
    },
  };
  
  export const textVarients1 = {
    initial1: {
      x: 100,
      opacity: 0,
    },
    animate1: {
      x: 10,
      opacity: 1,
      transition: commonTransition,
    },
  };
  
  