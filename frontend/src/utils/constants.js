export const TRAVEL_STYLES = [
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'luxury', label: 'Luxury', icon: '✨' },
  { value: 'budget', label: 'Budget', icon: '💰' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'romantic', label: 'Romantic', icon: '💑' },
  { value: 'solo', label: 'Solo', icon: '🎒' },
  { value: 'cultural', label: 'Cultural', icon: '🏛️' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'food', label: 'Food Exploration', icon: '🍜' },
];

export const ACCOMMODATION_TYPES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'resort', label: 'Resort' },
  { value: 'boutique', label: 'Boutique Hotel' },
  { value: 'camping', label: 'Camping' },
];

export const TRANSPORTATION_MODES = [
  { value: 'flight', label: 'Flight' },
  { value: 'train', label: 'Train' },
  { value: 'bus', label: 'Bus' },
  { value: 'car', label: 'Car' },
  { value: 'walking', label: 'Walking' },
  { value: 'mixed', label: 'Mixed' },
];

export const EXPENSE_CATEGORIES = [
  { value: 'transportation', label: 'Transportation', icon: '✈️', color: '#3B82F6' },
  { value: 'accommodation', label: 'Accommodation', icon: '🏨', color: '#8B5CF6' },
  { value: 'food', label: 'Food & Dining', icon: '🍜', color: '#F59E0B' },
  { value: 'activities', label: 'Activities', icon: '🎭', color: '#22D3EE' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: '#EC4899' },
  { value: 'miscellaneous', label: 'Miscellaneous', icon: '📦', color: '#94A3B8' },
];

export const NODE_TYPES = {
  city: { label: 'City', color: '#3B82F6', icon: '🏙️' },
  destination: { label: 'Destination', color: '#22D3EE', icon: '📍' },
  attraction: { label: 'Attraction', color: '#8B5CF6', icon: '⭐' },
  hotel: { label: 'Hotel', color: '#F59E0B', icon: '🏨' },
  restaurant: { label: 'Restaurant', color: '#EC4899', icon: '🍽️' },
  airport: { label: 'Airport', color: '#6366F1', icon: '✈️' },
  railway: { label: 'Railway Station', color: '#14B8A6', icon: '🚂' },
  bus: { label: 'Bus Station', color: '#84CC16', icon: '🚌' },
  nature: { label: 'Nature', color: '#10B981', icon: '🌿' },
};

export const EDGE_TYPES = {
  road: { label: 'Road', color: '#94A3B8' },
  railway: { label: 'Railway', color: '#14B8A6' },
  flight: { label: 'Flight', color: '#3B82F6' },
  walking: { label: 'Walking', color: '#10B981' },
  nearby: { label: 'Nearby', color: '#8B5CF6', dashed: true },
  recommended: { label: 'Recommended', color: '#F59E0B', dashed: true },
};

export const CURRENCY_LIST = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
];

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    profile: '/auth/profile',
  },
  trips: {
    list: '/trips',
    create: '/trips',
    get: (id) => `/trips/${id}`,
    update: (id) => `/trips/${id}`,
    delete: (id) => `/trips/${id}`,
    duplicate: (id) => `/trips/${id}/duplicate`,
    share: (id) => `/trips/${id}/share`,
  },
  ai: {
    generate: '/ai/generate-itinerary',
    regenerate: '/ai/regenerate-itinerary',
    chat: '/ai/chat',
  },
  destinations: {
    list: '/destinations',
    get: (id) => `/destinations/${id}`,
    search: '/destinations/search',
    attractions: (id) => `/destinations/${id}/attractions`,
  },
  graph: {
    get: (tripId) => `/graph/${tripId}`,
    nodes: '/graph/nodes',
    updateNode: (id) => `/graph/nodes/${id}`,
    deleteNode: (id) => `/graph/nodes/${id}`,
    edges: '/graph/edges',
    deleteEdge: (id) => `/graph/edges/${id}`,
    shortestPath: '/graph/shortest-path',
  },
  expenses: {
    list: (tripId) => `/expenses/${tripId}`,
    create: '/expenses',
    update: (id) => `/expenses/${id}`,
    delete: (id) => `/expenses/${id}`,
    analytics: (tripId) => `/analytics/${tripId}`,
  },
  favorites: {
    list: '/favorites',
    add: '/favorites',
    remove: (id) => `/favorites/${id}`,
  },
  shared: {
    get: (token) => `/shared/${token}`,
  },
  health: '/health',
};

export const TRIP_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const DESTINATION_CATEGORIES = [
  { value: 'beach', label: 'Beach', icon: '🏖️' },
  { value: 'mountain', label: 'Mountain', icon: '⛰️' },
  { value: 'city', label: 'City', icon: '🏙️' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'cultural', label: 'Cultural', icon: '🏛️' },
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'island', label: 'Island', icon: '🏝️' },
  { value: 'historical', label: 'Historical', icon: '🗿' },
];
