import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { centralAdminAnalytics } from '../data/centralAdminData';
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Analytics, Issue } from '../types';

interface CentralAdminAnalyticsProps {
  analytics?: Analytics;
  issues?: Issue[];
}

export function CentralAdminAnalytics({ analytics = centralAdminAnalytics, issues = [] }: CentralAdminAnalyticsProps) {
  // Transform data for charts
  const categoryData = Object.entries(analytics.issuesByCategory || analytics.reportsByCategory || {}).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count
  }));

  const statusData = Object.entries(analytics.issuesByStatus || analytics.reportsByStatus || {}).map(([status, count]) => ({
    status: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
    count
  }));

  const priorityData = Object.entries(analytics.issuesByPriority || {}).map(([priority, count]) => ({
    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    count
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round(((analytics.resolvedIssues || analytics.resolvedReports || 0) / (analytics.totalIssues || analytics.totalReports || 1)) * 100)}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+5.2%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.averageResolutionTime}d</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">-0.5d</span>
              <span className="text-gray-600 ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Issues</p>
                <p className="text-3xl font-bold text-orange-600">
                  {(analytics.totalIssues || analytics.totalReports || 0) - (analytics.resolvedIssues || analytics.resolvedReports || 0)}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-orange-600 mr-1" />
              <span className="text-orange-600">+12</span>
              <span className="text-gray-600 ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Issues</p>
                <p className="text-3xl font-bold text-red-600">{analytics.issuesByPriority?.urgent || 12}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">-3</span>
              <span className="text-gray-600 ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {priorityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="submitted" stroke="#3B82F6" strokeWidth={2} name="Submitted" />
                <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      {analytics.departmentPerformance && (
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.departmentPerformance.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{dept.department}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Total: {dept.totalAssigned}</span>
                      <span>Resolved: {dept.resolved}</span>
                      <span>Avg Time: {dept.averageTime}d</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      dept.resolved / dept.totalAssigned > 0.7 ? 'default' : 
                      dept.resolved / dept.totalAssigned > 0.5 ? 'secondary' : 'destructive'
                    }>
                      {Math.round((dept.resolved / dept.totalAssigned) * 100)}% resolved
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trends Chart */}
      {analytics.trendsData && (
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
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">New Issues:</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolved:</span>
                <span className="font-medium text-green-600">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Progress:</span>
                <span className="font-medium text-orange-600">15</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">New Issues:</span>
                <span className="font-medium">87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolved:</span>
                <span className="font-medium text-green-600">72</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overdue:</span>
                <span className="font-medium text-red-600">5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryData.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{item.category}:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
