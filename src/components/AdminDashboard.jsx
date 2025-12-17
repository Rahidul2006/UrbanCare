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

  const renderIssues = () => (
    <div className="space-y-6">
      {/* Header Section with Background */}
      <div className="relative rounded-3xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-cyan-100/20 to-transparent" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="relative p-8 space-y-4">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">Issue Management</h2>
              </div>
              <p className="text-sm text-gray-600 mt-2 ml-0 sm:ml-11">
                <span className="font-semibold text-gray-900">{filteredIssues.length}</span> showing • <span className="font-semibold text-gray-900">{issues.length}</span> total issues across all departments
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
              <div className="text-center px-5 py-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-blue-400/50 group/stat">
                <p className="text-xs font-semibold opacity-90 group-hover/stat:opacity-100">Active Issues</p>
                <p className="text-3xl font-bold mt-1">{issues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length}</p>
              </div>
              <div className="text-center px-5 py-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-green-400/50 group/stat">
                <p className="text-xs font-semibold opacity-90 group-hover/stat:opacity-100">Resolved</p>
                <p className="text-3xl font-bold mt-1">{resolvedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-blue-100/50 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Filter & Search</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-3 w-full">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-44 border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gradient-to-br from-white to-blue-50 rounded-xl h-12 shadow-md hover:shadow-lg hover:border-blue-400 transition-all font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-blue-300 shadow-lg">
                  <SelectItem value="all" className="font-semibold">All Status</SelectItem>
                  <SelectItem value="submitted" className="font-semibold">Submitted</SelectItem>
                  <SelectItem value="acknowledged" className="font-semibold">Acknowledged</SelectItem>
                  <SelectItem value="in-progress" className="font-semibold">In Progress</SelectItem>
                  <SelectItem value="resolved" className="font-semibold">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-44 border-2 border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gradient-to-br from-white to-orange-50 rounded-xl h-12 shadow-md hover:shadow-lg hover:border-orange-400 transition-all font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <SelectValue placeholder="All Priority" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-orange-300 shadow-lg">
                  <SelectItem value="all" className="font-semibold">All Priority</SelectItem>
                  <SelectItem value="low" className="font-semibold">Low</SelectItem>
                  <SelectItem value="medium" className="font-semibold">Medium</SelectItem>
                  <SelectItem value="high" className="font-semibold">High</SelectItem>
                  <SelectItem value="urgent" className="font-semibold">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full sm:w-48 border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gradient-to-br from-white to-purple-50 rounded-xl h-12 shadow-md hover:shadow-lg hover:border-purple-400 transition-all font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <SelectValue placeholder="All Departments" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-purple-300 shadow-lg">
                  <SelectItem value="all" className="font-semibold">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept} className="font-semibold">{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-44 border-2 border-cyan-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gradient-to-br from-white to-cyan-50 rounded-xl h-12 shadow-md hover:shadow-lg hover:border-cyan-400 transition-all font-medium text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-600" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-cyan-300 shadow-lg">
                <SelectItem value="latest" className="font-semibold">Latest</SelectItem>
                <SelectItem value="oldest" className="font-semibold">Oldest</SelectItem>
                <SelectItem value="urgent" className="font-semibold">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Issues Grid View */}
      <div className="space-y-3">
        {sortedIssues.length > 0 ? (
          sortedIssues.map((issue) => {
            const daysSinceCreated = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 60 * 60 * 24));
            const isUrgent = issue.priority === 'urgent';
            const isHighPriority = issue.priority === 'high';
            const isResolved = issue.status === 'resolved';
            const isInProgress = issue.status === 'in-progress';
            
            const getStatusIcon = () => {
              switch(issue.status) {
                case 'submitted': return <AlertTriangle className="w-5 h-5" />;
                case 'acknowledged': return <Clock className="w-5 h-5" />;
                case 'in-progress': return <Loader className="w-5 h-5 animate-spin" />;
                case 'resolved': return <CheckCircle className="w-5 h-5" />;
                default: return null;
              }
            };
            
            return (
              <div
                key={issue.id}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 border-2 backdrop-blur-sm ${
                  isUrgent 
                    ? 'border-red-300 hover:border-red-500 hover:shadow-2xl shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-red-50/30' 
                    : isHighPriority
                    ? 'border-orange-300 hover:border-orange-500 hover:shadow-xl shadow-lg hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50/30'
                    : isResolved
                    ? 'border-green-300 hover:border-green-500 hover:shadow-lg shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-white to-green-50/20'
                    : 'border-blue-300 hover:border-blue-500 hover:shadow-lg shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-white to-blue-50/20'
                }`}
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full ${
                  isUrgent ? 'bg-gradient-to-r from-red-500 to-orange-500' : isHighPriority ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : isResolved ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}></div>

                {/* Priority indicator stripe */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  isUrgent ? 'bg-gradient-to-b from-red-500 to-red-600' : isHighPriority ? 'bg-gradient-to-b from-orange-500 to-orange-600' : isResolved ? 'bg-gradient-to-b from-green-500 to-green-600' : 'bg-gradient-to-b from-blue-500 to-blue-600'
                }`}></div>

                <CardContent className="p-5 pl-6">
                  <div className="flex gap-4 items-start">
                    {/* Issue Image with Badge */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-24 h-24 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 ${
                        isUrgent ? 'border-red-300' : isHighPriority ? 'border-orange-300' : isResolved ? 'border-green-300' : 'border-blue-300'
                      }`}>
                        {issue.images && issue.images[0] ? (
                          <img src={issue.images[0]} alt="Issue" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                            isUrgent ? 'from-red-100 to-orange-100' : isHighPriority ? 'from-orange-100 to-yellow-100' : isResolved ? 'from-green-100 to-emerald-100' : 'from-blue-100 to-cyan-100'
                          }`}>
                            <AlertTriangle className={`w-8 h-8 ${
                              isUrgent ? 'text-red-500' : isHighPriority ? 'text-orange-500' : isResolved ? 'text-green-500' : 'text-blue-500'
                            }`} />
                          </div>
                        )}
                      </div>
                      {isUrgent && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-2 shadow-xl animate-pulse border-3 border-white">
                          <Zap className="w-5 h-5" />
                        </div>
                      )}
                      {isResolved && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-2 shadow-xl border-3 border-white">
                          <CheckCheck className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with Title and Status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className={`font-bold text-lg line-clamp-1 group-hover:text-blue-700 transition-colors ${
                              isResolved ? 'text-gray-600 line-through' : 'text-gray-900'
                            }`}>
                              {issue.title}
                            </h4>
                            <div className={`flex-shrink-0 transition-colors ${
                              isUrgent ? 'text-red-600' : isHighPriority ? 'text-orange-600' : isResolved ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {getStatusIcon()}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">{issue.description}</p>
                        </div>
                      </div>

                      {/* Location and Metadata with Icons */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <LocationIcon className={`w-4 h-4 flex-shrink-0 ${
                            isUrgent ? 'text-red-500' : isHighPriority ? 'text-orange-500' : isResolved ? 'text-green-500' : 'text-blue-500'
                          }`} />
                          <span className="line-clamp-1">{issue.location.address}</span>
                        </div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border-2 transition-all ${
                            isUrgent ? 'text-red-700 bg-red-100 border-red-300' : isHighPriority ? 'text-orange-700 bg-orange-100 border-orange-300' : isResolved ? 'text-green-700 bg-green-100 border-green-300' : 'text-blue-700 bg-blue-100 border-blue-300'
                          }`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{daysSinceCreated}d</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-100 border-2 border-purple-300 px-3 py-2 rounded-lg">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{issue.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Badges with enhanced styling */}
                      <div className="flex items-center flex-wrap gap-2.5">
                        <div className={`inline-flex items-center gap-1.5 font-bold px-4 py-2 rounded-lg border-2 transition-all ${getPriorityColor(issue.priority)} border-current border-opacity-40 hover:border-opacity-60`}>
                          <span className="text-xs">{issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}</span>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 font-bold px-4 py-2 rounded-lg border-2 transition-all ${getStatusColor(issue.status)} border-current border-opacity-40 hover:border-opacity-60`}>
                          <span className="text-xs">{issue.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                        </div>
                        {isInProgress && (
                          <span className="text-xs font-bold text-orange-700 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-lg animate-pulse border-2 border-orange-300 inline-flex items-center gap-1.5">
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex flex-col gap-2 pt-2">
                      <Button size="sm" className={`text-white shadow-lg hover:shadow-xl transition-all gap-2.5 px-4 rounded-xl h-10 font-bold text-xs whitespace-nowrap ${
                        isUrgent ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : isHighPriority ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' : isResolved ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                      }`}>
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button size="sm" variant="outline" className={`border-2 transition-all gap-2 px-3 h-10 rounded-xl font-medium text-xs ${
                        isUrgent ? 'border-red-300 text-red-700 hover:bg-red-50 hover:border-red-500' : isHighPriority ? 'border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-500' : isResolved ? 'border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500' : 'border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-500'
                      }`}>
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            );
          })
        ) : (
          <Card className="border-2 border-dashed border-gray-300 shadow-none rounded-3xl bg-gradient-to-br from-gray-50 to-slate-50">
            <CardContent className="p-16 text-center">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Filter className="w-10 h-10 text-gray-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">No issues found</h4>
              <p className="text-base text-gray-600 mt-3 max-w-sm mx-auto">Try adjusting your search or filter options to find the issues you're looking for</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );



  const renderContent = () => (
    <div className="space-y-10">
      {renderOverview()}
      {renderIssues()}
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