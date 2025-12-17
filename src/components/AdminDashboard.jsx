import { useState } from 'react';
import { MapPin, AlertTriangle, Clock, User2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { IssueCard } from './IssueCard';
import { format } from 'date-fns';

export function AdminDashboard({ issues, currentUser, onIssueUpdate }) {
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
    const locationCounts = {};
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
    <div className="space-y-8">
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Issue Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">All Issues</h3>
              <p className="text-sm text-gray-600 mt-1">Total: {filteredIssues.length} issues</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                <SelectTrigger className="w-40 border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                <SelectTrigger className="w-48 border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-12 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No issues match your filters</h4>
                  <p className="text-gray-600">Try adjusting your filter criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card className="border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Issue Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg h-48 flex items-center justify-center border-t border-blue-100">
                <div className="text-center px-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Interactive map view</p>
                  <p className="text-xs text-gray-600 mt-1">Shows all reported issues by location</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Hotspots */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
              <CardTitle>Problem Areas</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {locationHotspots.map((hotspot, index) => (
                  <div key={hotspot.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{hotspot.location}</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{hotspot.count} issues</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentIssues.map(issue => (
                  <div key={issue.id} className="p-3 bg-gradient-to-r from-amber-50 to-transparent rounded-lg border-l-4 border-amber-500 hover:bg-amber-50 transition-colors">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {issue.title}
                    </p>
                    <p className="text-xs text-gray-600 mb-1 mt-1">
                      {issue.location.address}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {format(new Date(issue.createdAt), 'MMM d, HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Workload */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <User2 className="w-5 h-5 text-green-600" />
                Department Workload
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
