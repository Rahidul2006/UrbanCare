import { Issue, Department, Analytics } from '../types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing damage to vehicles near the intersection of Main St and Oak Ave. Water collects here during rain.',
    category: 'pothole',
    status: 'in-progress',
    priority: 'high',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main Street, Downtown'
    },
    photos: ['https://images.unsplash.com/photo-1641822558386-345b80dee126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Rob2xlJTIwc3RyZWV0JTIwZGFtYWdlfGVufDF8fHx8MTc1ODI5MjAxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    reportedBy: {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com'
    },
    assignedTo: {
      id: 'admin1',
      name: 'Mike Wilson',
      department: 'Public Works'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    department: 'Public Works',
    estimatedResolution: '2024-01-20T00:00:00Z',
    updates: [
      {
        id: 'u1',
        message: 'Issue reported and verified. Crew dispatched for assessment.',
        author: { name: 'Mike Wilson', role: 'admin' },
        timestamp: '2024-01-16T14:20:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Broken streetlight on Pine Avenue',
    description: 'Streetlight has been flickering for weeks and now completely out. Creates safety hazard at night.',
    category: 'streetlight',
    status: 'acknowledged',
    priority: 'medium',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Pine Avenue, Northside'
    },
    photos: ['https://images.unsplash.com/photo-1685992830281-2eef1f9bd3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzdHJlZXRsaWdodCUyMG5pZ2h0fGVufDF8fHx8MTc1ODI3MzU4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    reportedBy: {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria@example.com'
    },
    createdAt: '2024-01-14T18:45:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    department: 'Electrical Services',
    estimatedResolution: '2024-01-22T00:00:00Z',
    updates: [
      {
        id: 'u2',
        message: 'Report received and forwarded to electrical department.',
        author: { name: 'Sarah Martinez', role: 'admin' },
        timestamp: '2024-01-15T09:15:00Z'
      }
    ]
  },
  {
    id: '3',
    title: 'Overflowing trash bin at Central Park',
    description: 'Trash bin near playground has been overflowing for days. Attracting pests and creating unsanitary conditions.',
    category: 'trash',
    status: 'resolved',
    priority: 'medium',
    location: {
      latitude: 40.7850,
      longitude: -73.9686,
      address: 'Central Park, Playground Area'
    },
    photos: ['https://images.unsplash.com/photo-1648818170819-0dd78af84faa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVyZmxvd2luZyUyMHRyYXNoJTIwYmluJTIwZ2FyYmFnZXxlbnwxfHx8fDE3NTgzNTU4ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    reportedBy: {
      id: '3',
      name: 'David Chen',
      email: 'david@example.com'
    },
    assignedTo: {
      id: 'admin2',
      name: 'Lisa Park',
      department: 'Sanitation'
    },
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-01-14T11:30:00Z',
    resolvedAt: '2024-01-14T11:30:00Z',
    department: 'Sanitation',
    updates: [
      {
        id: 'u3',
        message: 'Trash bin emptied and schedule updated for more frequent collection.',
        author: { name: 'Lisa Park', role: 'admin' },
        timestamp: '2024-01-14T11:30:00Z'
      }
    ]
  },
  {
    id: '4',
    title: 'Damaged sidewalk creating trip hazard',
    description: 'Cracked and uneven sidewalk in front of library. Several people have tripped.',
    category: 'sidewalk',
    status: 'submitted',
    priority: 'high',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '789 Library Street, Midtown'
    },
    photos: [],
    reportedBy: {
      id: '4',
      name: 'Jennifer Wilson',
      email: 'jennifer@example.com'
    },
    createdAt: '2024-01-16T20:10:00Z',
    updatedAt: '2024-01-16T20:10:00Z',
    department: 'Public Works',
    updates: []
  },
  {
    id: '5',
    title: 'Graffiti on community center wall',
    description: 'Large graffiti tag on the side of the community center building facing the street.',
    category: 'graffiti',
    status: 'acknowledged',
    priority: 'low',
    location: {
      latitude: 40.7282,
      longitude: -73.7949,
      address: '321 Community Drive, Eastside'
    },
    photos: [],
    reportedBy: {
      id: '5',
      name: 'Robert Taylor',
      email: 'robert@example.com'
    },
    createdAt: '2024-01-13T14:30:00Z',
    updatedAt: '2024-01-14T08:45:00Z',
    department: 'Parks & Recreation',
    estimatedResolution: '2024-01-25T00:00:00Z',
    updates: [
      {
        id: 'u4',
        message: 'Graffiti removal scheduled for next week.',
        author: { name: 'Tom Anderson', role: 'admin' },
        timestamp: '2024-01-14T08:45:00Z'
      }
    ]
  }
];

export const mockDepartments: Department[] = [
  {
    id: 'pw',
    name: 'Public Works',
    description: 'Roads, potholes, sidewalks, and infrastructure',
    categories: ['pothole', 'sidewalk', 'water', 'signage']
  },
  {
    id: 'es',
    name: 'Electrical Services',
    description: 'Street lighting and electrical infrastructure',
    categories: ['streetlight']
  },
  {
    id: 'san',
    name: 'Sanitation',
    description: 'Waste management and cleanliness',
    categories: ['trash']
  },
  {
    id: 'pr',
    name: 'Parks & Recreation',
    description: 'Parks, recreational facilities, and public spaces',
    categories: ['graffiti', 'other']
  }
];

export const mockAnalytics: Analytics = {
  totalReports: 2456,
  resolvedReports: 2203,
  averageResolutionTime: 4.2, // days
  reportsByCategory: {
    pothole: 856,
    streetlight: 445,
    trash: 523,
    graffiti: 234,
    signage: 198,
    water: 87,
    sidewalk: 98,
    other: 15
  },
  reportsByStatus: {
    submitted: 67,
    acknowledged: 89,
    'in-progress': 97,
    resolved: 2003,
    closed: 200
  },
  reportsByDepartment: {
    'Public Works': 1239,
    'Electrical Services': 445,
    'Sanitation': 523,
    'Parks & Recreation': 249
  },
  trendsData: [
    { date: '2024-01-01', reports: 45, resolved: 42 },
    { date: '2024-01-02', reports: 38, resolved: 35 },
    { date: '2024-01-03', reports: 52, resolved: 48 },
    { date: '2024-01-04', reports: 41, resolved: 39 },
    { date: '2024-01-05', reports: 49, resolved: 45 },
    { date: '2024-01-06', reports: 33, resolved: 31 },
    { date: '2024-01-07', reports: 28, resolved: 26 },
    { date: '2024-01-08', reports: 56, resolved: 52 },
    { date: '2024-01-09', reports: 43, resolved: 40 },
    { date: '2024-01-10', reports: 47, resolved: 44 },
    { date: '2024-01-11', reports: 51, resolved: 47 },
    { date: '2024-01-12', reports: 39, resolved: 36 },
    { date: '2024-01-13', reports: 44, resolved: 41 },
    { date: '2024-01-14', reports: 58, resolved: 54 }
  ]
};