import { useAuth } from '../react-query'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requireAuth = true, roles }) => {
  const { data: auth, isLoading } = useAuth()
  const accessToken = auth?.accessToken
  const role = auth?.role
  const isAuthenticated = !!accessToken

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-riec-orange"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAuth && roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard/overview" replace />
  }

  return children
}

export default ProtectedRoute
