import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  CheckCircle2, 
  LogOut, 
  AlertCircle, 
  ShieldCheck, 
  CloudCheck,
  Eye,
  EyeOff,
  Sprout
} from 'lucide-react';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  loginAsGuest,
  resetPassword,
  logoutUser, 
  type User 
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  savedScansCount?: number;
}

export function AuthModal({
  isOpen,
  onClose,
  user,
  savedScansCount = 0
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await loginWithGoogle();
      setSuccessMsg('Successfully signed in with Google! Your scans are synced.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.warn('Google sign in result:', err);
      const code = err?.code || '';
      const msg = err?.message || '';

      // Gracefully handle user closing popup or canceling - DO NOT show red error banner
      if (
        code === 'auth/popup-closed-by-user' || 
        code === 'auth/cancelled-popup-request' ||
        msg.includes('popup-closed-by-user') ||
        msg.includes('cancelled-popup-request')
      ) {
        // User closed the popup, silently clear any stale error
        setErrorMsg(null);
        return;
      }

      if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
        setErrorMsg('Browser popup was blocked. Please enable popups or use Email login.');
        return;
      }

      if (code === 'auth/network-request-failed') {
        setErrorMsg('Network error. Please check your internet connection.');
        return;
      }

      setErrorMsg(err.message || 'Google sign-in could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await loginAsGuest();
      setSuccessMsg('Signed in as Guest Caretaker! Your scans will sync to cloud.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Guest sign in error:', err);
      setErrorMsg('Could not start guest session. Please try email login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Please enter your email above to receive a password reset link.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await resetPassword(email);
      setSuccessMsg('Password reset link sent to your email!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send reset email. Verify your address.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        setSuccessMsg('Welcome back! Cloud backup is active.');
      } else {
        await registerWithEmail(email, password, displayName || undefined);
        setSuccessMsg('Account created successfully! Your scans are now backed up.');
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = err.message || 'Authentication failed.';
      if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
        message = 'Invalid email or password. Please check and try again.';
      } else if (message.includes('auth/email-already-in-use')) {
        message = 'An account with this email already exists. Try signing in.';
      } else if (message.includes('auth/weak-password')) {
        message = 'Password should be at least 6 characters.';
      } else if (message.includes('auth/user-not-found')) {
        message = 'No account found with this email. Click Sign Up to create one.';
      }
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await logoutUser();
      setSuccessMsg('Signed out successfully.');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMsg('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[6px] animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Transparent UI Glass Container - Exactly matching reference image */}
      <div 
        className="relative w-full max-w-[390px] rounded-[28px] overflow-hidden border border-white/25 shadow-2xl transition-all"
        style={{
          background: 'rgba(255, 255, 255, 0.09)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top frosted glow */}
        <div className="absolute -top-10 left-1/4 right-1/4 h-24 bg-white/10 blur-2xl pointer-events-none rounded-full" />

        {/* Top Floating Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-90 group"
            title="Close"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Modal Inner Content */}
        <div className="p-7 sm:p-8">
          {user ? (
            /* Logged-In User Profile State */
            <div className="text-center space-y-5 py-1">
              <div className="relative inline-block mx-auto">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-20 h-20 rounded-full border-2 border-white/40 object-cover shadow-lg mx-auto"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center text-white text-2xl font-black shadow-lg mx-auto backdrop-blur-md">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-zinc-950 border-2 border-zinc-900 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {user.displayName || (user.isAnonymous ? 'Guest Caretaker' : 'Plant Caretaker')}
                </h3>
                <p className="text-xs text-white/70 font-mono mt-0.5">
                  {user.email || (user.isAnonymous ? 'Anonymous Cloud Session' : 'Synced User')}
                </p>
              </div>

              {/* Cloud Sync Status Pill */}
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 border border-white/30">
                  <CloudCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">Cloud Backup Active</p>
                  <p className="text-[11px] text-white/70 truncate">
                    {savedScansCount > 0 
                      ? `${savedScansCount} plant disease scans synced to your account` 
                      : 'All new plant disease predictions save automatically'}
                  </p>
                </div>
              </div>

              {successMsg && (
                <div className="p-2.5 rounded-xl bg-white/20 border border-white/40 text-white text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/30 text-zinc-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/25 text-white border border-white/20 hover:border-white/40 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 backdrop-blur-md"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          ) : (
            /* Login / Sign Up Form State */
            <div>
              {/* Header Title: Welcome */}
              <div className="text-center mb-6 pt-2">
                <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-wide">
                  Welcome
                </h2>
              </div>

              {/* Status Messages */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-zinc-900/80 border border-white/30 text-zinc-100 text-xs flex items-center gap-2 backdrop-blur-md animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-zinc-300" />
                  <span className="leading-snug">{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-white/20 border border-white/35 text-white text-xs flex items-center gap-2 backdrop-blur-md animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/15 focus:border-white/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md transition-all shadow-inner"
                    />
                  </div>
                )}

                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/15 focus:border-white/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md transition-all shadow-inner"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-5 pr-11 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/15 focus:border-white/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-widest uppercase bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  {isLoading ? 'PLEASE WAIT...' : (mode === 'signin' ? 'LOGIN' : 'SIGN UP')}
                </button>

                {/* Helper Links: Forgot Password ? on left, Sign Up on right */}
                <div className="flex items-center justify-between text-xs text-white/80 pt-1 font-normal">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot Password ?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'signin' ? 'signup' : 'signin');
                      setErrorMsg(null);
                    }}
                    className="hover:text-white font-medium transition-colors cursor-pointer"
                  >
                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                  </button>
                </div>
              </form>

              {/* Divider: OR LOGIN WITH */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <span className="relative px-3 text-[10px] tracking-widest uppercase text-white/70 font-sans">
                  OR LOGIN WITH
                </span>
              </div>

              {/* Social Login Buttons: Frosted Circles (Google & Guest Cloud) */}
              <div className="flex items-center justify-center gap-4">
                {/* Google Sign In Circular Button (Matching Reference Image) */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  title="Sign in with Google"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 backdrop-blur-md group"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </button>

                {/* Instant Guest / Demo Cloud Sync Button */}
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={isLoading}
                  title="Instant Guest Cloud Sync (No popup needed)"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/25 hover:border-white/50 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 backdrop-blur-md"
                >
                  <Sprout className="w-5 h-5" />
                </button>
              </div>

              {/* Gentle note about instant cloud backup */}
              <p className="text-[11px] text-center text-white/60 mt-4">
                Google or 1-tap Guest sync your plant scans safely to cloud
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
