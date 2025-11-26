import { useState } from 'react';
import { Plus, MapPin, Clock, CheckCircle, AlertCircle, Camera, History } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { ReportIssueForm } from './ReportIssueForm';
import { IssueCard } from './IssueCard';
import { mockIssues } from '../data/mockData';

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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl text-gray-900 mb-2">Welcome back, {currentUser.name}</h2>
        <p className="text-gray-600 mb-6">Report civic issues in your community and track their progress</p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl text-orange-600 mb-1">{stats.submitted}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl text-blue-600 mb-1">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl text-green-600 mb-1">{stats.resolved}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </CardContent>
          </Card>
        </div>

        {/* Report Issue Button */}
        <Button 
          onClick={() => setShowReportForm(true)}
          className="w-full h-14 text-lg mb-6"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Report New Issue
        </Button>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="my-reports" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-reports" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            My Reports
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Nearby Issues
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-reports" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl text-gray-900 mb-4">Your Reported Issues</h3>
            
            {userIssues.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg text-gray-900 mb-2">No issues reported yet</h4>
                  <p className="text-gray-600 mb-4">Start by reporting your first civic issue to help improve your community</p>
                  <Button onClick={() => setShowReportForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Report Your First Issue
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
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

        <TabsContent value="nearby" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl text-gray-900 mb-4">Issues in Your Area</h3>
            
            <div className="space-y-4">
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

            <Card className="mt-6">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Interactive Map Coming Soon</h4>
                <p className="text-gray-600 text-sm">
                  View all nearby issues on an interactive map to better understand your community's needs
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
