import React, { useState, useEffect } from 'react';
import { Users, Shield, Menu, X, Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import { CitizenInterface } from './components/CitizenInterface';
import { AdminInterface } from './components/AdminInterface';
import { CentralAdminDashboard } from './components/CentralAdminDashboard';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { AuthModal } from './components/AuthModal';

// Mock user types
type UserRole = 'citizen' | 'admin' | 'central-admin' | null;

// Demo user database
const demoUsers = {
  citizen: [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'citizen' as const
    },
    {
      id: '2', 
      name: 'Maria Garcia',
      email: 'maria@example.com',
      role: 'citizen' as const
    }
  ],
  admin: [
    {
      id: 'admin1',
      name: 'Sarah Martinez', 
      email: 'admin@city.gov',
      role: 'admin' as const,
      department: 'Public Works'
    },
    {
      id: 'admin2',
      name: 'Mike Wilson',
      email: 'mike@city.gov', 
      role: 'admin' as const,
      department: 'Electrical Services'
    }
  ],
  'central-admin': [
    {
      id: 'central-admin-1',
      name: 'Sarah Johnson',
      email: 'central.admin@city.gov',
      role: 'central-admin' as const,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612a94c?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'central-admin-2',
      name: 'Michael Chen',
      email: 'system.admin@city.gov',
      role: 'central-admin' as const,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  ]
};

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'admin' | 'central-admin'>('citizen');

  // *START: ADDED CODE FOR ZOHO SALESIQ WIDGET*
  useEffect(() => {
    // 1. Initialize the global zoho object if it doesn't exist
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || { ready: function () {} };

    // 2. Create and append the script element
    const script = document.createElement('script');
    script.id = 'zsiqscript';
    script.src = "https://salesiq.zohopublic.in/widget?wc=siq7b15ece17fe19d8c68f07da098b929c8f0bddb9f78d1a12599405f3fe7f57211";
    script.defer = true;
    document.body.appendChild(script);

    // 3. Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
      // Optional: Clean up global state if necessary, but often left alone for widgets
      // delete window.$zoho; 
    };
  }, []); // Empty dependency array ensures this runs only once on mount
  // *END: ADDED CODE FOR ZOHO SALESIQ WIDGET*

  // Handle role selection (shows auth modal)
  const handleRoleSelection = (role: 'citizen' | 'admin' | 'central-admin') => {
    setSelectedRole(role);
    setShowAuthModal(true);
  };

  // Handle successful authentication
  const handleAuthLogin = (email: string, password: string) => {
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

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Report Issues</h3>
                <p className="text-gray-600 text-sm">Citizens can easily report potholes, broken streetlights, and other civic issues with photos and location data</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-gray-600 text-sm">Real-time updates on issue status from submission to resolution</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Menu className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Admin Dashboard</h3>
                <p className="text-gray-600 text-sm">Municipal staff can manage issues, route to departments, and track analytics</p>
              </CardContent>
            </Card>
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
