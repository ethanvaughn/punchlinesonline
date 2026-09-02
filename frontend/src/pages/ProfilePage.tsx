import { Link } from 'react-router-dom'
import { Masthead } from '../components/Masthead'
import { useAuth } from '../auth/useAuth'

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="site-shell">
      <Masthead />
      <main className="profile-page">
        <p className="auth-kicker">Your account</p>
        <h1>{user.firstName} {user.lastName}</h1>
        <div className="profile-details">
          <div><span>Name</span><strong>{user.firstName} {user.lastName}</strong></div>
          <div><span>Email</span><strong>{user.email}</strong></div>
        </div>
        <Link className="text-link" to="/">Back to punchlines</Link>
      </main>
    </div>
  )
}
