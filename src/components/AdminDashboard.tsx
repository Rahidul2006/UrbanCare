import React, { useState } from 'react';
import { MapPin, AlertTriangle, Clock, User2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { IssueCard } from './IssueCard';
import { Issue } from '../types';
import { format } from 'date-fns';

interface AdminDashboardProps {
  issues: Issue[];
  currentUser: any;
  onIssueUpdate: (issue: Issue) => void;
}

export function AdminDashboard({ issues, currentUser, onIssueUpdate }: AdminDashboardProps) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredIssues = issues.filter(issue => {
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (filterPriority !== 'all' && issue.priority !== filterPriority) return false;
    if (filterDepartment !== 'all' && issue.department !== filterDepartment) return false;
    return true;
  });

  const urgentIssues = issues.filter(i => i.priority === 'urgent' && i.status !== 'resolved' && i.status !== 'closed');
  const recentIssues = issues
    .filter(i => {
      const createdAt = new Date(i.createdAt);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return createdAt > oneDayAgo;
    })
    .slice(0, 5);

  const getLocationHotspots = () => {
    const locationCounts: Record<string, number> = {};
    issues.forEach(issue => {
      const area = issue.location.address.split(',')[1]?.trim() || issue.location.address;
      locationCounts[area] = (locationCounts[area] || 0) + 1;
    });
    
    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  };

  const locationHotspots = getLocationHotspots();

  const departments = ['Public Works', 'Electrical Services', 'Sanitation', 'Parks & Recreation'];

  return (
    <div className="space-y-6">
      {/* Urgent Issues Alert */}
      {urgentIssues.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Urgent Issues Requiring Immediate Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentIssues.slice(0, 3).map(issue => (
                <div key={issue.id} className="bg-white p-3 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{issue.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{issue.location.address}</p>
                      <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                    </div>
                    <Badge variant="outline">{issue.department}</Badge>
                  </div>
                </div>
              ))}
              {urgentIssues.length > 3 && (
                <p className="text-sm text-red-700">
                  +{urgentIssues.length - 3} more urgent issues
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Issue Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-gray-900">Recent Issues</h3>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
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
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
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

              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
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

          <div className="space-y-4">
            {filteredIssues.slice(0, 10).map(issue => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                userRole="admin"
                showReporter={true}
              />
            ))}
            
            {filteredIssues.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg text-gray-900 mb-2">No issues match your filters</h4>
                  <p className="text-gray-600">Try adjusting your filter criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Issue Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Interactive map view</p>
                  <p className="text-xs text-gray-500">Shows all reported issues by location</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Hotspots */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {locationHotspots.map((hotspot, index) => (
                  <div key={hotspot.location} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-900">{hotspot.location}</span>
                    </div>
                    <Badge variant="secondary">{hotspot.count} issues</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.map(issue => (
                  <div key={issue.id} className="border-l-4 border-blue-200 pl-3">
                    <p className="text-sm text-gray-900 font-medium line-clamp-1">
                      {issue.title}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {issue.location.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(issue.createdAt), 'MMM d, HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Workload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="w-5 h-5" />
                Department Workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departments.map(dept => {
                  const deptIssues = issues.filter(i => i.department === dept && i.status !== 'resolved' && i.status !== 'closed');
                  return (
                    <div key={dept} className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{dept}</span>
                      <Badge variant={deptIssues.length > 5 ? "destructive" : deptIssues.length > 2 ? "default" : "secondary"}>
                        {deptIssues.length} active
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}