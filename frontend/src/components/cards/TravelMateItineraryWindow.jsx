import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Train,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Compass,
} from 'lucide-react';

const TRIP_PRESETS = {
  italy: {
    id: 'italy',
    title: 'Italy Adventure: Roma, Firenze, Venezia',
    dates: 'October 14–23, 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    days: [
      {
        dayNum: 1,
        city: 'Roma',
        hotel: 'Hotel Artemide (Via Nazionale)',
        activities: [
          {
            id: 1,
            time: '10:00 AM',
            title: 'Colosseum & Roman Forum VIP Tour',
            detail: 'Skip-the-line Gladiators gate access',
            icon: Building,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '02:30 PM',
            title: 'Piazza Navona & Espresso Tasting',
            detail: 'Historic Baroque fountains & Sant Eustachio',
            icon: Clock,
            nodeNum: 2,
            pinId: 2,
          },
          {
            id: 3,
            time: '06:00 PM',
            title: 'Trevi Fountain & Spanish Steps',
            detail: 'Evening illuminated twilight walk',
            icon: MapPin,
            nodeNum: 3,
            pinId: 3,
          },
        ],
        map: {
          searchPlaceholder: 'Search Roma landmarks...',
          locationData: {
            name: 'Piazza del Colosseo',
            address: 'Piazza del Colosseo, 1, Roma • 1.8 km',
          },
          pins: [
            { id: 1, num: 1, name: 'Colosseum', x: 38, y: 44, address: 'Piazza del Colosseo, 1, Roma • 1.8 km' },
            { id: 2, num: 2, name: 'Piazza Navona', x: 26, y: 58, address: 'Piazza Navona, Roma • 2.4 km' },
            { id: 3, num: 3, name: 'Trevi Fountain', x: 62, y: 32, address: 'Piazza di Trevi, Roma • 3.1 km' },
            { id: 4, num: 4, name: 'Spanish Steps', x: 78, y: 64, address: 'Piazza di Spagna, Roma • 3.9 km' },
          ],
        },
      },
      {
        dayNum: 2,
        city: 'Roma → Firenze',
        hotel: 'Grand Hotel Minerva (Firenze)',
        activities: [
          {
            id: 1,
            time: '09:00 AM',
            title: 'Vatican Museums & Sistine Chapel',
            detail: 'Early morning reserved gallery entry',
            icon: Building,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '02:15 PM',
            title: 'High-Speed Frecciarossa Train',
            detail: 'Roma Termini to Firenze Santa Maria Novella (1h 35m)',
            icon: Train,
            nodeNum: 2,
            pinId: 2,
          },
          {
            id: 3,
            time: '06:30 PM',
            title: 'Florence Duomo Plaza Walk',
            detail: 'Check-in & evening passeggiata',
            icon: MapPin,
            nodeNum: 3,
            pinId: 3,
          },
        ],
        map: {
          searchPlaceholder: 'Search route Roma to Firenze...',
          locationData: {
            name: 'Firenze SMN Station',
            address: 'Piazza della Stazione, Firenze • 0.4 km',
          },
          pins: [
            { id: 1, num: 1, name: 'Vatican City', x: 32, y: 36, address: 'Vatican Museums, Roma • 0.5 km' },
            { id: 2, num: 2, name: 'Roma Termini', x: 50, y: 52, address: 'Roma Termini Station • 1.2 km' },
            { id: 3, num: 3, name: 'Firenze SMN', x: 68, y: 40, address: 'Firenze SMN Station • 0.4 km' },
            { id: 4, num: 4, name: 'Grand Minerva', x: 80, y: 70, address: 'Piazza Santa Maria Novella • 0.6 km' },
          ],
        },
      },
      {
        dayNum: 3,
        city: 'Firenze',
        hotel: 'Arno Firenze',
        activities: [
          {
            id: 1,
            time: '10:00 AM',
            title: 'Uffizi Gallery Tour (Skip-the-line)',
            detail: 'Links to Uffizi Gallery Details',
            icon: Building,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '01:30 PM',
            title: 'Ponte Vecchio & Gelato Walk',
            detail: 'Historic bridge crossing & artisanal gelato',
            icon: Clock,
            nodeNum: 3,
            pinId: 2,
          },
          {
            id: 3,
            time: '04:30 PM',
            title: 'Florence Sunset Tour (Piazzale Michelangelo)',
            detail: 'Panoramic viewpoint located after soft cyan details',
            icon: Train,
            nodeNum: 9,
            pinId: 4,
          },
        ],
        nextPreview: [
          {
            id: 4,
            time: '10:00 AM',
            title: 'Accademia Gallery (David)',
            detail: 'Soft cyan/links',
            nodeNum: 10,
          },
          {
            id: 5,
            time: '02:00 PM',
            title: 'Boboli Gardens Promenade',
            detail: 'Soft cyan/links',
            nodeNum: 11,
          },
        ],
        map: {
          searchPlaceholder: 'Search Firenze locations...',
          locationData: {
            name: 'Piazzale Michelangelo',
            address: '260 Sar St, Firenze • 3.3 mi',
          },
          pins: [
            { id: 1, num: 1, name: 'Uffizi Gallery', x: 42, y: 38, address: 'Piazzale degli Uffizi, 6, Firenze • 0.8 km' },
            { id: 2, num: 2, name: 'Ponte Vecchio', x: 28, y: 54, address: 'Ponte Vecchio, Firenze • 1.4 km' },
            { id: 3, num: 3, name: 'Palazzo Pitti', x: 55, y: 72, address: "Piazza de' Pitti, 1, Firenze • 2.6 km" },
            { id: 4, num: 4, name: 'Piazzale Michelangelo', x: 75, y: 28, address: '260 Sar St, Firenze • 3.3 mi' },
          ],
        },
      },
      {
        dayNum: 4,
        city: 'Firenze → Chianti',
        hotel: 'Arno Firenze',
        activities: [
          {
            id: 1,
            time: '10:00 AM',
            title: 'Accademia Gallery (Michelangelo’s David)',
            detail: 'Original statue & unfinished slaves gallery',
            icon: Building,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '01:30 PM',
            title: 'Tuscan Wine & Olive Oil Excursion',
            detail: 'Chianti countryside tasting & vineyard walk',
            icon: Clock,
            nodeNum: 2,
            pinId: 2,
          },
          {
            id: 3,
            time: '07:00 PM',
            title: 'Trattoria Bistecca alla Fiorentina',
            detail: 'Traditional Tuscan wood-fired dinner',
            icon: MapPin,
            nodeNum: 3,
            pinId: 3,
          },
        ],
        map: {
          searchPlaceholder: 'Search Chianti & Tuscany...',
          locationData: {
            name: 'Chianti Classico Estate',
            address: 'Greve in Chianti, Tuscany • 24 km',
          },
          pins: [
            { id: 1, num: 1, name: 'Accademia Gallery', x: 34, y: 32, address: 'Via Ricasoli, 58, Firenze • 0.5 km' },
            { id: 2, num: 2, name: 'Chianti Vineyards', x: 62, y: 68, address: 'Greve in Chianti • 24 km' },
            { id: 3, num: 3, name: 'Trattoria Zà Zà', x: 48, y: 44, address: 'Piazza del Mercato Centrale • 1.1 km' },
            { id: 4, num: 4, name: 'San Lorenzo', x: 72, y: 30, address: 'Mercato Centrale Firenze • 1.0 km' },
          ],
        },
      },
      {
        dayNum: 5,
        city: 'Firenze → Venezia',
        hotel: 'Hotel Danieli (Venezia)',
        activities: [
          {
            id: 1,
            time: '10:30 AM',
            title: 'High-Speed Rail to Venezia Santa Lucia',
            detail: 'Crossing the Venetian Lagoon causeway',
            icon: Train,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '02:00 PM',
            title: 'Private Gondola Cruise Grand Canal',
            detail: 'Rialto Bridge, secret waterways & serenades',
            icon: Clock,
            nodeNum: 2,
            pinId: 2,
          },
          {
            id: 3,
            time: '06:00 PM',
            title: 'St. Mark’s Square & Bell Tower Sunset',
            detail: 'Piazza San Marco orchestra cafes',
            icon: Building,
            nodeNum: 3,
            pinId: 3,
          },
        ],
        map: {
          searchPlaceholder: 'Search Venice canals & islands...',
          locationData: {
            name: 'Piazza San Marco',
            address: 'Piazza San Marco, Venezia • 0.2 km',
          },
          pins: [
            { id: 1, num: 1, name: 'Venezia Santa Lucia', x: 25, y: 40, address: 'Venezia Santa Lucia • 0.8 km' },
            { id: 2, num: 2, name: 'Rialto Bridge', x: 48, y: 50, address: 'Ponte di Rialto, Venezia • 0.4 km' },
            { id: 3, num: 3, name: 'St. Mark’s Basilica', x: 68, y: 62, address: 'Piazza San Marco • 0.2 km' },
            { id: 4, num: 4, name: 'Hotel Danieli', x: 82, y: 68, address: 'Riva degli Schiavoni • 0.3 km' },
          ],
        },
      },
      {
        dayNum: 6,
        city: 'Venezia',
        hotel: 'Hotel Danieli (Venezia)',
        activities: [
          {
            id: 1,
            time: '10:00 AM',
            title: 'Doge’s Palace & Bridge of Sighs',
            detail: 'Secret archives & historical council halls',
            icon: Building,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '01:30 PM',
            title: 'Murano Glassblowing & Burano Colors',
            detail: 'Vaporetto waterbus to artisanal lagoon islands',
            icon: Clock,
            nodeNum: 2,
            pinId: 2,
          },
          {
            id: 3,
            time: '07:30 PM',
            title: 'Venetian Cicchetti & Spritz Crawl',
            detail: 'Cannaregio district canal-side dining',
            icon: MapPin,
            nodeNum: 3,
            pinId: 3,
          },
        ],
        map: {
          searchPlaceholder: 'Search Venetian islands...',
          locationData: {
            name: 'Bridge of Sighs',
            address: 'Piazza San Marco, 1, Venezia • 0.1 km',
          },
          pins: [
            { id: 1, num: 1, name: 'Doge’s Palace', x: 50, y: 60, address: 'Piazza San Marco, 1 • 0.1 km' },
            { id: 2, num: 2, name: 'Bridge of Sighs', x: 62, y: 62, address: 'Rio di Palazzo, Venezia • 0.1 km' },
            { id: 3, num: 3, name: 'Murano Island', x: 74, y: 25, address: 'Murano Lagoon • 3.2 km' },
            { id: 4, num: 4, name: 'Cannaregio', x: 30, y: 35, address: 'Fondamenta dei Ormesini • 1.5 km' },
          ],
        },
      },
    ],
  },
  rajasthan: {
    id: 'rajasthan',
    title: 'Royal Rajasthan: Jaipur, Jodhpur, Udaipur',
    dates: 'November 10–18, 2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    days: [
      {
        dayNum: 1,
        city: 'Jaipur (Pink City)',
        hotel: 'Rambagh Palace, Jaipur',
        activities: [
          {
            id: 1,
            time: '09:30 AM',
            title: 'Amer Fort & Sheesh Mahal Exploration',
            detail: 'UNESCO hillside fortress with royal mirror palace',
            icon: Building,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '01:30 PM',
            title: 'Hawa Mahal & Johari Bazaar Walk',
            detail: '953 pink sandstone jharokhas & artisanal gems',
            icon: Clock,
            nodeNum: 2,
            pinId: 2,
          },
          {
            id: 3,
            time: '05:30 PM',
            title: 'Nahargarh Fort Sunset Viewpoint',
            detail: 'Panoramic golden hour overlooking Jaipur city',
            icon: MapPin,
            nodeNum: 3,
            pinId: 3,
          },
        ],
        map: {
          searchPlaceholder: 'Search Jaipur heritage sites...',
          locationData: {
            name: 'Amer Fort, Jaipur',
            address: 'Devisinghpura, Amer, Jaipur • 11 km',
          },
          pins: [
            { id: 1, num: 1, name: 'Amer Fort', x: 42, y: 30, address: 'Amer, Jaipur • 11 km' },
            { id: 2, num: 2, name: 'Hawa Mahal', x: 30, y: 55, address: 'Badi Choupad, Jaipur • 2.5 km' },
            { id: 3, num: 3, name: 'City Palace', x: 52, y: 68, address: 'Tulsi Marg, Gangori Bazaar • 2.0 km' },
            { id: 4, num: 4, name: 'Nahargarh Fort', x: 75, y: 34, address: 'Aravalli Hills, Jaipur • 14 km' },
          ],
        },
      },
      {
        dayNum: 2,
        city: 'Jaipur → Jodhpur',
        hotel: 'Umaid Bhawan Palace, Jodhpur',
        activities: [
          {
            id: 1,
            time: '09:00 AM',
            title: 'City Palace & Jantar Mantar Observatory',
            detail: 'World’s largest stone sundial & royal museum',
            icon: Building,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '02:00 PM',
            title: 'Scenic Express Transfer to Jodhpur',
            detail: 'Crossing the Thar desert borders (5h drive / train)',
            icon: Train,
            nodeNum: 2,
            pinId: 2,
          },
          {
            id: 3,
            time: '07:00 PM',
            title: 'Clock Tower & Blue City Spice Market',
            detail: 'Sardar Market vibrant blue alleys & Makhaniya Lassi',
            icon: MapPin,
            nodeNum: 3,
            pinId: 3,
          },
        ],
        map: {
          searchPlaceholder: 'Search Jodhpur Blue City...',
          locationData: {
            name: 'Mehrangarh Fort, Jodhpur',
            address: 'The Fort, Jodhpur, Rajasthan • 3.5 km',
          },
          pins: [
            { id: 1, num: 1, name: 'Mehrangarh Fort', x: 36, y: 38, address: 'Fort Rd, Jodhpur • 3.5 km' },
            { id: 2, num: 2, name: 'Jaswant Thada', x: 48, y: 48, address: 'Lawaran, Jodhpur • 1.2 km' },
            { id: 3, num: 3, name: 'Clock Tower', x: 65, y: 65, address: 'Nai Sarak, Jodhpur • 0.8 km' },
            { id: 4, num: 4, name: 'Umaid Bhawan', x: 80, y: 32, address: 'Circuit House Rd, Jodhpur • 5.0 km' },
          ],
        },
      },
      {
        dayNum: 3,
        city: 'Udaipur (City of Lakes)',
        hotel: 'Taj Lake Palace, Udaipur',
        activities: [
          {
            id: 1,
            time: '10:00 AM',
            title: 'City Palace Complex & Peacock Courtyard',
            detail: 'Marvel of Rajasthani and Mughal architectural fusion',
            icon: Building,
            nodeNum: 1,
            pinId: 1,
          },
          {
            id: 2,
            time: '02:00 PM',
            title: 'Private Boat Cruise on Lake Pichola',
            detail: 'Jag Mandir island palace and royal ghats vista',
            icon: Clock,
            nodeNum: 2,
            pinId: 2,
          },
          {
            id: 3,
            time: '06:00 PM',
            title: 'Bagore Ki Haveli Folk Dance & Sunset',
            detail: 'Traditional Dharohar cultural performance on waterfront',
            icon: MapPin,
            nodeNum: 3,
            pinId: 3,
          },
        ],
        map: {
          searchPlaceholder: 'Search Udaipur Lake Pichola...',
          locationData: {
            name: 'Lake Pichola, Udaipur',
            address: 'Pichola, Udaipur, Rajasthan • 1.1 km',
          },
          pins: [
            { id: 1, num: 1, name: 'City Palace Udaipur', x: 40, y: 40, address: 'Old City, Udaipur • 0.5 km' },
            { id: 2, num: 2, name: 'Lake Pichola', x: 30, y: 60, address: 'Lake Pichola, Udaipur • 1.1 km' },
            { id: 3, num: 3, name: 'Jag Mandir Palace', x: 58, y: 70, address: 'Pichola Island, Udaipur • 1.8 km' },
            { id: 4, num: 4, name: 'Bagore Ki Haveli', x: 74, y: 30, address: 'Gangaur Ghat Marg • 0.6 km' },
          ],
        },
      },
    ],
  },
};

export default function TravelMateItineraryWindow({ className = '' }) {
  const [selectedPreset, setSelectedPreset] = useState('rajasthan');
  const [activeDayIdx, setActiveDayIdx] = useState(0); // default to Day 1 (Jaipur)
  const [activePinId, setActivePinId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [customActivities, setCustomActivities] = useState({});

  const trip = TRIP_PRESETS[selectedPreset] || TRIP_PRESETS.rajasthan;
  const currentDay = trip.days[activeDayIdx] || trip.days[0];
  const dayKey = `${selectedPreset}_day_${currentDay.dayNum}`;

  // Combine default activities with any newly added ones
  const displayedActivities = [
    ...currentDay.activities,
    ...(customActivities[dayKey] || []),
  ];

  const currentMap = currentDay.map;
  const activePin =
    currentMap.pins.find((p) => p.id === activePinId) || currentMap.pins[0];

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const newAct = {
      id: Date.now(),
      time: '06:00 PM',
      title: newActivityTitle.trim(),
      detail: 'Custom itinerary excursion',
      icon: Clock,
      nodeNum: displayedActivities.length + 1,
      pinId: (displayedActivities.length % 4) + 1,
    };

    setCustomActivities((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), newAct],
    }));

    setNewActivityTitle('');
    setIsAddingActivity(false);
  };

  return (
    <div
      className={`relative w-full max-w-5xl mx-auto rounded-3xl bg-[#0E1118]/95 border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.75)] text-white overflow-hidden transition-all duration-300 transform-gpu ${className}`}
      style={{ transform: 'translate3d(0, 0, 0)' }}
    >
      {/* ==================== MAC OS WINDOW HEADER ==================== */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
        {/* Traffic Light Window Controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm transition-transform hover:scale-110" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm transition-transform hover:scale-110" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm transition-transform hover:scale-110" />
          <span className="ml-3 text-xs font-semibold tracking-wide text-neutral-300 flex items-center gap-1.5">
            <Compass size={13} className="text-neutral-400" />
            TravelMate
          </span>
        </div>

        {/* Trip Preset Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-full p-1 text-[11px]">
          <button
            type="button"
            onClick={() => {
              setSelectedPreset('italy');
              setActiveDayIdx(2);
              setActivePinId(4);
            }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              selectedPreset === 'italy'
                ? 'bg-white text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🇮🇹 Italy Adventure
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPreset('rajasthan');
              setActiveDayIdx(0);
              setActivePinId(1);
            }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              selectedPreset === 'rajasthan'
                ? 'bg-white text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🇮🇳 Royal Rajasthan
          </button>
        </div>
      </div>

      {/* ==================== TRIP TITLE & DATES BAR ==================== */}
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.01]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {trip.title}
          </h2>
          <p className="text-xs text-neutral-400 font-normal mt-0.5">{trip.dates}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 hidden sm:inline">Planned by Sarah M.</span>
          <img
            src={trip.avatar}
            alt="Traveler avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 shadow-lg"
          />
        </div>
      </div>

      {/* ==================== DAY TABS HORIZONTAL STRIP ==================== */}
      <div className="px-6 py-3 flex items-center gap-2 border-b border-white/[0.06] overflow-x-auto scrollbar-none bg-[#0B0D14]">
        {trip.days.map((day, idx) => {
          const isActive = activeDayIdx === idx;
          return (
            <button
              key={day.dayNum}
              type="button"
              onClick={() => {
                setActiveDayIdx(idx);
                setActivePinId(day.map.pins[0]?.id || 1);
              }}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 relative ${
                isActive
                  ? 'bg-white text-neutral-950 font-bold shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Day {day.dayNum}
            </button>
          );
        })}
      </div>

      {/* ==================== MAIN SPLIT BODY ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* LEFT COLUMN: TIMELINE & DAY ACTIVITIES (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Day Glass Card */}
          <div className="relative rounded-2xl bg-[#141824] border border-white/[0.08] p-5 shadow-lg">
            {/* Header: Day number & Add Activity button */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-black text-white">
                  Day {currentDay.dayNum} ({currentDay.city})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingActivity(!isAddingActivity)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <Plus size={13} />
                <span>Add Activity</span>
              </button>
            </div>

            {/* Quick Add Activity inline form */}
            <AnimatePresence>
              {isAddingActivity && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddActivitySubmit}
                  className="mb-4 p-3 bg-white/[0.04] rounded-xl border border-white/15 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    placeholder="e.g. Sunset Rooftop Aperitivo..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold rounded-lg transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingActivity(false)}
                    className="text-xs text-neutral-400 hover:text-white px-1.5"
                  >
                    Cancel
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Stay / Accommodation Row */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-amber-500/10 rounded-xl text-xs text-amber-300/90 font-medium mb-4 border border-amber-500/20">
              <Calendar size={14} className="text-amber-400 shrink-0" />
              <span className="truncate">{currentDay.hotel}</span>
            </div>

            {/* Timeline Activities List */}
            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-white/10">
              {displayedActivities.map((act) => {
                const ActIcon = act.icon || Clock;
                const isSelected = activePinId === act.pinId;
                return (
                  <div
                    key={act.id}
                    onClick={() => act.pinId && setActivePinId(act.pinId)}
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/25 shadow-md'
                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/15 hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Timeline Node Badge on the Left */}
                    <div
                      className={`absolute -left-[30px] top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-white text-neutral-950 font-bold ring-4 ring-white/10 shadow-sm'
                          : 'bg-[#151923] text-neutral-400 border border-white/15'
                      }`}
                    >
                      {act.nodeNum || '•'}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <ActIcon size={14} className="text-amber-400/90 shrink-0" />
                          <span className="text-xs font-bold text-white tracking-tight">
                            {act.time}: {act.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-normal pl-5">
                          {act.detail}
                        </p>
                      </div>

                      <ChevronRight
                        size={14}
                        className={`text-neutral-500 shrink-0 mt-0.5 transition-transform ${
                          isSelected ? 'text-white translate-x-0.5' : ''
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Activity pill buttons */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setIsAddingActivity(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-1.5"
              >
                <Plus size={13} />
                <span>Add Activity +</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddingActivity(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-1.5"
              >
                <Plus size={13} />
                <span>Add Activity +</span>
              </button>
            </div>
          </div>

          {/* Next Day Preview Card */}
          {currentDay.nextPreview && (
            <div className="rounded-2xl bg-[#141824]/60 border border-white/[0.06] p-4 space-y-2 opacity-85 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 mb-1">
                <span>Tomorrow’s Highlights Preview</span>
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Day {currentDay.dayNum + 1}</span>
              </div>
              {currentDay.nextPreview.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/5 text-neutral-400 border border-white/10 flex items-center justify-center text-[10px] font-mono">
                      {item.nodeNum}
                    </span>
                    <Building size={13} className="text-neutral-500" />
                    <span className="text-neutral-300 font-medium">
                      {item.time}: {item.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">{item.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DARK MODE VECTOR ROUTE MAP (5 cols) */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl bg-[#0E1118] border border-white/[0.08] overflow-hidden shadow-2xl h-[480px] flex flex-col">
            {/* Map Top Search Input */}
            <div className="p-3 border-b border-white/[0.08] bg-[#121622] z-10">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] rounded-xl border border-white/[0.08] focus-within:border-white/20 transition-colors">
                <Search size={14} className="text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentMap.searchPlaceholder}
                  className="bg-transparent text-xs text-white placeholder-neutral-500 outline-none w-full"
                />
              </div>
            </div>

            {/* Stylized Dark Vector Map Canvas */}
            <div className="relative flex-1 w-full h-full overflow-hidden bg-[#0A0D14]">
              {/* Vector Road and River Network SVG */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
              >
                {/* Secondary Street Grid lines */}
                <line x1="0" y1="20" x2="100" y2="28" stroke="#1E2533" strokeWidth="0.8" />
                <line x1="0" y1="45" x2="100" y2="52" stroke="#1E2533" strokeWidth="0.8" />
                <line x1="0" y1="75" x2="100" y2="82" stroke="#1E2533" strokeWidth="0.8" />
                <line x1="25" y1="0" x2="30" y2="100" stroke="#1E2533" strokeWidth="0.8" />
                <line x1="60" y1="0" x2="65" y2="100" stroke="#1E2533" strokeWidth="0.8" />
                <line x1="85" y1="0" x2="88" y2="100" stroke="#1E2533" strokeWidth="0.8" />

                {/* Angled avenues */}
                <path
                  d="M10,90 Q40,40 90,20"
                  fill="none"
                  stroke="#2D3748"
                  strokeWidth="1.2"
                />
                <path
                  d="M20,10 Q60,60 95,85"
                  fill="none"
                  stroke="#2D3748"
                  strokeWidth="1.2"
                />

                {/* River water body */}
                <path
                  d="M0,65 Q35,70 65,45 T100,50"
                  fill="none"
                  stroke="#17202E"
                  strokeWidth="5"
                  strokeOpacity="0.8"
                />

                {/* Connected Travel Route Polyline in warm amber/gold */}
                <polyline
                  points={currentMap.pins.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.8"
                  strokeDasharray="3 2"
                />
              </svg>

              {/* Interactive Numbered Pins */}
              {currentMap.pins.map((pin) => {
                const isSelected = activePinId === pin.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => setActivePinId(pin.id)}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 cursor-pointer"
                  >
                    {/* Ring when selected */}
                    {isSelected && (
                      <span className="absolute -inset-1 rounded-full border border-amber-400/50 pointer-events-none" />
                    )}

                    {/* Pin Bubble */}
                    <div
                      className={`relative flex items-center justify-center rounded-full transition-all duration-150 ${
                        isSelected
                          ? 'w-8 h-8 bg-amber-500 text-neutral-950 shadow-lg ring-2 ring-white scale-110 font-bold'
                          : 'w-7 h-7 bg-[#161B26] border border-white/20 text-neutral-300 hover:scale-105 hover:border-white/40'
                      }`}
                    >
                      <span className="text-xs font-black font-mono">{pin.num}</span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap bg-[#121622] border border-white/15 text-[11px] font-bold text-white px-2 py-1 rounded-lg shadow-xl z-30 pointer-events-none">
                      {pin.name}
                    </div>
                  </button>
                );
              })}

              {/* Floating Bottom Location Data Card */}
              <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-[#141824] border border-white/[0.08] p-3.5 shadow-2xl flex items-center justify-between z-20">
                <div className="space-y-0.5 max-w-[80%]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">Location details</span>
                    <span className="text-[10px] text-amber-400 font-semibold">• {activePin.name}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate font-normal">
                    {activePin.address}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Compass size={15} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
