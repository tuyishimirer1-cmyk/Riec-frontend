import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { Scale, FileCheck, AlertTriangle, Clock, Globe, Copyright } from 'lucide-react'

const SECTIONS = [
  {
    icon: Globe,
    title: 'Acceptance of Terms',
    content: `By accessing and using the RIEC website, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of our website immediately. These terms apply to all visitors, users, and clients who access our services.`,
  },
  {
    icon: FileCheck,
    title: 'Services & Projects',
    content: `RIEC provides construction, architectural design, and real estate development services in Rwanda. All project descriptions, pricing, and availability shown on our website are for informational purposes and do not constitute a binding offer. Final pricing, timelines, and project specifications are established through signed contracts and official quotations.`,
  },
  {
    icon: Copyright,
    title: 'Intellectual Property',
    content: `All content on this website — including text, images, logos, architectural designs, project photographs, and graphics — is the exclusive property of RIEC Ltd or its licensors and is protected by Rwandan and international copyright laws. You may not reproduce, distribute, modify, or use any content without our prior written consent.`,
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: `RIEC shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services. While we strive to keep all information accurate and current, we do not warrant that the website content is error-free, complete, or up-to-date at all times.`,
  },
  {
    icon: Clock,
    title: 'Modifications',
    content: `We reserve the right to modify these Terms & Conditions at any time without prior notice. Changes become effective immediately upon posting to this page. Your continued use of the website after any modifications constitutes acceptance of the updated terms. We recommend reviewing this page periodically.`,
  },
  {
    icon: Scale,
    title: 'Governing Law',
    content: `These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of Rwanda. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Rwanda.`,
  },
]

export default function TermsConditions() {
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
        <title>{t('terms.title', { defaultValue: 'Terms & Conditions' })} | R.I.E.C</title>
        <meta name="description" content="RIEC Terms & Conditions — rules and guidelines for using our website and services." />
      </Helmet>

      <div className="min-h-screen bg-riec-dark">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-riec-dark">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-72 h-72 bg-riec-orange rounded-full blur-[120px]" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-[150px]" />
          </div>
          <div ref={heroRef} className="relative max-w-screen-xl mx-auto px-6 md:px-12 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-riec-orange/20">
                <Scale className="h-5 w-5 text-riec-orange" />
              </div>
              <span className="text-riec-orange text-xs font-bold uppercase tracking-wider">
                {t('terms.last_updated', { defaultValue: 'Last updated: July 2026' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t('terms.title', { defaultValue: 'Terms & Conditions' })}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t('terms.subtitle', { defaultValue: 'Please read these terms carefully before using our website or engaging our services. By using this site, you agree to the following conditions.' })}
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
        </div>
      </div>
    </>
  )
}