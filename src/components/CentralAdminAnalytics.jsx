import { Card, CardHeader, CardContent, CardTitle } from './card';
import { Badge } from './badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { centralAdminAnalytics } from '../data/centralAdminData';
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function CentralAdminAnalytics({ analytics = centralAdminAnalytics, issues = [] }) {
  // Safety check for analytics data
  if (!analytics) {
    return <div className="text-center py-12 text-gray-600">No analytics data available</div>;
  }

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

  return (
    <div className="space-y-6 w-full">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-5 md:p-6 bg-gradient-to-br from-green-500 to-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-green-100">Resolution Rate</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">
                  {Math.round(((analytics.resolvedIssues || analytics.resolvedReports || 0) / (analytics.totalIssues || analytics.totalReports || 1)) * 100)}%
                </p>
              </div>
              <div className="bg-white/20 p-2 md:p-3 rounded-full">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs md:text-sm text-green-100">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-white mr-1 flex-shrink-0" />
              <span className="font-semibold">+5.2%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-5 md:p-6 bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-blue-100">Avg Resolution Time</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">{analytics.averageResolutionTime}d</p>
              </div>
              <div className="bg-white/20 p-2 md:p-3 rounded-full">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs md:text-sm text-blue-100">
              <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-white mr-1 flex-shrink-0" />
              <span className="text-white font-semibold">-0.5d</span>
              <span className="ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-5 md:p-6 bg-gradient-to-br from-orange-500 to-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-orange-100">Active Issues</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">
                  {(analytics.totalIssues || analytics.totalReports || 0) - (analytics.resolvedIssues || analytics.resolvedReports || 0)}
                </p>
              </div>
              <div className="bg-white/20 p-2 md:p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs md:text-sm text-orange-100">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-white mr-1 flex-shrink-0" />
              <span className="text-white font-semibold">+12</span>
              <span className="ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardContent className="p-5 md:p-6 bg-gradient-to-br from-red-500 to-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-red-100">Urgent Issues</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-2">{analytics.issuesByPriority?.urgent || 0}</p>
              </div>
              <div className="bg-white/20 p-2 md:p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs md:text-sm text-red-100">
              <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-white mr-1 flex-shrink-0" />
              <span className="text-white font-semibold">-3</span>
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-base md:text-lg">Issues by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {categoryData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-base md:text-lg">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {statusData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
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
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {priorityData.length > 0 && (
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-base md:text-lg">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {analytics.monthlyTrends && analytics.monthlyTrends.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="submitted" stroke="#3B82F6" strokeWidth={2} name="Submitted" />
                    <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No trend data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      {analytics.departmentPerformance && analytics.departmentPerformance.length > 0 && (
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-base md:text-lg">Department Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {analytics.departmentPerformance.map((dept, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-gray-600">
                      <span>Total: {dept.totalAssigned}</span>
                      <span>•</span>
                      <span>Resolved: {dept.resolved}</span>
                      <span>•</span>
                      <span>Avg: {dept.averageTime}d</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant={
                      dept.resolved / dept.totalAssigned > 0.7 ? 'default' : 
                      dept.resolved / dept.totalAssigned > 0.5 ? 'secondary' : 'destructive'
                    }>
                      {Math.round((dept.resolved / dept.totalAssigned) * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trends Chart */}
      {analytics.trendsData && analytics.trendsData.length > 0 && (
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Reporting Trends (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.trendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="New Reports"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#10B981" 
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-base">This Week</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Issues:</span>
                <span className="font-semibold text-gray-900">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolved:</span>
                <span className="font-semibold text-green-600">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress:</span>
                <span className="font-semibold text-orange-600">15</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Issues:</span>
                <span className="font-semibold text-gray-900">87</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolved:</span>
                <span className="font-semibold text-green-600">72</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overdue:</span>
                <span className="font-semibold text-red-600">5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
          <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="text-base">Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {categoryData.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.category}:</span>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
