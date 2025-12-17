import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, CheckCircle, Users, AlertTriangle, Zap, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export function AdminAnalytics({ analytics, issues }) {
  const categoryData = Object.entries(analytics.reportsByCategory || {}).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count
  }));

  const statusData = Object.entries(analytics.reportsByStatus || {}).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));

  const departmentData = Object.entries(analytics.reportsByDepartment || {}).map(([department, count]) => ({
    department,
    count
  }));

  const resolutionTimeData = [
    { department: 'Public Works', avgDays: 4.2 },
    { department: 'Electrical', avgDays: 3.8 },
    { department: 'Sanitation', avgDays: 2.1 },
    { department: 'Parks & Rec', avgDays: 5.5 }
  ];

  const getResolutionRate = () => {
    return ((analytics.resolvedReports / analytics.totalReports) * 100).toFixed(1);
  };

  const getActiveIssues = () => {
    return analytics.totalReports - analytics.resolvedReports;
  };

  const getAvgResponseTime = () => {
    return '2.3 hours';
  };

  const getTopPerformingDepartment = () => {
    const deptPerformance = Object.entries(analytics.reportsByDepartment || {}).map(([dept, total]) => {
      const resolved = issues.filter(i => i.department === dept && i.status === 'resolved').length;
      return { dept, rate: (resolved / total) * 100 };
    });
    
    return deptPerformance.sort((a, b) => b.rate - a.rate)[0]?.dept || 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-blue-100/20 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative p-8 space-y-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Analytics Dashboard</h2>
          </div>
          <p className="text-sm text-gray-600 ml-0 sm:ml-11">Track performance, trends, and insights across all departments</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="relative rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 bg-green-100 px-2.5 py-1 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-bold text-green-600">+12%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analytics.totalReports}</div>
              <div className="text-sm text-gray-600 mt-2">Total Reports</div>
              <div className="text-xs text-gray-500 mt-3">This month</div>
            </CardContent>
          </Card>
        </div>

        {/* Resolution Rate */}
        <div className="relative rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <Card className="border-2 border-green-200 hover:border-green-300 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center gap-1 bg-green-100 px-2.5 py-1 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-bold text-green-600">+2.3%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{getResolutionRate()}%</div>
              <div className="text-sm text-gray-600 mt-2">Resolution Rate</div>
              <div className="text-xs text-gray-500 mt-3">This month</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Issues */}
        <div className="relative rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <Card className="border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 bg-red-100 px-2.5 py-1 rounded-full">
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-xs font-bold text-red-600">-5%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{getActiveIssues()}</div>
              <div className="text-sm text-gray-600 mt-2">Active Issues</div>
              <div className="text-xs text-gray-500 mt-3">This week</div>
            </CardContent>
          </Card>
        </div>

        {/* Avg Resolution */}
        <div className="relative rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <Card className="border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 bg-green-100 px-2.5 py-1 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-bold text-green-600">-0.3</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analytics.averageResolutionTime}</div>
              <div className="text-sm text-gray-600 mt-2">Avg Resolution (days)</div>
              <div className="text-xs text-gray-500 mt-3">Improved</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reports by Category */}
        <Card className="border-2 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              Reports by Category
            </CardTitle>
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
                  <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #3b82f6', borderRadius: '0.5rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Reports by Status */}
        <Card className="border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              Issues by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="status" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #22c55e', borderRadius: '0.5rem' }} />
                  <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="border-2 border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-yellow-500"></div>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              Department Workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="department" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #f97316', borderRadius: '0.5rem' }} />
                  <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Time by Department */}
        <Card className="border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              Average Resolution Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resolutionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="department" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip formatter={(value) => [`${value} days`, 'Avg Resolution Time']} contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #a855f7', borderRadius: '0.5rem' }} />
                  <Bar dataKey="avgDays" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card className="border-2 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            Reporting Trends (Last 14 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trendsData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #0ea5e9', borderRadius: '0.5rem' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  name="New Reports"
                  dot={{ fill: '#0ea5e9', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  name="Resolved Issues"
                  dot={{ fill: '#22c55e', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl group-hover:shadow-lg transition-all">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Avg Response Time</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{getAvgResponseTime()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
          <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl group-hover:shadow-lg transition-all">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Top Department</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{getTopPerformingDepartment()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-yellow-500"></div>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl group-hover:shadow-lg transition-all">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Citizens</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">1,247</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
          <div className="h-1 w-full bg-gradient-to-r from-red-500 to-pink-500"></div>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl group-hover:shadow-lg transition-all">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Urgent Issues</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{issues.filter(i => i.priority === 'urgent' && i.status !== 'resolved').length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl border-2 border-green-200/50 hover:border-green-300 hover:shadow-md transition-all">
              <div className="p-2.5 bg-green-100 rounded-xl flex-shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-green-900">Resolution Rate Improved</div>
                <div className="text-sm text-green-700 mt-1">Achieved 89.7% resolution rate this month (+2.3%)</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="p-2.5 bg-blue-100 rounded-xl flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-blue-900">Faster Response Times</div>
                <div className="text-sm text-blue-700 mt-1">Average response time reduced to 2.3 hours</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl border-2 border-purple-200/50 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="p-2.5 bg-purple-100 rounded-xl flex-shrink-0 mt-0.5">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-purple-900">Increased Citizen Engagement</div>
                <div className="text-sm text-purple-700 mt-1">12% increase in reports submitted this month</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
