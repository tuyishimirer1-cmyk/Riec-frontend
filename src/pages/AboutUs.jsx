import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Settings, Ruler, Leaf, Lightbulb, MapPin, Phone, Mail, Link as LinkIcon, Linkedin, User } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQuoteModal } from '../components/layouts/MainLayout';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const TeamMemberAvatar = ({ name, image, alt }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (imgError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-riec-orange/30 to-riec-orange/10">
        <div className="text-center">
          <User className="w-16 h-16 text-riec-orange/70 mx-auto mb-2" />
          <span className="text-2xl font-bold text-riec-orange/80 tracking-wider">
            {getInitials(name)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
};

const AboutUs = () => {
  const { t } = useTranslation();
  const valuesRef = useRef(null);
  const journeyRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);

  const coreValues = [
    { icon: Settings, title: t('about.values.integrity.title'), description: t('about.values.integrity.desc') },
    { icon: Ruler,    title: t('about.values.precision.title'), description: t('about.values.precision.desc') },
    { icon: Leaf,     title: t('about.values.sustainability.title'), description: t('about.values.sustainability.desc') },
    { icon: Lightbulb,title: t('about.values.innovation.title'), description: t('about.values.innovation.desc') },
  ];

  const timeline = [
    { year: '2023', title: t('about.journey.1998.title'), desc: t('about.journey.1998.desc') },
    { year: '2024', title: t('about.journey.2005.title'), desc: t('about.journey.2005.desc') },
    { year: '2025', title: t('about.journey.2014.title'), desc: t('about.journey.2014.desc') },
    { year: '2026', title: t('about.journey.2024.title'), desc: t('about.journey.2024.desc') },
  ];

  const team = [
    { name: t('about.team.ceo.name'),                          role: t('about.team.ceo.role'),                          desc: t('about.team.ceo.desc'),                          image: '/libert.jpeg',                                     email: 'izerlibert10@gmail.com',   phone: '0787 106 857' },
    { name: t('about.team.operation_manager.name'),            role: t('about.team.operation_manager.role'),            desc: t('about.team.operation_manager.desc'),            image: '/zing.png',                                        email: 'futuremanirakiza@gmail.com', phone: '0784 231 161' },
    { name: t('about.team.project_engineer.name'),             role: t('about.team.project_engineer.role'),             desc: t('about.team.project_engineer.desc'),             image: '/team3.jpg',                                       email: 'riec2025@gmail.com',        phone: '0738 117 255' },
    { name: t('about.team.electrical_engineer.name'),          role: t('about.team.electrical_engineer.role'),          desc: t('about.team.electrical_engineer.desc'),          image: '/team4.jpg',                                       email: 'muhuzasergeadelit@gmail.com', phone: '+250 780 584 866' },
    { name: t('about.team.developer_it_manager.name'),         role: t('about.team.developer_it_manager.role'),         desc: t('about.team.developer_it_manager.desc'),         image: '/rosine.png',                                     email: 'riec2025@gmail.com',        phone: '0783 968 441' },
    { name: t('about.team.site_engineer_assistant_operator.name'), role: t('about.team.site_engineer_assistant_operator.role'), desc: t('about.team.site_engineer_assistant_operator.desc'), image: '/tresor.jpeg',                              email: 'tresbalin1@gmail.com',      phone: '0783 304 952' },
  ];

  useEffect(() => {
    gsap.fromTo(valuesRef.current?.children,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: valuesRef.current, start: 'top 70%' } }
    );
    gsap.fromTo(journeyRef.current?.children,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power2.out',
        scrollTrigger: { trigger: journeyRef.current, start: 'top 70%' } }
    );
    gsap.fromTo(teamRef.current?.children,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: teamRef.current, start: 'top 70%' } }
    );
  }, []);

  const { openQuoteModal } = useQuoteModal() || {};

  return (
    <>
      <Helmet>
        <title>{t('about.page_title')} | R.I.E.C</title>
        <meta name="description" content={t('about.page_description')} />
      </Helmet>

      {/* Core Values */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-riec-dark">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('about.values.title')}
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl">
                {t('about.values.subtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={openQuoteModal}
              className="text-riec-orange font-bold flex items-center gap-2 transition-all"
              onMouseEnter={(e) => e.currentTarget.style.gap = '12px'}
              onMouseLeave={(e) => e.currentTarget.style.gap = '8px'}
            >
              {t('about.values.ethics_link')}
              <span>→</span>
            </button>
          </div>

          <div ref={valuesRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-all duration-300">
                  <div className="bg-riec-orange/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-riec-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-slate-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 px-6 md:px-12 bg-slate-900 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('about.journey.title')}
          </h2>
          <div className="w-16 h-1 bg-riec-orange mx-auto mb-16" />

          <div ref={journeyRef} className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-riec-orange/40 transform -translate-x-1/2 hidden md:block" />

            {timeline.map((item, idx) => (
              <div key={idx} className={`relative mb-10 md:mb-16 ${
                idx % 2 === 0 ? 'md:text-right md:pr-1/2' : 'md:text-left md:pl-1/2'
              }`}>
                <div className={`md:w-1/2 ${
                  idx % 2 === 0 ? 'md:ml-auto md:pr-14' : 'md:ml-0 md:pl-14'
                }`}>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-riec-orange/40 transition-colors duration-300">
                    <div className="text-riec-orange font-bold text-2xl mb-2">{item.year}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 top-6 w-4 h-4 bg-riec-orange rounded-full transform -translate-x-1/2 hidden md:block ring-4 ring-slate-900" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6 md:px-12 bg-riec-dark">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('about.team.title')}
          </h2>
          <p className="text-slate-400 text-lg text-center max-w-3xl mx-auto mb-12">
            {t('about.team.subtitle')}
          </p>

          <div ref={teamRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800 transition-all duration-300">
                <div className="aspect-[3/4] bg-slate-700">
                  <TeamMemberAvatar name={member.name} image={member.image} alt={member.name} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-riec-orange font-bold text-sm uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-slate-400 text-sm mb-4">{member.desc}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Mail className="w-4 h-4 text-riec-orange/70 flex-shrink-0" />
                      <a href={`mailto:${member.email}`} className="hover:text-riec-orange transition-colors truncate">
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Phone className="w-4 h-4 text-riec-orange/70 flex-shrink-0" />
                      <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="hover:text-riec-orange transition-colors">
                        {member.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-slate-500 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-riec-orange)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                      <LinkIcon className="w-5 h-5" />
                    </button>
                    <button className="text-slate-500 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-riec-orange)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                      <Mail className="w-5 h-5" />
                    </button>
                    <Link to={member.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="text-slate-500 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-riec-orange)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                      <Linkedin className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section ref={contactRef} className="py-16 px-6 md:px-12 bg-slate-900">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Form */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('about.contact.title')}
              </h2>
              <div className="w-16 h-1 bg-riec-orange mb-6" />
              <p className="text-slate-400 text-lg mb-8">
                {t('about.contact.subtitle')}
              </p>

              <form className="space-y-6">
                {[
                  { label: t('about.contact.form.name'),    type: 'text',  placeholder: 'John Doe' },
                  { label: t('about.contact.form.email'),   type: 'email', placeholder: 'john@example.com' },
                  { label: t('about.contact.form.subject'), type: 'text',  placeholder: 'Inquiry about Infrastructure Project' },
                ].map(({ label, type, placeholder }) => (
                  <div key={label}>
                    <label className="block text-slate-300 font-semibold mb-2">{label}</label>
                    <input type={type} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-riec-orange focus:outline-none transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">{t('about.contact.form.message')}</label>
                  <textarea rows="5" placeholder="Tell us about your project requirements..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-riec-orange focus:outline-none resize-none transition-colors" />
                </div>
                <button type="submit"
                  className="bg-riec-orange text-white font-bold px-8 py-4 rounded-lg transition-all duration-300"
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                  {t('about.contact.form.submit')}
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-8">
              {[
                {
                  Icon: MapPin,
                  title: t('about.contact.office.title'),
                  lines: [t('about.contact.office.address1'), t('about.contact.office.address2')],
                },
                {
                  Icon: Phone,
                  title: t('about.contact.phone.title'),
                  lines: [t('about.contact.phone.number1'), t('about.contact.phone.number2')],
                },
                {
                  Icon: Mail,
                  title: t('about.contact.email.title'),
                  lines: [t('about.contact.email.inquiry'), t('about.contact.email.careers')],
                },
              ].map(({ Icon, title, lines }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="bg-riec-orange/10 p-4 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-riec-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    {lines.map((l, i) => <p key={i} className="text-slate-400">{l}</p>)}
                  </div>
                </div>
              ))}

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">{t('about.contact.hours.title')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>{t('about.contact.hours.weekday')}</span>
                    <span className="font-semibold text-slate-200">{t('about.contact.hours.weekday_time')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{t('about.contact.hours.saturday')}</span>
                    <span className="font-semibold text-slate-200">{t('about.contact.hours.saturday_time')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{t('about.contact.hours.sunday')}</span>
                    <span className="font-semibold text-red-400">{t('about.contact.hours.sunday_time')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96">
        <iframe
          src="https://maps.google.com/maps?width=600&height=400&hl=en&q=-1.948537,30.126226&t=&z=17&ie=UTF8&iwloc=B&output=embed"
          width="100%" height="100%"
          style={{ border: 0 }}
          allowFullScreen="" loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
        />
      </section>
    </>
  );
};

export default AboutUs;
