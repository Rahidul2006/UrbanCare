import { useState, useEffect } from 'react';
import { BarChart3, Filter, MapPin, Users, Clock, CheckCircle, AlertTriangle, TrendingUp, Target, Zap, Settings, Bell, Calendar, TrendingDown, Percent } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import { AdminDashboard } from './AdminDashboard';
import { IssueManagement } from './IssueManagement';
import { AdminAnalytics } from './AdminAnalytics';
import { mockIssues, mockAnalytics } from '../data/mockData';
import { roleColors } from '../utils/roleColors';

export function AdminInterface({ currentUser }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch issues from backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/issues');
        const data = await response.json();

        if (data.success && data.issues) {
          console.log('Fetched issues for admin:', data.issues);
          setIssues(data.issues);
        } else {
          setIssues(mockIssues);
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
        setIssues(mockIssues);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleIssueUpdate = (updatedIssue) => {
    setIssues(prev => prev.map(issue => 
      issue.id === updatedIssue.id ? updatedIssue : issue
    ));
  };

  const getDashboardStats = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const totalIssues = issues.length;
    const pendingIssues = issues.filter(i => i.status === 'submitted' || i.status === 'acknowledged').length;
    const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
    const resolvedToday = issues.filter(i => 
      i.status === 'resolved' && 
      new Date(i.resolvedAt || '').toDateString() === today.toDateString()
    ).length;

    const urgentIssues = issues.filter(i => 
      i.priority === 'urgent' && 
      i.status !== 'resolved' && 
      i.status !== 'closed'
    ).length;

    return {
      totalIssues,
      pendingIssues,
      inProgressIssues,
      resolvedToday,
      urgentIssues
    };
  };

  const stats = getDashboardStats();
  const colors = roleColors.admin;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-slate-100">
      {/* Subtle Background Elements - Same as Citizen */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute -bottom-32 right-1/3 w-80 h-80 bg-blue-50/20 rounded-full mix-blend-screen filter blur-2xl" />
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl relative z-10">
        {/* Modern Header */}
        <div className="mb-12 bg-gradient-to-br from-white via-blue-50 to-slate-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-indigo-100/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-start justify-between flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500 mt-1">Last updated: {new Date().toLocaleString()}</p>
                </div>
              </div>
              <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
                Monitor and manage civic issues, track resolution progress, and analyze departmental performance in real-time
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-300/70 shadow-md">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 text-sm font-semibold">System Active</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2 border-blue-200 hover:bg-blue-50 text-blue-600">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Quick Stats with light colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          {/* Total Issues */}
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 ring-2 ring-blue-200 hover:ring-blue-400 shadow-md border border-blue-100 relative overflow-hidden hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-50" />
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-200/20 rounded-full blur-lg" />
            <p className="text-slate-700 text-sm font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Total Issues
            </p>
            <div className="flex items-end justify-between mb-4">
              <div className="text-4xl font-bold text-blue-600">{stats.totalIssues}</div>
              <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">All time</div>
            </div>
            <div className="h-2 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full shadow-md group-hover:shadow-lg group-hover:from-blue-400 group-hover:to-blue-600 transition-all"></div>
          </div>
          
          {/* Pending Review */}
          <div className="group bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 ring-2 ring-amber-200 hover:ring-amber-400 shadow-md border border-amber-100 relative overflow-hidden hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-50" />
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-200/20 rounded-full blur-lg" />
            <p className="text-slate-700 text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Review
            </p>
            <div className="flex items-end justify-between mb-4">
              <div className="text-4xl font-bold text-amber-600">{stats.pendingIssues}</div>
              <div className="text-xs font-semibold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">Active</div>
            </div>
            <div className="h-2 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full shadow-md group-hover:shadow-lg group-hover:from-amber-400 group-hover:to-amber-600 transition-all"></div>
          </div>
          
          {/* In Progress */}
          <div className="group bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 ring-2 ring-cyan-200 hover:ring-cyan-400 shadow-md border border-cyan-100 relative overflow-hidden hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50" />
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-200/20 rounded-full blur-lg" />
            <p className="text-slate-700 text-sm font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600" />
              In Progress
            </p>
            <div className="flex items-end justify-between mb-4">
              <div className="text-4xl font-bold text-cyan-600">{stats.inProgressIssues}</div>
              <div className="text-xs font-semibold text-cyan-600 bg-cyan-100 px-2.5 py-1 rounded-full">Working</div>
            </div>
            <div className="h-2 bg-gradient-to-r from-cyan-300 to-cyan-500 rounded-full shadow-md group-hover:shadow-lg group-hover:from-cyan-400 group-hover:to-cyan-600 transition-all"></div>
          </div>
          
          {/* Resolved Today */}
          <div className="group bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 ring-2 ring-green-200 hover:ring-green-400 shadow-md border border-green-100 relative overflow-hidden hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-50" />
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-200/20 rounded-full blur-lg" />
            <p className="text-slate-700 text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Resolved Today
            </p>
            <div className="flex items-end justify-between mb-4">
              <div className="text-4xl font-bold text-green-600">{stats.resolvedToday}</div>
              <div className="text-xs font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">Today</div>
            </div>
            <div className="h-2 bg-gradient-to-r from-green-300 to-green-500 rounded-full shadow-md group-hover:shadow-lg group-hover:from-green-400 group-hover:to-green-600 transition-all"></div>
          </div>
          
          {/* Urgent Issues */}
          <div className="group bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 ring-2 ring-red-200 hover:ring-red-400 shadow-md border border-red-100 relative overflow-hidden hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent opacity-50" />
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-200/20 rounded-full blur-lg" />
            <p className="text-slate-700 text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Urgent Issues
            </p>
            <div className="flex items-end justify-between mb-4">
              <div className="text-4xl font-bold text-red-600">{stats.urgentIssues}</div>
              <div className="text-xs font-semibold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">Critical</div>
            </div>
            <div className="h-2 bg-gradient-to-r from-red-300 to-red-500 rounded-full shadow-md group-hover:shadow-lg group-hover:from-red-400 group-hover:to-red-600 transition-all"></div>
          </div>
        </div>

      {/* Modern Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="ring-2 ring-slate-200/60 rounded-2xl shadow-md hover:shadow-lg transition-all p-2 bg-gradient-to-r from-slate-50 to-blue-50/50 backdrop-blur-sm mb-8 border border-blue-200/50">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="dashboard" 
              className={`flex items-center justify-center gap-2 rounded-xl transition-all font-semibold py-3 text-sm sm:text-base ${
                activeTab === 'dashboard'
                  ? 'text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                  : 'text-slate-700 bg-white/60 hover:bg-white border border-slate-200/50 hover:border-blue-300'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Board</span>
            </TabsTrigger>
            <TabsTrigger 
              value="issues" 
              className={`flex items-center justify-center gap-2 rounded-xl transition-all font-semibold py-3 text-sm sm:text-base ${
                activeTab === 'issues'
                  ? 'text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                  : 'text-slate-700 bg-white/60 hover:bg-white border border-slate-200/50 hover:border-blue-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Issue Management</span>
              <span className="sm:hidden">Issues</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className={`flex items-center justify-center gap-2 rounded-xl transition-all font-semibold py-3 text-sm sm:text-base ${
                activeTab === 'analytics'
                  ? 'text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                  : 'text-slate-700 bg-white/60 hover:bg-white border border-slate-200/50 hover:border-blue-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-0">
          <div className="group bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ring-2 ring-slate-200/60 hover:ring-slate-300/80 shadow-md border border-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 group-hover:opacity-50" />
            <AdminDashboard 
              issues={issues}
              currentUser={currentUser}
              onIssueUpdate={handleIssueUpdate}
            />
          </div>
        </TabsContent>

        <TabsContent value="issues" className="mt-0">
          <div className="group bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ring-2 ring-slate-200/60 hover:ring-slate-300/80 shadow-md border border-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 group-hover:opacity-50" />
            <IssueManagement 
              issues={issues}
              currentUser={currentUser}
              onIssueUpdate={handleIssueUpdate}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <div className="group bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ring-2 ring-slate-200/60 hover:ring-slate-300/80 shadow-md border border-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 group-hover:opacity-50" />
            <AdminAnalytics 
              analytics={mockAnalytics}
              issues={issues}
            />
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
