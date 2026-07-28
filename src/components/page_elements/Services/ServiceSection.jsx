import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ServiceSection = ({ id, title, description, features, image, index, onViewProjects, onViewProcess }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const isEven = index % 2 === 0;
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { x: isEven ? 100 : -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(imageRef.current,
        { x: isEven ? -100 : 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <section 
      id={id}
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative"
      style={{ 
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-riec-dark/90 to-riec-dark/70"></div>
      
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div ref={contentRef} className={index % 2 === 0 ? 'lg:order-2' : ''}>
            <span className="bg-riec-orange text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
              Service {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-6">
              {title.split(' ').map((word, i) => (
                <span key={i} className={i === title.split(' ').length - 1 ? 'text-riec-orange' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {description}
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-riec-orange mb-3">{feature.icon}</div>
                  <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                  {/* <p className="text-gray-400 text-sm">{feature.description}</p> */}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={onViewProjects}
                className="bg-riec-orange text-white font-bold px-8 py-4 rounded-full hover:bg-riec-orange-light transition-all duration-300 hover:scale-105"
              >
                View Projects
              </button>
              <button 
                onClick={onViewProcess}
                className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                Our Process
              </button>
            </div>
          </div>

          {/* Image Placeholder */}
          <div ref={imageRef} className={`hidden lg:block ${index % 2 === 0 ? 'lg:order-1' : ''}`}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
              <img src={image} alt={title} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

ServiceSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  image: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onViewProjects: PropTypes.func.isRequired,
  onViewProcess: PropTypes.func.isRequired
};

export default ServiceSection;
