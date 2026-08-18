import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Map, Building2, Warehouse, Home, Wrench, Zap, Layers, Palette } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Plans = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const spotlightRef = useRef(null);
  const methodologyRef = useRef(null);

  const filters = [
    { id: 'all', label: t('plans.filters.all') },
    { id: 'residential', label: t('plans.filters.residential') },
    { id: 'commercial', label: t('plans.filters.commercial') },
    { id: 'industrial', label: t('plans.filters.industrial') }
  ];

  const plans = [
    {
      id: 1,
      image: '/project2.png',
      category: 'residential',
      title: t('plans.items.eco_villa.title'),
      subtitle: t('plans.items.eco_villa.subtitle')
    },
    {
      id: 2,
      image: '/project6.png',
      category: 'commercial',
      title: t('plans.items.trade_hub.title'),
      subtitle: t('plans.items.trade_hub.subtitle')
    },
    {
      id: 3,
      image: '/project5.png',
      category: 'industrial',
      title: t('plans.items.warehouse.title'),
      subtitle: t('plans.items.warehouse.subtitle')
    },
    {
      id: 4,
      image: '/interior.png',
      category: 'residential',
      title: t('plans.items.skyline_loft.title'),
      subtitle: t('plans.items.skyline_loft.subtitle')
    }
  ];

  const filteredPlans = activeFilter === 'all' 
    ? plans 
    : plans.filter(p => p.category === activeFilter);

  const documentSets = [
    { icon: Layers, title: t('plans.documents.architectural'), desc: t('plans.documents.architectural_desc') },
    { icon: Building2, title: t('plans.documents.structural'), desc: t('plans.documents.structural_desc') },
    { icon: Wrench, title: t('plans.documents.mep'), desc: t('plans.documents.mep_desc') },
    { icon: Palette, title: t('plans.documents.interior'), desc: t('plans.documents.interior_desc') }
  ];

  const methodology = [
    { icon: Map, title: t('plans.methodology.site.title'), desc: t('plans.methodology.site.desc') },
    { icon: Building2, title: t('plans.methodology.design.title'), desc: t('plans.methodology.design.desc') },
    { icon: Layers, title: t('plans.methodology.specs.title'), desc: t('plans.methodology.specs.desc') }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 }
      );

      gsap.fromTo(descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: 'power2.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
      );
    }
  }, [filteredPlans]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(spotlightRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: spotlightRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo(methodologyRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: methodologyRef.current, start: 'top 70%' }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('plans.page_title')} | R.I.E.C</title>
        <meta name="description" content={t('plans.page_description')} />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-br from-riec-dark via-gray-900 to-riec-dark">
        <div className="max-w-screen-2xl mx-auto text-center">
          <p className="text-riec-orange font-bold text-sm uppercase tracking-wider mb-4">
            {t('plans.hero.tag')}
          </p>
          <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('plans.hero.title1')} <span className="text-riec-orange">{t('plans.hero.title2')}</span>
          </h1>
          <p ref={descRef} className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
            {t('plans.hero.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-riec-orange text-white font-bold px-8 py-4 rounded-full hover:bg-riec-orange-light transition-all duration-300 hover:scale-105">
              {t('plans.hero.button1')}
            </button>
            {/* <button className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300">
              {t('plans.hero.button2')}
            </button> */}
          </div>
        </div>
      </section>

      {/* Technical Blueprints Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('plans.blueprints.title')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('plans.blueprints.description')}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-12">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-riec-orange text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlans.map((plan, index) => (
              <div
                key={plan.id}
                ref={el => cardsRef.current[index] = el}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-riec-orange font-bold text-xs uppercase tracking-wider mb-2">
                    {plan.category}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {plan.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {plan.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Section */}
      <section ref={spotlightRef} className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <p className="text-riec-orange font-bold text-sm uppercase tracking-wider mb-4">
            {t('plans.spotlight.tag')}
          </p>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('plans.spotlight.title')}
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                {t('plans.spotlight.description')}
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t('plans.spotlight.documents_title')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {documentSets.map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="bg-riec-orange/10 p-2 rounded-lg">
                        <Icon className="w-5 h-5 text-riec-orange" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{doc.title}</h4>
                        <p className="text-gray-600 text-xs">{doc.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 relative overflow-hidden min-h-[400px]">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
              </div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <img 
                  src="/project1.png" 
                  alt="Technical Blueprint Preview" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <a 
                href="/projects" 
                className="absolute bottom-6 right-6 z-20 bg-riec-orange text-white p-4 rounded-full hover:scale-110 hover:shadow-2xl transition-all cursor-pointer shadow-lg"
                aria-label="View all projects"
              >
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How We Plan Section */}
      <section ref={methodologyRef} className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('plans.how_we_plan.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12">
            {t('plans.how_we_plan.description')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {methodology.map((method, idx) => {
              const Icon = method.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-riec-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-riec-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {String(idx + 1).padStart(2, '0')}. {method.title}
                  </h3>
                  <p className="text-gray-600">
                    {method.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-gradient-to-r from-riec-orange to-riec-red rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t('plans.cta.title')}
                </h2>
                <p className="text-white/90 text-lg">
                  {t('plans.cta.description')}
                </p>
              </div>
              <button className="bg-white text-riec-orange font-bold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 whitespace-nowrap">
                {t('plans.cta.button')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Plans;