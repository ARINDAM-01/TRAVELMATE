import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Plane,
  Calendar,
  Wallet,
  Users,
  Compass,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  Save,
  Download,
  Info,
  ShieldAlert,
  Luggage,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api, { extractError } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';
import {
  TRAVEL_STYLES,
  ACCOMMODATION_TYPES,
  TRANSPORTATION_MODES,
  CURRENCY_LIST,
  INDIAN_STATES,
} from '../utils/constants';

const STATE_PRESETS = {
  Rajasthan: {
    destinations: 'Jaipur, Jodhpur, Udaipur',
    budget: 28000,
    interests: 'Amer Fort, royal palaces, desert safari, Rajasthani thali, blue pottery shopping',
    travelStyle: 'cultural',
    accommodation: 'Heritage Haveli / Resort',
  },
  Kerala: {
    destinations: 'Munnar, Alleppey, Kochi',
    budget: 30000,
    interests: 'Emerald tea plantations, serene backwaters houseboat cruise, Kathakali dance, Ayurvedic wellness',
    travelStyle: 'nature',
    accommodation: 'Resort / Houseboat',
  },
  Goa: {
    destinations: 'North Goa (Baga, Anjuna) & South Goa (Palolem)',
    budget: 25000,
    interests: 'Beach hopping, water sports, Portuguese churches, sunset shacks, coastal seafood',
    travelStyle: 'beach',
    accommodation: 'Boutique Beach Resort',
  },
  'Himachal Pradesh': {
    destinations: 'Manali, Shimla, Dharamshala',
    budget: 26000,
    interests: 'Solang Valley snow adventures, Rohtang Pass, Tibetan monasteries, mountain cafes',
    travelStyle: 'hill_station',
    accommodation: 'Mountain View Cottage',
  },
  Uttarakhand: {
    destinations: 'Rishikesh, Haridwar, Mussoorie',
    budget: 22000,
    interests: 'Holy Ganga evening aarti, white water rafting, yoga ashrams, mountain viewpoints',
    travelStyle: 'spiritual',
    accommodation: 'Riverfront Resort / Ashram',
  },
  'Jammu and Kashmir': {
    destinations: 'Srinagar, Gulmarg, Pahalgam',
    budget: 35000,
    interests: 'Dal Lake shikara ride, Gulmarg gondola snow cable car, saffron valleys, Mughal gardens',
    travelStyle: 'nature',
    accommodation: 'Luxury Houseboat / Hotel',
  },
  Ladakh: {
    destinations: 'Leh, Pangong Tso, Nubra Valley',
    budget: 38000,
    interests: 'High mountain passes, Khardung La, Pangong blue lake, ancient Buddhist gompas, star gazing',
    travelStyle: 'adventure',
    accommodation: 'High Altitude Glamping / Hotel',
  },
  Maharashtra: {
    destinations: 'Mumbai, Lonavala, Alibaug',
    budget: 24000,
    interests: 'Gateway of India, Marine Drive, Western Ghats waterfalls, coastal forts, street food',
    travelStyle: 'cultural',
    accommodation: 'Hotel',
  },
  Karnataka: {
    destinations: 'Hampi, Coorg, Mysore',
    budget: 25000,
    interests: 'UNESCO ruins of Vijayanagara, coffee plantation trails, Mysore Royal Palace',
    travelStyle: 'cultural',
    accommodation: 'Plantation Homestay / Hotel',
  },
  'Tamil Nadu': {
    destinations: 'Ooty, Madurai, Kanyakumari',
    budget: 24000,
    interests: 'Nilgiri mountain toy train, Meenakshi Amman Temple, Southernmost sunrise point',
    travelStyle: 'spiritual',
    accommodation: 'Hotel',
  },
  'West Bengal': {
    destinations: 'Darjeeling, Kalimpong, Kolkata',
    budget: 25000,
    interests: 'Tiger Hill Kanchenjunga sunrise, UNESCO toy train, colonial architecture, street sweets',
    travelStyle: 'cultural',
    accommodation: 'Heritage Hotel',
  },
  'Uttar Pradesh': {
    destinations: 'Varanasi, Agra, Lucknow',
    budget: 22000,
    interests: 'Ganga ghat aarti, Taj Mahal sunrise, Awadhi culinary trail, ancient lanes',
    travelStyle: 'spiritual',
    accommodation: 'Hotel',
  },
};

const AIPlanner = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDest = searchParams.get('destination') || '';
  const initialState = searchParams.get('state') || '';

  const [selectedState, setSelectedState] = useState(initialState);
  const [formData, setFormData] = useState({
    startLocation: 'New Delhi, India',
    destinations: initialDest || 'Jaipur & Udaipur, Rajasthan',
    days: 4,
    startDate: '',
    endDate: '',
    numTravelers: 2,
    budget: 28000,
    currency: 'INR',
    travelStyle: 'cultural',
    transportationPreference: 'Indian Railways (Vande Bharat / Express)',
    accommodationPreference: 'Heritage Haveli / Resort',
    interests: 'Royal palaces, grand hill forts, Rajasthani thali dining & vibrant bazaars',
    specialRequirements: 'Prefer comfortable travel with local cuisine and evening sunset viewpoints',
  });

  // Handle state change to auto-customize
  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    if (!stateName) return;

    const preset = STATE_PRESETS[stateName];
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        destinations: preset.destinations,
        budget: preset.budget,
        interests: preset.interests,
        travelStyle: preset.travelStyle || prev.travelStyle,
        accommodationPreference: preset.accommodation || prev.accommodationPreference,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        destinations: `Top destinations in ${stateName}, India`,
        interests: `Explore top sights, culture, nature, and food of ${stateName}`,
      }));
    }
  };

  useEffect(() => {
    if (initialState) {
      handleStateSelect(initialState);
    }
    if (initialDest) {
      setFormData((prev) => ({ ...prev, destinations: initialDest }));
    }
  }, [initialState, initialDest]);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [configTip, setConfigTip] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMsg('');
    setConfigTip(null);

    try {
      const payload = {
        ...formData,
        destinations: formData.destinations.split(',').map((d) => d.trim()).filter(Boolean),
        days: parseInt(formData.days) || 3,
        numTravelers: parseInt(formData.numTravelers) || 1,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };

      const { data } = await api.post('/ai/generate-itinerary', payload);
      setGeneratedPlan(data.data.plan);
    } catch (err) {
      if (err.response?.status === 503 && err.response?.data?.configured === false) {
        setConfigTip(err.response.data.tip || 'Please configure GEMINI_API_KEY in backend/.env');
        setErrorMsg('Google Gemini API Key is not configured on the backend server.');
      } else {
        setErrorMsg(extractError(err));
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToTrips = async () => {
    if (!generatedPlan) return;
    setSaving(true);
    try {
      const { data } = await api.post('/ai/save-itinerary', {
        title: `${generatedPlan.destinations?.[0] || 'Expedition'} Itinerary`,
        plan: generatedPlan,
        currency: formData.currency,
      });

      alert('Trip saved successfully to your trips collection!');
      navigate(`/dashboard/trips?id=${data.data.trip.id}`);
    } catch (err) {
      alert(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleExportText = () => {
    if (!generatedPlan) return;
    const content = JSON.stringify(generatedPlan, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itinerary-${generatedPlan.destinations?.[0] || 'trip'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout activeTitle="AI Trip Planner">
      {/* Intro Header */}
      <div className="glass-card p-6 border border-white/10 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-electric-cyan" size={20} />
            <h2 className="text-xl font-bold text-white">Google Gemini AI Itinerary Studio</h2>
          </div>
          <p className="text-xs text-white/50 max-w-xl">
            Input your starting point, destinations, dates, and stylistic desires. The AI generates verified JSON day-by-day itineraries with estimated expenses.
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form & Generated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Traveler Preferences */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleGenerate}
            className="glass-card p-6 border border-white/10 space-y-4 sticky top-6"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 border-b border-white/10 pb-3 flex items-center gap-2">
              <Compass size={16} className="text-electric-cyan" />
              Travel Preferences (India Edition)
            </h3>

            {/* Indian State Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-electric-cyan" />
                  <span>Explore by Indian State:</span>
                </span>
                <span className="text-[10px] text-electric-cyan font-bold lowercase">auto-fills form</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateSelect(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-electric-blue transition-all"
              >
                <option value="" className="bg-navy-secondary text-white">
                  🇮🇳 Select an Indian State or UT...
                </option>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.name} className="bg-navy-secondary text-white">
                    {s.name} - {s.famousFor}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Starting Location in India"
              placeholder="e.g. New Delhi, Mumbai, Bengaluru, Kolkata..."
              value={formData.startLocation}
              onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
              required
            />

            <Input
              label="Destination(s) in India (comma-separated)"
              placeholder="e.g. Jaipur, Udaipur, Jodhpur or Munnar, Alleppey"
              value={formData.destinations}
              onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Days Duration"
                type="number"
                min="1"
                max="14"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                required
              />
              <Input
                label="Travelers"
                type="number"
                min="1"
                max="20"
                value={formData.numTravelers}
                onChange={(e) => setFormData({ ...formData, numTravelers: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Budget Estimate"
                type="number"
                placeholder="e.g. 1500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase text-white/70">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
                >
                  {CURRENCY_LIST.map((c) => (
                    <option key={c.code} value={c.code} className="bg-navy-secondary text-white">
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Travel Style</label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-blue"
              >
                {TRAVEL_STYLES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-navy-secondary text-white">
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase text-white/70">Key Interests</label>
              <textarea
                rows="2"
                placeholder="e.g. Art museums, street food, coastal hikes..."
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-electric-blue"
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              loading={generating}
              fullWidth
              icon={Sparkles}
            >
              Generate Itinerary
            </Button>
          </form>
        </div>

        {/* Right Output: Generated Structured Itinerary */}
        <div className="lg:col-span-7">
          {generating ? (
            <div className="glass-card p-12 border border-white/10 text-center flex flex-col items-center justify-center min-h-[450px]">
              <div className="relative mb-6">
                <Spinner size="xl" />
                <Sparkles size={20} className="absolute inset-0 m-auto text-electric-cyan animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Analyzing Destinations & Crafting Itinerary...</h3>
              <p className="text-xs text-white/50 max-w-sm leading-relaxed">
                Google Gemini is assembling optimal attractions, dining, and transportation schedules based on your preferences.
              </p>
            </div>
          ) : errorMsg ? (
            <div className="glass-card p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
              <AlertCircle size={36} className="text-red-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Generation Unavailable</h3>
              <p className="text-sm text-red-300 max-w-md mx-auto">{errorMsg}</p>
              {configTip && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl max-w-md mx-auto text-xs text-white/70 text-left">
                  <p className="font-semibold text-white mb-1">Configuration Required:</p>
                  <p>{configTip}</p>
                  <p className="mt-2 text-white/40 font-mono text-[11px]">
                    Edit: travelTrove/backend/.env -&gt; GEMINI_API_KEY=AIzaSy...
                  </p>
                </div>
              )}
            </div>
          ) : generatedPlan ? (
            <div className="glass-card p-6 sm:p-8 border border-white/10 space-y-8">
              {/* Output Header with Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-electric-cyan mb-1 block">
                    AI Generated Plan
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    {generatedPlan.destinations?.join(' & ') || 'Custom Expedition'}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" icon={Download} onClick={handleExportText}>
                    Export JSON
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    loading={saving}
                    icon={Save}
                    onClick={handleSaveToTrips}
                  >
                    Save to My Trips
                  </Button>
                </div>
              </div>

              {/* Trip Narrative Overview */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Overview</h4>
                <p className="text-sm text-white/80 leading-relaxed font-normal">
                  {generatedPlan.tripOverview}
                </p>
              </div>

              {/* Estimated Expenses Summary */}
              {generatedPlan.estimatedExpenses && (
                <div className="p-5 bg-navy border border-white/10 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                      <Wallet size={15} className="text-amber" />
                      Estimated Expenses Breakdown
                    </h4>
                    <span className="text-base font-black text-amber">
                      Total ~{generatedPlan.estimatedExpenses.currency} {generatedPlan.estimatedExpenses.totalEstimated}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block">Transit</span>
                      <span className="font-bold text-white">
                        {generatedPlan.estimatedExpenses.currency} {generatedPlan.estimatedExpenses.transportation}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block">Lodging</span>
                      <span className="font-bold text-white">
                        {generatedPlan.estimatedExpenses.currency} {generatedPlan.estimatedExpenses.accommodation}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block">Dining</span>
                      <span className="font-bold text-white">
                        {generatedPlan.estimatedExpenses.currency} {generatedPlan.estimatedExpenses.food}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block">Activities</span>
                      <span className="font-bold text-white">
                        {generatedPlan.estimatedExpenses.currency} {generatedPlan.estimatedExpenses.activities}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl">
                      <span className="text-white/40 block">Misc</span>
                      <span className="font-bold text-white">
                        {generatedPlan.estimatedExpenses.currency} {generatedPlan.estimatedExpenses.miscellaneous}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 mt-3 italic">
                    * Estimated amounts are benchmarks generated by AI based on travel profile, not confirmed live rates.
                  </p>
                </div>
              )}

              {/* Day-by-Day Timeline */}
              <div className="space-y-6">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-electric-cyan" />
                  Day-by-Day Schedule
                </h4>

                {generatedPlan.days?.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="p-5 bg-navy-secondary border border-white/10 rounded-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-electric-blue/20 text-electric-cyan flex items-center justify-center font-bold text-sm">
                          {day.dayNumber}
                        </span>
                        <div>
                          <h5 className="font-bold text-white text-base">
                            Day {day.dayNumber}: {day.location}
                          </h5>
                          <p className="text-xs text-white/50">{day.summary}</p>
                        </div>
                      </div>
                      {day.weatherNote && (
                        <span className="text-xs text-white/40 italic">🌦️ {day.weatherNote}</span>
                      )}
                    </div>

                    {/* Morning, Afternoon, Evening */}
                    {['morning', 'afternoon', 'evening'].map((period) => {
                      const acts = day[period] || [];
                      if (acts.length === 0) return null;
                      return (
                        <div key={period} className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block pl-3 border-l-2 border-electric-cyan">
                            {period}
                          </span>
                          <div className="space-y-2 pl-3">
                            {acts.map((act, i) => (
                              <div
                                key={i}
                                className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start justify-between gap-4 text-xs"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-white text-sm">{act.name}</span>
                                    {act.startTime && (
                                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                                        <Clock size={11} /> {act.startTime} - {act.endTime}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-white/70 leading-relaxed mb-1">{act.description}</p>
                                  {act.notes && (
                                    <p className="text-electric-cyan text-[11px] font-medium">
                                      Tip: {act.notes}
                                    </p>
                                  )}
                                </div>
                                {act.estimatedCost > 0 && (
                                  <span className="font-semibold text-amber shrink-0">
                                    ~{act.currency} {act.estimatedCost}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Tips & Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {generatedPlan.travelTips?.length > 0 && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-1.5 text-electric-cyan">
                      <Info size={14} /> Travel Tips
                    </h5>
                    <ul className="space-y-1.5 text-white/70 list-disc list-inside">
                      {generatedPlan.travelTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedPlan.packingRecommendations?.length > 0 && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-1.5 text-violet">
                      <Luggage size={14} /> Packing Recommendations
                    </h5>
                    <ul className="space-y-1.5 text-white/70 list-disc list-inside">
                      {generatedPlan.packingRecommendations.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 border border-white/10 text-center flex flex-col items-center justify-center min-h-[450px]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to Plan</h3>
              <p className="text-xs text-white/50 max-w-sm leading-relaxed">
                Configure your starting city, destinations, and style on the left, then click "Generate Itinerary" to produce your AI travel plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIPlanner;
