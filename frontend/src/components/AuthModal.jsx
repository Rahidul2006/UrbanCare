import { useState } from 'react';
import { X, Eye, EyeOff, Loader2, User, Shield } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';

// Demo credentials
const demoCredentials = {
  citizen: [
    { email: 'alex@example.com', password: 'demo123', name: 'Alex Johnson' },
    { email: 'maria@example.com', password: 'demo123', name: 'Maria Garcia' }
  ],
  admin: [
    { email: 'admin@city.gov', password: 'demo123', name: 'Sarah Martinez' },
    { email: 'mike@city.gov', password: 'demo123', name: 'Mike Wilson' }
  ],
  'central-admin': [
    { email: 'central.admin@city.gov', password: 'demo123', name: 'Sarah Johnson' },
    { email: 'system.admin@city.gov', password: 'demo123', name: 'Michael Chen' }
  ]
};

export function AuthModal({ isOpen, userRole, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    // Demo authentication - check credentials
    const credentials = demoCredentials[userRole];
    const validUser = credentials.find(
      cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );

    if (!validUser) {
      setError('Invalid email or password');
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 800);
  };

  const fillDemoCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError('');
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              {userRole === 'citizen' ? (
                <User className="w-6 h-6 text-white" />
              ) : (
                <Shield className="w-6 h-6 text-white" />
              )}
            </div>
            <CardTitle className="text-xl">
              {userRole === 'citizen' ? 'Citizen Login' : 
               userRole === 'central-admin' ? 'Central Admin Login' : 'Municipal Staff Login'}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Please enter your credentials to continue
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-10"
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
                  placeholder="    Enter your password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              className="w-full h-10"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 text-center mb-3">Demo Credentials:</p>
            <div className="space-y-2">
              {demoCredentials[userRole].map((cred, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillDemoCredentials(cred.email)}
                  className="w-full p-2 text-left text-xs bg-gray-50 hover:bg-gray-100 rounded "
                >
                  <div className="font-medium">{cred.name}</div>
                  <div className="text-gray-600">{cred.email} / demo123</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
