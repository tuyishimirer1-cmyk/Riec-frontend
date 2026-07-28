import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const statsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo(badgeRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      );

      gsap.fromTo(titleRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo(descRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo(statsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, delay: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Image with Badge */}
          <div className="relative">
            <div ref={imageRef} className="bg-black overflow-hidden shadow-2xl">
              <img 
                src="/intro.png" 
                alt="Architecture Vision" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div 
              ref={badgeRef}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-1/2 bg-riec-orange text-white rounded-xl p-8 shadow-2xl text-center min-w-[200px]"
            >
              <div className="text-5xl font-bold mb-2">5+</div>
              <div className="text-sm font-semibold uppercase tracking-wider">{t('common.intro.text1')}<br/>{t('common.intro.text2')}</div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:pl-12 mt-12 lg:mt-0">
            <div ref={titleRef}>
              <p className="text-riec-orange font-bold text-sm uppercase tracking-wider mb-4">{t('common.intro.title')}</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('common.intro.text3')}
              </h2>
            </div>
            
            <p ref={descRef} className="text-gray-600 text-lg leading-relaxed mb-12">
              {t('common.intro.text4')}
            </p>
            
            <div className="flex flex-wrap gap-12">
              <div ref={el => statsRef.current[0] = el}>
                <div className="text-5xl font-bold text-riec-orange mb-2">100+</div>
                <div className="text-gray-600 font-semibold uppercase text-sm tracking-wider">{t('common.intro.stats.projects')}</div>
              </div>
              <div ref={el => statsRef.current[1] = el}>
                <div className="text-5xl font-bold text-riec-orange mb-2">4</div>
                <div className="text-gray-600 font-semibold uppercase text-sm tracking-wider">{t('common.intro.stats.awards')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;