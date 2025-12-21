export const centralAdminUsers = [
  {
    id: 'central-admin-1',
    email: 'central.admin@city.gov',
    name: 'Sarah Johnson',
    role: 'central-admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612a94c?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'central-admin-2',
    email: 'system.admin@city.gov',
    name: 'Michael Chen',
    role: 'central-admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
];

export const centralAdminDepartments = [
  {
    id: '1',
    name: 'Public Works',
    description: 'Road maintenance, infrastructure, and streetlights',
    categories: ['pothole', 'streetlight', 'signage']
  },
  {
    id: '2',
    name: 'Sanitation',
    description: 'Waste management and cleanliness',
    categories: ['trash', 'graffiti']
  },
  {
    id: '3',
    name: 'Parks & Recreation',
    description: 'Park maintenance and recreational facilities',
    categories: ['other']
  },
  {
    id: '4',
    name: 'Water Management',
    description: 'Water supply and drainage systems',
    categories: ['water']
  },
  {
    id: '5',
    name: 'Transportation',
    description: 'Traffic management and sidewalk maintenance',
    categories: ['sidewalk']
  }
];

export const centralAdminIssues = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Dangerous pothole causing vehicle damage near the intersection with Oak Avenue',
    category: 'pothole',
    status: 'in-progress',
    priority: 'high',
    location: {
      address: '1234 Main Street',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    images: ['https://images.unsplash.com/photo-1641822558386-345b80dee126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3Rob2xlJTIwc3RyZWV0JTIwZGFtYWdlfGVufDF8fHx8MTc1ODI5MjAxNXww&ixlib=rb-4.1.0&q=80&w=1080'],
    submittedBy: '1',
    submittedAt: new Date('2024-01-15T10:30:00'),
    assignedTo: '3',
    assignedDepartment: 'Public Works',
    estimatedResolution: new Date('2024-01-20T17:00:00'),
    updates: [
      {
        id: '1',
        issueId: '1',
        message: 'Report acknowledged. Inspection scheduled for tomorrow.',
        author: { name: 'Mike Chen', role: 'admin' },
        timestamp: '2024-01-15T14:00:00'
      },
      {
        id: '2',
        issueId: '1',
        message: 'Work crew dispatched to location. Repair in progress.',
        author: { name: 'Mike Chen', role: 'admin' },
        timestamp: '2024-01-16T09:00:00'
      }
    ]
  },
  {
    id: '2',
    title: 'Broken streetlight',
    description: 'Streetlight not working, creating unsafe conditions at night',
    category: 'streetlight',
    status: 'acknowledged',
    priority: 'medium',
    location: {
      address: '567 Elm Street',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    images: ['https://images.unsplash.com/photo-1695236200077-f61c1450f21a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzdHJlZXRsaWdodCUyMHVyYmFufGVufDF8fHx8MTc1ODM0OTY1MHww&ixlib=rb-4.1.0&q=80&w=1080'],
    submittedBy: '1',
    submittedAt: new Date('2024-01-17T19:45:00'),
    assignedTo: '3',
    assignedDepartment: 'Public Works',
    updates: [
      {
        id: '3',
        issueId: '2',
        message: 'Report received and logged. Electrician will be dispatched.',
        author: { name: 'Mike Chen', role: 'admin' },
        timestamp: '2024-01-18T08:00:00'
      }
    ]
  },
  {
    id: '3',
    title: 'Overflowing garbage bin',
    description: 'Public trash bin overflowing, attracting pests and creating unsanitary conditions',
    category: 'trash',
    status: 'resolved',
    priority: 'medium',
    location: {
      address: '890 Park Avenue',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    images: ['https://images.unsplash.com/photo-1707038368897-ccac635fbbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhvdmVyZmxvd2luZyUyMGdhcmJhZ2UlMjBiaW58ZW58MXx8fHwxNzU4MzYxNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    submittedBy: '1',
    submittedAt: new Date('2024-01-10T12:15:00'),
    assignedTo: '4',
    assignedDepartment: 'Sanitation',
    actualResolution: new Date('2024-01-12T10:30:00'),
    resolvedAt: new Date('2024-01-12T10:30:00'),
    updates: [
      {
        id: '4',
        issueId: '3',
        message: 'Sanitation crew dispatched to empty bin.',
        author: { name: 'Lisa Rodriguez', role: 'admin' },
        timestamp: '2024-01-11T09:00:00'
      },
      {
        id: '5',
        issueId: '3',
        message: 'Bin emptied and cleaned. Issue resolved.',
        author: { name: 'Lisa Rodriguez', role: 'admin' },
        timestamp: '2024-01-12T10:30:00'
      }
    ]
  },
  {
    id: '4',
    title: 'Graffiti on public building',
    description: 'Vandalism on the side of the community center building',
    category: 'graffiti',
    status: 'submitted',
    priority: 'low',
    location: {
      address: '123 Community Drive',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    images: ['https://images.unsplash.com/photo-1589823991945-c4b2a5c7e62b?w=800&h=600&fit=crop'],
    submittedBy: '1',
    submittedAt: new Date('2024-01-18T16:20:00'),
    updates: []
  },
  {
    id: '5',
    title: 'Damaged sidewalk',
    description: 'Cracked and uneven sidewalk creating trip hazard',
    category: 'sidewalk',
    status: 'in-progress',
    priority: 'high',
    location: {
      address: '456 Broadway Street',
      coordinates: { lat: 40.7614, lng: -73.9776 }
    },
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    submittedBy: '2',
    submittedAt: new Date('2024-01-19T11:30:00'),
    assignedDepartment: 'Transportation',
    updates: [
      {
        id: '6',
        issueId: '5',
        message: 'Issue has been assessed. Repair crew scheduled.',
        author: { name: 'Transportation Dept', role: 'admin' },
        timestamp: '2024-01-19T15:00:00'
      }
    ]
  },
  {
    id: '6',
    title: 'Water main leak',
    description: 'Water pooling on street due to underground leak',
    category: 'water',
    status: 'acknowledged',
    priority: 'urgent',
    location: {
      address: '789 Water Street',
      coordinates: { lat: 40.7480, lng: -73.9857 }
    },
    images: ['https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&h=600&fit=crop'],
    submittedBy: '3',
    submittedAt: new Date('2024-01-20T08:15:00'),
    assignedDepartment: 'Water Management',
    updates: [
      {
        id: '7',
        issueId: '6',
        message: 'Emergency crew has been notified. Response imminent.',
        author: { name: 'Water Management', role: 'admin' },
        timestamp: '2024-01-20T08:45:00'
      }
    ]
  }
];

export const centralAdminAnalytics = {
  totalReports: 156,
  resolvedReports: 89,
  totalIssues: 156,
  resolvedIssues: 89,
  averageResolutionTime: 3.2,
  reportsByCategory: {
    pothole: 45,
    streetlight: 23,
    trash: 34,
    signage: 18,
    graffiti: 12,
    water: 15,
    sidewalk: 9,
    other: 24
  },
  issuesByCategory: {
    pothole: 45,
    streetlight: 23,
    trash: 34,
    signage: 18,
    graffiti: 12,
    water: 15,
    sidewalk: 9,
    other: 24
  },
  reportsByStatus: {
    submitted: 23,
    acknowledged: 18,
    'in-progress': 26,
    resolved: 89,
    closed: 0
  },
  issuesByStatus: {
    submitted: 23,
    acknowledged: 18,
    'in-progress': 26,
    resolved: 89,
    closed: 0
  },
  issuesByPriority: {
    low: 34,
    medium: 67,
    high: 43,
    urgent: 12
  },
  reportsByDepartment: {
    'Public Works': 86,
    'Sanitation': 47,
    'Parks & Recreation': 12,
    'Water Management': 15,
    'Transportation': 23
  },
  departmentPerformance: [
    {
      department: 'Public Works',
      totalAssigned: 86,
      resolved: 54,
      averageTime: 4.1
    },
    {
      department: 'Sanitation',
      totalAssigned: 47,
      resolved: 35,
      averageTime: 2.3
    },
    {
      department: 'Parks & Recreation',
      totalAssigned: 12,
      resolved: 8,
      averageTime: 5.2
    },
    {
      department: 'Water Management',
      totalAssigned: 15,
      resolved: 12,
      averageTime: 1.8
    },
    {
      department: 'Transportation',
      totalAssigned: 23,
      resolved: 15,
      averageTime: 3.7
    }
  ],
  monthlyTrends: [
    { month: 'Sep', submitted: 23, resolved: 18 },
    { month: 'Oct', submitted: 34, resolved: 28 },
    { month: 'Nov', submitted: 45, resolved: 39 },
    { month: 'Dec', submitted: 32, resolved: 31 },
    { month: 'Jan', submitted: 22, resolved: 15 }
  ],
  trendsData: [
    { date: '2024-01-07', reports: 5, resolved: 3 },
    { date: '2024-01-08', reports: 8, resolved: 6 },
    { date: '2024-01-09', reports: 3, resolved: 4 },
    { date: '2024-01-10', reports: 7, resolved: 5 },
    { date: '2024-01-11', reports: 4, resolved: 7 },
    { date: '2024-01-12', reports: 6, resolved: 8 },
    { date: '2024-01-13', reports: 9, resolved: 4 },
    { date: '2024-01-14', reports: 2, resolved: 6 },
    { date: '2024-01-15', reports: 11, resolved: 9 },
    { date: '2024-01-16', reports: 7, resolved: 12 },
    { date: '2024-01-17', reports: 5, resolved: 8 },
    { date: '2024-01-18', reports: 8, resolved: 6 },
    { date: '2024-01-19', reports: 12, resolved: 10 },
    { date: '2024-01-20', reports: 6, resolved: 7 }
  ]
};
