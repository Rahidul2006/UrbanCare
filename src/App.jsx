import { useState } from 'react';
import { Users, Shield, Menu, X, Settings } from 'lucide-react';
import { Button } from './components/button';
import { CitizenInterface } from './components/CitizenInterface';
import { AdminInterface } from './components/AdminInterface';
import { CentralAdminDashboard } from './components/CentralAdminDashboard';
import { Card, CardContent } from './components/card';
import { Badge } from './components/badge';
import { AuthModal } from './components/AuthModal';

// Mock user types and data
const demoUsers = {
  citizen: [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'citizen'
    },
    {
      id: '2', 
      name: 'Maria Garcia',
      email: 'maria@example.com',
      role: 'citizen'
    }
  ],
  admin: [
    {
      id: 'admin1',
      name: 'Sarah Martinez', 
      email: 'admin@city.gov',
      role: 'admin',
      department: 'Public Works'
    },
    {
      id: 'admin2',
      name: 'Mike Wilson',
      email: 'mike@city.gov', 
      role: 'admin',
      department: 'Electrical Services'
    }
  ],
  'central-admin': [
    {
      id: 'central-admin-1',
      name: 'Sarah Johnson',
      email: 'central.admin@city.gov',
      role: 'central-admin',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612a94c?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'central-admin-2',
      name: 'Michael Chen',
      email: 'system.admin@city.gov',
      role: 'central-admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  ]
};

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('citizen');

  // Handle role selection (shows auth modal)
  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowAuthModal(true);
  };

  // Handle successful authentication
  const handleAuthLogin = (email, password) => {
    // Find user by email in the selected role group
    const users = demoUsers[selectedRole];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      setCurrentUser(user);
      setUserRole(selectedRole);
      setShowAuthModal(false);
    }
  };

  // Handle auth modal close
  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
  };

  // Landing page when not logged in
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UrbanCare
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empowering communities to report civic issues and enabling municipalities to respond efficiently
            </p>
          </div>

          
          {/* Login Options */}
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl text-center text-gray-900 mb-6">Choose Your Role</h2>
            
            <Button 
              onClick={() => handleRoleSelection('citizen')}
              className="w-full h-14 text-lg"
              variant="default"
            >
              <Users className="w-5 h-5 mr-2" />
              Continue as Citizen
            </Button>

            <Button 
              onClick={() => handleRoleSelection('admin')}
              className="w-full h-14 text-lg"
              variant="outline"
            >
              <Shield className="w-5 h-5 mr-2" />
              Municipal Staff Login
            </Button>

            <Button 
              onClick={() => handleRoleSelection('central-admin')}
              className="w-full h-14 text-lg"
              variant="secondary"
            >
              <Settings className="w-5 h-5 mr-2" />
              Central Admin Login
            </Button>


            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Demo application - Choose any role to explore</p>
            </div>
          </div>

          
        </div>
        
        {/* Authentication Modal */}
        <AuthModal
          isOpen={showAuthModal}
          userRole={selectedRole}
          onClose={handleAuthClose}
          onLogin={handleAuthLogin}
        />
      </div>
    );
  }

  // Render the appropriate interface based on user role
  if (userRole === 'central-admin') {
    // Central Admin uses its own layout with integrated header
    return <CentralAdminDashboard currentUser={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">UrbanCare</h1>
              <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                {userRole === 'admin' ? 'Municipal Staff' : 'Citizen'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser?.name}
              </span>
              <Button 
                variant="outline" 
                size="sm"
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
