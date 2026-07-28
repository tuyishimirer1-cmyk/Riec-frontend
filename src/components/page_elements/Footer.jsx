import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { FaTiktok, FaLinkedin } from 'react-icons/fa';
import logo from '../../assets/logo.svg';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { href: '/services', text: t('common.footer.company_links.services') },
    { href: '/projects', text: t('common.footer.company_links.projects') },
    { href: '/plans', text: t('common.footer.company_links.plans') },
    { href: '/about', text: t('common.footer.company_links.about_us') },
    { href: '/favorites', text: t('nav.favorites', { defaultValue: 'Favorites' }) },
    { href: '/careers', text: t('nav.careers', { defaultValue: 'Careers' }) },
    { href: '/login', text: t('common.footer.company_links.login') }
  ];

  const serviceLinks = [
    { href: '/services', text: t('common.footer.service_links.residential') },
    { href: '/services', text: t('common.footer.service_links.commercial') },
    { href: '/services', text: t('common.footer.service_links.renovation') },
    { href: '/services', text: t('common.footer.service_links.architecture') },
    { href: '/services', text: t('common.footer.service_links.project_management') },
    { href: '/services', text: t('common.footer.service_links.structural') }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/riec2025', label: 'X' },
    { icon: Instagram, href: 'https://www.instagram.com/riec.2025/', label: 'Instagram' },
    { icon: FaTiktok, href: 'https://vm.tiktok.com/ZS9jErCJbhL5b-dNsi0/', label: 'TikTok', isCustom: true },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/riec-ltd-84050337a/', label: 'LinkedIn', isCustom: true }
  ];

  return (
    <footer className="bg-riec-dark text-white">
      {/* Top Section - Contact Info */}
      <div className="border-b border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="bg-riec-orange p-4 rounded-lg">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t('common.footer.phone')}</p>
                <p className="font-semibold">{t('common.footer.contact.phone_number')}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="bg-riec-orange p-4 rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t('common.footer.email')}</p>
                <p className="font-semibold">{t('common.footer.contact.email_address')}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="bg-riec-orange p-4 rounded-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t('common.footer.location')}</p>
                <p className="font-semibold">{t('common.footer.contact.address_line1')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="RIEC Logo" className="h-8" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('common.footer.brand_description')}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('common.footer.company')}</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-riec-orange transition-colors duration-300 text-sm"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('common.footer.services')}</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.text}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-riec-orange transition-colors duration-300 text-sm"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('common.footer.follow_us')}</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-riec-orange p-3 rounded-lg transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  {social.isCustom ? (
                    <social.icon className="w-5 h-5" />
                  ) : (
                    <social.icon className="w-5 h-5" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>{currentYear} {t('common.footer.rights_reserved')}</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-riec-orange transition-colors duration-300">
                {t('common.footer.privacy_policy')}
              </Link>
              <Link to="/terms" className="hover:text-riec-orange transition-colors duration-300">
                {t('common.footer.terms_conditions')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
