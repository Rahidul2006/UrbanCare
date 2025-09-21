import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  LogOut, 
  Search, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';
import { centralAdminIssues, centralAdminAnalytics, centralAdminDepartments } from '../data/centralAdminData';
import { Issue, User } from '../types';
import { CentralAdminAnalytics } from './CentralAdminAnalytics';

interface CentralAdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

export function CentralAdminDashboard({ currentUser, onLogout }: CentralAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Filter issues based on search and filters
  const filteredIssues = centralAdminIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Central Administration</h1>
              <p className="text-sm text-gray-600">Welcome back, {currentUser?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="h-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">All Issues</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Issues</p>
                      <p className="text-3xl font-bold text-gray-900">{centralAdminAnalytics.totalIssues}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-green-600">↗ 12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resolved</p>
                      <p className="text-3xl font-bold text-gray-900">{centralAdminAnalytics.resolvedIssues}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Resolution rate: {Math.round((centralAdminAnalytics.resolvedIssues! / centralAdminAnalytics.totalIssues!) * 100)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                      <p className="text-3xl font-bold text-gray-900">{centralAdminAnalytics.averageResolutionTime}d</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-green-600">↘ 0.5d</span> improvement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-3xl font-bold text-gray-900">2.4k</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="text-green-600">↗ 8%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Issues */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centralAdminIssues.slice(0, 5).map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {issue.images && issue.images[0] && (
                            <img src={issue.images[0]} alt="Issue" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{issue.title}</h3>
                          <p className="text-sm text-gray-600">{issue.location.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Issues Tab */}
          <TabsContent value="issues" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="     Search issues..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[120px] h-9">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="acknowledged">Acknowledged</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[120px] h-9">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues List */}
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <Card key={issue.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex space-x-3 flex-1">
                        <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                          {issue.images && issue.images[0] && (
                            <img src={issue.images[0]} alt="Issue" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 pl-3 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1">{issue.title}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{issue.description}</p>
                          <div className="flex items-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[120px] sm:max-w-[180px]">{issue.location.address}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <span className="text-xs">{issue.submittedAt && new Date(issue.submittedAt).toLocaleDateString()}</span>
                            {issue.assignedDepartment && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="truncate max-w-[80px] sm:max-w-[120px] text-xs">{issue.assignedDepartment}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-2 sm:space-y-2">
                        <div className="flex flex-row gap-1">
                          <Badge className={`${getPriorityColor(issue.priority)} text-xs px-2 py-0.5`}>
                            {issue.priority}
                          </Badge>
                          <Badge className={`${getStatusColor(issue.status)} text-xs px-2 py-0.5`}>
                            {issue.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" className="h-7 px-3 text-xs flex-shrink-0">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <CentralAdminAnalytics />
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {centralAdminDepartments.map((dept) => (
                <Card key={dept.id}>
                  <CardHeader>
                    <CardTitle>{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{dept.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Issues:</span>
                        <span className="font-medium">
                          {centralAdminIssues.filter(i => i.assignedDepartment === dept.name && i.status !== 'resolved').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Resolved:</span>
                        <span className="font-medium text-green-600">
                          {centralAdminIssues.filter(i => i.assignedDepartment === dept.name && i.status === 'resolved').length}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {dept.categories.map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>System Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Auto-assignment</h3>
                      <p className="text-sm text-gray-600">Automatically assign issues to departments</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Notification Settings</h3>
                      <p className="text-sm text-gray-600">Manage email and SMS notifications</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Data Export</h3>
                      <p className="text-sm text-gray-600">Export reports and analytics data</p>
                    </div>
                    <Button variant="outline">Export</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">User Management</h3>
                      <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">System Backup</h3>
                      <p className="text-sm text-gray-600">Configure automatic data backups</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
