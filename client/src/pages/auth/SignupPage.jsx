import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuthStore } from '../../store/authStore'
import { useGoogleLogin } from '@react-oauth/google'
import FacebookLoginModule from '@greatsumini/react-facebook-login'
const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;
import { motion, AnimatePresence } from 'framer-motion'
import ShowcasePanel from '../../components/auth/ShowcasePanel'

const pageVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}
const formContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const formItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}
const panelSlide = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 } },
}
const modeSwitch = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 20, transition: { duration: 0.18 } },
}

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState('oauth')
  const { signupByEmail, isSigningUp, googleLogin, isGoogleLoggingIn, facebookLogin, isFacebookLoggingIn } = useAuthStore()
  const navigate = useNavigate()

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLogin(tokenResponse.access_token);
        if (res && res.success) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Error is handled in the store
      }
    },
    onError: () => {
      console.log('Google Signup Failed');
    }
  });

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        const res = await facebookLogin(response.accessToken);
        if (res && res.success) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Error is handled in the store
      }
    } else {
      console.log('Facebook Signup Failed or Cancelled');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try {
      const res = await signupByEmail(form);
      if (res && res.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error is handled in the store
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-[8px] text-[13.5px] text-ghost outline-none transition-all duration-200"
  const inputStyle = { background: '#111111', border: '1px solid #2A2A2A', fontFamily: 'var(--font-sans)' }
  const oauthBtn = { background: '#141414', border: '1px solid #2A2A2A' }

  return (
    <motion.div className="h-screen flex overflow-hidden" variants={pageVariants} initial="hidden" animate="visible">

      {/* Left: Form */}
      <div className="w-full lg:w-[45%] h-full flex flex-col items-center justify-center px-8 relative overflow-y-auto" style={{ background: '#080808' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(57,255,20,0.04), transparent)' }} />

        <motion.div className="relative z-10 w-full max-w-[360px] flex flex-col gap-6" variants={formContainer} initial="hidden" animate="visible">

          <motion.div className="text-center" variants={formItem}>
            <h1 className="text-[24px] font-bold text-ghost tracking-tight mb-1">Create your account</h1>
            <p className="text-[13px] text-dim">Free to start. No credit card required.</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {mode === 'oauth' ? (
              <motion.div key="oauth" className="flex flex-col gap-3" variants={modeSwitch} initial="hidden" animate="visible" exit="exit">
                <motion.button onClick={() => handleGoogleLogin()} disabled={isGoogleLoggingIn} className="w-full py-3 rounded-[8px] flex items-center justify-center gap-3 text-[13.5px] font-medium text-ghost disabled:opacity-50" style={oauthBtn} whileHover={{ borderColor: '#3A3A3A', scale: isGoogleLoggingIn ? 1 : 1.01 }} whileTap={{ scale: isGoogleLoggingIn ? 1 : 0.98 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {isGoogleLoggingIn ? 'Logging in...' : 'Continue with Google'}
                </motion.button>

                <motion.button className="w-full py-3 rounded-[8px] flex items-center justify-center gap-3 text-[13.5px] font-medium text-ghost" style={oauthBtn} whileHover={{ borderColor: '#3A3A3A', scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.42.07 2.41.74 3.22.8 1.23-.26 2.41-.96 3.7-.84 1.58.17 2.77.83 3.54 2.1-3.23 1.98-2.67 5.9.51 7.08-.6 1.65-1.41 3.28-2.97 3.74zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </motion.button>

                <FacebookLogin
                  appId={import.meta.env.VITE_FACEBOOK_APP_ID || "100000000000000"}
                  scope="public_profile,email"
                  fields="name,email,picture"
                  onSuccess={(response) => responseFacebook(response)}
                  onFail={(error) => console.log('Facebook Signup Failed!', error)}
                  render={({ onClick, isDisabled }) => (
                    <motion.button onClick={onClick} disabled={isFacebookLoggingIn || isDisabled} className="w-full py-3 rounded-[8px] flex items-center justify-center gap-3 text-[13.5px] font-medium text-ghost disabled:opacity-50" style={oauthBtn} whileHover={{ borderColor: '#3A3A3A', scale: (isFacebookLoggingIn || isDisabled) ? 1 : 1.01 }} whileTap={{ scale: (isFacebookLoggingIn || isDisabled) ? 1 : 0.98 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      {isFacebookLoggingIn ? 'Logging in...' : 'Continue with Facebook'}
                    </motion.button>
                  )}
                />

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: '#1C1C1C' }} />
                  <span className="text-[10px] text-dimmer font-mono" style={{ fontFamily: 'var(--font-mono)' }}>or</span>
                  <div className="flex-1 h-px" style={{ background: '#1C1C1C' }} />
                </div>

                <motion.button onClick={() => setMode('email')} className="w-full py-3 rounded-[8px] flex items-center justify-center gap-3 text-[13.5px] font-medium text-ghost" style={oauthBtn} whileHover={{ borderColor: '#3A3A3A', scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>
                  Sign up with Email
                </motion.button>
              </motion.div>
            ) : (
              <motion.form key="email" onSubmit={handleSubmit} className="flex flex-col gap-3" variants={modeSwitch} initial="hidden" animate="visible" exit="exit">
                <motion.button type="button" onClick={() => setMode('oauth')} className="flex items-center gap-1.5 text-[12px] text-dim self-start mb-1" whileHover={{ x: -2, color: '#F5F5F5' }} transition={{ duration: 0.15 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back
                </motion.button>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Full name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className={inputCls} style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'} onBlur={e => e.target.style.borderColor = '#2A2A2A'} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className={inputCls} style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'} onBlur={e => e.target.style.borderColor = '#2A2A2A'} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required className={inputCls} style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'} onBlur={e => e.target.style.borderColor = '#2A2A2A'} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Password</label>
                  <div className="relative">
                    <input type={show ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required minLength={8} className={`${inputCls} pr-14`} style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'} onBlur={e => e.target.style.borderColor = '#2A2A2A'} />
                    <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-dimmer hover:text-dim" style={{ fontFamily: 'var(--font-mono)' }}>{show ? 'HIDE' : 'SHOW'}</button>
                  </div>
                </div>
                <motion.button type="submit" disabled={isSigningUp} className="btn-neon w-full py-3 text-[13.5px] font-bold rounded-[8px] mt-1 disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{ scale: isSigningUp ? 1 : 1.02 }} whileTap={{ scale: isSigningUp ? 1 : 0.97 }}>
                  {isSigningUp ? 'Creating account...' : 'Create account →'}
                </motion.button>
                <p className="text-center text-[11px] text-dimmer leading-[1.6]">
                  By signing up you agree to our{' '}
                  <Link to="#" className="underline hover:text-dim transition-colors">Terms</Link>{' '}&amp;{' '}
                  <Link to="#" className="underline hover:text-dim transition-colors">Privacy</Link>.
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.p className="text-center text-[12px] text-dim" variants={formItem}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#39FF14' }} className="font-semibold hover:underline">Log in</Link>
          </motion.p>
          <motion.p className="text-center text-[11px] text-dimmer leading-[1.6]" variants={formItem}>
            By continuing, I agree to the{' '}
            <Link to="#" className="underline hover:text-dim transition-colors">Privacy Policy</Link>{' '}and{' '}
            <Link to="#" className="underline hover:text-dim transition-colors">Terms of Use</Link>.
          </motion.p>
        </motion.div>
      </div>

      {/* Right: showcase */}
      <motion.div className="hidden lg:block lg:w-[55%] h-full" variants={panelSlide} initial="hidden" animate="visible">
        <ShowcasePanel />
      </motion.div>
    </motion.div>
  )
}

export default SignupPage
