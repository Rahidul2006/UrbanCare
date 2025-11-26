import { useState } from 'react';
import { MapPin, Clock, User, MessageCircle, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { ImageWithFallback } from './ImageWithFallback';
import { formatDistanceToNow } from 'date-fns';

export function IssueCard({ issue, showReporter = true, userRole }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-orange-100 text-orange-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'pothole': return '🕳️';
      case 'streetlight': return '💡';
      case 'trash': return '🗑️';
      case 'graffiti': return '🎨';
      case 'signage': return '🪧';
      case 'water': return '💧';
      case 'sidewalk': return '🚶';
      case 'other': return '📋';
      default: return '📋';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'submitted': return 20;
      case 'acknowledged': return 40;
      case 'in-progress': return 70;
      case 'resolved': return 100;
      case 'closed': return 100;
      default: return 0;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-2xl">{getCategoryIcon(issue.category)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{issue.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{issue.location.address}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor(issue.status)}>
                  {formatStatus(issue.status)}
                </Badge>
                <Badge className={getPriorityColor(issue.priority)}>
                  {issue.priority} priority
                </Badge>
                {userRole === 'admin' && (
                  <Badge variant="outline">
                    {issue.department}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Photo if available */}
        {issue.photos && issue.photos.length > 0 && (
          <div className="mb-4">
            <ImageWithFallback
              src={issue.photos[0]}
              alt="Issue photo"
              className="w-full h-48 object-cover rounded-lg"
            />
            {issue.photos.length > 1 && (
              <div className="text-xs text-gray-500 mt-1">
                +{issue.photos.length - 1} more photo{issue.photos.length > 2 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {/* Description preview */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {issue.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </div>
          {showReporter && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {issue.reportedBy.name}
            </div>
          )}
          {issue.estimatedResolution && issue.status !== 'resolved' && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              ETA: {formatDistanceToNow(new Date(issue.estimatedResolution))}
            </div>
          )}
        </div>

        {/* Assigned staff (admin view) */}
        {userRole === 'admin' && issue.assignedTo && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <div className="text-sm">
              <span className="text-gray-600">Assigned to:</span>
              <span className="font-medium text-blue-900 ml-1">
                {typeof issue.assignedTo === 'string' ? issue.assignedTo : `${issue.assignedTo.name} (${issue.assignedTo.department})`}
              </span>
            </div>
          </div>
        )}

        {/* Updates */}
        {issue.updates && issue.updates.length > 0 && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between p-0 h-auto"
            >
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <MessageCircle className="w-4 h-4" />
                {issue.updates.length} update{issue.updates.length !== 1 ? 's' : ''}
              </span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            {isExpanded && (
              <div className="space-y-2 border-l-2 border-gray-200 pl-4 ml-2">
                {issue.updates.map((update) => (
                  <div key={update.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 mb-1">{update.message}</p>
                    <div className="text-xs text-gray-500">
                      {update.author.name} • {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress indicator for citizen view */}
        {userRole === 'citizen' && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{getProgressPercentage(issue.status)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(issue.status)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
