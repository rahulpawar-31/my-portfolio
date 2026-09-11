export const viewportOnce = { once: true };

export const fadeIn = (delay = 0, duration = 0.6) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration },
});

export const fadeInUp = (delay = 0, duration = 0.6, y = 20) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration },
});

export const fadeInUpOnScroll = (delay = 0, duration = 0.6, y = 20) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewportOnce,
  transition: { delay, duration },
});

export const fadeInX = (x, delay = 0, duration = 0.6) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration },
});

export const fadeInXOnScroll = (x, delay = 0, duration = 0.6) => ({
  initial: { opacity: 0, x },
  whileInView: { opacity: 1, x: 0 },
  viewport: viewportOnce,
  transition: { delay, duration },
});

export const fadeInScaleOnScroll = (delay = 0, duration = 0.3, scale = 0.8) => ({
  initial: { opacity: 0, scale },
  whileInView: { opacity: 1, scale: 1 },
  viewport: viewportOnce,
  transition: { delay, duration },
});

export const fadeInScale = (delay = 0, duration = 0.6, scale = 0.8) => ({
  initial: { opacity: 0, scale },
  animate: { opacity: 1, scale: 1 },
  transition: { delay, duration },
});
