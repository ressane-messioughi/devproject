export const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

export const item = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
