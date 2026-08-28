import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Search, Home, Building2, MapPin, Calendar } from 'lucide-react';
import gsap from 'gsap';

const Properties = () => {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

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

  return (
    <>
      <Helmet>
        <title>{t('properties.page_title', 'Properties')} | R.I.E.C</title>
        <meta name="description" content={t('properties.page_description', 'Browse verified properties for sale and rent in Rwanda')} />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-br from-riec-dark via-gray-900 to-riec-dark">
        <div className="max-w-screen-2xl mx-auto text-center">
          <p className="text-riec-orange font-bold text-sm uppercase tracking-wider mb-4">
            {t('properties.hero.tag', 'REAL ESTATE MARKETPLACE')}
          </p>
          <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('properties.hero.title1', 'Find Your Dream')} <span className="text-riec-orange">{t('properties.hero.title2', 'Property')}</span>
          </h1>
          <p ref={descRef} className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
            {t('properties.hero.description', 'Browse verified houses, land, and apartments for sale or rent across Rwanda')}
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('properties.search_placeholder', 'Search location or property...')}
                  className="w-full outline-none text-gray-700"
                />
              </div>
              <button className="bg-riec-orange text-white font-bold px-8 py-3 rounded-xl hover:bg-riec-orange-light transition-all duration-300 hover:scale-105">
                {t('properties.search_button', 'Search')}
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:border-riec-orange hover:text-riec-orange transition-colors">
                🏠 {t('properties.types.house', 'House')}
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:border-riec-orange hover:text-riec-orange transition-colors">
                🏢 {t('properties.types.apartment', 'Apartment')}
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:border-riec-orange hover:text-riec-orange transition-colors">
                🌳 {t('properties.types.land', 'Land')}
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:border-riec-orange hover:text-riec-orange transition-colors">
                🏭 {t('properties.types.commercial', 'Commercial')}
              </button>
              <button className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                ✓ {t('properties.verified_only', 'Verified Only')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-screen-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 md:p-16">
            <div className="w-20 h-20 bg-riec-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-riec-orange" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('properties.coming_soon.title', 'Properties Marketplace Coming Soon!')}
            </h2>
            
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              {t('properties.coming_soon.description', 'We are building a comprehensive real estate marketplace where you can find verified properties for sale and rent across Rwanda.')}
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {t('properties.coming_soon.feature1', 'Verified Properties')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('properties.coming_soon.feature1_desc', 'All properties verified by RIEC')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {t('properties.coming_soon.feature2', 'All Locations')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('properties.coming_soon.feature2_desc', 'Properties across Rwanda')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-riec-orange" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {t('properties.coming_soon.feature3', 'Easy Viewing')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('properties.coming_soon.feature3_desc', 'Schedule property viewings easily')}
                </p>
              </div>
            </div>

            <div className="bg-riec-orange/10 border border-riec-orange/20 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-riec-orange font-semibold mb-2">
                {t('properties.coming_soon.notify', '🔔 Want to be notified when we launch?')}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {t('properties.coming_soon.contact', 'Contact us at')} <a href="mailto:riec2025@gmail.com" className="text-riec-orange font-semibold hover:underline">riec2025@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-gradient-to-r from-riec-orange to-riec-red rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('properties.cta.title', 'Have a Property to List?')}
              </h2>
              <p className="text-white/90 text-lg mb-6">
                {t('properties.cta.description', 'Get in touch with us to list your property on our marketplace')}
              </p>
              <a href="/contact" className="inline-block bg-white text-riec-orange font-bold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300">
                {t('properties.cta.button', 'Contact Us')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Properties;
