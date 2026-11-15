const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');
const config = require('../config');

// Zod Schema for Structured Itinerary Validation
const activitySchema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  estimatedCost: z.number().nonnegative().optional().default(0),
  currency: z.string().default('USD'),
  category: z.string().optional().default('activity'),
  location: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  notes: z.string().optional(),
});

const dayItinerarySchema = z.object({
  dayNumber: z.number().int().positive(),
  date: z.string().optional(),
  location: z.string(),
  summary: z.string(),
  weatherNote: z.string().optional(),
  morning: z.array(activitySchema).default([]),
  afternoon: z.array(activitySchema).default([]),
  evening: z.array(activitySchema).default([]),
});

const generatedItinerarySchema = z.object({
  tripOverview: z.string(),
  destinations: z.array(z.string()),
  days: z.array(dayItinerarySchema),
  estimatedExpenses: z.object({
    transportation: z.number().default(0),
    accommodation: z.number().default(0),
    food: z.number().default(0),
    activities: z.number().default(0),
    miscellaneous: z.number().default(0),
    totalEstimated: z.number().default(0),
    currency: z.string().default('USD'),
  }),
  accommodationSuggestions: z.array(z.object({
    name: z.string(),
    type: z.string(),
    area: z.string(),
    priceRange: z.string(),
    description: z.string().optional(),
  })).default([]),
  transportationSuggestions: z.array(z.object({
    mode: z.string(),
    from: z.string(),
    to: z.string(),
    estimatedCost: z.string().optional(),
    tips: z.string().optional(),
  })).default([]),
  travelTips: z.array(z.string()).default([]),
  safetyConsiderations: z.array(z.string()).default([]),
  packingRecommendations: z.array(z.string()).default([]),
});

/**
 * Generates an itinerary using Google Gemini models
 */
async function generateItineraryPlan(preferences) {
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('MISSING_API_KEY: Google Gemini API key is not configured on the backend. Please add GEMINI_API_KEY to your environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  });

  const prompt = `
You are TravelMate's master AI travel planner. Create a comprehensive, realistic, and highly structured travel itinerary based on these traveler preferences:

Starting Location: ${preferences.startLocation}
Destination(s): ${Array.isArray(preferences.destinations) ? preferences.destinations.join(', ') : preferences.destinations}
Duration: ${preferences.days || 3} days
Departure Date: ${preferences.startDate || 'Flexible'}
Return Date: ${preferences.endDate || 'Flexible'}
Number of Travelers: ${preferences.numTravelers || 1}
Budget Tier / Amount: ${preferences.budget ? `${preferences.budget} ${preferences.currency || 'USD'}` : 'Moderate'}
Currency: ${preferences.currency || 'USD'}
Travel Style: ${preferences.travelStyle || 'Balanced Explorer'}
Transportation Preference: ${preferences.transportationPreference || 'Mixed / Public & Rail'}
Accommodation Preference: ${preferences.accommodationPreference || 'Boutique Hotel / Well-rated'}
Interests: ${preferences.interests || 'Culture, Food, Scenic Sights, Local Gems'}
Special Requirements: ${preferences.specialRequirements || 'None'}

Return a single valid JSON object strictly complying with this structure:
{
  "tripOverview": "Detailed summary describing the trip narrative...",
  "destinations": ["City 1", "City 2"],
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD or empty",
      "location": "City/Region",
      "summary": "Focus of the day",
      "weatherNote": "Expected weather advice",
      "morning": [
        {
          "name": "Activity Name",
          "description": "Specific details",
          "timeOfDay": "morning",
          "startTime": "09:00",
          "endTime": "11:30",
          "estimatedCost": 25,
          "currency": "${preferences.currency || 'USD'}",
          "category": "museum / sight / food / transport",
          "location": "Specific address or landmark",
          "latitude": 48.8566,
          "longitude": 2.3522,
          "notes": "Helpful insider tip"
        }
      ],
      "afternoon": [...],
      "evening": [...]
    }
  ],
  "estimatedExpenses": {
    "transportation": 150,
    "accommodation": 400,
    "food": 250,
    "activities": 180,
    "miscellaneous": 70,
    "totalEstimated": 1050,
    "currency": "${preferences.currency || 'USD'}"
  },
  "accommodationSuggestions": [
    { "name": "Hotel Name", "type": "Hotel", "area": "Neighborhood", "priceRange": "$$$", "description": "Why it fits" }
  ],
  "transportationSuggestions": [
    { "mode": "Train/Flight", "from": "A", "to": "B", "estimatedCost": "$45", "tips": "Book in advance" }
  ],
  "travelTips": ["Tip 1", "Tip 2"],
  "safetyConsiderations": ["Safety advisory 1", "Emergency numbers"],
  "packingRecommendations": ["Essential item 1", "Adapter type"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    // Validate with Zod
    const validated = generatedItinerarySchema.parse(parsed);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[AI Validation Error]', error.errors);
      throw new Error(`AI generated response did not pass schema validation: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

/**
 * AI travel assistant chat
 */
async function aiTravelChat(messages, context = {}) {
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('MISSING_API_KEY: Gemini API key is not configured.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemInstruction = `
You are TravelMate AI, an expert travel concierge and route planner.
Context:
Current Trip: ${context.tripTitle || 'None specified'}
Destinations: ${context.destinations ? JSON.stringify(context.destinations) : 'General'}
User Currency: ${context.currency || 'USD'}

Provide helpful, concise, well-structured travel advice. Use markdown bullets and formatting. Never fabricate live booking prices or claim guaranteed reservations.
`;

  const conversationText = messages
    .map(m => `${m.role === 'user' ? 'Traveler' : 'TravelMate'}: ${m.content}`)
    .join('\n\n');

  const fullPrompt = `${systemInstruction}\n\nConversation:\n${conversationText}\n\nTravelMate:`;

  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

module.exports = {
  generateItineraryPlan,
  aiTravelChat,
  generatedItinerarySchema,
};
