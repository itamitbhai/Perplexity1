import React, { useState } from 'react'
import { Link } from 'react-router'
import { register } from '../services/auth.api'
import Logo from '../../../components/Logo'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitForm = async(event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const payload = {
      username,
      email,
      password,
    }

    setIsSubmitting(true)
    try {
      await register(payload)
      setSuccessMessage('Account created! Check your email to verify your account, then log in.')
      setUsername('')
      setEmail('')
      setPassword('')
    } catch (error) {
      const responseData = error.response?.data
      const message = responseData?.errors?.map((err) => err.msg).join(', ')
        || responseData?.message
        || 'Registration failed. Please try again.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <section className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-6 shadow-2xl shadow-black/50 backdrop-blur sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Logo size={40} />
            <span className="text-xl font-semibold tracking-tight text-white">DeepOcean</span>
          </div>
          <h1 className="text-3xl font-bold text-[#31b8c6]">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-zinc-300">
            Register with your username, email, and password.
          </p>

          {errorMessage && (
            <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-6 rounded-lg border border-[#31b8c6]/40 bg-[#31b8c6]/10 px-4 py-3 text-sm text-[#5fd3df]">
              {successMessage}
            </div>
          )}

          <form onSubmit={submitForm} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-zinc-200">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#31b8c6] transition hover:text-[#45c7d4]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Register