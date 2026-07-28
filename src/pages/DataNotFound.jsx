import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, FileX, AlertTriangle, Home, ArrowRight } from 'lucide-react'

const DataNotFound = ({ 
  title = 'Data Not Found', 
  message = 'The data you\'re looking for could not be found or has been removed.',
  dataType = 'data',
  backPath = '/projects'
}) => {
  const navigate = useNavigate()

  const handleSearch = () => {
    navigate('/projects')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <>
      <Helmet>
        <title>{title} | R.I.E.C</title>
        <meta name="description" content={message} />
      </Helmet>
      
      <div className="min-h-screen bg-riec-dark flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-lg">
          {/* Animated Error Icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 animate-blob opacity-20" style={{ background: 'var(--color-riec-red)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            {message}
          </p>

          {/* Data Type Specific Actions */}
          <div className="bg-slate-900/80 rounded-2xl p-6 mb-8 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">What would you like to do?</h2>
            <div className="space-y-3">
              <button
                onClick={handleSearch}
                className="w-full flex items-center gap-3 p-4 text-left rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all duration-300 hover:scale-105 group"
              >
                <Search className="w-5 h-5 text-riec-orange group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="font-medium text-white">Browse Other {dataType}</div>
                  <div className="text-xs text-slate-400">Search available {dataType}</div>
                </div>
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full flex items-center gap-3 p-4 text-left rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all duration-300 hover:scale-105 group"
              >
                <Home className="w-5 h-5 text-riec-orange group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="font-medium text-white">Return to Homepage</div>
                  <div className="text-xs text-slate-400">Go to main page</div>
                </div>
              </button>
              
              <button
                onClick={() => navigate(backPath)}
                className="w-full flex items-center gap-3 p-4 text-left rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all duration-300 hover:scale-105 group"
              >
                <ArrowRight className="w-5 h-5 text-riec-orange group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="font-medium text-white">Go Back</div>
                  <div className="text-xs text-slate-400">Return to previous page</div>
                </div>
              </button>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-4">Still need help?</p>
            <button
              onClick={() => window.location.href = 'mailto:support@riec.rw'}
              className="rounded-full bg-riec-orange px-6 py-3 text-sm font-semibold text-white hover:bg-riec-orange-light transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DataNotFound
