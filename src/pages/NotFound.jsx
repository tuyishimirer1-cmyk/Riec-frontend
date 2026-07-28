import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home, Search, RefreshCw, ArrowRight } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    window.history.back()
  }

  const handleSearch = () => {
    navigate('/projects')
  }

  return (
    <>
      <Helmet>
        <title>Page Not Found | R.I.E.C</title>
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
      </Helmet>
      
      <div className="min-h-screen bg-riec-dark flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-lg">
          {/* Animated 404 Icon */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 animate-blob opacity-20" style={{ background: 'var(--color-riec-orange)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-white">404</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            The page at <code className="text-riec-orange bg-slate-800 px-2 py-1 rounded">{location.pathname}</code> doesn't exist or has been moved.
          </p>

          {/* Search Suggestions */}
          <div className="bg-slate-900/80 rounded-2xl p-6 mb-8 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">What are you looking For?</h2>
            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full flex items-center gap-3 p-4 text-left rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all duration-300 hover:scale-105 group"
              >
                <Home className="w-5 h-5 text-riec-orange group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="font-medium text-white">Homepage</div>
                  <div className="text-xs text-slate-400">Navigate to main page</div>
                </div>
              </button>
              
              <button
                onClick={handleSearch}
                className="w-full flex items-center gap-3 p-4 text-left rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all duration-300 hover:scale-105 group"
              >
                <Search className="w-5 h-5 text-riec-orange group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="font-medium text-white">Browse Projects</div>
                  <div className="text-xs text-slate-400">Search all projects</div>
                </div>
              </button>
              
              <button
                onClick={handleGoBack}
                className="w-full flex items-center gap-3 p-4 text-left rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all duration-300 hover:scale-105 group"
              >
                <RefreshCw className="w-5 h-5 text-riec-orange group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="font-medium text-white">Go Back</div>
                  <div className="text-xs text-slate-400">Return to previous page</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = 'mailto:info@riec.rw'}
              className="rounded-full bg-riec-orange px-6 py-3 text-sm font-semibold text-white hover:bg-riec-orange-light transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Contact Support
            </button>
            <button
              onClick={handleGoHome}
              className="rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
