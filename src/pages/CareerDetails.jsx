import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { MapPin, Building2, Clock3, ArrowLeft } from 'lucide-react'
import { useApplyJob, useGetCareer } from '../react-query'

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  coverLetter: '',
  cvUrl: '',
  cvFile: null,
  coverLetterFile: null,
  qualifications: [],
}

export default function CareerDetails() {
  const { careerId } = useParams()
  const { data: job, isLoading } = useGetCareer(careerId)
  const applyMutation = useApplyJob()
  const [form, setForm] = useState(EMPTY_FORM)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }))
    }
  }

  const addQualification = () => {
    setForm((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { type: '', institution: '', year: '', file: null, fileUrl: '' }
      ]
    }))
  }

  const removeQualification = (index) => {
    setForm((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }))
  }

  const updateQualification = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) => 
        i === index ? { ...qual, [field]: value } : qual
      )
    }))
  }

  const updateQualificationFile = (index, file) => {
    setForm((prev) => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) => 
        i === index ? { ...qual, file: file } : qual
      )
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!job?.id) return

    if (!form.fullName || !form.email) {
      toast.error('Full name and email are required.')
      return
    }

    // Check if CV is provided (either file or URL)
    if (!form.cvFile && !form.cvUrl) {
      toast.error('Please upload your CV or provide a CV URL.')
      return
    }

    try {
      const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:3000/api'
      
      // Upload files using backend API if provided
      let cvUrl = form.cvUrl
      let coverLetterUrl = ''
      const qualificationsData = []

      if (form.cvFile) {
        toast.loading('Uploading CV...', { id: 'cv-upload' })
        const cvFormData = new FormData()
        cvFormData.append('file', form.cvFile)
        
        try {
          const cvUploadResponse = await fetch(
            `${backendUrl}/applications/upload?folder=job_applications/cvs`,
            {
              method: 'POST',
              body: cvFormData,
            }
          )
          
          if (!cvUploadResponse.ok) {
            throw new Error('CV upload failed')
          }
          
          const cvData = await cvUploadResponse.json()
          
          if (cvData.data?.url) {
            cvUrl = cvData.data.url
            toast.success('CV uploaded successfully', { id: 'cv-upload' })
          } else {
            throw new Error('Invalid upload response')
          }
        } catch (error) {
          toast.error('CV upload failed. Please use the URL field instead.', { id: 'cv-upload' })
          return
        }
      }

      if (form.coverLetterFile) {
        toast.loading('Uploading cover letter...', { id: 'cl-upload' })
        const clFormData = new FormData()
        clFormData.append('file', form.coverLetterFile)
        
        try {
          const clUploadResponse = await fetch(
            `${backendUrl}/applications/upload?folder=job_applications/cover_letters`,
            {
              method: 'POST',
              body: clFormData,
            }
          )
          
          if (clUploadResponse.ok) {
            const clData = await clUploadResponse.json()
            if (clData.data?.url) {
              coverLetterUrl = clData.data.url
              toast.success('Cover letter uploaded', { id: 'cl-upload' })
            } else {
              toast.dismiss('cl-upload')
            }
          } else {
            toast.dismiss('cl-upload')
          }
        } catch (error) {
          toast.dismiss('cl-upload')
          // Continue with submission even if cover letter upload fails
        }
      }

      // Upload qualification files
      if (form.qualifications.length > 0) {
        toast.loading('Uploading qualifications...', { id: 'qual-upload' })
      }
      
      for (const qual of form.qualifications) {
        const qualData = {
          type: qual.type,
          institution: qual.institution,
          year: qual.year,
          fileUrl: qual.fileUrl
        }

        if (qual.file) {
          const qualFormData = new FormData()
          qualFormData.append('file', qual.file)
          
          try {
            const qualUploadResponse = await fetch(
              `${backendUrl}/applications/upload?folder=job_applications/certificates`,
              {
                method: 'POST',
                body: qualFormData,
              }
            )
            
            if (qualUploadResponse.ok) {
              const qualUploadData = await qualUploadResponse.json()
              if (qualUploadData.data?.url) {
                qualData.fileUrl = qualUploadData.data.url
              }
            }
          } catch (error) {
            // Continue anyway
          }
        }

        qualificationsData.push(qualData)
      }
      
      if (form.qualifications.length > 0) {
        toast.success('Qualifications uploaded', { id: 'qual-upload' })
      }

      toast.loading('Submitting application...', { id: 'submit' })

      await applyMutation.mutateAsync({
        jobId: job.id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        cvUrl: cvUrl,
        coverLetter: coverLetterUrl || form.coverLetter,
        qualifications: qualificationsData.length > 0 ? JSON.stringify(qualificationsData) : undefined,
      })
      
      toast.success('Application submitted successfully!', { id: 'submit' })
      setForm(EMPTY_FORM)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to submit application.', { id: 'submit' })
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-riec-dark pt-28 text-white">
        <div className="mx-auto max-w-4xl px-4 text-sm text-slate-400">Loading role details...</div>
      </main>
    )
  }

  if (!job?.id) {
    return (
      <main className="min-h-screen bg-riec-dark pt-28 text-white">
        <div className="mx-auto max-w-4xl px-4">
          <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Role not found or no longer published.</p>
          <Link to="/careers" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-riec-orange hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to careers
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <Helmet>
        <title>{job.title} | Careers | R.I.E.C</title>
        <meta name="description" content={job.description || 'Career opportunity at R.I.E.C'} />
      </Helmet>

      <main className="min-h-screen bg-riec-dark pb-16 pt-28 text-white">
        <div className="mx-auto max-w-6xl px-4">
          {/* Header with Back Button */}
          <div className="mb-8">
            <Link to="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-riec-orange transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to All Careers
            </Link>
          </div>

          {/* Job Title and Key Info */}
          <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl font-black leading-tight mb-4">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-riec-orange" /> 
                    <span className="font-semibold">{job.location || 'Location not specified'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-riec-orange" /> 
                    <span className="font-semibold">{job.department || 'General'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-riec-orange" /> 
                    <span className="font-semibold">{job.employmentType || 'Full-time'}</span>
                  </p>
                </div>
              </div>
              <a 
                href="#apply-section"
                className="bg-riec-orange text-white px-8 py-3 rounded-full font-bold hover:bg-riec-orange-light transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Apply Now
              </a>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* Left Column - Main Content */}
            <div className="space-y-6">
              {/* About Role */}
              <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-riec-orange rounded-full"></span>
                  About This Role
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-line text-slate-300 leading-relaxed text-base">{job.description}</p>
                </div>
              </section>

              {/* Responsibilities */}
              {job.responsibilities && (
                <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-1 h-8 bg-riec-orange rounded-full"></span>
                    Key Responsibilities
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line text-slate-300 leading-relaxed text-base">{job.responsibilities}</p>
                  </div>
                </section>
              )}

              {/* Requirements */}
              {job.requirements && (
                <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-1 h-8 bg-riec-orange rounded-full"></span>
                    Requirements & Qualifications
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line text-slate-300 leading-relaxed text-base">{job.requirements}</p>
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Application Form */}
            <aside className="h-fit sticky top-24">
              <div id="apply-section" className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
                <h2 className="text-2xl font-bold text-white mb-2">Apply for This Position</h2>
                <p className="text-sm text-slate-400 mb-6">
                  Fill out the form below and our team will review your application within 48 hours.
                </p>

                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name *</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={onChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="+250 XXX XXX XXX"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Qualifications Section */}
                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-slate-300">Qualifications</label>
                      <button
                        type="button"
                        onClick={addQualification}
                        className="text-xs font-semibold text-riec-orange hover:text-riec-orange-light flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Qualification
                      </button>
                    </div>

                    {form.qualifications.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">
                        Add your diplomas, degrees, certificates, or other qualifications
                      </p>
                    )}

                    <div className="space-y-4">
                      {form.qualifications.map((qual, index) => (
                        <div key={index} className="relative p-4 border border-slate-700 rounded-xl bg-slate-900/50">
                          <button
                            type="button"
                            onClick={() => removeQualification(index)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Remove qualification"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>

                          <div className="space-y-3 pr-8">
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                              <select
                                value={qual.type}
                                onChange={(e) => updateQualification(index, 'type', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-riec-orange focus:outline-none transition-colors"
                              >
                                <option value="">Select type...</option>
                                <option value="High School Diploma">High School Diploma</option>
                                <option value="Associate Degree">Associate Degree</option>
                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                <option value="Master's Degree">Master's Degree</option>
                                <option value="PhD">PhD</option>
                                <option value="Professional Certificate">Professional Certificate</option>
                                <option value="Technical Certificate">Technical Certificate</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Institution</label>
                                <input
                                  value={qual.institution}
                                  onChange={(e) => updateQualification(index, 'institution', e.target.value)}
                                  placeholder="University name"
                                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
                                <input
                                  value={qual.year}
                                  onChange={(e) => updateQualification(index, 'year', e.target.value)}
                                  placeholder="2020"
                                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none transition-colors"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1">Certificate (PDF only)</label>
                              <label className="block w-full cursor-pointer">
                                <div className="flex items-center gap-2 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/30 px-3 py-2 text-xs text-slate-400 hover:border-riec-orange hover:bg-slate-900 transition-all">
                                  {qual.file ? (
                                    <div className="flex items-center gap-2 flex-1">
                                      <svg className="w-4 h-4 text-riec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <span className="text-white text-xs truncate flex-1">{qual.file.name}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          updateQualificationFile(index, null)
                                        }}
                                        className="text-red-400 hover:text-red-300"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                      <span>Upload certificate (PDF)</span>
                                    </>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      updateQualificationFile(index, e.target.files[0])
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">CV / Resume *</label>
                    
                    {/* File Upload Option */}
                    <div className="mb-3">
                      <label className="block w-full cursor-pointer">
                        <div className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-sm text-slate-400 hover:border-riec-orange hover:bg-slate-900 transition-all">
                          {form.cvFile ? (
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-riec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-white font-medium">{form.cvFile.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setForm((prev) => ({ ...prev, cvFile: null }))
                                }}
                                className="ml-2 text-red-400 hover:text-red-300"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span>Click to upload CV (PDF only)</span>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          name="cvFile"
                          accept=".pdf"
                          onChange={onFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* OR URL Option */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-slate-900 px-2 text-slate-500">OR provide URL</span>
                      </div>
                    </div>

                    <input
                      name="cvUrl"
                      value={form.cvUrl}
                      onChange={onChange}
                      placeholder="https://drive.google.com/..."
                      disabled={!!form.cvFile}
                      required={!form.cvFile}
                      className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Upload a file or paste a link to your resume</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Cover Letter</label>
                    
                    {/* File Upload Option */}
                    <div className="mb-3">
                      <label className="block w-full cursor-pointer">
                        <div className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-sm text-slate-400 hover:border-riec-orange hover:bg-slate-900 transition-all">
                          {form.coverLetterFile ? (
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-riec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-white font-medium">{form.coverLetterFile.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setForm((prev) => ({ ...prev, coverLetterFile: null }))
                                }}
                                className="ml-2 text-red-400 hover:text-red-300"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span>Click to upload Cover Letter (PDF only)</span>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          name="coverLetterFile"
                          accept=".pdf"
                          onChange={onFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* OR Text Option */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-slate-900 px-2 text-slate-500">OR write here</span>
                      </div>
                    </div>

                    <textarea
                      name="coverLetter"
                      value={form.coverLetter}
                      onChange={onChange}
                      rows={6}
                      placeholder="Tell us why you're a great fit for this role..."
                      disabled={!!form.coverLetterFile}
                      className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-riec-orange focus:outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applyMutation.isPending}
                    className="w-full rounded-full bg-riec-orange px-6 py-4 text-base font-bold text-white transition-all duration-300 hover:bg-riec-orange-light disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 shadow-lg"
                  >
                    {applyMutation.isPending ? 'Submitting Application...' : 'Submit Application'}
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    * Required fields
                  </p>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
