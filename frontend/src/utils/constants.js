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
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const INDIAN_STATES = [
  { code: 'RJ', name: 'Rajasthan', region: 'North', capital: 'Jaipur', famousFor: 'Forts, Palaces, Desert & Royal Heritage', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800' },
  { code: 'KL', name: 'Kerala', region: 'South', capital: 'Thiruvananthapuram', famousFor: 'Backwaters, Ayurveda, Houseboats & Tea Hills', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800' },
  { code: 'GA', name: 'Goa', region: 'West', capital: 'Panaji', famousFor: 'Pristine Beaches, Portuguese Forts & Nightlife', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800' },
  { code: 'HP', name: 'Himachal Pradesh', region: 'North', capital: 'Shimla', famousFor: 'Himalayan Valleys, Snow Passes & Pine Forests', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800' },
  { code: 'UK', name: 'Uttarakhand', region: 'North', capital: 'Dehradun', famousFor: 'Yoga, Holy Ganga, Trekking & Mountain Shrines', image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800' },
  { code: 'JK', name: 'Jammu and Kashmir', region: 'North', capital: 'Srinagar / Jammu', famousFor: 'Dal Lake Shikaras, Gulmarg Snow & Alpine Meadows', image: 'https://images.unsplash.com/photo-1566833910398-356ec39d783d?w=800' },
  { code: 'LA', name: 'Ladakh', region: 'North', capital: 'Leh', famousFor: 'Pangong Tso, Khardung La & Buddhist Monasteries', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800' },
  { code: 'MH', name: 'Maharashtra', region: 'West', capital: 'Mumbai', famousFor: 'Gateway of India, Western Ghats & Ancient Caves', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800' },
  { code: 'KA', name: 'Karnataka', region: 'South', capital: 'Bengaluru', famousFor: 'Hampi Ruins, Coorg Coffee Estates & Royal Mysore', image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c2c?w=800' },
  { code: 'TN', name: 'Tamil Nadu', region: 'South', capital: 'Chennai', famousFor: 'Dravidian Temples, Nilgiri Hills & Coastal Heritage', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800' },
  { code: 'WB', name: 'West Bengal', region: 'East', capital: 'Kolkata', famousFor: 'Darjeeling Himalayas, Colonial Architecture & Sunderbans', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800' },
  { code: 'UP', name: 'Uttar Pradesh', region: 'North', capital: 'Lucknow', famousFor: 'Taj Mahal, Sacred Varanasi Ghats & Awadhi Food', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800' },
  { code: 'SK', name: 'Sikkim', region: 'North-East', capital: 'Gangtok', famousFor: 'Kanchenjunga Views, Tsomgo Lake & Monasteries', image: 'https://images.unsplash.com/photo-1616447881729-1f4879f9064c?w=800' },
  { code: 'DL', name: 'Delhi (NCT)', region: 'North', capital: 'New Delhi', famousFor: 'Red Fort, Qutub Minar, Chandni Chowk & Street Food', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' },
  { code: 'GJ', name: 'Gujarat', region: 'West', capital: 'Gandhinagar', famousFor: 'White Desert of Kutch, Gir Asiatic Lions & Heritage', image: 'https://images.unsplash.com/photo-1596707328905-1a87db781d43?w=800' },
  { code: 'MP', name: 'Madhya Pradesh', region: 'Central', capital: 'Bhopal', famousFor: 'Khajuraho Erotic Sculptures, Tiger Safaris & Ujjain', image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800' },
  { code: 'PB', name: 'Punjab', region: 'North', capital: 'Chandigarh', famousFor: 'Golden Temple Amritsar, Wagah Border & Punjabi Cuisine', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800' },
  { code: 'OD', name: 'Odisha', region: 'East', capital: 'Bhubaneswar', famousFor: 'Konark Sun Temple, Puri Jagannath & Chilika Lake', image: 'https://images.unsplash.com/photo-1598890777032-bde13fba5be3?w=800' },
  { code: 'AS', name: 'Assam', region: 'North-East', capital: 'Dispur', famousFor: 'Kaziranga One-Horned Rhinos, Brahmaputra & Tea Gardens', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800' },
  { code: 'ML', name: 'Meghalaya', region: 'North-East', capital: 'Shillong', famousFor: 'Living Root Bridges, Cherrapunji Rains & Crystal Rivers', image: 'https://images.unsplash.com/photo-1622306237887-f8e21a71fb58?w=800' },
  { code: 'AN', name: 'Andaman and Nicobar Islands', region: 'Islands', capital: 'Port Blair', famousFor: 'Radhanagar White Sand Beach & Coral Reefs', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' },
  { code: 'AP', name: 'Andhra Pradesh', region: 'South', capital: 'Amaravati', famousFor: 'Tirupati Balaji Pilgrimage & Araku Valley Hills', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800' },
  { code: 'TG', name: 'Telangana', region: 'South', capital: 'Hyderabad', famousFor: 'Charminar, Golconda Fort & Hyderabadi Biryani', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800' },
  { code: 'BR', name: 'Bihar', region: 'East', capital: 'Patna', famousFor: 'Bodh Gaya Mahabodhi Temple & Nalanda University', image: 'https://images.unsplash.com/photo-1610476485072-4d2210813f89?w=800' },
  { code: 'CH', name: 'Chandigarh', region: 'North', capital: 'Chandigarh', famousFor: 'Rock Garden & Le Corbusier Urban Planning', image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800' },
  { code: 'CG', name: 'Chhattisgarh', region: 'Central', capital: 'Raipur', famousFor: 'Chitrakote Horseshoe Falls & Tribal Craft', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' },
  { code: 'JH', name: 'Jharkhand', region: 'East', capital: 'Ranchi', famousFor: 'Hundru Falls, Betla Tiger Reserve & Hills', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' },
  { code: 'HR', name: 'Haryana', region: 'North', capital: 'Chandigarh', famousFor: 'Kurukshetra Heritage & Sultanpur Bird Sanctuary', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' },
  { code: 'AR', name: 'Arunachal Pradesh', region: 'North-East', capital: 'Itanagar', famousFor: 'Tawang Buddhist Monastery & Sela Pass', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800' },
  { code: 'MN', name: 'Manipur', region: 'North-East', capital: 'Imphal', famousFor: 'Loktak Floating Phumdis Lake & Keibul Lamjao', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800' },
  { code: 'MZ', name: 'Mizoram', region: 'North-East', capital: 'Aizawl', famousFor: 'Blue Mountain & Lush Green Vistas', image: 'https://images.unsplash.com/photo-1622306237887-f8e21a71fb58?w=800' },
  { code: 'NL', name: 'Nagaland', region: 'North-East', capital: 'Kohima', famousFor: 'Hornbill Festival & Dzukou Valley Treks', image: 'https://images.unsplash.com/photo-1622306237887-f8e21a71fb58?w=800' },
  { code: 'TR', name: 'Tripura', region: 'North-East', capital: 'Agartala', famousFor: 'Neermahal Floating Palace & Ujjayanta Palace', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800' },
  { code: 'PY', name: 'Puducherry', region: 'South', capital: 'Pondicherry', famousFor: 'French Colonial Quarters, Auroville & Promenade Beach', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800' },
  { code: 'LD', name: 'Lakshadweep', region: 'Islands', capital: 'Kavaratti', famousFor: 'Pristine Lagoons, Agatti Coral Reefs & Water Sports', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800' },
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
  { value: 'heritage', label: 'Heritage & Royal', icon: '👑' },
  { value: 'hill_station', label: 'Hill Station', icon: '⛰️' },
  { value: 'beach', label: 'Beach & Coastal', icon: '🏖️' },
  { value: 'spiritual', label: 'Spiritual & Ghats', icon: '🛕' },
  { value: 'nature', label: 'Nature & Backwaters', icon: '🌿' },
  { value: 'adventure', label: 'Adventure & Snow', icon: '🏔️' },
  { value: 'cultural', label: 'Culture & Food', icon: '🏛️' },
  { value: 'city', label: 'City & Metro', icon: '🏙️' },
];
