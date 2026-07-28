import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const bgRef = useRef(null);
  const slidesRef = useRef([]);
  const carouselInterval = useRef(null);

  const { t } = useTranslation();

  const images = ['/hero_img.png', '/hero_img2.png', '/hero_img3.png'];
  const [current, setCurrent] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    carouselInterval.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(carouselInterval.current);
  }, []);

  // Cross-fade between slides
  useEffect(() => {
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      gsap.to(slide, {
        opacity: i === current ? 1 : 0,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    });
  }, [current]);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(bgRef.current,
      { scale: 1.2 },
      { scale: 1.0, duration: 2, ease: 'power2.out' }
    )
    .fromTo(titleRef.current, 
      { y: 80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      '-=1.5'
    )
    .fromTo(subtitleRef.current, 
      { y: 60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, 
      '-=0.5'
    )
    .fromTo(descRef.current.children, 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, 
      '-=0.3'
    )
    .fromTo(buttonsRef.current.children, 
      { y: 30, opacity: 0, scale: 0.9 }, 
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.5)' }, 
      '-=0.2'
    );
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-start overflow-hidden pt-40 pb-24 px-6 md:px-12"
    >
      {/* Background Carousel */}
      <div ref={bgRef} className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={src}
            ref={(el) => (slidesRef.current[i] = el)}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${src})`, opacity: i === 0 ? 1 : 0 }}
          />
        ))}

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white scale-125' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Overlay with Better Opacity */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 max-w-screen-2xl mx-auto w-full">
        <div className="max-w-4xl">
          <h1 className="text-white text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-poppins font-bold leading-tight mb-8">
            <span ref={titleRef} className="block mb-2">{t('common.hero.title1')} <span ref={subtitleRef} className="text-riec-orange">{t('common.hero.title2')}</span></span>
          </h1>
          
          <div ref={descRef} className="text-white text-lg md:text-xl lg:text-2xl space-y-5 mb-12 font-poppins font-light">
            <p>{t('common.hero.description')}</p>
          </div>
          
          <div ref={buttonsRef} className="flex flex-wrap gap-6">
            <Link
              to="/about"
              className="bg-riec-orange text-white font-poppins font-bold text-lg px-10 py-4 rounded-full hover:bg-riec-orange-light transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('common.hero.button1')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/projects"
              className="bg-white text-riec-orange font-poppins font-bold text-lg px-10 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('common.hero.button2')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero