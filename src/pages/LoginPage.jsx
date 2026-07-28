import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Mail, Lock } from 'lucide-react'
import gsap from 'gsap'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import Card from '../components/ui/Card'
import { useLogin, useAuth } from '../react-query'
import loginBg from '../assets/login.jpg'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const navigate = useNavigate()
  const { data: auth, isLoading: authLoading } = useAuth()
  const role = auth?.role

  const loginMutation = useLogin()
  const serverError = loginMutation.error?.response?.data?.message || loginMutation.error?.message
  const isLoading = loginMutation.isPending

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const cardRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(logoRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
      .fromTo(cardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.2')
  }, [])

  useEffect(() => {
    if (authLoading || !role) return
    if (role !== 'CLIENT') {
      navigate('/dashboard/overview', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [authLoading, role, navigate])

  const validate = () => {
    const nextErrors = {}
    if (!email) nextErrors.email = 'Email is required'
    else if (!emailRegex.test(email)) nextErrors.email = 'Enter a valid email'
    if (!password) nextErrors.password = 'Password is required'
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await loginMutation.mutateAsync({ email, password })
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Helmet><title>Login | R.I.E.C Portal</title></Helmet>

      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-right bg-cover opacity-20" style={{ backgroundImage: `url(${loginBg})` }} />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div ref={cardRef} className="w-full max-w-md">
          <Card className="px-8 py-10">
            <div ref={logoRef} className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg">
                <span className="text-xl font-bold">R</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold tracking-[0.3em] text-slate-500">RIEC</p>
                <p className="mt-1 text-xs text-slate-400">Architectural Excellence &amp; Innovation</p>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
              <p className="mt-1 text-sm text-slate-500">Enter your credentials to access your projects</p>
            </div>

            {serverError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{serverError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField label="Email Address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@riec-arch.com" error={fieldErrors.email} icon={<Mail className="h-4 w-4" />} />

              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label htmlFor="password">Password</label>
                  <button type="button" className="text-orange-600 hover:text-orange-700">Forgot Password?</button>
                </div>
                <TextField name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" error={fieldErrors.password} icon={<Lock className="h-4 w-4" />} />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span>Remember me</span>
                </label>
              </div>

              <Button type="submit" isLoading={isLoading}>Sign In to Portal</Button>
            </form>

            <div className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>Or continue with</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-4">
              <Button variant="outline"><span className="mr-2 text-lg">G</span>Sign in with Google</Button>
            </div>
          </Card>

          <div className="mt-6 flex justify-center gap-4 text-[11px] text-slate-400">
            <button type="button" className="hover:text-slate-600">Privacy Policy</button>
            <span>•</span>
            <button type="button" className="hover:text-slate-600">Terms of Service</button>
            <span>•</span>
            <button type="button" className="hover:text-slate-600">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
