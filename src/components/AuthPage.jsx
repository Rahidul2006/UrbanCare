import { useState } from 'react';
import { Eye, EyeOff, Loader2, User, Shield, Settings, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { roleColors } from '../utils/roleColors';

const API_BASE_URL = 'http://localhost:5000';

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

      // Success
      onLogin(email.toLowerCase(), password, activeTab);
      setIsLoading(false);
    } catch (err) {
      setError('Error connecting to server. Make sure backend is running on port 5000.');
      setIsLoading(false);
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
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-2xl overflow-hidden">
        {/* Gradient Header */}
        <div className={`${colors.bg} p-8 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">UrbanCare</h2>
                <p className="text-white/80 text-sm">{isRegister ? 'Create Account' : 'Welcome Back'}</p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="citizen">Citizen</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="central-admin">Central Admin</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition"
                  disabled={isLoading}
                />
              </div>
            )}

            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your mobile number (10+ digits)"
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full h-11 ${colors.button} text-white font-semibold transition`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Register/Login Toggle for Citizen */}
          {activeTab === 'citizen' && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-semibold transition"
                  disabled={isLoading}
                >
                  {isRegister ? 'Sign In' : 'Register Now'}
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center hover:bg-white/20 transition">
          <User className="w-8 h-8 mx-auto mb-2 text-blue-300" />
          <h3 className="font-semibold mb-1">Report Issues</h3>
          <p className="text-sm text-white/70">Help improve your community</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center hover:bg-white/20 transition">
          <Shield className="w-8 h-8 mx-auto mb-2 text-amber-300" />
          <h3 className="font-semibold mb-1">Manage Issues</h3>
          <p className="text-sm text-white/70">Track and resolve problems</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center hover:bg-white/20 transition">
          <Settings className="w-8 h-8 mx-auto mb-2 text-purple-300" />
          <h3 className="font-semibold mb-1">Monitor System</h3>
          <p className="text-sm text-white/70">Centralized administration</p>
        </div>
      </div>
    </div>
  );
}
