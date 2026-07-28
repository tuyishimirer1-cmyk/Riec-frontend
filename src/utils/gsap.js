import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Register all plugins once here — never call registerPlugin elsewhere
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// Global defaults
gsap.defaults({ ease: 'power2.out', duration: 0.6 })

// ScrollTrigger defaults — normalise scroll so it doesn't fight native scroll
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
})

export { gsap, ScrollTrigger }
