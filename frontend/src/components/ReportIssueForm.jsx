import { useState } from 'react';
import { ArrowLeft, Camera, MapPin, Upload, Mic, MicOff, Send } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';
import { Badge } from './badge';
import { ImageWithFallback } from './ImageWithFallback';

export function ReportIssueForm({ currentUser, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    photos: [],
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

  const handlePhotoUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        };
      });
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      alert('Please enter an issue title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (!formData.location.address.trim()) {
      alert('Please provide a location');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📤 Form validation passed, preparing to submit...');
      console.log('Submitting issue with data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        userId: currentUser.id
      });

      const response = await fetch('http://localhost:5000/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          location: {
            address: formData.location.address.trim(),
            latitude: formData.location.latitude || null,
            longitude: formData.location.longitude || null
          },
          userId: currentUser.id
        })
      });

      console.log('📥 Response received, status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);

      if (!response.ok) {
        console.error('❌ Server error:', data);
        const errorMsg = data.error || 'Unknown error';
        console.error('Full error:', errorMsg);
        alert(`Failed to submit issue: ${errorMsg}`);
        setIsSubmitting(false);
        return;
      }

      if (!data.issue || !data.issue.id) {
        console.error('❌ Invalid response:', data);
        alert('Error: Invalid response from server');
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Issue submitted successfully:', data);

      // Format the response to include photos for frontend display only
      const newIssue = {
        id: data.issue.id,
        title: data.issue.title,
        description: data.issue.description,
        category: data.issue.category,
        status: data.issue.status,
        priority: data.issue.priority,
        location: data.issue.location,
        photos: formData.photos || [],  // Use locally stored photos for display
        reportedBy: data.issue.reportedBy,
        department: data.issue.department,
        createdAt: data.issue.createdAt,
        updatedAt: data.issue.updatedAt,
        updates: []
      };

      console.log('Calling onSubmit with issue:', newIssue);
      onSubmit(newIssue);
    } catch (error) {
      console.error('Error submitting issue:', error);
      const errorMsg = error?.message || 'Network error or server not responding';
      alert(`Error submitting issue: ${errorMsg}. Please check that the server is running on http://localhost:5000`);
      setIsSubmitting(false);
    }
  };

  const getDepartmentForCategory = (category) => {
    const categoryMap = {
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
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-slate-100">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl relative z-10">
        <div className="mb-8">
          <Button variant="ghost" onClick={onCancel} className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Report an Issue</h2>
          <p className="text-slate-600 text-lg">Help improve your community by reporting civic issues</p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Issue Category */}
        <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-200/60 shadow-md hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">What type of issue are you reporting?</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(category => (
              <button
                key={category.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                className={`group h-auto p-4 flex flex-col items-center gap-2 rounded-xl transition-all duration-300 ${
                  formData.category === category.value
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-400/50 shadow-lg'
                    : 'bg-slate-50 text-slate-700 ring-1.5 ring-slate-200/60 hover:ring-slate-300/80 hover:bg-slate-100'
                }`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{category.icon}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Issue Details */}
        <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-200/60 shadow-md hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Describe the Issue</h3>
          <div className="space-y-5">
            <div>
              <Label htmlFor="title" className="text-slate-700 font-medium mb-2">Issue Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="ring-1 ring-slate-200/60 focus:ring-blue-400 border-0"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-700 font-medium mb-2">Detailed Description</Label>
              <div className="relative">
                <Textarea
                  id="description"
                  placeholder="Provide more details about the issue, its location, and impact"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="ring-1 ring-slate-200/60 focus:ring-blue-400 border-0"
                  rows={4}
                  required
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={toggleRecording}
                  className={`absolute bottom-2 right-2 transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              {isRecording && (
                <div className="text-sm text-red-600 mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  Recording... (speak now)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-200/60 shadow-md hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Location</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-slate-700 font-medium mb-2">Address or Description</Label>
              <Input
                id="address"
                placeholder="Enter address or location description"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, address: e.target.value }
                }))}
                className="ring-1 ring-slate-200/60 focus:ring-blue-400 border-0"
                required
              />
            </div>
            
            <button
              type="button"
              onClick={handleLocationDetect}
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Use Current Location
            </button>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl p-6 ring-1 ring-slate-200/60 shadow-md hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Photos (Optional)</h3>
          <div className="space-y-4">
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <ImageWithFallback
                      src={typeof photo === 'string' ? photo : photo.url}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl ring-1 ring-slate-200/60 group-hover:ring-slate-300/80 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-8 text-center transition-all bg-slate-50/50 hover:bg-slate-50">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photos" className="cursor-pointer block">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium mb-3">Add photos to help identify the issue</p>
                <span className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all">
                  <Upload className="w-4 h-4" />
                  Choose Photos
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2 pb-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-xl bg-white ring-1.5 ring-slate-200/60 hover:ring-slate-300/80 text-slate-700 font-semibold transition-all hover:shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Report
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
