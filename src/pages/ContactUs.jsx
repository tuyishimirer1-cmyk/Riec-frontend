import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import gsap from 'gsap'
import {
  Mail, Phone, MapPin, Send, CheckCircle,
  Clock, MessageSquare, User, Building2, AlertCircle,
} from 'lucide-react'
import { useCreateContact } from '../react-query'

const contactSchema = Yup.object({
  name: Yup.string().min(2, 'Name is too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().min(6, 'Phone number is too short'),
  company: Yup.string(),
  subject: Yup.string().min(3, 'Subject is required').required(),
  message: Yup.string().min(10, 'Please write at least 10 characters').required('Message is required'),
})

const inputCls = [
  'w-full rounded-xl border bg-slate-800/60 px-4 py-3 text-sm text-white',
  'placeholder:text-slate-500',
  'border-slate-700 focus:border-riec-orange focus:outline-none focus:bg-slate-800/90',
  'transition-colors duration-200',
].join(' ')

export default function ContactUs() {
  const { t } = useTranslation()
  const createContact = useCreateContact()
  const [submitted, setSubmitted] = useState(false)

  const heroRef = useRef(null)
  const formCardRef = useRef(null)
  const infoCardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })

      gsap.fromTo(formCardRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 })

      gsap.fromTo(infoCardsRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.35 })
    })
    return () => ctx.revert()
  }, [])

  const formik = useFormik({
    initialValues: { name: '', email: '', phone: '', company: '', subject: '', message: '' },
    validationSchema: contactSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await createContact.mutateAsync(values)
        setSubmitted(true)
      } catch (err) {
        const msg = err?.response?.data?.message
        setStatus(Array.isArray(msg) ? msg.join(' · ') : (msg || t('contact.error', { defaultValue: 'Something went wrong. Please try again.' })))
      } finally {
        setSubmitting(false)
      }
    },
  })

  const infoItems = [
    { icon: Phone, label: t('nav.phone', { defaultValue: 'Phone' }), value: '+250 787 106 854', href: 'tel:+250787106854' },
    { icon: Phone, label: t('nav.phone', { defaultValue: 'Phone' }), value: '+250 784 231 101', href: 'tel:+250784231101' },
    { icon: Mail, label: t('nav.email', { defaultValue: 'Email' }), value: 'riec2025@gmail.com', href: 'mailto:riec2025@gmail.com' },
    { icon: MapPin, label: t('nav.location', { defaultValue: 'Location' }), value: 'Kigali, Rwanda', href: '#' },
    { icon: Clock, label: t('contact.hours', { defaultValue: 'Working Hours' }), value: 'Mon–Fri: 8:00 AM – 5:00 PM', href: null },
  ]

  return (
    <>
      <Helmet>
        <title>{t('nav.contact', { defaultValue: 'Contact' })} | R.I.E.C</title>
        <meta name="description" content="Contact R.I.E.C for construction, architectural design, and real estate development services in Rwanda." />
      </Helmet>

      <div className="min-h-screen bg-riec-dark pb-16">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-riec-dark">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-1/4 w-80 h-80 bg-riec-orange rounded-full blur-[130px]" />
            <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-secondary rounded-full blur-[120px]" />
          </div>
          <div ref={heroRef} className="relative max-w-screen-xl mx-auto px-6 md:px-12 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-riec-orange/20">
                <MessageSquare className="h-5 w-5 text-riec-orange" />
              </div>
              <span className="text-riec-orange text-xs font-bold uppercase tracking-wider">
                {t('contact.get_in_touch', { defaultValue: 'Get In Touch' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t('nav.contact', { defaultValue: 'Contact Us' })}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t('contact.subtitle', { defaultValue: 'Have a project in mind? Need a quote? We\'d love to hear from you. Reach out and our team will get back to you within 24 hours.' })}
            </p>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 md:px-12 -mt-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form Card */}
            <div ref={formCardRef} className="lg:col-span-2">
              <div className="bg-slate-900/80 p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {t('contact.success_title', { defaultValue: 'Message Sent!' })}
                    </h2>
                    <p className="text-slate-300 max-w-md mx-auto leading-relaxed">
                      {t('contact.success_message', { defaultValue: 'Thank you for reaching out. Our team will review your message and get back to you shortly.' })}
                    </p>
                    <button
                      type="button"
                      onClick={() => { setSubmitted(false); formik.resetForm() }}
                      className="mt-6 rounded-full border border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:border-riec-orange hover:text-riec-orange transition-colors duration-300"
                    >
                      {t('contact.send_another', { defaultValue: 'Send Another Message' })}
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white mb-6">
                      {t('contact.form_title', { defaultValue: 'Send Us a Message' })}
                    </h2>

                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                            {t('contact.field_name', { defaultValue: 'Full Name' })} *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                            <input
                              name="name"
                              type="text"
                              className={`${inputCls} pl-10`}
                              placeholder="John Doe"
                              value={formik.values.name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.name && formik.errors.name && (
                            <p className="mt-1 text-xs text-red-400">{formik.errors.name}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                            {t('contact.field_email', { defaultValue: 'Email' })} *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                            <input
                              name="email"
                              type="email"
                              className={`${inputCls} pl-10`}
                              placeholder="john@example.com"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-xs text-red-400">{formik.errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Phone */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                            {t('contact.field_phone', { defaultValue: 'Phone' })}
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                            <input
                              name="phone"
                              type="tel"
                              className={`${inputCls} pl-10`}
                              placeholder="+250 788 000 000"
                              value={formik.values.phone}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          {formik.touched.phone && formik.errors.phone && (
                            <p className="mt-1 text-xs text-red-400">{formik.errors.phone}</p>
                          )}
                        </div>

                        {/* Company */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                            {t('contact.field_company', { defaultValue: 'Company' })}
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                            <input
                              name="company"
                              type="text"
                              className={`${inputCls} pl-10`}
                              placeholder="Your Company Ltd"
                              value={formik.values.company}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                          {t('contact.field_subject', { defaultValue: 'Subject' })} *
                        </label>
                        <input
                          name="subject"
                          type="text"
                          className={inputCls}
                          placeholder={t('contact.subject_placeholder', { defaultValue: 'How can we help you?' })}
                          value={formik.values.subject}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.subject && formik.errors.subject && (
                          <p className="mt-1 text-xs text-red-400">{formik.errors.subject}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                          {t('contact.field_message', { defaultValue: 'Message' })} *
                        </label>
                        <textarea
                          name="message"
                          rows={5}
                          className={`${inputCls} resize-none`}
                          placeholder={t('contact.message_placeholder', { defaultValue: 'Tell us about your project or inquiry…' })}
                          value={formik.values.message}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.message && formik.errors.message && (
                          <p className="mt-1 text-xs text-red-400">{formik.errors.message}</p>
                        )}
                      </div>

                      {/* Error status */}
                      {formik.status && (
                        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2.5">
                          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                          <p className="text-xs text-red-300">{formik.status}</p>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-riec-orange px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-riec-orange-light hover:shadow-lg hover:shadow-riec-orange/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {formik.isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t('contact.sending', { defaultValue: 'Sending…' })}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            {t('contact.send', { defaultValue: 'Send Message' })}
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {infoItems.map((item, i) => {
                const Icon = item.icon
                const Wrapper = item.href && item.href !== '#' ? 'a' : 'div'
                const wrapperProps = item.href && item.href !== '#'
                  ? { href: item.href, target: item.href.startsWith('tel:') || item.href.startsWith('mailto:') ? undefined : '_blank', rel: item.href.startsWith('http') ? 'noopener noreferrer' : undefined }
                  : {}

                return (
                  <Wrapper
                    key={item.label}
                    ref={(el) => { infoCardsRef.current[i] = el }}
                    className={`group bg-slate-900/70 p-5 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:border-riec-orange/40 hover:shadow-lg hover:shadow-riec-orange/5 ${item.href && item.href !== '#' ? 'cursor-pointer' : ''}`}
                    {...wrapperProps}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-riec-orange/10 group-hover:bg-riec-orange/20 transition-colors duration-300">
                        <Icon className="h-5 w-5 text-riec-orange group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">{item.label}</p>
                        <p className="text-sm font-bold text-white group-hover:text-riec-orange transition-colors duration-300">{item.value}</p>
                      </div>
                    </div>
                  </Wrapper>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}