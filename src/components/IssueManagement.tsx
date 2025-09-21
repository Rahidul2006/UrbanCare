import React, { useState } from 'react';
import { Search, Filter, UserPlus, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { IssueCard } from './IssueCard';
import { Issue, IssueStatus, IssuePriority } from '../types';
import { format } from 'date-fns';

interface IssueManagementProps {
  issues: Issue[];
  currentUser: any;
  onIssueUpdate: (issue: Issue) => void;
}

export function IssueManagement({ issues, currentUser, onIssueUpdate }: IssueManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
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

  const departments = ['Public Works', 'Electrical Services', 'Sanitation', 'Parks & Recreation'];
  const staffMembers = [
    { id: 'staff1', name: 'Mike Wilson', department: 'Public Works' },
    { id: 'staff2', name: 'Lisa Park', department: 'Sanitation' },
    { id: 'staff3', name: 'Tom Anderson', department: 'Parks & Recreation' },
    { id: 'staff4', name: 'Sarah Chen', department: 'Electrical Services' }
  ];

  const handleStatusUpdate = (issueId: string, newStatus: IssueStatus) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    const updatedIssue: Issue = {
      ...issue,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : issue.resolvedAt,
      updates: [
        ...issue.updates,
        {
          id: `update-${Date.now()}`,
          message: `Status updated to ${newStatus}`,
          author: { name: currentUser.name, role: 'admin' },
          timestamp: new Date().toISOString()
        }
      ]
    };

    onIssueUpdate(updatedIssue);
  };

  const handlePriorityUpdate = (issueId: string, newPriority: IssuePriority) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    const updatedIssue: Issue = {
      ...issue,
      priority: newPriority,
      updatedAt: new Date().toISOString(),
      updates: [
        ...issue.updates,
        {
          id: `update-${Date.now()}`,
          message: `Priority updated to ${newPriority}`,
          author: { name: currentUser.name, role: 'admin' },
          timestamp: new Date().toISOString()
        }
      ]
    };

    onIssueUpdate(updatedIssue);
  };

  const handleAssignStaff = (issueId: string, staffId: string) => {
    const issue = issues.find(i => i.id === issueId);
    const staff = staffMembers.find(s => s.id === staffId);
    if (!issue || !staff) return;

    const updatedIssue: Issue = {
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

  const handleAddUpdate = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue || !updateMessage.trim()) return;

    const updatedIssue: Issue = {
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
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Issue Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search issues by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredIssues.length} of {issues.length} issues
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map(issue => (
          <Card key={issue.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Issue Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                    <p className="text-gray-500 text-sm mb-3">{issue.location.address}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getStatusColor(issue.status)}>
                        {formatStatus(issue.status)}
                      </Badge>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        {issue.department}
                      </Badge>
                      {issue.assignedTo && (
                        <Badge variant="secondary">
                          Assigned to {issue.assignedTo.name}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Reported by {issue.reportedBy.name} • {format(new Date(issue.createdAt), 'MMM d, yyyy HH:mm')}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t">
                  <Select onValueChange={(value) => handleStatusUpdate(issue.id, value as IssueStatus)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acknowledged">Acknowledge</SelectItem>
                      <SelectItem value="in-progress">Mark In Progress</SelectItem>
                      <SelectItem value="resolved">Mark Resolved</SelectItem>
                      <SelectItem value="closed">Close</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handlePriorityUpdate(issue.id, value as IssuePriority)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Set Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handleAssignStaff(issue.id, value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Assign Staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} ({staff.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedIssue(issue)}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Add Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Update to Issue</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Issue: {issue.title}</Label>
                        </div>
                        <div>
                          <Label htmlFor="update-message">Update Message</Label>
                          <Textarea
                            id="update-message"
                            placeholder="Enter progress update, resolution details, or communication for the reporter..."
                            value={updateMessage}
                            onChange={(e) => setUpdateMessage(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleAddUpdate(issue.id)}
                            disabled={!updateMessage.trim()}
                          >
                            Add Update
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedIssue(null);
                              setUpdateMessage('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Updates */}
                {issue.updates.length > 0 && (
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Updates</h4>
                    <div className="space-y-2">
                      {issue.updates.slice(-2).map(update => (
                        <div key={update.id} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700 mb-1">{update.message}</p>
                          <div className="text-xs text-gray-500">
                            {update.author.name} • {format(new Date(update.timestamp), 'MMM d, HH:mm')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredIssues.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg text-gray-900 mb-2">No issues found</h4>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'submitted': return 'bg-orange-100 text-orange-800';
    case 'acknowledged': return 'bg-blue-100 text-blue-800';
    case 'in-progress': return 'bg-purple-100 text-purple-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    case 'closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function formatStatus(status: string) {
  switch (status) {
    case 'in-progress': return 'In Progress';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
}