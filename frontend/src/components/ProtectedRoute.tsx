import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="route-loading">Loading Punchlines Online...</div>
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace state={{ from: location }} />
}
