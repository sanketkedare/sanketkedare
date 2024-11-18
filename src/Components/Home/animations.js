export const textVarients = {
    initial: {
      x: -500,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.1,
      },
    },
    scrollButton: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

export const sliderVarients = {
    initial: {
      y: 100,
    },
    animate: {
      y: "-110%",
      transition: {
        repeat: Infinity,
        repeateType: "mirror",
        duration: 15,
      },
    },
  };