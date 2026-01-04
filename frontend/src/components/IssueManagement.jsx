import { useState } from 'react';
import { Search, Filter, UserPlus, MessageSquare, CheckCircle, XCircle, Clock, AlertTriangle, Building2, Calendar, Zap, CheckCheck, Loader, Eye, Edit, MapPin as LocationIcon, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Label } from './label';
import { IssueCard } from './IssueCard';
import { format } from 'date-fns';

export function IssueManagement({ issues, currentUser, onIssueUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const matchesDepartment = departmentFilter === 'all' || issue.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

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
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;

  const departments = ['Public Works', 'Electrical Services', 'Sanitation', 'Parks & Recreation'];
  const staffMembers = [
    { id: 'staff1', name: 'Mike Wilson', department: 'Public Works' },
    { id: 'staff2', name: 'Lisa Park', department: 'Sanitation' },
    { id: 'staff3', name: 'Tom Anderson', department: 'Parks & Recreation' },
    { id: 'staff4', name: 'Sarah Chen', department: 'Electrical Services' }
  ];

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

  const formatStatus = (status) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleStatusUpdate = (issueId, newStatus) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    // Send update to backend
    const updateIssueOnServer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/issues/${issueId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus,
            priority: issue.priority,
            department: issue.department
          })
        });

        const data = await response.json();

        if (data.success) {
          const updatedIssue = {
            ...data.issue,
            updates: [
              ...(issue.updates || []),
              {
                id: `update-${Date.now()}`,
                message: `Status updated to ${newStatus}`,
                author: { name: currentUser.name, role: 'admin' },
                timestamp: new Date().toISOString()
              }
            ]
          };

          onIssueUpdate(updatedIssue);
        }
      } catch (error) {
        console.error('Error updating issue status:', error);
      }
    };

    updateIssueOnServer();
  };

  const handlePriorityUpdate = (issueId, newPriority) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    // Send update to backend
    const updateIssueOnServer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/issues/${issueId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: issue.status,
            priority: newPriority,
            department: issue.department
          })
        });

        const data = await response.json();

        if (data.success) {
          const updatedIssue = {
            ...data.issue,
            updates: [
              ...(issue.updates || []),
              {
                id: `update-${Date.now()}`,
                message: `Priority updated to ${newPriority}`,
                author: { name: currentUser.name, role: 'admin' },
                timestamp: new Date().toISOString()
              }
            ]
          };

          onIssueUpdate(updatedIssue);
        }
      } catch (error) {
        console.error('Error updating issue priority:', error);
      }
    };

    updateIssueOnServer();
  };

  const handleAssignStaff = (issueId, staffId) => {
    const issue = issues.find(i => i.id === issueId);
    const staff = staffMembers.find(s => s.id === staffId);
    if (!issue || !staff) return;

    const updatedIssue = {
      ...issue,
      assignedTo: staff,
      status: issue.status === 'submitted' ? 'acknowledged' : issue.status,
      updatedAt: new Date().toISOString(),
      updates: [
        ...issue.updates,
        {
          id: `update-${Date.now()}`,
          message: `Assigned to ${staff.name} (${staff.department})`,
          author: { name: currentUser.name, role: 'admin' },
          timestamp: new Date().toISOString()
        }
      ]
    };

    onIssueUpdate(updatedIssue);
  };

  const handleAddUpdate = (issueId) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue || !updateMessage.trim()) return;

    const updatedIssue = {
      ...issue,
      updatedAt: new Date().toISOString(),
      updates: [
        ...issue.updates,
        {
          id: `update-${Date.now()}`,
          message: updateMessage.trim(),
          author: { name: currentUser.name, role: 'admin' },
          timestamp: new Date().toISOString()
        }
      ]
    };

    onIssueUpdate(updatedIssue);
    setUpdateMessage('');
    setSelectedIssue(null);
  };

  return (
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44 border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gradient-to-br from-white to-blue-50 rounded-xl h-12 shadow-md hover:shadow-lg hover:border-blue-400 transition-all font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 bg-white border-blue-300 shadow-lg">
                  <SelectItem value="all" className="font-semibold">All Status</SelectItem>
                  <SelectItem value="submitted" className="font-semibold">Submitted</SelectItem>
                  <SelectItem value="acknowledged" className="font-semibold">Acknowledged</SelectItem>
                  <SelectItem value="in-progress" className="font-semibold">In Progress</SelectItem>
                  <SelectItem value="resolved" className="font-semibold">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-44 border-2 border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gradient-to-br from-white to-orange-50 rounded-xl h-12 shadow-md hover:shadow-lg hover:border-orange-400 transition-all font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <SelectValue placeholder="All Priority" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 bg-white border-orange-300 shadow-lg">
                  <SelectItem value="all" className="font-semibold">All Priority</SelectItem>
                  <SelectItem value="low" className="font-semibold">Low</SelectItem>
                  <SelectItem value="medium" className="font-semibold">Medium</SelectItem>
                  <SelectItem value="high" className="font-semibold">High</SelectItem>
                  <SelectItem value="urgent" className="font-semibold">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48 border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gradient-to-br from-white to-purple-50 rounded-xl h-12 shadow-md hover:shadow-lg hover:border-purple-400 transition-all font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <SelectValue placeholder="All Departments" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 bg-white border-purple-300 shadow-lg">
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
              <SelectContent className="rounded-xl border-2 bg-white border-cyan-300 shadow-lg">
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className={`text-white shadow-lg hover:shadow-xl transition-all gap-2.5 px-4 rounded-xl h-10 font-bold text-xs whitespace-nowrap ${
                            isUrgent ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : isHighPriority ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' : isResolved ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                          }`}>
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{issue.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            <div>
                              <Label className="font-semibold">Description</Label>
                              <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Location</Label>
                              <p className="text-sm text-gray-600 mt-1">{issue.location.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Status</Label>
                                <Select value={issue.status} onValueChange={(value) => handleStatusUpdate(issue.id, value)}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="font-semibold">Priority</Label>
                                <Select value={issue.priority} onValueChange={(value) => handlePriorityUpdate(issue.id, value)}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label className="font-semibold">Assign To</Label>
                              <Select value={issue.assignedTo?.id || ''} onValueChange={(value) => handleAssignStaff(issue.id, value)}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                  {staffMembers.map(staff => (
                                    <SelectItem key={staff.id} value={staff.id}>
                                      {staff.name} ({staff.department})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="font-semibold mb-2 block">Add Update</Label>
                              <Textarea
                                placeholder="Add a status update..."
                                value={updateMessage}
                                onChange={(e) => setUpdateMessage(e.target.value)}
                                className="min-h-20"
                              />
                              <Button onClick={() => handleAddUpdate(issue.id)} className="mt-2 bg-blue-600 hover:bg-blue-700">
                                Add Update
                              </Button>
                            </div>
                            <div>
                              <Label className="font-semibold mb-2 block">Updates</Label>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {issue.updates?.map((update) => (
                                  <div key={update.id} className="bg-gray-50 p-2 rounded text-xs">
                                    <p className="font-semibold text-gray-900">{update.author.name}</p>
                                    <p className="text-gray-600">{update.message}</p>
                                    <p className="text-gray-500 text-xs mt-1">{format(new Date(update.timestamp), 'MMM d, yyyy HH:mm')}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
}
