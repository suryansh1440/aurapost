import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import ShowcasePanel from "../../components/auth/ShowcasePanel";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};
const formContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const formItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};
const panelSlide = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 } },
};
const modeSwitch = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.18 } },
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPassword, verifyOtp, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-[8px] text-[13.5px] text-ghost outline-none transition-all duration-200"
  const inputStyle = { background: '#111111', border: '1px solid #2A2A2A', fontFamily: 'var(--font-sans)' }

  return (
    <motion.div className="h-screen flex overflow-hidden" variants={pageVariants} initial="hidden" animate="visible">
      
      {/* Left: Form */}
      <div className="w-full lg:w-[45%] h-full flex flex-col items-center justify-center px-8 relative overflow-y-auto" style={{ background: '#080808' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(57,255,20,0.04), transparent)' }} />

        <motion.div className="relative z-10 w-full max-w-[360px] flex flex-col gap-6" variants={formContainer} initial="hidden" animate="visible">
          
          <motion.div className="text-center" variants={formItem}>
            <h1 className="text-[24px] font-bold text-ghost tracking-tight mb-1">
              {step === 1 && "Reset Password"}
              {step === 2 && "Verification"}
              {step === 3 && "New Credentials"}
            </h1>
            <p className="text-[13px] text-dim">
              {step === 1 && "Enter your email to receive a code."}
              {step === 2 && `We've sent an OTP to ${email}`}
              {step === 3 && "Secure your account with a new password."}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1" 
                onSubmit={handleSendOtp} 
                className="flex flex-col gap-4"
                variants={modeSwitch}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    required 
                    className={inputCls} 
                    style={inputStyle} 
                    onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'} 
                    onBlur={e => e.target.style.borderColor = '#2A2A2A'} 
                  />
                </div>
                <motion.button 
                  type="submit" 
                  disabled={isLoading} 
                  className="btn-neon w-full py-3 text-[13.5px] font-bold rounded-[8px] mt-1 disabled:opacity-50"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }} 
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                >
                  {isLoading ? 'Sending...' : 'Send OTP →'}
                </motion.button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2" 
                onSubmit={handleVerifyOtp} 
                className="flex flex-col gap-4"
                variants={modeSwitch}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-dim" style={{ fontFamily: 'var(--font-mono)' }}>One-Time Password</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="000000" 
                    required 
                    className={`${inputCls} text-center tracking-[8px] text-[20px]`}
                    style={inputStyle} 
                    onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'} 
                    onBlur={e => e.target.style.borderColor = '#2A2A2A'} 
                  />
                </div>
                <motion.button 
                  type="submit" 
                  disabled={isLoading} 
                  className="btn-neon w-full py-3 text-[13.5px] font-bold rounded-[8px] mt-1 disabled:opacity-50"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }} 
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code →'}
                </motion.button>
                <button type="button" onClick={() => setStep(1)} className="text-[12px] text-dim hover:text-ghost transition-colors mt-2 underline">Change Email</button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form 
                key="step3" 
                onSubmit={handleResetPassword} 
                className="flex flex-col gap-4"
                variants={modeSwitch}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-dim" style={{ fontFamily: 'var(--font-mono)' }}>New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className={inputCls} 
                    style={inputStyle} 
                    onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'} 
                    onBlur={e => e.target.style.borderColor = '#2A2A2A'} 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-dim" style={{ fontFamily: 'var(--font-mono)' }}>Confirm Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className={inputCls} 
                    style={inputStyle} 
                    onFocus={e => e.target.style.borderColor = 'rgba(57,255,20,0.5)'} 
                    onBlur={e => e.target.style.borderColor = '#2A2A2A'} 
                  />
                </div>
                <motion.button 
                  type="submit" 
                  disabled={isLoading} 
                  className="btn-neon w-full py-3 text-[13.5px] font-bold rounded-[8px] mt-1 disabled:opacity-50"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }} 
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password →'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div className="text-center" variants={formItem}>
            <Link to="/login" className="text-[12px] text-dim hover:text-ghost transition-colors">
              Back to Login
            </Link>
          </motion.div>

        </motion.div>
      </div>

      {/* Right: showcase */}
      <motion.div className="hidden lg:block lg:w-[55%] h-full" variants={panelSlide} initial="hidden" animate="visible">
        <ShowcasePanel />
      </motion.div>

    </motion.div>
  );
};

export default ForgotPasswordPage;
