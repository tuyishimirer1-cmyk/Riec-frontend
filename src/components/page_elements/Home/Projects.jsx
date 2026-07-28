import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Filter, Grid3X3 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGetProjects, useGetCategories, useGetCategoriesSummary, useGetProjectsByCategory } from '../../../react-query';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  
  // React Query state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories on mount
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories()
  const { data: categoriesSummaryData, isLoading: summaryLoading } = useGetCategoriesSummary()
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsByCategory(selectedCategory)

  const categories = categoriesData || []
  const categoriesSummary = categoriesSummaryData
  const projects = projectsData?.items || []
  const categoriesStatus = categoriesLoading || summaryLoading ? 'loading' : 'idle'

  // Get category count
  const getCategoryCount = (category) => {
    const summary = categoriesSummary?.summary?.find(s => s.category === category);
    return summary?.count || 0;
  }

  // Static fallback projects for display when no category is selected
  const fallbackProjects = [
    {
      id: 'fallback-1',
      image: '/project3.png',
      title: t('common.projects.interior_design'),
      subtitle: t('common.projects.interior_constructions'),
      category: 'RESIDENTIAL',
      bgColor: 'bg-white'
    },
    {
      id: 'fallback-2',
      image: '/project2.png',
      title: t('common.projects.residential'),
      subtitle: t('common.projects.residential_construction'),
      category: 'RESIDENTIAL',
      bgColor: 'bg-white'
    },
    {
      id: 'fallback-3',
      image: '/project1.png',
      title: t('common.projects.green_sustainable'),
      subtitle: t('common.projects.green_constructions'),
      category: 'COMMERCIAL',
      bgColor: 'bg-white'
    },
    {
      id: 'fallback-4',
      image: '/project4.png',
      title: t('common.projects.commercial'),
      subtitle: t('common.projects.commercial_constructions'),
      category: 'COMMERCIAL',
      bgColor: 'bg-white'
    },
    {
      id: 'fallback-5',
      image: '/project5.png',
      title: t('common.projects.industrial'),
      subtitle: t('common.projects.industrial_constructions'),
      category: 'INDUSTRIAL',
      bgColor: 'bg-white'
    },
    {
      id: 'fallback-6',
      image: '/project6.png',
      title: t('common.projects.edustructures'),
      subtitle: t('common.projects.edustructures_constructions'),
      category: 'INDUSTRIAL',
      bgColor: 'bg-white'
    }
  ];

  // Use API projects if available, otherwise fallback
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );

      gsap.fromTo(descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out',
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
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {t('common.projects.title')}
            </h2>
            <p ref={descRef} className="text-gray-600 text-lg">
              {t('common.projects.description')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {selectedCategory 
                  ? categories.find(c => c === selectedCategory) || selectedCategory
                  : t('common.projects.all_categories')
                }
              </button>
              
              {/* Category Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 ${
                        !selectedCategory ? 'bg-riec-orange text-white' : 'text-gray-700'
                      }`}
                    >
                      {t('common.projects.all_categories')}
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between ${
                          selectedCategory === category ? 'bg-riec-orange text-white' : 'text-gray-700'
                        }`}
                      >
                        <span>{category}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {getCategoryCount(category)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link
              to="/projects"
              className="bg-riec-orange text-white font-bold px-8 py-4 rounded-lg hover:bg-riec-orange-light transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
            >
              <Grid3X3 className="w-5 h-5" />
              {t('common.projects.view_all')}
            </Link>
          </div>
        </div>

        {/* Category Summary */}
        {categoriesSummary && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoriesSummary.summary?.slice(0, 3).map((summary) => (
              <div key={summary.category} className="bg-gray-50 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{summary.category}</h3>
                <p className="text-3xl font-bold text-riec-orange">{summary.count}</p>
                <p className="text-sm text-gray-600">
                  {Math.round(summary.percentage)}% {t('common.projects.of_total')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, index) => (
            <div
              key={project.id || index}
              ref={el => cardsRef.current[index] = el}
              className="group bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {project.subtitle}
                  </p>
                  {project.category && (
                    <span className="inline-block mt-2 text-xs bg-riec-orange text-white px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  )}
                </div>
                <div className={`${project.bgColor} ${project.bgColor === 'bg-white' ? 'border-2 border-gray-300 text-gray-900' : 'text-white bg-riec-orange'} w-12 h-12 rounded-full flex items-center justify-center group-hover:border-2 group-hover:border-riec-orange group-hover:text-white group-hover:scale-110 group-hover:bg-riec-orange-light transition-transform duration-300`}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {categoriesStatus === 'loading' && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-riec-orange border-t-transparent"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;