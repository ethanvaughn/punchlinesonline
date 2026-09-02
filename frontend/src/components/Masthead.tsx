import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function Masthead() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
  }

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <Link className="brand-lockup" to="/" aria-label="Punchlines Online home">
          <img src="/clippy-placeholder.svg" alt="Clippy placeholder logo" />
          <span className="brand-copy">
            <strong>Punchlines Online</strong>
            <span>Only the punchlines, online, all the time</span>
          </span>
        </Link>

        <nav className="masthead-nav" aria-label="Account navigation">
          {user ? (
            <div className="profile-menu" ref={menuRef}>
              <button
                type="button"
                className="profile-trigger"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {user.lastName.charAt(0).toUpperCase()}
              </button>
              {menuOpen ? (
                <div className="profile-dropdown" role="menu">
                  <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); navigate('/profile') }}>
                    Profile
                  </button>
                  <button type="button" role="menuitem" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link to="/signin">Sign in</Link>
              <Link to="/register" className="nav-register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
