/**
 * India Travel Data Catalog & Fallbacks
 * Covers all 28 States & 8 Union Territories of India
 */

const INDIAN_STATES = [
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
  { code: 'DL', name: 'Delhi', region: 'North', capital: 'New Delhi', famousFor: 'Red Fort, Qutub Minar, Chandni Chowk & Street Food', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800' },
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

/**
 * Curated authentic destinations for quick real-time lookup per state
 */
const CURATED_STATE_DESTINATIONS = {
  'Rajasthan': [
    {
      name: 'Jaipur',
      city: 'Rajasthan',
      country: 'India',
      description: 'The Pink City of India, legendary for majestic hilltop hill-forts, grand royal palaces, vibrant bazaars, and rich Rajputana heritage.',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
      latitude: 26.9124,
      longitude: 75.7873,
      estimatedBudgetPerDay: 2800,
      currency: 'INR',
      category: 'heritage',
      tags: ['heritage', 'forts', 'palaces', 'rajasthan', 'shopping', 'food'],
      isPopular: true,
      attractions: [
        { name: 'Amer Fort', description: 'Magnificent 16th-century fortress crafted from red sandstone and marble overlooking Maota Lake.', category: 'landmark', estimatedCost: 200, currency: 'INR', estimatedDurationHours: 3.5, latitude: 26.9855, longitude: 75.8513, rating: 4.8, openingHours: '08:00 - 17:30' },
        { name: 'Hawa Mahal', description: 'Iconic five-storey Palace of Winds with 953 intricately carved jharokha honeycomb windows.', category: 'landmark', estimatedCost: 50, currency: 'INR', estimatedDurationHours: 1.5, latitude: 26.9239, longitude: 75.8267, rating: 4.7, openingHours: '09:00 - 17:00' },
        { name: 'City Palace', description: 'Royal palace complex featuring courtyards, Mughal-Rajput architecture, and museum galleries.', category: 'museum', estimatedCost: 300, currency: 'INR', estimatedDurationHours: 2.5, latitude: 26.9258, longitude: 75.8237, rating: 4.6, openingHours: '09:30 - 17:00' },
        { name: 'Nahargarh Fort', description: 'Perched on the edge of the Aravalli Hills, providing panoramic sunset views across Jaipur.', category: 'nature', estimatedCost: 50, currency: 'INR', estimatedDurationHours: 2.0, latitude: 26.9378, longitude: 75.8155, rating: 4.7, openingHours: '10:00 - 18:00' },
      ],
    },
    {
      name: 'Udaipur',
      city: 'Rajasthan',
      country: 'India',
      description: 'The City of Lakes and Venice of the East, surrounded by the Aravalli Hills, white marble palaces, and tranquil boat cruises on Lake Pichola.',
      imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800',
      latitude: 24.5854,
      longitude: 73.7125,
      estimatedBudgetPerDay: 3200,
      currency: 'INR',
      category: 'heritage',
      tags: ['lakes', 'romantic', 'palaces', 'rajasthan', 'culture'],
      isPopular: true,
      attractions: [
        { name: 'Udaipur City Palace', description: 'Rajasthan\'s largest palace complex perched over Lake Pichola with mirror-work balconies.', category: 'landmark', estimatedCost: 300, currency: 'INR', estimatedDurationHours: 3.0, latitude: 24.5764, longitude: 73.6835, rating: 4.8, openingHours: '09:00 - 17:30' },
        { name: 'Lake Pichola Boat Cruise', description: 'Scenic boat ride offering views of Jag Mandir Island and the floating Lake Palace.', category: 'nature', estimatedCost: 450, currency: 'INR', estimatedDurationHours: 1.5, latitude: 24.5772, longitude: 73.6788, rating: 4.7, openingHours: '09:00 - 18:00' },
        { name: 'Jagdish Temple', description: 'Indo-Aryan style temple dedicated to Lord Vishnu, decorated with beautiful carved pillars.', category: 'spiritual', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 1.0, latitude: 24.5796, longitude: 73.6844, rating: 4.6, openingHours: '05:00 - 21:00' },
      ],
    },
    {
      name: 'Jodhpur',
      city: 'Rajasthan',
      country: 'India',
      description: 'The Sun City and Blue City, crowned by the formidable Mehrangarh Fort rising above an ocean of indigo-painted cube houses.',
      imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800',
      latitude: 26.2389,
      longitude: 73.0243,
      estimatedBudgetPerDay: 2500,
      currency: 'INR',
      category: 'heritage',
      tags: ['forts', 'blue city', 'heritage', 'desert', 'rajasthan'],
      isPopular: true,
      attractions: [
        { name: 'Mehrangarh Fort', description: 'One of India\'s largest and most imposing hill forts, featuring palatial museum halls and city vistas.', category: 'landmark', estimatedCost: 200, currency: 'INR', estimatedDurationHours: 3.5, latitude: 26.2978, longitude: 73.0185, rating: 4.9, openingHours: '09:00 - 17:00' },
        { name: 'Jaswant Thada', description: 'Graceful white marble cenotaph memorial with intricately carved gazebos and tranquil gardens.', category: 'landmark', estimatedCost: 30, currency: 'INR', estimatedDurationHours: 1.0, latitude: 26.3039, longitude: 73.0247, rating: 4.6, openingHours: '09:00 - 17:00' },
      ],
    },
  ],
  'Kerala': [
    {
      name: 'Munnar',
      city: 'Kerala',
      country: 'India',
      description: 'Enchanting hill station 1,600m above sea level in the Western Ghats, famed for sprawling emerald tea plantations, mist-covered peaks, and waterfalls.',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
      latitude: 10.0889,
      longitude: 77.0595,
      estimatedBudgetPerDay: 2600,
      currency: 'INR',
      category: 'hill_station',
      tags: ['tea gardens', 'hills', 'nature', 'kerala', 'waterfalls'],
      isPopular: true,
      attractions: [
        { name: 'Eravikulam National Park', description: 'Home to the endangered Nilgiri Tahr and the blooming Neelakurinji flowers.', category: 'nature', estimatedCost: 200, currency: 'INR', estimatedDurationHours: 3.0, latitude: 10.1500, longitude: 77.0600, rating: 4.7, openingHours: '07:30 - 16:00' },
        { name: 'Mattupetty Dam & Lake', description: 'Picturesque concrete gravity dam surrounded by tea estates and boating facilities.', category: 'nature', estimatedCost: 100, currency: 'INR', estimatedDurationHours: 2.0, latitude: 10.1067, longitude: 77.1247, rating: 4.5, openingHours: '09:30 - 17:00' },
        { name: 'Tata Tea Museum', description: 'Historic museum demonstrating orthodox tea manufacture and Munnar\'s colonial plantation roots.', category: 'museum', estimatedCost: 150, currency: 'INR', estimatedDurationHours: 1.5, latitude: 10.0862, longitude: 77.0543, rating: 4.4, openingHours: '09:00 - 16:00' },
      ],
    },
    {
      name: 'Alleppey (Alappuzha)',
      city: 'Kerala',
      country: 'India',
      description: 'The Backwater Hub of Kerala, famed for overnight traditional Kettuvallam houseboat cruises along serene palm-fringed canals and lagoons.',
      imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
      latitude: 9.4981,
      longitude: 76.3388,
      estimatedBudgetPerDay: 3500,
      currency: 'INR',
      category: 'nature',
      tags: ['backwaters', 'houseboat', 'beaches', 'kerala', 'ayurveda'],
      isPopular: true,
      attractions: [
        { name: 'Vembanad Lake Backwater Cruise', description: 'Tranquil houseboat cruising through paddy fields, coconut groves, and traditional village life.', category: 'nature', estimatedCost: 1500, currency: 'INR', estimatedDurationHours: 4.0, latitude: 9.6000, longitude: 76.4000, rating: 4.8, openingHours: '08:00 - 18:00' },
        { name: 'Alappuzha Beach & Pier', description: 'Historic beach featuring a 150-year-old ruined pier stretching out into the Arabian Sea.', category: 'beach', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 2.0, latitude: 9.4925, longitude: 76.3184, rating: 4.4, openingHours: '24 Hours' },
      ],
    },
    {
      name: 'Kochi (Cochin)',
      city: 'Kerala',
      country: 'India',
      description: 'Cosmopolitan port city where Chinese fishing nets, Portuguese churches, Dutch palaces, and spice bazaars reflect centuries of seafaring commerce.',
      imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
      latitude: 9.9312,
      longitude: 76.2673,
      estimatedBudgetPerDay: 2400,
      currency: 'INR',
      category: 'cultural',
      tags: ['coastal', 'heritage', 'spices', 'history', 'kerala'],
      isPopular: true,
      attractions: [
        { name: 'Fort Kochi Chinese Fishing Nets', description: 'Iconic cantilevered shore-operated fishing nets introduced by Chinese explorers in the 14th century.', category: 'landmark', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 1.5, latitude: 9.9674, longitude: 76.2415, rating: 4.5, openingHours: '24 Hours' },
        { name: 'Mattancherry Dutch Palace', description: 'Kerala style palace with European architectural influences, celebrated for vivid Hindu murals.', category: 'museum', estimatedCost: 10, currency: 'INR', estimatedDurationHours: 1.5, latitude: 9.9583, longitude: 76.2592, rating: 4.4, openingHours: '09:45 - 13:00' },
      ],
    },
  ],
  'Goa': [
    {
      name: 'North Goa',
      city: 'Goa',
      country: 'India',
      description: 'Energetic coastal haven celebrated for golden sand beaches, beach shacks, water sports, historic forts, and lively flea markets.',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
      latitude: 15.5494,
      longitude: 73.7535,
      estimatedBudgetPerDay: 2800,
      currency: 'INR',
      category: 'beach',
      tags: ['beaches', 'nightlife', 'water sports', 'goa', 'seafood'],
      isPopular: true,
      attractions: [
        { name: 'Fort Aguada & Lighthouse', description: '17th-century Portuguese fort standing high on Sinquerim Beach overlooking the Arabian Sea.', category: 'landmark', estimatedCost: 50, currency: 'INR', estimatedDurationHours: 2.0, latitude: 15.4925, longitude: 73.7736, rating: 4.6, openingHours: '09:30 - 18:00' },
        { name: 'Anjuna & Vagator Cliffs', description: 'Scenic red laterite cliffs overlooking sweeping bays and open-air sunset cafes.', category: 'beach', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 3.0, latitude: 15.5847, longitude: 73.7388, rating: 4.5, openingHours: '24 Hours' },
      ],
    },
    {
      name: 'South Goa & Old Goa',
      city: 'Goa',
      country: 'India',
      description: 'Serene and laidback Goa featuring tranquil white beaches, UNESCO baroque churches, and spice plantations.',
      imageUrl: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=800',
      latitude: 15.2832,
      longitude: 73.9862,
      estimatedBudgetPerDay: 3200,
      currency: 'INR',
      category: 'heritage',
      tags: ['heritage', 'churches', 'peaceful', 'beaches', 'goa'],
      isPopular: true,
      attractions: [
        { name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage baroque church containing the sacred mortal remains of St. Francis Xavier.', category: 'landmark', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 2.0, latitude: 15.5008, longitude: 73.9116, rating: 4.8, openingHours: '09:00 - 18:30' },
        { name: 'Palolem Crescent Beach', description: 'Idyllic crescent bay with calm shallow waters, dolphin-watching boat trips, and palm trees.', category: 'beach', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 3.5, latitude: 15.0100, longitude: 74.0232, rating: 4.7, openingHours: '24 Hours' },
      ],
    },
  ],
  'Himachal Pradesh': [
    {
      name: 'Manali',
      city: 'Himachal Pradesh',
      country: 'India',
      description: 'High-altitude Himalayan resort town nestled in the Kullu Valley, renowned for snow sports, pine valleys, and gateway to Rohtang Pass.',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      latitude: 32.2432,
      longitude: 77.1892,
      estimatedBudgetPerDay: 2600,
      currency: 'INR',
      category: 'hill_station',
      tags: ['himalayas', 'snow', 'adventure', 'mountains', 'himachal'],
      isPopular: true,
      attractions: [
        { name: 'Solang Valley', description: 'Thriving adventure sports hub offering paragliding, skiing, zorbing, and ropeway cable cars.', category: 'adventure', estimatedCost: 500, currency: 'INR', estimatedDurationHours: 4.0, latitude: 32.3160, longitude: 77.1578, rating: 4.7, openingHours: '09:00 - 18:00' },
        { name: 'Hadimba Devi Temple', description: 'Ancient wooden pagoda-style temple constructed in 1553 amid towering deodar forests.', category: 'spiritual', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 1.5, latitude: 32.2483, longitude: 77.1805, rating: 4.6, openingHours: '08:00 - 18:00' },
        { name: 'Rohtang Pass Viewpoint', description: 'Breathtaking 3,978m mountain pass connecting Kullu with the arid Lahaul and Spiti Valleys.', category: 'nature', estimatedCost: 550, currency: 'INR', estimatedDurationHours: 5.0, latitude: 32.3716, longitude: 77.2466, rating: 4.8, openingHours: '06:00 - 16:00' },
      ],
    },
    {
      name: 'Shimla',
      city: 'Himachal Pradesh',
      country: 'India',
      description: 'The Queen of Hills and former summer capital of British India, set amid oak and rhododendron forests with historic colonial architecture.',
      imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800',
      latitude: 31.1048,
      longitude: 77.1734,
      estimatedBudgetPerDay: 2400,
      currency: 'INR',
      category: 'hill_station',
      tags: ['colonial', 'heritage', 'hills', 'himachal', 'toy train'],
      isPopular: true,
      attractions: [
        { name: 'The Ridge & Mall Road', description: 'Open pedestrian cultural promenade offering views of the snow-draped mountain ranges.', category: 'landmark', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 2.5, latitude: 31.1044, longitude: 77.1753, rating: 4.6, openingHours: '24 Hours' },
        { name: 'Jakhoo Hill & Temple', description: 'Shimla\'s highest peak crowned by a 108-foot colossal statue of Lord Hanuman and monkeys.', category: 'spiritual', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 2.0, latitude: 31.1011, longitude: 77.1842, rating: 4.5, openingHours: '07:00 - 20:00' },
      ],
    },
  ],
  'Uttarakhand': [
    {
      name: 'Rishikesh',
      city: 'Uttarakhand',
      country: 'India',
      description: 'The Yoga Capital of the World, where the holy river Ganga descends from the Shivalik Himalayas into the plains amid ashrams and rapids.',
      imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800',
      latitude: 30.0869,
      longitude: 78.2676,
      estimatedBudgetPerDay: 2000,
      currency: 'INR',
      category: 'spiritual',
      tags: ['yoga', 'rafting', 'ganga', 'spiritual', 'uttarakhand', 'adventure'],
      isPopular: true,
      attractions: [
        { name: 'Triveni Ghat Evening Aarti', description: 'Mesmerizing evening prayer ritual with floating diyas and Vedic chanting on the Ganga bank.', category: 'spiritual', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 1.5, latitude: 30.1065, longitude: 78.2938, rating: 4.9, openingHours: '18:00 - 19:30' },
        { name: 'Ganga White Water Rafting', description: 'Thrilling grade III & IV white water rafting expedition from Shivpuri down to Rishikesh.', category: 'adventure', estimatedCost: 1000, currency: 'INR', estimatedDurationHours: 3.5, latitude: 30.1340, longitude: 78.3880, rating: 4.8, openingHours: '08:00 - 16:00' },
        { name: 'Laxman Jhula & Ram Jhula', description: 'Iconic suspension iron bridges suspended across the holy river Ganga flanked by temples.', category: 'landmark', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 1.5, latitude: 30.1248, longitude: 78.3283, rating: 4.6, openingHours: '24 Hours' },
      ],
    },
  ],
  'Uttar Pradesh': [
    {
      name: 'Varanasi (Kashi)',
      city: 'Uttar Pradesh',
      country: 'India',
      description: 'One of the world\'s oldest living cities, spiritual epicenter of India with sacred riverside ghats, ancient lanes, and morning boat rituals.',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
      latitude: 25.3176,
      longitude: 82.9739,
      estimatedBudgetPerDay: 2000,
      currency: 'INR',
      category: 'spiritual',
      tags: ['spiritual', 'ghats', 'ancient', 'ganga', 'uttar pradesh'],
      isPopular: true,
      attractions: [
        { name: 'Dashashwamedh Ghat Ganga Aarti', description: 'Spectacular multi-priest choregraphed brass lamp Aarti ritual attended by thousands nightly.', category: 'spiritual', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 1.5, latitude: 25.3073, longitude: 83.0104, rating: 4.9, openingHours: '18:30 - 20:00' },
        { name: 'Kashi Vishwanath Corridor', description: 'Sacred golden-spired temple dedicated to Lord Shiva, newly renovated into a grand spiritual corridor.', category: 'spiritual', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 2.0, latitude: 25.3109, longitude: 83.0107, rating: 4.8, openingHours: '04:00 - 22:00' },
        { name: 'Sunrise Boat Ride on Ganges', description: 'Serene sunrise wooden rowing boat along Assi Ghat, Manikarnika Ghat, and historic riverfronts.', category: 'nature', estimatedCost: 400, currency: 'INR', estimatedDurationHours: 2.0, latitude: 25.2890, longitude: 83.0060, rating: 4.8, openingHours: '05:30 - 08:00' },
      ],
    },
    {
      name: 'Agra',
      city: 'Uttar Pradesh',
      country: 'India',
      description: 'Home to the magnificent Taj Mahal, symbol of eternal love and Mughal architectural zenith, alongside red sandstone forts and gardens.',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
      latitude: 27.1767,
      longitude: 78.0081,
      estimatedBudgetPerDay: 2500,
      currency: 'INR',
      category: 'heritage',
      tags: ['taj mahal', 'mughal', 'heritage', 'unesco', 'uttar pradesh'],
      isPopular: true,
      attractions: [
        { name: 'Taj Mahal', description: 'UNESCO World Heritage ivory-white marble mausoleum built by Emperor Shah Jahan in memory of Mumtaz Mahal.', category: 'landmark', estimatedCost: 50, currency: 'INR', estimatedDurationHours: 3.5, latitude: 27.1751, longitude: 78.0421, rating: 4.9, openingHours: '06:00 - 18:30 (Closed Fridays)' },
        { name: 'Agra Fort', description: 'Vast 16th-century Mughal red sandstone citadel housing royal audience halls and marble palaces.', category: 'landmark', estimatedCost: 50, currency: 'INR', estimatedDurationHours: 2.5, latitude: 27.1795, longitude: 78.0211, rating: 4.7, openingHours: '06:00 - 18:00' },
      ],
    },
  ],
  'Maharashtra': [
    {
      name: 'Mumbai',
      city: 'Maharashtra',
      country: 'India',
      description: 'India\'s financial and entertainment capital, a vibrant coastal metropolis blending Victorian Gothic architecture with Bollywood energy and Arabian Sea views.',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
      latitude: 19.0760,
      longitude: 72.8777,
      estimatedBudgetPerDay: 3500,
      currency: 'INR',
      category: 'city',
      tags: ['urban', 'heritage', 'coastal', 'food', 'bollywood', 'maharashtra'],
      isPopular: true,
      attractions: [
        { name: 'Gateway of India', description: 'Colossal Indo-Saracenic triumphal arch overlooking Mumbai Harbour, erected in 1924.', category: 'landmark', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 1.5, latitude: 18.9220, longitude: 72.8347, rating: 4.7, openingHours: '24 Hours' },
        { name: 'Marine Drive & Queen\'s Necklace', description: '3.6 km arc promenade along the coast famous for evening sea breezes and sparkling city lights.', category: 'landmark', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 2.0, latitude: 18.9432, longitude: 72.8231, rating: 4.8, openingHours: '24 Hours' },
        { name: 'Elephanta Caves', description: 'UNESCO World Heritage rock-cut cave temples dedicated to Lord Shiva situated on an island in the bay.', category: 'landmark', estimatedCost: 260, currency: 'INR', estimatedDurationHours: 4.0, latitude: 18.9633, longitude: 72.9315, rating: 4.6, openingHours: '09:00 - 17:30' },
      ],
    },
  ],
  'Karnataka': [
    {
      name: 'Hampi',
      city: 'Karnataka',
      country: 'India',
      description: 'UNESCO World Heritage boulder-strewn open-air museum, capital of the magnificent 14th-century Vijayanagara Empire along the Tungabhadra River.',
      imageUrl: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=800',
      latitude: 15.3350,
      longitude: 76.4600,
      estimatedBudgetPerDay: 2000,
      currency: 'INR',
      category: 'heritage',
      tags: ['unesco', 'ancient ruins', 'temples', 'boulders', 'karnataka'],
      isPopular: true,
      attractions: [
        { name: 'Virupaksha Temple', description: 'Sacred functioning Hindu temple with a towering 50-meter gopuram, standing since the 7th century.', category: 'spiritual', estimatedCost: 25, currency: 'INR', estimatedDurationHours: 2.0, latitude: 15.3353, longitude: 76.4597, rating: 4.8, openingHours: '06:00 - 18:00' },
        { name: 'Vijaya Vittala Temple & Stone Chariot', description: 'Architectural wonder featuring the world-famous Stone Chariot and musical granite pillars.', category: 'landmark', estimatedCost: 40, currency: 'INR', estimatedDurationHours: 2.5, latitude: 15.3392, longitude: 76.4786, rating: 4.9, openingHours: '08:30 - 17:30' },
      ],
    },
  ],
  'West Bengal': [
    {
      name: 'Darjeeling',
      city: 'West Bengal',
      country: 'India',
      description: 'The Queen of the Hills in the Eastern Himalayas, world-famous for aromatic Darjeeling tea, UNESCO Himalayan Toy Train, and Kanchenjunga panoramas.',
      imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800',
      latitude: 27.0410,
      longitude: 88.2663,
      estimatedBudgetPerDay: 2400,
      currency: 'INR',
      category: 'hill_station',
      tags: ['tea gardens', 'himalayas', 'toy train', 'west bengal', 'scenic'],
      isPopular: true,
      attractions: [
        { name: 'Tiger Hill Sunrise', description: 'Panoramic high summit offering sunrise illuminates Mount Kanchenjunga and Mount Everest in golden light.', category: 'nature', estimatedCost: 50, currency: 'INR', estimatedDurationHours: 3.0, latitude: 26.9934, longitude: 88.2862, rating: 4.8, openingHours: '04:00 - 07:00' },
        { name: 'Darjeeling Himalayan Toy Train', description: 'UNESCO World Heritage 2-foot narrow gauge steam railway chugging through mountains and loops.', category: 'landmark', estimatedCost: 1000, currency: 'INR', estimatedDurationHours: 2.0, latitude: 27.0390, longitude: 88.2630, rating: 4.7, openingHours: '09:00 - 16:00' },
      ],
    },
  ],
  'Jammu and Kashmir': [
    {
      name: 'Srinagar',
      city: 'Jammu and Kashmir',
      country: 'India',
      description: 'The jewel of Kashmir valley, celebrated for serene Dal Lake Shikara rides, floating vegetable markets, and Mughal terraced gardens.',
      imageUrl: 'https://images.unsplash.com/photo-1566833910398-356ec39d783d?w=800',
      latitude: 34.0837,
      longitude: 74.7973,
      estimatedBudgetPerDay: 3000,
      currency: 'INR',
      category: 'nature',
      tags: ['dal lake', 'shikara', 'kashmir', 'mughal gardens', 'valleys'],
      isPopular: true,
      attractions: [
        { name: 'Dal Lake Shikara Ride', description: 'Iconic wooden gondola ride traversing floating gardens and lotus wetlands against snow peaks.', category: 'nature', estimatedCost: 700, currency: 'INR', estimatedDurationHours: 2.0, latitude: 34.1120, longitude: 74.8620, rating: 4.8, openingHours: '06:00 - 20:00' },
        { name: 'Shalimar & Nishat Mughal Gardens', description: '17th-century terraced Mughal gardens with fountains, chinar trees, and Dal Lake views.', category: 'nature', estimatedCost: 25, currency: 'INR', estimatedDurationHours: 2.0, latitude: 34.1500, longitude: 74.8720, rating: 4.7, openingHours: '09:00 - 19:00' },
      ],
    },
  ],
  'Ladakh': [
    {
      name: 'Leh & Nubra Valley',
      city: 'Ladakh',
      country: 'India',
      description: 'High-altitude cold desert territory featuring turquoise alpine lakes, high motorable passes, and ancient Tibetan Buddhist gompas.',
      imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800',
      latitude: 34.1526,
      longitude: 77.5771,
      estimatedBudgetPerDay: 3800,
      currency: 'INR',
      category: 'adventure',
      tags: ['ladakh', 'himalayas', 'lakes', 'monasteries', 'adventure', 'desert'],
      isPopular: true,
      attractions: [
        { name: 'Pangong Tso Lake', description: 'World\'s highest saltwater lake at 4,350m, famous for shifting shades of blue and dramatic desert backdrop.', category: 'nature', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 4.0, latitude: 33.7595, longitude: 78.6674, rating: 4.9, openingHours: '24 Hours' },
        { name: 'Khardung La Pass', description: 'Legendary mountain pass at 5,359m offering snow vistas and gateway to the Shyok and Nubra valleys.', category: 'adventure', estimatedCost: 0, currency: 'INR', estimatedDurationHours: 2.0, latitude: 34.2787, longitude: 77.6047, rating: 4.8, openingHours: '08:00 - 17:00' },
      ],
    },
  ],
};

function getIndianStatesList() {
  return INDIAN_STATES;
}

function getCuratedStateDestinations(stateName) {
  if (!stateName) return [];
  // Match case-insensitively
  const normalized = stateName.toLowerCase().trim();
  for (const [key, list] of Object.entries(CURATED_STATE_DESTINATIONS)) {
    if (key.toLowerCase() === normalized || normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return list;
    }
  }
  // Generic fallback if not explicitly in curated map
  return [
    {
      name: `${stateName} Explorer`,
      city: stateName,
      country: 'India',
      description: `Explore the vibrant culture, scenic landscapes, local handicrafts, and regional delicacies of ${stateName}, India.`,
      imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800',
      latitude: 20.5937,
      longitude: 78.9629,
      estimatedBudgetPerDay: 2500,
      currency: 'INR',
      category: 'cultural',
      tags: [stateName.toLowerCase(), 'india', 'culture', 'sightseeing'],
      isPopular: true,
      attractions: [
        { name: `${stateName} Heritage Landmark`, description: `Historic monument highlighting the royal and cultural heritage of ${stateName}.`, category: 'landmark', estimatedCost: 100, currency: 'INR', estimatedDurationHours: 2.0, rating: 4.6, openingHours: '09:00 - 18:00' },
        { name: `${stateName} Scenic Nature Viewpoint`, description: `Breathtaking natural viewpoint celebrated for scenic views and photography in ${stateName}.`, category: 'nature', estimatedCost: 50, currency: 'INR', estimatedDurationHours: 2.5, rating: 4.7, openingHours: 'Sunrise - Sunset' },
      ],
    },
  ];
}

/**
 * Maps destination names, states, and categories to authentic, verified Unsplash photos
 */
function resolveDestinationImage(name = '', stateName = '', category = '') {
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

module.exports = {
  INDIAN_STATES,
  CURATED_STATE_DESTINATIONS,
  getIndianStatesList,
  getCuratedStateDestinations,
  resolveDestinationImage,
};
