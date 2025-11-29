import { useState } from 'react';
import { Plus, MapPin, Clock, CheckCircle, AlertCircle, Camera, History } from 'lucide-react';
import { ReportIssueForm } from './ReportIssueForm';
import { IssueCard } from './IssueCard';
import { mockIssues } from '../data/mockData';
import { roleColors } from '../utils/roleColors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export function CitizenInterface({ currentUser }) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [userIssues, setUserIssues] = useState(
    mockIssues.filter(issue => issue.reportedBy.id === currentUser.id)
  );

  const handleIssueSubmitted = (newIssue) => {
    setUserIssues(prev => [newIssue, ...prev]);
    setShowReportForm(false);
  };

  const getStatusStats = () => {
    const stats = {
      submitted: userIssues.filter(i => i.status === 'submitted').length,
      inProgress: userIssues.filter(i => i.status === 'in-progress' || i.status === 'acknowledged').length,
      resolved: userIssues.filter(i => i.status === 'resolved').length,
    };
    return stats;
  };

  const stats = getStatusStats();
  const colors = roleColors.citizen;

  if (showReportForm) {
    return (
      <ReportIssueForm 
        currentUser={currentUser}
        onSubmit={handleIssueSubmitted}
        onCancel={() => setShowReportForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-slate-100">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute -bottom-32 right-1/3 w-80 h-80 bg-blue-50/20 rounded-full mix-blend-screen filter blur-2xl" />
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl relative z-10">
        {/* Modern Header */}
        <div className="mb-12 bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Welcome back, {currentUser.name}</h2>
              <p className="text-slate-600 text-lg">Report civic issues in your community and track their progress</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 border-2 border-green-300">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 text-sm font-medium">Active</span>
            </div>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="group bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
              <p className="text-slate-600 text-sm font-medium mb-3">Pending Review</p>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold text-blue-600">{stats.submitted}</div>
                <AlertCircle className="w-5 h-5 text-blue-500/70 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="group bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-2xl p-6 hover:shadow-lg hover:border-amber-300 transition-all duration-300">
              <p className="text-slate-600 text-sm font-medium mb-3">In Progress</p>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold text-amber-600">{stats.inProgress}</div>
                <Clock className="w-5 h-5 text-amber-500/70 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="group bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300">
              <p className="text-slate-600 text-sm font-medium mb-3">Resolved</p>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold text-green-600">{stats.resolved}</div>
                <CheckCircle className="w-5 h-5 text-green-500/70 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>

          {/* Report Issue Button */}
          <button
            onClick={() => setShowReportForm(true)}
            className="w-full mt-10 h-14 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Report New Issue
          </button>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="my-reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border-2 border-slate-200 p-2 rounded-2xl">
            <TabsTrigger value="my-reports" className="flex items-center gap-2 text-slate-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-2 data-[state=active]:border-blue-300 rounded-xl transition-all font-medium">
              <History className="w-4 h-4" />
              My Reports
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex items-center gap-2 text-slate-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-2 data-[state=active]:border-blue-300 rounded-xl transition-all font-medium">
              <MapPin className="w-4 h-4" />
              Nearby Issues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reports" className="mt-8">
            <div className="space-y-8">
              <h3 className="text-2xl text-slate-900 font-semibold">Your Reported Issues</h3>
              
              {userIssues.length === 0 ? (
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-16 text-center hover:shadow-md transition-all duration-300">
                  <Camera className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                  <h4 className="text-xl text-slate-900 font-semibold mb-3">No issues reported yet</h4>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">Start by reporting your first civic issue to help improve your community and make a difference</p>
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Report Your First Issue
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {userIssues.map(issue => (
                    <IssueCard 
                      key={issue.id} 
                      issue={issue} 
                      showReporter={false}
                      userRole="citizen"
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nearby" className="mt-8">
            <div className="space-y-8">
              <h3 className="text-2xl text-slate-900 font-semibold">Issues in Your Area</h3>
              
              <div className="space-y-6">
                {mockIssues
                  .filter(issue => issue.reportedBy.id !== currentUser.id)
                  .slice(0, 3)
                  .map(issue => (
                    <IssueCard 
                      key={issue.id} 
                      issue={issue} 
                      showReporter={true}
                      userRole="citizen"
                    />
                  ))}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-3xl p-12 text-center hover:shadow-md hover:border-blue-300 transition-all duration-300">
                <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Interactive Map Coming Soon</h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  View all nearby issues on an interactive map to better understand your community's needs and contribute to solutions
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
