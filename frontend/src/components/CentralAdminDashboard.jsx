import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { 
  LogOut, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Activity,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { centralAdminIssues, centralAdminAnalytics, centralAdminDepartments } from '../data/centralAdminData';
import { CentralAdminAnalytics } from './CentralAdminAnalytics';
import { IssueManagement } from './IssueManagement';
import { format } from 'date-fns';

export function CentralAdminDashboard({ currentUser, onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch issues and stats from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all issues
        const issuesResponse = await fetch('http://localhost:5000/api/issues');
        const issuesData = await issuesResponse.json();
        
        if (issuesData.success) {
          setIssues(issuesData.issues);
        }

        // Fetch stats
        const statsResponse = await fetch('http://localhost:5000/api/issues/stats/overview');
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats(statsData.stats);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fall back to initial data if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle issue updates
  const handleIssueUpdate = (updatedIssue) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'issues', label: 'All Issues', icon: '🔍' },
    { id: 'departments', label: 'Departments', icon: '🏢' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Urgent Issues Alert */}
      {issues.filter(i => i.priority === 'urgent' && i.status !== 'resolved' && i.status !== 'closed').length > 0 && (
        <Card className="border-0 bg-gradient-to-r from-red-50 to-orange-50 shadow-md overflow-hidden">
          <CardHeader className="pb-4 border-b border-red-100">
            <CardTitle className="flex items-center gap-3 text-red-900">
              <div className="bg-red-600 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              Urgent Issues Requiring Immediate Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {issues.filter(i => i.priority === 'urgent' && i.status !== 'resolved' && i.status !== 'closed').slice(0, 3).map(issue => (
                <div key={issue.id} className="bg-white p-4 rounded-lg border border-red-100 hover:border-red-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{issue.location.address}</p>
                      <Badge className="bg-red-600 hover:bg-red-700 text-white">Urgent</Badge>
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap">{issue.assignedDepartment}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-5 md:p-6 bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-blue-100">Total Issues</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">{centralAdminAnalytics.totalIssues}</p>
              </div>
              <div className="bg-white/20 p-2 md:p-3 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-blue-100 mt-4">
              <span className="font-semibold">↗ 12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-5 md:p-6 bg-gradient-to-br from-green-500 to-green-600">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-green-100">Resolved</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">{centralAdminAnalytics.resolvedIssues}</p>
              </div>
              <div className="bg-white/20 p-2 md:p-3 rounded-lg flex-shrink-0">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-green-100 mt-4">
              Rate: <span className="font-semibold">{Math.round((centralAdminAnalytics.resolvedIssues / centralAdminAnalytics.totalIssues) * 100)}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-5 md:p-6 bg-gradient-to-br from-orange-500 to-orange-600">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-orange-100">Avg Resolution</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">{centralAdminAnalytics.averageResolutionTime}d</p>
              </div>
              <div className="bg-white/20 p-2 md:p-3 rounded-lg flex-shrink-0">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-orange-100 mt-4">
              <span className="font-semibold">↘ 0.5d</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-5 md:p-6 bg-gradient-to-br from-purple-500 to-purple-600">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-purple-100">Active Users</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">2.4k</p>
              </div>
              <div className="bg-white/20 p-2 md:p-3 rounded-lg flex-shrink-0">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-purple-100 mt-4">
              <span className="font-semibold">↗ 8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Issues */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white border-b">
              <CardTitle className="text-base md:text-lg">Recent Issues Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6 space-y-2 md:space-y-3">
              {issues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="flex gap-3 md:gap-4 items-start">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {issue.images && issue.images[0] ? (
                        <img src={issue.images[0]} alt="Issue" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{issue.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">{issue.location.address}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                          <Badge className={getPriorityColor(issue.priority)} variant="secondary">
                            <span className="text-xs">{issue.priority}</span>
                          </Badge>
                          <Badge className={getStatusColor(issue.status)} variant="secondary">
                            <span className="text-xs">{issue.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {format(new Date(issue.submittedAt), 'MMM d, yyyy HH:mm')} • {issue.assignedDepartment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-3 md:p-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {issues.filter(i => i.status === 'submitted').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-3 md:p-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {issues.filter(i => i.status === 'in-progress').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Being addressed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* System Status */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-2 md:pb-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4 space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-gray-700">Server Health</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-gray-700">Database</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-gray-700">API Status</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Top Departments */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-2 md:pb-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Top Departments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4 space-y-2 md:space-y-3">
              {centralAdminDepartments.slice(0, 3).map((dept) => {
                const activeIssues = issues.filter(i => i.assignedDepartment === dept.name && i.status !== 'resolved').length;
                return (
                  <div key={dept.id} className="p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-900 truncate">{dept.name}</span>
                      <Badge className="bg-red-100 text-red-700 text-xs flex-shrink-0">{activeIssues}</Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderIssues = () => (
    <IssueManagement 
      issues={issues}
      currentUser={currentUser}
      onIssueUpdate={handleIssueUpdate}
    />
  );

  const renderDepartments = () => (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Department Management</h2>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Monitor and manage city departments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {centralAdminDepartments.map((dept) => {
          const activeIssues = issues.filter(i => i.assignedDepartment === dept.name && i.status !== 'resolved').length;
          const resolvedIssues = issues.filter(i => i.assignedDepartment === dept.name && i.status === 'resolved').length;
          
          return (
            <Card key={dept.id} className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
              <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                <CardTitle className="text-base md:text-lg truncate">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-6 space-y-3 md:space-y-4">
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{dept.description}</p>
                
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <div className="p-3 md:p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-xs font-medium text-gray-600">Active Issues</p>
                    <p className="text-xl md:text-2xl font-bold text-orange-600 mt-1">{activeIssues}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-xs font-medium text-gray-600">Resolved</p>
                    <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">{resolvedIssues}</p>
                  </div>
                </div>

                <div className="pt-2 md:pt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {dept.categories.slice(0, 4).map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs bg-gray-100">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">System Analytics</h2>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Detailed performance metrics and insights</p>
      </div>
      <CentralAdminAnalytics />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Configure system-wide settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 border-b">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Auto-Assignment</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Automatically assign issues to departments</p>
            </div>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm flex-shrink-0">Configure</Button>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 border-b">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Notification Settings</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Manage email and SMS notifications</p>
            </div>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm flex-shrink-0">Configure</Button>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 border-b">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Data Export</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Export reports and analytics data</p>
            </div>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm flex-shrink-0">Export</Button>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 border-b">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">User Management</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Manage user accounts and permissions</p>
            </div>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm flex-shrink-0">Manage</Button>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">System Backup</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Configure automatic data backups</p>
            </div>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm flex-shrink-0">Configure</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'issues':
        return renderIssues();
      case 'departments':
        return renderDepartments();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Central Administration Hub</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">System-wide oversight and management</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-600">Central Administrator</p>
              </div>
              <Button 
                onClick={onLogout} 
                variant="ghost" 
                className="gap-2 text-sm hover:bg-red-50 hover:text-red-600 hidden sm:flex"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Layout Container */}
      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-16 left-0 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

