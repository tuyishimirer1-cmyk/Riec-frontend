import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';

const ScrollIndicator = ({ services, activeSection }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: element, offsetY: 0 },
        ease: 'power3.inOut'
      });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col gap-4">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Tooltip */}
            <div className={`
              absolute right-full mr-4 top-1/2 -translate-y-1/2 
              bg-white text-riec-dark px-4 py-2 rounded-lg shadow-lg
              whitespace-nowrap font-semibold text-sm
              transition-all duration-300
              ${hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
            `}>
              {service.title}
            </div>

            {/* Indicator Dot */}
            <button
              onClick={() => scrollToSection(service.id)}
              className={`
                w-4 h-4 rounded-full border-2 transition-all duration-300
                ${activeSection === service.id 
                  ? 'bg-riec-orange border-riec-orange scale-125' 
                  : 'bg-transparent border-white hover:border-riec-orange hover:scale-110'
                }
              `}
              aria-label={`Scroll to ${service.title}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

ScrollIndicator.propTypes = {
  services: PropTypes.array.isRequired,
  activeSection: PropTypes.string
};

export default ScrollIndicator;
