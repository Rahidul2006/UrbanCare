import React, { useState, useEffect } from 'react';
import { Users, Shield, Menu, X, Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import { CitizenInterface } from './components/CitizenInterface';

// --- Placeholder demo data / types (replace with your real data) ---
type Role = 'citizen' | 'admin' | 'central-admin';

interface DemoUser {
  id: string;
  name: string;
  email: string;
}

const demoUsers: Record<Role, DemoUser[]> = {
  citizen: [
    { id: 'c1', name: 'Citizen One', email: 'citizen1@example.com' },
  ],
  admin: [
    { id: 'a1', name: 'Admin One', email: 'admin1@example.com' },
  ],
  'central-admin': [
    { id: 'ca1', name: 'Central Admin', email: 'central@example.com' },
  ],
};

// ------------------------------------------------------------------
export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('citizen');
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);

  // NOTE: Zoho SalesIQ widget integration has been REMOVED as requested.

  // Handle role selection (shows auth modal)
  const handleRoleSelection = (role: Role) => {
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
    } else {
      // You can add error handling / toasts here
      console.warn('No user found for', email, 'in role', selectedRole);
    }
  };

  // Handle auth modal close
  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-surface-1 text-foreground">
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users />
          <h1 className="text-xl font-semibold">UrbanCare</h1>
        </div>

        <nav className="flex items-center gap-2">
          <Button onClick={() => handleRoleSelection('citizen')}>Citizen</Button>
          <Button onClick={() => handleRoleSelection('admin')}>Admin</Button>
          <Button onClick={() => handleRoleSelection('central-admin')}>Central Admin</Button>
        </nav>
      </header>

      <main className="p-4">
        {/* Render your main app UI here. Example: */}
        {currentUser ? (
          <div>
            <p>Welcome back, {currentUser.name} ({userRole})</p>
            {/* Render CitizenInterface or other components based on role */}
            {userRole === 'citizen' && <CitizenInterface user={currentUser} />}
          </div>
        ) : (
          <div>
            <p>Please select a role and sign in.</p>
          </div>
        )}
      </main>

      {/* Auth modal mockup - replace with your actual modal component */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium">Sign in as {selectedRole}</h2>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement & {
                  email: HTMLInputElement;
                  password: HTMLInputElement;
                };
                handleAuthLogin(form.email.value, form.password.value);
              }}
              className="mt-4 flex flex-col gap-3"
            >
              <input name="email" placeholder="Email" className="input" />
              <input name="password" type="password" placeholder="Password" className="input" />

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" onClick={handleAuthClose}>Close</Button>
                <Button type="submit">Sign in</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
