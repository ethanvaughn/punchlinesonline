import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import './App.css'
import { useAuth } from './auth/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { ProfilePage } from './pages/ProfilePage'
import { PunchlinePage } from './pages/PunchlinePage'
import { RegisterPage } from './pages/RegisterPage'
import { SignInPage } from './pages/SignInPage'

type LocationState = {
  backgroundLocation?: Location
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="route-loading">Loading Punchlines Online...</div>
  return user ? <Navigate to="/" replace /> : children
}

function App() {
  const location = useLocation()
  const backgroundLocation = (location.state as LocationState | null)?.backgroundLocation
  const isPunchlineOverlay = location.pathname === '/punchline'
  const routesLocation = backgroundLocation ?? (isPunchlineOverlay
    ? { ...location, pathname: '/', search: '', hash: '', state: null }
    : location)

  return (
    <>
      <Routes location={routesLocation}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isPunchlineOverlay && (
        <Routes>
          <Route path="/punchline" element={<PunchlinePage />} />
        </Routes>
      )}
    </>
  )
}

export default App
