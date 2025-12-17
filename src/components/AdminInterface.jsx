import { useState } from 'react';
import { BarChart3, Filter, MapPin, Users, Clock, CheckCircle, AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';
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
  const [issues, setIssues] = useState(mockIssues);

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
        <div className="mb-12 bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-transparent bg-gradient-to-br from-white to-slate-50 ring-1 ring-inset ring-blue-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40" />
          <div className="flex items-start justify-between flex-col sm:flex-row gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Admin Dashboard</h1>
              </div>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Monitor and manage civic issues, track resolution progress, and analyze departmental performance
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-300/70 shadow-md">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 text-sm font-medium">System Active</span>
            </div>
          </div>
        </div>

        {/* Modern Quick Stats with light colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
          {/* Total Issues */}
          <div className="group bg-gradient-to-br from-blue-50 via-blue-50/50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ring-1.5 ring-blue-300/60 hover:ring-blue-400/80 shadow-md hover:shadow-blue-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 group-hover:opacity-50" />
            <p className="text-slate-600 text-sm font-medium mb-4">Total Issues</p>
            <div className="flex items-end justify-between">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stats.totalIssues}</div>
              <div className="bg-blue-100 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-md"></div>
          </div>
          
          {/* Pending Review */}
          <div className="group bg-gradient-to-br from-amber-50 via-amber-50/50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ring-1.5 ring-amber-300/60 hover:ring-amber-400/80 shadow-md hover:shadow-amber-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-30 group-hover:opacity-50" />
            <p className="text-slate-600 text-sm font-medium mb-4">Pending Review</p>
            <div className="flex items-end justify-between">
              <div className="text-3xl sm:text-4xl font-bold text-amber-600">{stats.pendingIssues}</div>
              <div className="bg-amber-100 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-md"></div>
          </div>
          
          {/* In Progress */}
          <div className="group bg-gradient-to-br from-cyan-50 via-cyan-50/50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ring-1.5 ring-cyan-300/60 hover:ring-cyan-400/80 shadow-md hover:shadow-cyan-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 group-hover:opacity-50" />
            <p className="text-slate-600 text-sm font-medium mb-4">In Progress</p>
            <div className="flex items-end justify-between">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-600">{stats.inProgressIssues}</div>
              <div className="bg-cyan-100 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full shadow-md"></div>
          </div>
          
          {/* Resolved Today */}
          <div className="group bg-gradient-to-br from-green-50 via-green-50/50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ring-1.5 ring-green-300/60 hover:ring-green-400/80 shadow-md hover:shadow-green-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30 group-hover:opacity-50" />
            <p className="text-slate-600 text-sm font-medium mb-4">Resolved Today</p>
            <div className="flex items-end justify-between">
              <div className="text-3xl sm:text-4xl font-bold text-green-600">{stats.resolvedToday}</div>
              <div className="bg-green-100 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-md"></div>
          </div>
          
          {/* Urgent Issues */}
          <div className="group bg-gradient-to-br from-red-50 via-red-50/50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ring-1.5 ring-red-300/60 hover:ring-red-400/80 shadow-md hover:shadow-red-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-30 group-hover:opacity-50" />
            <p className="text-slate-600 text-sm font-medium mb-4">Urgent Issues</p>
            <div className="flex items-end justify-between">
              <div className="text-3xl sm:text-4xl font-bold text-red-600">{stats.urgentIssues}</div>
              <div className="bg-red-100 p-3 rounded-lg group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-md"></div>
          </div>
        </div>

      {/* Modern Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="ring-1.5 ring-slate-200/60 rounded-2xl shadow-md hover:shadow-lg transition-all p-2 bg-slate-50/50 backdrop-blur-sm mb-8">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-3 bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center justify-center gap-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg rounded-xl transition-all font-medium py-2 text-sm sm:text-base"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Board</span>
            </TabsTrigger>
            <TabsTrigger 
              value="issues" 
              className="flex items-center justify-center gap-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg rounded-xl transition-all font-medium py-2 text-sm sm:text-base"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Issue Management</span>
              <span className="sm:hidden">Issues</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center justify-center gap-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg rounded-xl transition-all font-medium py-2 text-sm sm:text-base"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-0">
          <div className="group bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ring-1.5 ring-slate-200/60 hover:ring-slate-300/80 shadow-md hover:shadow-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 group-hover:opacity-50" />
            <AdminDashboard 
              issues={issues}
              currentUser={currentUser}
              onIssueUpdate={handleIssueUpdate}
            />
          </div>
        </TabsContent>

        <TabsContent value="issues" className="mt-0">
          <div className="group bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ring-1.5 ring-slate-200/60 hover:ring-slate-300/80 shadow-md hover:shadow-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 group-hover:opacity-50" />
            <IssueManagement 
              issues={issues}
              currentUser={currentUser}
              onIssueUpdate={handleIssueUpdate}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <div className="group bg-gradient-to-br from-white via-slate-50/50 to-white rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 ring-1.5 ring-slate-200/60 hover:ring-slate-300/80 shadow-md hover:shadow-slate-200/50 relative overflow-hidden">
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
