import React, { useState } from 'react';
import { BarChart3, Filter, MapPin, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { AdminDashboard } from './AdminDashboard';
import { IssueManagement } from './IssueManagement';
import { AdminAnalytics } from './AdminAnalytics';
import { mockIssues, mockAnalytics } from '../data/mockData';
import { Issue } from '../types';

interface AdminInterfaceProps {
  currentUser: any;
}

export function AdminInterface({ currentUser }: AdminInterfaceProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [issues, setIssues] = useState<Issue[]>(mockIssues);

  const handleIssueUpdate = (updatedIssue: Issue) => {
    setIssues(prev => prev.map(issue => 
      issue.id === updatedIssue.id ? updatedIssue : issue
    ));
  };

  const getDashboardStats = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const totalIssues = issues.length;
    const pendingIssues = issues.filter(i => i.status === 'submitted' || i.status === 'acknowledged').length;
    const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
    const resolvedToday = issues.filter(i => 
      i.status === 'resolved' && 
      new Date(i.resolvedAt || '').toDateString() === today.toDateString()
    ).length;

    const urgentIssues = issues.filter(i => 
      i.priority === 'urgent' && 
      i.status !== 'resolved' && 
      i.status !== 'closed'
    ).length;

    return {
      totalIssues,
      pendingIssues,
      inProgressIssues,
      resolvedToday,
      urgentIssues
    };
  };

  const stats = getDashboardStats();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl text-gray-900 mb-2">Administrative Dashboard</h2>
        <p className="text-gray-600">
          Manage civic issues, track progress, and monitor departmental performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-blue-600 mb-1">{stats.totalIssues}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-orange-600 mb-1">{stats.pendingIssues}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-purple-600 mb-1">{stats.inProgressIssues}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-green-600 mb-1">{stats.resolvedToday}</div>
            <div className="text-sm text-gray-600">Resolved Today</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-red-600 mb-1">{stats.urgentIssues}</div>
            <div className="text-sm text-gray-600">Urgent Issues</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Issue Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <AdminDashboard 
            issues={issues}
            currentUser={currentUser}
            onIssueUpdate={handleIssueUpdate}
          />
        </TabsContent>

        <TabsContent value="issues" className="mt-6">
          <IssueManagement 
            issues={issues}
            currentUser={currentUser}
            onIssueUpdate={handleIssueUpdate}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AdminAnalytics 
            analytics={mockAnalytics}
            issues={issues}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}