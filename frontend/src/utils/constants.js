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
  { code: 'JK', name: 'Jammu and Kashmir', region: 'North', capital: 'Srinagar / Jammu', famousFor: 'Dal Lake Shikaras, Gulmarg Snow & Alpine Meadows', image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800' },
  { code: 'LA', name: 'Ladakh', region: 'North', capital: 'Leh', famousFor: 'Pangong Tso, Khardung La & Buddhist Monasteries', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800' },
  { code: 'MH', name: 'Maharashtra', region: 'West', capital: 'Mumbai', famousFor: 'Gateway of India, Western Ghats & Ancient Caves', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800' },
  { code: 'KA', name: 'Karnataka', region: 'South', capital: 'Bengaluru', famousFor: 'Hampi Ruins, Coorg Coffee Estates & Royal Mysore', image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=800' },
  { code: 'TN', name: 'Tamil Nadu', region: 'South', capital: 'Chennai', famousFor: 'Dravidian Temples, Nilgiri Hills & Coastal Heritage', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800' },
  { code: 'WB', name: 'West Bengal', region: 'East', capital: 'Kolkata', famousFor: 'Darjeeling Himalayas, Colonial Architecture & Sunderbans', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800' },
  { code: 'UP', name: 'Uttar Pradesh', region: 'North', capital: 'Lucknow', famousFor: 'Taj Mahal, Sacred Varanasi Ghats & Awadhi Food', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800' },
  { code: 'SK', name: 'Sikkim', region: 'North-East', capital: 'Gangtok', famousFor: 'Kanchenjunga Views, Tsomgo Lake & Monasteries', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800' },
  { code: 'DL', name: 'Delhi (NCT)', region: 'North', capital: 'New Delhi', famousFor: 'Red Fort, Qutub Minar, Chandni Chowk & Street Food', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' },
  { code: 'GJ', name: 'Gujarat', region: 'West', capital: 'Gandhinagar', famousFor: 'White Desert of Kutch, Gir Asiatic Lions & Heritage', image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800' },
  { code: 'MP', name: 'Madhya Pradesh', region: 'Central', capital: 'Bhopal', famousFor: 'Khajuraho Erotic Sculptures, Tiger Safaris & Ujjain', image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800' },
  { code: 'PB', name: 'Punjab', region: 'North', capital: 'Chandigarh', famousFor: 'Golden Temple Amritsar, Wagah Border & Punjabi Cuisine', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800' },
  { code: 'OD', name: 'Odisha', region: 'East', capital: 'Bhubaneswar', famousFor: 'Konark Sun Temple, Puri Jagannath & Chilika Lake', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800' },
  { code: 'AS', name: 'Assam', region: 'North-East', capital: 'Dispur', famousFor: 'Kaziranga One-Horned Rhinos, Brahmaputra & Tea Gardens', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800' },
  { code: 'ML', name: 'Meghalaya', region: 'North-East', capital: 'Shillong', famousFor: 'Living Root Bridges, Cherrapunji Rains & Crystal Rivers', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
  { code: 'AN', name: 'Andaman and Nicobar Islands', region: 'Islands', capital: 'Port Blair', famousFor: 'Radhanagar White Sand Beach & Coral Reefs', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' },
  { code: 'AP', name: 'Andhra Pradesh', region: 'South', capital: 'Amaravati', famousFor: 'Tirupati Balaji Pilgrimage & Araku Valley Hills', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800' },
  { code: 'TG', name: 'Telangana', region: 'South', capital: 'Hyderabad', famousFor: 'Charminar, Golconda Fort & Hyderabadi Biryani', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800' },
  { code: 'BR', name: 'Bihar', region: 'East', capital: 'Patna', famousFor: 'Bodh Gaya Mahabodhi Temple & Nalanda University', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800' },
  { code: 'CH', name: 'Chandigarh', region: 'North', capital: 'Chandigarh', famousFor: 'Rock Garden & Le Corbusier Urban Planning', image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800' },
  { code: 'CG', name: 'Chhattisgarh', region: 'Central', capital: 'Raipur', famousFor: 'Chitrakote Horseshoe Falls & Tribal Craft', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' },
  { code: 'JH', name: 'Jharkhand', region: 'East', capital: 'Ranchi', famousFor: 'Hundru Falls, Betla Tiger Reserve & Hills', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' },
  { code: 'HR', name: 'Haryana', region: 'North', capital: 'Chandigarh', famousFor: 'Kurukshetra Heritage & Sultanpur Bird Sanctuary', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' },
  { code: 'AR', name: 'Arunachal Pradesh', region: 'North-East', capital: 'Itanagar', famousFor: 'Tawang Buddhist Monastery & Sela Pass', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800' },
  { code: 'MN', name: 'Manipur', region: 'North-East', capital: 'Imphal', famousFor: 'Loktak Floating Phumdis Lake & Keibul Lamjao', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800' },
  { code: 'MZ', name: 'Mizoram', region: 'North-East', capital: 'Aizawl', famousFor: 'Blue Mountain & Lush Green Vistas', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
  { code: 'NL', name: 'Nagaland', region: 'North-East', capital: 'Kohima', famousFor: 'Hornbill Festival & Dzukou Valley Treks', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
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

export const POPULAR_INDIAN_DESTINATIONS = [
  {
    name: 'Jaipur',
    country: 'India',
    city: 'Rajasthan',
    description: 'The Pink City of India, legendary for majestic hilltop forts, grand royal palaces, vibrant bazaars, and rich Rajputana heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    estimatedBudgetPerDay: 2800,
    currency: 'INR',
    category: 'heritage',
    tags: ['heritage', 'forts', 'palaces', 'rajasthan', 'shopping', 'food'],
    _count: { attractions: 4, favorites: 12 },
  },
  {
    name: 'Alleppey (Alappuzha)',
    country: 'India',
    city: 'Kerala',
    description: 'The Backwater Hub of Kerala, famed for overnight traditional Kettuvallam houseboat cruises along serene palm-fringed canals and lagoons.',
    imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
    estimatedBudgetPerDay: 3500,
    currency: 'INR',
    category: 'nature',
    tags: ['backwaters', 'houseboat', 'beaches', 'kerala', 'ayurveda'],
    _count: { attractions: 3, favorites: 18 },
  },
  {
    name: 'North Goa',
    country: 'India',
    city: 'Goa',
    description: 'Energetic coastal haven celebrated for golden sand beaches, beach shacks, water sports, historic forts, and lively flea markets.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    estimatedBudgetPerDay: 2800,
    currency: 'INR',
    category: 'beach',
    tags: ['beaches', 'nightlife', 'water sports', 'goa', 'seafood'],
    _count: { attractions: 4, favorites: 25 },
  },
  {
    name: 'Udaipur',
    country: 'India',
    city: 'Rajasthan',
    description: 'The City of Lakes and Venice of the East, surrounded by the Aravalli Hills, white marble palaces, and tranquil boat cruises on Lake Pichola.',
    imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800',
    estimatedBudgetPerDay: 3200,
    currency: 'INR',
    category: 'heritage',
    tags: ['lakes', 'romantic', 'palaces', 'rajasthan', 'culture'],
    _count: { attractions: 3, favorites: 14 },
  },
  {
    name: 'Manali & Solang Valley',
    country: 'India',
    city: 'Himachal Pradesh',
    description: 'High-altitude Himalayan retreat renowned for snowy mountain passes, apple orchards, river rafting, and adventure sports.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    estimatedBudgetPerDay: 2600,
    currency: 'INR',
    category: 'adventure',
    tags: ['snow', 'adventure', 'mountains', 'himachal', 'trekking'],
    _count: { attractions: 4, favorites: 22 },
  },
  {
    name: 'Varanasi',
    country: 'India',
    city: 'Uttar Pradesh',
    description: 'One of the world\'s oldest living cities on the sacred banks of River Ganga, famous for its timeless spiritual ghats, evening Ganga Aarti, and silk weaving.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
    estimatedBudgetPerDay: 1800,
    currency: 'INR',
    category: 'spiritual',
    tags: ['spiritual', 'ghats', 'ganga', 'heritage', 'culture'],
    _count: { attractions: 4, favorites: 19 },
  },
  {
    name: 'Munnar',
    country: 'India',
    city: 'Kerala',
    description: 'Idyllic hill station nestled in the Western Ghats with endless rolling emerald tea gardens, misty waterfalls, and cool mountain breezes.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    estimatedBudgetPerDay: 2500,
    currency: 'INR',
    category: 'hill_station',
    tags: ['tea gardens', 'hills', 'waterfalls', 'kerala', 'nature'],
    _count: { attractions: 3, favorites: 15 },
  },
  {
    name: 'Rishikesh',
    country: 'India',
    city: 'Uttarakhand',
    description: 'The Yoga Capital of the World along the emerald Ganga, famed for ashrams, suspension bridges, Himalayan hiking, and thrilling white-water rafting.',
    imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800',
    estimatedBudgetPerDay: 2000,
    currency: 'INR',
    category: 'adventure',
    tags: ['yoga', 'rafting', 'ganga', 'spiritual', 'uttarakhand'],
    _count: { attractions: 3, favorites: 17 },
  },
  {
    name: 'Leh & Nubra Valley',
    country: 'India',
    city: 'Ladakh',
    description: 'Trans-Himalayan high desert wonderland of high mountain passes, crystal-blue Pangong Tso, Buddhist gompas, and double-humped camel dunes.',
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800',
    estimatedBudgetPerDay: 3800,
    currency: 'INR',
    category: 'adventure',
    tags: ['ladakh', 'monasteries', 'passes', 'pangong', 'himalayas'],
    _count: { attractions: 4, favorites: 30 },
  },
  {
    name: 'Darjeeling',
    country: 'India',
    city: 'West Bengal',
    description: 'Queen of the Hills offering dramatic views of Mount Kanchenjunga, historic UNESCO toy train rides, and colonial-era world-famous tea estates.',
    imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800',
    estimatedBudgetPerDay: 2400,
    currency: 'INR',
    category: 'hill_station',
    tags: ['kanchenjunga', 'toy train', 'tea gardens', 'himalayas'],
    _count: { attractions: 3, favorites: 16 },
  },
  {
    name: 'Hampi',
    country: 'India',
    city: 'Karnataka',
    description: 'UNESCO World Heritage open-air museum of boulders, ruins, and stone chariots from the glorious 14th-century Vijayanagara Empire along the Tungabhadra River.',
    imageUrl: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=800',
    estimatedBudgetPerDay: 1900,
    currency: 'INR',
    category: 'heritage',
    tags: ['hampi', 'ruins', 'unesco', 'heritage', 'karnataka'],
    _count: { attractions: 4, favorites: 21 },
  },
  {
    name: 'Amritsar',
    country: 'India',
    city: 'Punjab',
    description: 'Heart of Sikh culture, home to the breathtaking Harmandir Sahib (Golden Temple), poignant Jallianwala Bagh, and celebratory Wagah Border retreat ceremony.',
    imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800',
    estimatedBudgetPerDay: 2100,
    currency: 'INR',
    category: 'spiritual',
    tags: ['golden temple', 'amritsar', 'punjab', 'spiritual', 'food'],
    _count: { attractions: 3, favorites: 20 },
  },
];

/**
 * Maps destination names, states, and categories to authentic, verified Unsplash photos
 */
export function resolveDestinationImage(name = '', stateName = '', category = '', existingUrl = null) {
  const norm = (name || '').toLowerCase().trim();
  const stateNorm = (stateName || '').toLowerCase().trim();

  // 1. Exact city / landmark matches with authentic verified photos
  if (norm.includes('varanasi') || norm.includes('kashi') || norm.includes('banaras') || norm.includes('ghat')) {
    return 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800'; // Dashashwamedh Ghat Varanasi
  }
  if (norm.includes('agra') || norm.includes('taj mahal') || norm.includes('fatehpur')) {
    return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'; // Taj Mahal Agra
  }
  if (norm.includes('dharamshala') || norm.includes('dharamsala') || norm.includes('mcleod') || norm.includes('kangra') || norm.includes('dalai lama') || norm.includes('triund')) {
    return 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'; // Dhauladhar range / Himachal
  }
  if (norm.includes('manali') || norm.includes('solang') || norm.includes('rohtang') || norm.includes('kullu') || norm.includes('kasol') || norm.includes('spiti')) {
    return 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'; // Himachal snow & valleys
  }
  if (norm.includes('shimla') || norm.includes('kufri') || norm.includes('chail') || norm.includes('mashobra')) {
    return 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'; // Pine hills Shimla
  }
  if (norm.includes('jaipur') || norm.includes('amer') || norm.includes('amber') || norm.includes('hawa mahal') || norm.includes('pink city') || norm.includes('nahargarh')) {
    return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800'; // Amer Fort Jaipur
  }
  if (norm.includes('jaisalmer') || norm.includes('thar') || norm.includes('sam sand dunes')) {
    return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800'; // Jaisalmer
  }
  if (norm.includes('udaipur') || norm.includes('pichola') || norm.includes('city palace') || norm.includes('fateh sagar')) {
    return 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800'; // Lake Pichola Udaipur
  }
  if (norm.includes('jodhpur') || norm.includes('mehrangarh') || norm.includes('blue city')) {
    return 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800'; // Mehrangarh Fort Jodhpur
  }
  if (norm.includes('alleppey') || norm.includes('alappuzha') || norm.includes('kumarakom') || norm.includes('vembanad') || norm.includes('backwaters')) {
    return 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800'; // Alleppey Houseboat
  }
  if (norm.includes('munnar') || norm.includes('tea garden') || norm.includes('wayanad') || norm.includes('idukki')) {
    return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'; // Munnar Tea Hills
  }
  if (norm.includes('coorg') || norm.includes('kodagu') || norm.includes('ooty') || norm.includes('kodaikanal') || norm.includes('nilgiris') || norm.includes('chikmagalur')) {
    return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'; // South Indian Hill Station
  }
  if (norm.includes('kochi') || norm.includes('cochin') || norm.includes('fort kochi')) {
    return 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'; // Fort Kochi
  }
  if (norm.includes('goa') || norm.includes('calangute') || norm.includes('baga') || norm.includes('anjuna') || norm.includes('panaji') || norm.includes('candolim') || norm.includes('palolem') || norm.includes('vagator')) {
    return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'; // Goa Beach
  }
  if (norm.includes('hampi') || norm.includes('vijayanagara') || norm.includes('badami') || norm.includes('pattadakal')) {
    return 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=800'; // Hampi Stone Chariot
  }
  if (norm.includes('amritsar') || norm.includes('golden temple') || norm.includes('wagah')) {
    return 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800'; // Golden Temple Amritsar
  }
  if (norm.includes('rishikesh') || norm.includes('haridwar') || norm.includes('dehradun') || norm.includes('mussoorie') || norm.includes('nainital')) {
    return 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800'; // Ganga Foothills Rishikesh
  }
  if (norm.includes('leh') || norm.includes('ladakh') || norm.includes('pangong') || norm.includes('nubra') || norm.includes('khardung')) {
    return 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800'; // Pangong Lake Ladakh
  }
  if (norm.includes('srinagar') || norm.includes('gulmarg') || norm.includes('kashmir') || norm.includes('pahalgam') || norm.includes('sonamarg') || norm.includes('dal lake')) {
    return 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800'; // Dal Lake Shikara
  }
  if (norm.includes('darjeeling') || norm.includes('kalimpong') || norm.includes('mirik')) {
    return 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800'; // Darjeeling Tea Hills
  }
  if (norm.includes('gangtok') || norm.includes('sikkim') || norm.includes('tsomgo') || norm.includes('pelling') || norm.includes('lachung')) {
    return 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800'; // Sikkim Kanchenjunga
  }
  if (norm.includes('delhi') || norm.includes('qutub') || norm.includes('india gate') || norm.includes('red fort')) {
    return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'; // Delhi Red Fort
  }
  if (norm.includes('mumbai') || norm.includes('bombay') || norm.includes('marine drive') || norm.includes('gateway of india')) {
    return 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800'; // Gateway of India
  }
  if (norm.includes('puri') || norm.includes('konark') || norm.includes('bhubaneswar') || norm.includes('jagannath')) {
    return 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800'; // Konark Sun Temple
  }
  if (norm.includes('shillong') || norm.includes('cherrapunji') || norm.includes('meghalaya') || norm.includes('mawlynnong') || norm.includes('dawki') || norm.includes('kaziranga') || norm.includes('assam')) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'; // Meghalaya Living Roots / North East
  }
  if (norm.includes('bodh gaya') || norm.includes('nalanda') || norm.includes('bihar') || norm.includes('rajgir')) {
    return 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'; // Bodh Gaya Stupa
  }
  if (norm.includes('kutch') || norm.includes('gujarat') || norm.includes('rann') || norm.includes('ahmedabad') || norm.includes('gir')) {
    return 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800'; // White Rann
  }
  if (norm.includes('madurai') || norm.includes('meenakshi') || norm.includes('mahabalipuram') || norm.includes('chennai') || norm.includes('tamil nadu')) {
    return 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'; // South Indian Heritage
  }

  // If a valid non-empty existingUrl was provided and didn't trigger any mismatch, use it if it's not a generic placeholder
  if (existingUrl && typeof existingUrl === 'string' && existingUrl.startsWith('http') && !existingUrl.includes('photo-1564507592333-c60657eea523') && !existingUrl.includes('photo-1600100397608-f010f4439c2c')) {
    return existingUrl;
  }

  // 2. State-level fallback
  const stateObj = INDIAN_STATES.find(s => s.name.toLowerCase() === stateNorm || stateNorm.includes(s.name.toLowerCase()));
  if (stateObj && stateObj.image) {
    return stateObj.image;
  }

  // 3. Category-level fallback
  const cat = (category || '').toLowerCase();
  if (cat.includes('beach')) return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800';
  if (cat.includes('hill') || cat.includes('mountain') || cat.includes('adventure')) return 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800';
  if (cat.includes('nature') || cat.includes('water')) return 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800';
  if (cat.includes('spiritual')) return 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800';

  return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800';
}
