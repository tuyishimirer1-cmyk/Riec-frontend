import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass, Ruler, Map, Layers, Palette, Home, HardHat, DollarSign, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  const services = [
    {
      icon: Compass,
      title: t('common.services.surveying'),
      description: t('common.services.descriptions.surveying'),
      slug: 'land-surveying'
    },
    {
      icon: Ruler,
      title: t('common.services.boundary_surveying'),
      description: t('common.services.descriptions.boundary_surveying'),
      slug: 'boundary-surveying'
    },
    {
      icon: Map,
      title: t('common.services.topographic_surveying'),
      description: t('common.services.descriptions.topographic_surveying'),
      slug: 'topographic-surveying'
    },
    {
      icon: Layers,
      title: t('common.services.construction_layout'),
      description: t('common.services.descriptions.construction_layout'),
      slug: 'construction-layout'
    },
    {
      icon: Palette,
      title: t('common.services.interior_design'),
      description: t('common.services.descriptions.interior_design'),
      slug: 'interior-design'
    },
    {
      icon: Home,
      title: t('common.services.house_design'),
      description: t('common.services.descriptions.house_design'),
      slug: 'house-design'
    },
    {
      icon: HardHat,
      title: t('common.services.construction_supervision'),
      description: t('common.services.descriptions.construction_supervision'),
      slug: 'construction-supervision'
    },
    {
      icon: DollarSign,
      title: t('common.services.property_valuation'),
      description: t('common.services.descriptions.property_valuation'),
      slug: 'property-valuation'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo(cardsRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-gradient-to-b from-riec-dark via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-screen-2xl mx-auto relative z-10">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t('common.services.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-riec-orange to-riec-red mx-auto rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={`/services/${service.slug}`}
                ref={el => cardsRef.current[index] = el}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-riec-orange/50 transition-all duration-500 hover:shadow-2xl hover:shadow-riec-orange/20 hover:-translate-y-2 cursor-pointer"
              >
                <div className="bg-gradient-to-br from-riec-orange/20 to-riec-red/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-riec-orange" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-riec-orange transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center text-riec-orange group-hover:gap-2 transition-all duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-riec-orange to-riec-red text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl hover:shadow-riec-orange/50 transition-all duration-300 hover:scale-105 group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;