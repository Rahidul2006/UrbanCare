/**
 * Role-based color system for UrbanCare
 */

export const roleColors = {
  citizen: {
    primary: '#2563eb', // blue-600
    light: '#3b82f6', // blue-500
    lighter: '#60a5fa', // blue-400
    dark: '#1d4ed8', // blue-700
    darker: '#1e40af', // blue-800
    bg: 'bg-blue-600',
    bgHover: 'hover:bg-blue-700',
    bgLight: 'bg-blue-50',
    bgLighter: 'bg-blue-100',
    text: 'text-blue-600',
    textLight: 'text-blue-100',
    border: 'border-blue-200',
    ring: 'ring-blue-500',
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    gradient2: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-100 text-blue-800',
    button: 'bg-blue-600 hover:bg-blue-700',
    header: 'bg-blue-600',
    tab: 'bg-blue-100 text-blue-700',
    tabActive: 'bg-blue-600 text-white',
    accent: '#0ea5e9', // sky-500
  },
  admin: {
    primary: '#d97706', // amber-600
    light: '#f59e0b', // amber-500
    lighter: '#fbbf24', // amber-400
    dark: '#b45309', // amber-700
    darker: '#92400e', // amber-800
    bg: 'bg-amber-600',
    bgHover: 'hover:bg-amber-700',
    bgLight: 'bg-amber-50',
    bgLighter: 'bg-amber-100',
    text: 'text-amber-600',
    textLight: 'text-amber-100',
    border: 'border-amber-200',
    ring: 'ring-amber-500',
    gradient: 'from-amber-600 via-orange-700 to-red-800',
    gradient2: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-800',
    button: 'bg-amber-600 hover:bg-amber-700',
    header: 'bg-amber-600',
    tab: 'bg-amber-100 text-amber-700',
    tabActive: 'bg-amber-600 text-white',
    accent: '#f97316', // orange-500
  },
  'central-admin': {
    primary: '#a855f7', // purple-600
    light: '#c084fc', // purple-400
    lighter: '#d8b4fe', // purple-300
    dark: '#9333ea', // purple-700
    darker: '#6b21a8', // purple-800
    bg: 'bg-purple-600',
    bgHover: 'hover:bg-purple-700',
    bgLight: 'bg-purple-50',
    bgLighter: 'bg-purple-100',
    text: 'text-purple-600',
    textLight: 'text-purple-100',
    border: 'border-purple-200',
    ring: 'ring-purple-500',
    gradient: 'from-purple-600 via-purple-700 to-indigo-800',
    gradient2: 'from-purple-500 to-indigo-600',
    badge: 'bg-purple-100 text-purple-800',
    button: 'bg-purple-600 hover:bg-purple-700',
    header: 'bg-purple-600',
    tab: 'bg-purple-100 text-purple-700',
    tabActive: 'bg-purple-600 text-white',
    accent: '#ec4899', // pink-500
  },
};

export const getColorByRole = (role) => {
  return roleColors[role] || roleColors.citizen;
};

export const getLandingGradient = (role) => {
  const gradients = {
    citizen: 'from-blue-600 via-indigo-700 to-purple-800',
    admin: 'from-amber-600 via-orange-700 to-red-800',
    'central-admin': 'from-purple-600 via-indigo-700 to-blue-800',
  };
  return gradients[role] || gradients.citizen;
};
