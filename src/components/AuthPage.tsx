import React, { useState } from 'react';
import { Mail, Phone, User, Calendar, Lock, ShieldCheck, Heart } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: UserType) => void;
  registeredUsers: UserType[];
  onRegisterUser: (user: UserType) => void;
}

export default function AuthPage({ onAuthSuccess, registeredUsers, onRegisterUser }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  
  // Signup State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signin State
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !age || !phone || !email || !password) {
      setError('Please fill in all standard registration fields.');
      return;
    }

    const ageNum = parseInt(age);
    if (!ageNum || ageNum < 1 || ageNum > 125) {
      setError('Please enter a valid age boundary (1-125).');
      return;
    }

    // Check if email already registered
    const exists = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setError('This email is already registered on GuardianBeacon.');
      return;
    }

    const newUser: UserType = {
      id: 'user-' + Date.now(),
      name,
      age: ageNum,
      phoneNumber: phone,
      email: email.toLowerCase(),
      isVerified: false,
      idVerified: false
    };

    onRegisterUser(newUser);
    setSuccess('Registration successful! Redirecting you to complete your verification...');
    
    setTimeout(() => {
      onAuthSuccess(newUser);
    }, 1500);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signinEmail || !signinPassword) {
      setError('Please provide your login credentials.');
      return;
    }

    // Search in user pool
    const userMatched = registeredUsers.find(u => u.email.toLowerCase() === signinEmail.toLowerCase());
    if (userMatched) {
      setSuccess(`Welcome back, ${userMatched.name}! Logging you in...`);
      setTimeout(() => {
        onAuthSuccess(userMatched);
      }, 1000);
    } else {
      // Fallback: Create dynamic mock user to ensure smooth UX even if they use standard email
      const dynamicUser: UserType = {
        id: 'user-' + Date.now(),
        name: signinEmail.split('@')[0].toUpperCase(),
        age: 30,
        phoneNumber: '+1 (555) 000-0000',
        email: signinEmail.toLowerCase(),
        isVerified: false,
        idVerified: false
      };
      
      onRegisterUser(dynamicUser);
      setSuccess(`Account registered automatically for demonstration. Welcome, ${dynamicUser.name}!`);
      setTimeout(() => {
        onAuthSuccess(dynamicUser);
      }, 1500);
    }
  };

  return (
    <div className="mx-auto max-w-md my-12 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl text-left">
        {/* Branding Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-custom/10 text-primary-custom">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            {isSignUp ? 'Create Emergency Account' : 'Sign In to Dashboard'}
          </h2>
          <p className="text-xs text-slate-500">
            {isSignUp 
              ? 'Join GuardianBeacon to register emergency descriptors.' 
              : 'Access your profile node and dispatch immediate alerts.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-alert-custom border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 border border-emerald-100 animate-pulse">
            {success}
          </div>
        )}

        {isSignUp ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-primary-custom focus:ring-1 focus:ring-primary-custom focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="125"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs font-medium focus:border-primary-custom focus:ring-1 focus:ring-primary-custom focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-xs font-medium focus:border-primary-custom focus:ring-1 focus:ring-primary-custom focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-primary-custom focus:ring-1 focus:ring-primary-custom focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-primary-custom focus:ring-1 focus:ring-primary-custom focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary-custom py-3 text-xs font-bold text-white shadow-md hover:bg-teal-800 transition"
            >
              Register & Begin Safe Setup
            </button>
          </form>
        ) : (
          /* SIGNIN FORM */
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-primary-custom focus:ring-1 focus:ring-primary-custom focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-primary-custom focus:ring-1 focus:ring-primary-custom focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary-custom py-3 text-xs font-bold text-white shadow-md hover:bg-teal-800 transition"
            >
              Sign In to Safe Environment
            </button>
          </form>
        )}

        {/* Toggles */}
        <div className="mt-6 text-center text-xs">
          {isSignUp ? (
            <p className="text-slate-500">
              Already have an emergency account?{' '}
              <button 
                onClick={() => setIsSignUp(false)} 
                className="font-bold text-primary-custom hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-slate-500">
              New to GuardianBeacon?{' '}
              <button 
                onClick={() => setIsSignUp(true)} 
                className="font-bold text-primary-custom hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Informative Guidance Drawer */}
        <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-3">
          <div className="flex items-start space-x-2">
            <Heart className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Anticipatory Family Protection</span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Signing up registers you in our local crisis pool. If a teammate or loved one needs to file an urgent missing report on your behalf later, they can instantly tag your profile to autofill your high-definition photo, real-time location metrics, and physical tags.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
