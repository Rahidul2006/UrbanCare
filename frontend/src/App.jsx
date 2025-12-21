import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './components/button';
import { CitizenInterface } from './components/CitizenInterface';
import { AdminInterface } from './components/AdminInterface';
import { CentralAdminDashboard } from './components/CentralAdminDashboard';
import { Badge } from './components/badge';
import { AuthPage } from './components/AuthPage';
import { roleColors, getLandingGradient } from './utils/roleColors';

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Handle successful authentication from AuthPage
  const handleAuthLogin = (email, password, role, userData) => {
    // Create user object from authentication response
    const user = userData || {
      id: `${role}-${Date.now()}`,
      name: email.split('@')[0], // Fallback name from email
      email: email.toLowerCase(),
      role: role,
      department: role === 'admin' ? 'Municipal Services' : undefined
    };
    
    setCurrentUser(user);
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
  };

  // Landing page when not logged in
  if (!userRole) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getLandingGradient('citizen')} flex items-center justify-center p-4`}>
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              UrbanCare
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Empowering communities to report civic issues and enabling municipalities to respond efficiently
            </p>
          </div>

          {/* Authentication Form */}
          <AuthPage onLogin={handleAuthLogin} />
        </div>
      </div>
    );
  }

  // Render the appropriate interface based on user role
  if (userRole === 'central-admin') {
    // Central Admin uses its own layout with integrated header
    return <CentralAdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  const roleColorScheme = roleColors[userRole];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`${roleColorScheme.header} text-white shadow-lg border-b`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">UrbanCare</h1>
              <Badge className={`${roleColorScheme.badge} font-semibold`}>
                {userRole === 'admin' ? 'Municipal Staff' : 'Citizen'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/90">
                Welcome, {currentUser?.name}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white text-white hover:bg-white/20"
                onClick={handleLogout}
              >
                <X className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {userRole === 'citizen' && <CitizenInterface currentUser={currentUser} />}
      {userRole === 'admin' && <AdminInterface currentUser={currentUser} />}
    </div>
  );
}
