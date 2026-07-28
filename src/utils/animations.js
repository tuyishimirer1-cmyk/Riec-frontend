import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const slideDownFromTop = (element, options = {}) => {
  const { duration = 0.8, delay = 0, ease = "power2.out" } = options;
  
  gsap.fromTo(element, 
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, ease }
  );
};

export const staggerSlideDown = (elements, options = {}) => {
  const { duration = 0.6, stagger = 0.12, delay = 0, ease = "power2.out", scrollTrigger = false } = options;

  const cfg = { y: -40, opacity: 0 };
  const target = { y: 0, opacity: 1, duration, ease, stagger, delay };

  if (scrollTrigger) {
    gsap.fromTo(elements, cfg, { ...target, scrollTrigger: { trigger: elements[0] || elements, start: 'top 90%', toggleActions: 'play none none none' } });
  } else {
    gsap.fromTo(elements, cfg, target);
  }
};

export const fadeInUp = (element, options = {}) => {
  const { duration = 0.9, delay = 0, ease = "power2.out", scrollTrigger = true } = options;

  const from = { y: 40, opacity: 0 };
  const to = { y: 0, opacity: 1, duration, delay, ease };

  if (scrollTrigger) {
    gsap.fromTo(element, from, { ...to, scrollTrigger: { trigger: element, start: 'top 92%', toggleActions: 'play none none reverse' } });
  } else {
    gsap.fromTo(element, from, to);
  }
};

export const circleGrowAnimation = (element, options = {}) => {
  const { duration = 2, ease = "power2.out" } = options;
  
  gsap.fromTo(element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration,
      ease,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    }
  );
};

export const textRevealAnimation = (elements, options = {}) => {
  const { duration = 0.85, stagger = 0.12, delay = 0.2, ease = 'power2.out', scrollTrigger = true } = options;

  const from = { y: 30, opacity: 0 };
  const to = { y: 0, opacity: 1, duration, stagger, delay, ease };

  if (scrollTrigger) {
    gsap.fromTo(elements, from, { ...to, scrollTrigger: { trigger: elements[0] || elements, start: 'top 92%', toggleActions: 'play none none reverse' } });
  } else {
    gsap.fromTo(elements, from, to);
  }
};
