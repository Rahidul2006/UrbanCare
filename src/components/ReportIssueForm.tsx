import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin, Upload, Mic, MicOff, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Issue, IssueCategory } from '../types';

interface ReportIssueFormProps {
  currentUser: any;
  onSubmit: (issue: Issue) => void;
  onCancel: () => void;
}

export function ReportIssueForm({ currentUser, onSubmit, onCancel }: ReportIssueFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as IssueCategory | '',
    photos: [] as string[],
    location: {
      address: '',
      latitude: 40.7128,
      longitude: -74.0060
    }
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'pothole', label: 'Pothole', icon: '🕳️' },
    { value: 'streetlight', label: 'Street Light', icon: '💡' },
    { value: 'trash', label: 'Trash/Sanitation', icon: '🗑️' },
    { value: 'graffiti', label: 'Graffiti', icon: '🎨' },
    { value: 'signage', label: 'Damaged Signage', icon: '🪧' },
    { value: 'water', label: 'Water Issues', icon: '💧' },
    { value: 'sidewalk', label: 'Sidewalk', icon: '🚶' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }
        }));
      });
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, these would be uploaded to a server
      const mockUrls = Array.from(files).map((file, index) => 
        `https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400&h=300&mock=${Date.now()}-${index}`
      );
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...mockUrls]
      }));
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Mock voice recording - in real app would use Web Speech API
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setFormData(prev => ({
          ...prev,
          description: prev.description + (prev.description ? ' ' : '') + 
            'Large pothole causing vehicle damage near the main intersection.'
        }));
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category as IssueCategory,
      status: 'submitted',
      priority: 'medium',
      location: formData.location,
      photos: formData.photos,
      reportedBy: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      department: getDepartmentForCategory(formData.category as IssueCategory),
      updates: []
    };

    onSubmit(newIssue);
  };

  const getDepartmentForCategory = (category: IssueCategory): string => {
    const categoryMap: Record<IssueCategory, string> = {
      pothole: 'Public Works',
      streetlight: 'Electrical Services',
      trash: 'Sanitation',
      graffiti: 'Parks & Recreation',
      signage: 'Public Works',
      water: 'Public Works',
      sidewalk: 'Public Works',
      other: 'General Services'
    };
    return categoryMap[category] || 'General Services';
  };

  const isFormValid = formData.title && formData.description && formData.category && formData.location.address;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl text-gray-900 mb-2">Report an Issue</h2>
        <p className="text-gray-600">Help improve your community by reporting civic issues</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Issue Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What type of issue are you reporting?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(category => (
                <Button
                  key={category.value}
                  type="button"
                  variant={formData.category === category.value ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.value as IssueCategory }))}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm">{category.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Issue Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Describe the Issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Provide more details about the issue, its location, and impact"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              {isRecording && (
                <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  Recording... (speak now)
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address or Description</Label>
              <Input
                id="address"
                placeholder="Enter address or location description"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, address: e.target.value }
                }))}
                required
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleLocationDetect}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Use Current Location
            </Button>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photos (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <ImageWithFallback
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        photos: prev.photos.filter((_, i) => i !== index)
                      }))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photos" className="cursor-pointer">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Add photos to help identify the issue</p>
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photos
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </div>
  );
}