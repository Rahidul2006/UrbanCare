import { useState } from 'react';
import { MapPin, AlertTriangle, Clock, User2, Filter, Search, CheckCircle, TrendingUp, Activity, Building2, LogOut, Eye, ChevronRight, MapPin as LocationIcon, Calendar, Zap, MoreVertical, Edit, Trash2, Plus, CheckCheck, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Input } from './input';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { IssueCard } from './IssueCard';
import { format } from 'date-fns';

export function AdminDashboard({ issues, currentUser, onIssueUpdate, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
    const matchesDepartment = filterDepartment === 'all' || issue.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

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

  const departments = ['Public Works', 'Electrical Services', 'Sanitation', 'Parks & Recreation'];

  const urgentIssues = issues.filter(i => i.priority === 'urgent' && i.status !== 'resolved' && i.status !== 'closed');
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const avgResolutionTime = Math.round(Math.random() * 7 + 2);

  const [sortBy, setSortBy] = useState('latest');

  const getSortedIssues = () => {
    const sorted = [...filteredIssues];
    switch (sortBy) {
      case 'latest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'urgent':
        return sorted.sort((a, b) => {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
        });
      default:
        return sorted;
    }
  };

  const sortedIssues = getSortedIssues();

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Urgent Issues Alert */}
      {urgentIssues.length > 0 && (
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
              {urgentIssues.slice(0, 3).map(issue => (
                <div key={issue.id} className="bg-white p-4 rounded-lg border border-red-100 hover:border-red-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{issue.location.address}</p>
                      <Badge className="bg-red-600 hover:bg-red-700 text-white">Urgent</Badge>
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap">{issue.department}</Badge>
                  </div>
                </div>
              ))}
              {urgentIssues.length > 3 && (
                <p className="text-sm text-red-700 font-medium">
                  +{urgentIssues.length - 3} more urgent issues
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-6 bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Total Issues</p>
                <p className="text-3xl font-bold text-white mt-2">{issues.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-blue-100 mt-4">
              <span className="font-semibold">↗ {urgentIssues.length}</span> urgent
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-6 bg-gradient-to-br from-green-500 to-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">Resolved</p>
                <p className="text-3xl font-bold text-white mt-2">{resolvedCount}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-green-100 mt-4">
              Rate: <span className="font-semibold">{issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 0}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-6 bg-gradient-to-br from-orange-500 to-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100">Avg Resolution</p>
                <p className="text-3xl font-bold text-white mt-2">{avgResolutionTime}d</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-orange-100 mt-4">
              <span className="font-semibold">↘ 0.5d</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-6 bg-gradient-to-br from-purple-500 to-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-100">Active Cases</p>
                <p className="text-3xl font-bold text-white mt-2">{issues.filter(i => i.status === 'in-progress').length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-purple-100 mt-4">
              <span className="font-semibold">Currently</span> being handled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Issues */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white border-b">
              <CardTitle className="text-lg">Recent Issues Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {issues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {issue.images && issue.images[0] ? (
                        <img src={issue.images[0]} alt="Issue" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <AlertTriangle className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{issue.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{issue.location.address}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Badge className={getPriorityColor(issue.priority)} variant="secondary">
                            {issue.priority}
                          </Badge>
                          <Badge className={getStatusColor(issue.status)} variant="secondary">
                            {issue.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {format(new Date(issue.createdAt), 'MMM d, yyyy HH:mm')} • {issue.department}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Department Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {issues.filter(i => i.status === 'submitted').length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Awaiting action</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {issues.filter(i => i.status === 'in-progress').length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Being addressed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Department Workload */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Department Workload
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {departments.map(dept => {
                const deptIssues = issues.filter(i => i.department === dept && i.status !== 'resolved' && i.status !== 'closed');
                const issuePercentage = Math.min((deptIssues.length / 10) * 100, 100);
                
                return (
                  <div key={dept} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{dept}</span>
                      <Badge className={`
                        ${deptIssues.length > 5 ? "bg-red-100 text-red-700" : ""}
                        ${deptIssues.length > 2 && deptIssues.length <= 5 ? "bg-amber-100 text-amber-700" : ""}
                        ${deptIssues.length <= 2 ? "bg-green-100 text-green-700" : ""}
                      `}>
                        {deptIssues.length} active
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${issuePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
            <CardContent className="p-4 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-12 h-12 border-2 border-white">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-white/20">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{currentUser?.name}</p>
                  <p className="text-xs text-slate-300">Administrator</p>
                </div>
              </div>
              {onLogout && (
                <Button onClick={onLogout} className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 text-sm">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );





  const renderContent = () => (
    <div className="space-y-10">
      {renderOverview()}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and monitor city issues</p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
              <p className="text-xs text-gray-600">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
}