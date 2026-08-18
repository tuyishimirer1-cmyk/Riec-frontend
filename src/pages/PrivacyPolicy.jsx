import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react'

const SECTIONS = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: `We collect information you provide directly, such as your name, email address, phone number, and any messages you submit through our contact forms or quote requests. We also collect information automatically when you browse our website, including your IP address, browser type, device information, and pages visited.`,
  },
  {
    icon: Lock,
    title: 'How We Use Your Information',
    content: `Your information is used to respond to your inquiries, process quote requests, improve our services, and communicate project updates. We do not sell, trade, or share your personal information with third parties except as required by law or with trusted partners who assist in operating our website (analytics providers, hosting services).`,
  },
  {
    icon: Shield,
    title: 'Data Protection',
    content: `We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal data. While we strive to use commercially acceptable means to protect your information, no method of electronic storage is 100% secure.`,
  },
  {
    icon: FileText,
    title: 'Cookies',
    content: `Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us remember your preferences and understand how you interact with our site. You can disable cookies in your browser settings, though some features may not function properly.`,
  },
  {
    icon: Eye,
    title: 'Third-Party Links',
    content: `Our website may contain links to external sites not operated by us. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policy of every site you visit.`,
  },
]

export default function PrivacyPolicy() {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const sectionsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })

      gsap.fromTo(sectionsRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.3 })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('privacy.title', { defaultValue: 'Privacy Policy' })} | R.I.E.C</title>
        <meta name="description" content="R.I.E.C Privacy Policy — how we collect, use, and protect your data." />
      </Helmet>

      <div className="min-h-screen bg-riec-dark">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-riec-dark">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-riec-orange rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-[150px]" />
          </div>
          <div ref={heroRef} className="relative max-w-screen-xl mx-auto px-6 md:px-12 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-riec-orange/20">
                <Shield className="h-5 w-5 text-riec-orange" />
              </div>
              <span className="text-riec-orange text-xs font-bold uppercase tracking-wider">
                {t('privacy.last_updated', { defaultValue: 'Last updated: July 2026' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t('privacy.title', { defaultValue: 'Privacy Policy' })}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t('privacy.subtitle', { defaultValue: 'Your privacy is important to us. This policy explains how we collect, use, and safeguard your personal information when you interact with our website and services.' })}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {SECTIONS.map((section, i) => {
              const Icon = section.icon
              return (
                <div
                  key={section.title}
                  ref={(el) => { sectionsRef.current[i] = el }}
                  className="group bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-riec-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-riec-orange/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-riec-orange/10 group-hover:bg-riec-orange/20 transition-colors duration-300">
                      <Icon className="h-6 w-6 text-riec-orange group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-riec-orange transition-colors duration-300">
                        {section.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
              <Mail className="h-4 w-4" />
              {t('privacy.questions', { defaultValue: 'Questions about our privacy policy?' })}
              <a href="mailto:riec2025@gmail.com" className="text-riec-orange font-semibold hover:underline ml-1">
                riec2025@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}