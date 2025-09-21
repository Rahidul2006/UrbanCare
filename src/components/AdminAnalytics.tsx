import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, CheckCircle, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Analytics, Issue } from '../types';

interface AdminAnalyticsProps {
  analytics: Analytics;
  issues: Issue[];
}

export function AdminAnalytics({ analytics, issues }: AdminAnalyticsProps) {
  const categoryData = Object.entries(analytics.reportsByCategory).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count
  }));

  const statusData = Object.entries(analytics.reportsByStatus).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));

  const departmentData = Object.entries(analytics.reportsByDepartment).map(([department, count]) => ({
    department,
    count
  }));

  const resolutionTimeData = [
    { department: 'Public Works', avgDays: 4.2 },
    { department: 'Electrical', avgDays: 3.8 },
    { department: 'Sanitation', avgDays: 2.1 },
    { department: 'Parks & Rec', avgDays: 5.5 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  const getResolutionRate = () => {
    return ((analytics.resolvedReports / analytics.totalReports) * 100).toFixed(1);
  };

  const getActiveIssues = () => {
    return analytics.totalReports - analytics.resolvedReports;
  };

  const getAvgResponseTime = () => {
    // Mock calculation for average response time
    return '2.3 hours';
  };

  const getTopPerformingDepartment = () => {
    const deptPerformance = Object.entries(analytics.reportsByDepartment).map(([dept, total]) => {
      const resolved = issues.filter(i => i.department === dept && i.status === 'resolved').length;
      return { dept, rate: (resolved / total) * 100 };
    });
    
    return deptPerformance.sort((a, b) => b.rate - a.rate)[0]?.dept || 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-blue-600 mb-1">{analytics.totalReports}</div>
            <div className="text-sm text-gray-600">Total Reports</div>
            <div className="text-xs text-green-600 mt-1">+12% this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-green-600 mb-1">{getResolutionRate()}%</div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
            <div className="text-xs text-green-600 mt-1">+2.3% this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-orange-600 mb-1">{getActiveIssues()}</div>
            <div className="text-sm text-gray-600">Active Issues</div>
            <div className="text-xs text-red-600 mt-1">-5% this week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-purple-600 mb-1">{analytics.averageResolutionTime}</div>
            <div className="text-sm text-gray-600">Avg Resolution (days)</div>
            <div className="text-xs text-green-600 mt-1">-0.3 days improved</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reports by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Reports by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Time by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Average Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resolutionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} days`, 'Avg Resolution Time']} />
                  <Bar dataKey="avgDays" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Reporting Trends (Last 14 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="New Reports"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Resolved Issues"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Avg Response Time</div>
                <div className="text-sm text-gray-600">{getAvgResponseTime()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Top Department</div>
                <div className="text-sm text-gray-600">{getTopPerformingDepartment()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium">Active Citizens</div>
                <div className="text-sm text-gray-600">1,247 reporters</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium">Urgent Issues</div>
                <div className="text-sm text-gray-600">
                  {issues.filter(i => i.priority === 'urgent' && i.status !== 'resolved').length} pending
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900">Resolution Rate Improved</div>
                <div className="text-sm text-green-700">Achieved 89.7% resolution rate this month (+2.3%)</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Faster Response Times</div>
                <div className="text-sm text-blue-700">Average response time reduced to 2.3 hours</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-900">Increased Citizen Engagement</div>
                <div className="text-sm text-purple-700">12% increase in reports submitted this month</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}