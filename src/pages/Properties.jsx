import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Search, Home, Building2, MapPin, Calendar, Bed, Bath, Maximize, Phone, Mail } from 'lucide-react';
import gsap from 'gsap';
import { useGetProperties } from '../react-query/propertiesQuery';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Properties = () => {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null); // 'HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL'
  const [verifiedOnly, setVerifiedOnly] = useState(true); // Default to verified only

  // Fetch properties with filters
  const { data: propertiesData, isLoading } = useGetProperties({
    search: searchQuery,
    propertyType: selectedType,
    verifiedOnly: verifiedOnly,
  });

  const properties = propertiesData?.items || [];
  const hasProperties = properties.length > 0;

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

  // Handle search
  const handleSearch = () => {
    // Properties will auto-refresh due to useGetPublicProperties dependency on filters
    console.log('Searching with filters:', {
      query: searchQuery,
      type: selectedType,
      verifiedOnly
    });
  };

  // Handle property type filter
  const handleTypeFilter = (type) => {
    setSelectedType(selectedType === type ? null : type);
  };

  // Handle verified filter
  const handleVerifiedFilter = () => {
    setVerifiedOnly(!verifiedOnly);
  };

  const properties = propertiesData?.data || [];
  const hasProperties = properties.length > 0;

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={t('properties.search_placeholder', 'Search location or property...')}
                  className="w-full outline-none text-gray-700"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-riec-orange text-white font-bold px-8 py-3 rounded-xl hover:bg-riec-orange-light transition-all duration-300 hover:scale-105"
              >
                {t('properties.search_button', 'Search')}
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button 
                onClick={() => handleTypeFilter('HOUSE')}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                  selectedType === 'HOUSE' 
                    ? 'border-riec-orange bg-riec-orange text-white' 
                    : 'border-gray-200 hover:border-riec-orange hover:text-riec-orange'
                }`}
              >
                {t('properties.types.house', 'House')}
              </button>
              <button 
                onClick={() => handleTypeFilter('APARTMENT')}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                  selectedType === 'APARTMENT' 
                    ? 'border-riec-orange bg-riec-orange text-white' 
                    : 'border-gray-200 hover:border-riec-orange hover:text-riec-orange'
                }`}
              >
                {t('properties.types.apartment', 'Apartment')}
              </button>
              <button 
                onClick={() => handleTypeFilter('LAND')}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                  selectedType === 'LAND' 
                    ? 'border-riec-orange bg-riec-orange text-white' 
                    : 'border-gray-200 hover:border-riec-orange hover:text-riec-orange'
                }`}
              >
                {t('properties.types.land', 'Land')}
              </button>
              <button 
                onClick(() => handleTypeFilter('COMMERCIAL')}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                  selectedType === 'COMMERCIAL' 
                    ? 'border-riec-orange bg-riec-orange text-white' 
                    : 'border-gray-200 hover:border-riec-orange hover:text-riec-orange'
                }`}
              >
                {t('properties.types.commercial', 'Commercial')}
              </button>
              <button 
                onClick={handleVerifiedFilter}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                  verifiedOnly 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                }`}
              >
                Verified Only
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Listing Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : hasProperties ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {properties.length} {t('properties.results', 'Properties Found')}
                </h2>
                <p className="text-gray-600">
                  {selectedType && `Showing ${selectedType.toLowerCase()} properties`}
                  {verifiedOnly && ' (Verified only)'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Property Image */}
                    <div className="relative h-64 overflow-hidden">
                      {property.images && property.images[0] ? (
                        <img 
                          src={property.images[0].url} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Home className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {property.verificationStatus === 'VERIFIED' && (
                        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ✓ Verified
                        </div>
                      )}
                      {property.isFeatured && (
                        <div className="absolute top-4 left-4 bg-riec-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ⭐ Featured
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-riec-orange font-bold text-xl">
                          {property.price.toLocaleString()} {property.currency}
                        </p>
                        <p className="text-sm text-gray-600">{property.listingType === 'FOR_SALE' ? 'For Sale' : 'For Rent'}</p>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{property.sector}, {property.district}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      {/* Property Features */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-700">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span>{property.landSize}m²</span>
                        </div>
                      </div>

                      {/* Contact Buttons */}
                      <div className="flex gap-2">
                        <a 
                          href={`tel:${property.sellerPhone}`}
                          className="flex-1 bg-riec-orange text-white text-center py-2 rounded-lg hover:bg-riec-orange-light transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                        <a 
                          href={`mailto:${property.sellerEmail}`}
                          className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('properties.no_results', 'No Properties Found')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('properties.no_results_desc', 'Try adjusting your filters or search query')}
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType(null);
                  setVerifiedOnly(true);
                }}
                className="bg-riec-orange text-white px-6 py-3 rounded-lg hover:bg-riec-orange-light transition-colors duration-200"
              >
                {t('properties.clear_filters', 'Clear Filters')}
              </button>
            </div>
          )}
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
