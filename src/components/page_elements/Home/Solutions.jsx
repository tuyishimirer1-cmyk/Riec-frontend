import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Solutions = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);

  const solutions = [
    {
      step: '01',
      title: t('common.solutions.plan.title'),
      description: t('common.solutions.plan.description')
    },
    {
      step: '02',
      title: t('common.solutions.build.title'),
      description: t('common.solutions.build.description')
    },
    {
      step: '03',
      title: t('common.solutions.renovate.title'),
      description: t('common.solutions.renovate.description')
    },
    {
      step: '04',
      title: t('common.solutions.deliver.title'),
      description: t('common.solutions.deliver.description')
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(tagRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo(descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo(cardsRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Content */}
          <div>
            <p ref={tagRef} className="text-riec-orange font-bold text-sm uppercase tracking-wider mb-4">
              {t('common.solutions.tag')}
            </p>
            <h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('common.solutions.title')}
            </h2>
            <p ref={descRef} className="text-gray-600 text-lg leading-relaxed">
              {t('common.solutions.description')}
            </p>
          </div>

          {/* Right: Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {solutions.map((solution, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="group bg-riec-dark rounded-2xl p-8 hover:bg-riec-orange transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="text-riec-orange group-hover:text-white font-bold text-sm uppercase tracking-wider mb-4 transition-colors duration-300">
                  STEP {solution.step}
                </div>
                <h3 className="text-2xl font-bold text-riec-orange group-hover:text-white mb-4 transition-colors duration-300">
                  {solution.title}
                </h3>
                <p className="text-gray-300 group-hover:text-white text-sm leading-relaxed transition-colors duration-300">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;