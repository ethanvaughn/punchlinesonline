import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

type User = {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  phone: string
  city: string
  country: string
  birthday: string
}

const demoUser: User = {
  firstName: 'Ava',
  lastName: 'Johnson',
  email: 'ava.johnson@example.com',
  username: 'avaj',
  password: 'password123',
  phone: '+1 (555) 123-4567',
  city: 'Seattle',
  country: 'United States',
  birthday: '1994-05-22',
}

const emptyRegistrationForm: User = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  phone: '',
  city: '',
  country: '',
  birthday: '',
}

function App() {
  const navigate = useNavigate()
  const [activeUser, setActiveUser] = useState<User>(demoUser)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registrationForm, setRegistrationForm] = useState<User>(emptyRegistrationForm)
  const [loginError, setLoginError] = useState('')
  const [registrationError, setRegistrationError] = useState('')

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  const handleRegistrationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setRegistrationForm((current) => ({ ...current, [name]: value }))
  }

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const emailMatches = loginForm.email.trim().toLowerCase() === activeUser.email.toLowerCase()
    const passwordMatches = loginForm.password === activeUser.password

    if (!emailMatches || !passwordMatches) {
      setLoginError('Incorrect email or password. Please try again.')
      return
    }

    setLoginError('')
    navigate('/profile')
  }

  const handleRegistrationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const missingField = Object.values(registrationForm).some((value) => !value.trim())

    if (missingField) {
      setRegistrationError('Please complete all fields to create your account.')
      return
    }

    const newUser: User = { ...registrationForm }
    setActiveUser(newUser)
    setRegistrationError('')
    setRegistrationForm(emptyRegistrationForm)
    navigate('/profile')
  }

  const goToLogin = () => {
    setLoginError('')
    navigate('/login')
  }

  const goToRegister = () => {
    setRegistrationError('')
    navigate('/register')
  }

  const LoginScreen = () => (
    <div className="auth-panel">
      <div className="auth-header">
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in</h1>
      </div>

      <form className="auth-form" onSubmit={handleLoginSubmit}>
        <label>
          Email address
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginForm.password}
            onChange={handleLoginChange}
            required
          />
        </label>

        {loginError ? <p className="form-message error">{loginError}</p> : null}

        <button type="submit" className="primary-button">
          Log in
        </button>
      </form>

      <p className="switch-copy">
        Don’t have an account?{' '}
        <button type="button" className="link-button" onClick={goToRegister}>
          Register here.
        </button>
      </p>
    </div>
  )

  const RegisterScreen = () => (
    <div className="auth-panel wide-panel">
      <div className="auth-header">
        <span className="eyebrow">Create account</span>
        <h1>Register</h1>
      </div>

      <form className="auth-form registration-form" onSubmit={handleRegistrationSubmit}>
        <div className="field-row">
          <label>
            First name
            <input
              type="text"
              name="firstName"
              placeholder="Ava"
              value={registrationForm.firstName}
              onChange={handleRegistrationChange}
            />
          </label>

          <label>
            Last name
            <input
              type="text"
              name="lastName"
              placeholder="Johnson"
              value={registrationForm.lastName}
              onChange={handleRegistrationChange}
            />
          </label>
        </div>

        <div className="field-row">
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={registrationForm.email}
              onChange={handleRegistrationChange}
            />
          </label>

          <label>
            Username
            <input
              type="text"
              name="username"
              placeholder="username"
              value={registrationForm.username}
              onChange={handleRegistrationChange}
            />
          </label>
        </div>

        <div className="field-row">
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={registrationForm.password}
              onChange={handleRegistrationChange}
            />
          </label>

          <label>
            Phone number
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 123-4567"
              value={registrationForm.phone}
              onChange={handleRegistrationChange}
            />
          </label>
        </div>

        <div className="field-row">
          <label>
            City
            <input
              type="text"
              name="city"
              placeholder="Seattle"
              value={registrationForm.city}
              onChange={handleRegistrationChange}
            />
          </label>

          <label>
            Country
            <input
              type="text"
              name="country"
              placeholder="United States"
              value={registrationForm.country}
              onChange={handleRegistrationChange}
            />
          </label>
        </div>

        <label>
          Birthday
          <input
            type="date"
            name="birthday"
            value={registrationForm.birthday}
            onChange={handleRegistrationChange}
          />
        </label>

        {registrationError ? <p className="form-message error">{registrationError}</p> : null}

        <button type="submit" className="primary-button">
          Create account
        </button>
      </form>

      <p className="switch-copy">
        Already have an account?{' '}
        <button type="button" className="link-button" onClick={goToLogin}>
          Log in.
        </button>
      </p>
    </div>
  )

  const ProfileScreen = () => (
    <div className="profile-panel">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Your profile</span>
          <h1>
            {activeUser.firstName} {activeUser.lastName}
          </h1>
        </div>
        <button type="button" className="secondary-button" onClick={goToLogin}>
          Log out
        </button>
      </div>

      <div className="profile-card">
        <div className="avatar">{activeUser.firstName.charAt(0)}{activeUser.lastName.charAt(0)}</div>

        <div className="profile-grid">
          <div>
            <span className="label">Username</span>
            <strong>{activeUser.username}</strong>
          </div>
          <div>
            <span className="label">Email</span>
            <strong>{activeUser.email}</strong>
          </div>
          <div>
            <span className="label">Phone</span>
            <strong>{activeUser.phone}</strong>
          </div>
          <div>
            <span className="label">Location</span>
            <strong>
              {activeUser.city}, {activeUser.country}
            </strong>
          </div>
          <div>
            <span className="label">Birthday</span>
            <strong>{new Date(activeUser.birthday).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
          </div>
          <div>
            <span className="label">Password</span>
            <strong>Hidden</strong>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <main className="app-shell">
      <div className="app-card">
        <aside className="brand-panel">
          <div className="brand-badge">A</div>
          <h2>Account Portal</h2>
          <p>Manage your profile, update details, and keep your account secure.</p>
        </aside>

        <section className="screen-panel">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </section>
      </div>
    </main>
  )
}

export default App
