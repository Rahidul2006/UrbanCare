import { useState } from 'react';
import { Eye, EyeOff, Loader2, User, Shield, Settings, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { roleColors } from '../utils/roleColors';

const API_BASE_URL = 'http://localhost:5000';

// Demo credentials - hardcoded for offline/dev mode when server is not running
const demoCredentials = {
  citizen: [
    { email: 'alex@example.com', password: 'demo123', name: 'Alex Johnson', mobile: '9876543210' },
    { email: 'maria@example.com', password: 'demo123', name: 'Maria Garcia', mobile: '9876543211' }
  ],
  admin: [
    { email: 'admin@city.gov', password: 'demo123', name: 'Sarah Martinez', mobile: '1234567890' },
    { email: 'mike@city.gov', password: 'demo123', name: 'Mike Wilson', mobile: '1234567891' }
  ],
  'central-admin': [
    { email: 'central.admin@city.gov', password: 'demo123', name: 'Sarah Johnson', mobile: '1234567892' },
    { email: 'system.admin@city.gov', password: 'demo123', name: 'Michael Chen', mobile: '1234567893' }
  ]
};

export function AuthPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setMobileNumber('');
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
    setIsRegister(false);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile) => {
    const cleanMobile = mobile.replace(/\D/g, '');
    return cleanMobile.length >= 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (isRegister && !fullName) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    if (isRegister && !mobileNumber) {
      setError('Please enter your mobile number');
      setIsLoading(false);
      return;
    }

    if (isRegister && !validateMobile(mobileNumber)) {
      setError('Please enter a valid mobile number (at least 10 digits)');
      setIsLoading(false);
      return;
    }

    if (isRegister && activeTab === 'citizen') {
      // Register as citizen
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password,
            name: fullName,
            mobile: mobileNumber
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Registration failed');
          setIsLoading(false);
          return;
        }

        setSuccessMessage('Registration successful! You can now login.');
        setIsRegister(false);
        setEmail('');
        setPassword('');
        setFullName('');
        setMobileNumber('');
        setIsLoading(false);
      } catch (err) {
        setError('Error connecting to server. Make sure backend is running on port 5000.');
        setIsLoading(false);
      }
      return;
    }

    // Login
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
          role: activeTab
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Success - pass the user data from the API response
      onLogin(email.toLowerCase(), password, activeTab, data.user);
      setIsLoading(false);
    } catch (err) {
      // Fallback to demo credentials when server is not running
      const credentials = demoCredentials[activeTab];
      const validUser = credentials.find(
        cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );

      if (validUser) {
        // Demo login successful - simulate API delay
        setTimeout(() => {
          setSuccessMessage('Demo login successful! (Server not running)');
          onLogin(email.toLowerCase(), password, activeTab, {
            id: Math.random().toString(36).substr(2, 9),
            email: validUser.email,
            name: validUser.name,
            role: activeTab,
            mobile: validUser.mobile
          });
          setIsLoading(false);
        }, 800);
      } else {
        setError('Server not running. Please use demo credentials: alex@example.com / demo123 for citizen, admin@city.gov / demo123 for admin, or central.admin@city.gov / demo123 for central admin. Password: demo123');
        setIsLoading(false);
      }
    }
  };

  const tabConfig = {
    citizen: { icon: User, label: 'Citizen', colors: roleColors.citizen },
    admin: { icon: Shield, label: 'Admin', colors: roleColors.admin },
    'central-admin': { icon: Settings, label: 'Central Admin', colors: roleColors['central-admin'] }
  };

  const currentConfig = tabConfig[activeTab];
  const IconComponent = currentConfig.icon;
  const colors = currentConfig.colors;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop")',
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/50 to-purple-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Animated Blur Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:border-white/30">
          {/* Gradient Header */}
          <div className={`relative overflow-hidden px-8 py-12 ${colors.bg}`}>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              }}></div>
            </div>
            
            <div className="relative text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30 transform transition-transform duration-300 hover:scale-110">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">UrbanCare</h1>
              <p className="text-white/70 text-sm font-medium">{isRegister ? 'Create Your Account' : 'Welcome Back'}</p>
            </div>
          </div>

          <div className="px-8 py-8">
            {/* Role Tabs - Modern Design */}
            <div className="flex gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur">
              {['citizen', 'admin', 'central-admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleTabChange(role)}
                  className={`flex-1 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeTab === role
                      ? 'bg-white text-slate-900 shadow-lg scale-105'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {role === 'central-admin' ? 'Central' : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>

            {/* Demo Credentials Quick Access - visible when not registering */}
            {/* {!isRegister && (
              <div className="mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur">
                <p className="text-blue-100 text-xs font-semibold mb-2">📌 Demo Credentials (Server Offline Mode):</p>
                <div className="space-y-1">
                  {demoCredentials[activeTab].map((cred, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setEmail(cred.email);
                        setPassword(cred.password);
                        setError('');
                      }}
                      className="w-full text-left text-blue-200 text-xs p-2 rounded hover:bg-blue-500/20 transition flex justify-between items-center group"
                    >
                      <span className="font-mono">{cred.email}</span>
                      <span className="text-blue-300/50 group-hover:text-blue-300 text-xs">click to fill</span>
                    </button>
                  ))}
                  <p className="text-blue-200/60 text-xs pt-1 border-t border-blue-500/20 mt-1">Password for all: <span className="font-mono font-bold">demo123</span></p>
                </div>
              </div>
            )} */}

            {/* Alert Messages */}
            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 backdrop-blur flex items-start gap-3 animate-in slide-in-from-top-2">
                <div className="w-5 h-5 rounded-full bg-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 backdrop-blur flex items-start gap-3 animate-in slide-in-from-top-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-100 text-sm">{successMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition backdrop-blur"
                    disabled={isLoading}
                  />
                </div>
              )}

              {isRegister && (
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="10+ digits"
                    className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition backdrop-blur"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition backdrop-blur"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition backdrop-blur pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                  colors.button
                } shadow-lg hover:shadow-xl disabled:opacity-50`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isRegister ? 'Creating...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {isRegister ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Register/Login Toggle */}
            {activeTab === 'citizen' && (
              <div className="mt-6 text-center">
                <p className="text-white/70 text-sm">
                  {isRegister ? "Already have an account? " : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-white font-semibold hover:text-blue-300 transition"
                    disabled={isLoading}
                  >
                    {isRegister ? 'Sign In' : 'Register'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid Below Card */}
        <div className="grid grid-cols-3 gap-3 mt-10">
          <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
            <User className="w-6 h-6 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
            <p className="text-white/70 text-xs font-medium">Report</p>
          </div>
          <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
            <Shield className="w-6 h-6 mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
            <p className="text-white/70 text-xs font-medium">Manage</p>
          </div>
          <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
            <Settings className="w-6 h-6 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
            <p className="text-white/70 text-xs font-medium">Monitor</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-from-top-2 {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in.slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.3s ease-out;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
}
