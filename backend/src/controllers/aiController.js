const { generateItineraryPlan, aiTravelChat } = require('../services/aiService');
const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const generateItinerary = async (req, res, next) => {
  try {
    const preferences = req.body;

    if (!preferences.startLocation || !preferences.destinations) {
      return errorResponse(res, 'startLocation and destinations are required for itinerary generation', 400);
    }

    const plan = await generateItineraryPlan(preferences);
    return successResponse(res, { plan }, 'AI itinerary generated successfully');
  } catch (err) {
    if (err.message && err.message.startsWith('MISSING_API_KEY')) {
      return res.status(503).json({
        success: false,
        configured: false,
        message: err.message,
        tip: 'To enable AI generation, add GEMINI_API_KEY to backend/.env',
      });
    }
    next(err);
  }
};

const saveGeneratedItinerary = async (req, res, next) => {
  try {
    const { title, plan, currency = 'USD' } = req.body;

    if (!plan || !plan.days) {
      return errorResponse(res, 'Valid generated plan object is required', 400);
    }

    const tripCurrency = plan.estimatedExpenses?.currency || currency || 'USD';
    const totalEstimated = plan.estimatedExpenses?.totalEstimated || null;

    // Build serialized AI budget plan for persistent category money separation
    let aiNotesData = null;
    if (plan.estimatedExpenses) {
      try {
        aiNotesData = JSON.stringify({
          aiBudgetPlan: {
            transportation: Number(plan.estimatedExpenses.transportation) || 0,
            accommodation: Number(plan.estimatedExpenses.accommodation) || 0,
            food: Number(plan.estimatedExpenses.food) || 0,
            activities: Number(plan.estimatedExpenses.activities) || 0,
            miscellaneous: Number(plan.estimatedExpenses.miscellaneous) || 0,
            totalEstimated: Number(plan.estimatedExpenses.totalEstimated) || 0,
            currency: tripCurrency,
          },
        });
      } catch (e) {
        aiNotesData = null;
      }
    }

    // Populate categorized estimated expenses from AI cost planning
    const estimatedExpensesData = [];
    if (plan.estimatedExpenses) {
      const categoryMapping = [
        {
          key: 'transportation',
          title: 'AI Transit Estimate',
          category: 'transportation',
          description: 'AI projected transportation, flights, trains & local transit',
        },
        {
          key: 'accommodation',
          title: 'AI Lodging Estimate',
          category: 'accommodation',
          description: 'AI projected hotels, resorts & stays',
        },
        {
          key: 'food',
          title: 'AI Dining Estimate',
          category: 'food',
          description: 'AI projected meals, street food & dining budget',
        },
        {
          key: 'activities',
          title: 'AI Activities Estimate',
          category: 'activities',
          description: 'AI projected sightseeing, monuments, entry tickets & tours',
        },
        {
          key: 'miscellaneous',
          title: 'AI Misc & Contingency',
          category: 'miscellaneous',
          description: 'AI projected shopping buffer & emergency contingency',
        },
      ];

      for (const item of categoryMapping) {
        const amount = Number(plan.estimatedExpenses[item.key]) || 0;
        if (amount > 0) {
          estimatedExpensesData.push({
            userId: req.user.id,
            category: item.category,
            title: item.title,
            description: item.description,
            amount: amount,
            currency: tripCurrency,
            date: new Date(),
            isEstimated: true,
          });
        }
      }
    }

    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title: title || `${plan.destinations?.[0] || 'AI Planned'} Expedition`,
        description: plan.tripOverview,
        startLocation: plan.destinations?.[0] || 'Origin',
        destinations: plan.destinations || [],
        currency: tripCurrency,
        budget: totalEstimated,
        status: 'planning',
        notes: aiNotesData,
        expenses: {
          create: estimatedExpensesData,
        },
        itineraryDays: {
          create: plan.days.map((day) => {
            const allActivities = [
              ...(day.morning || []).map((a, i) => ({ ...a, orderIndex: i })),
              ...(day.afternoon || []).map((a, i) => ({ ...a, orderIndex: 10 + i })),
              ...(day.evening || []).map((a, i) => ({ ...a, orderIndex: 20 + i })),
            ];

            return {
              dayNumber: day.dayNumber,
              location: day.location,
              summary: day.summary,
              weatherNote: day.weatherNote,
              activities: {
                create: allActivities.map((act) => ({
                  name: act.name,
                  description: act.description,
                  timeOfDay: act.timeOfDay,
                  startTime: act.startTime,
                  endTime: act.endTime,
                  estimatedCost: act.estimatedCost,
                  currency: act.currency || tripCurrency,
                  category: act.category,
                  location: act.location,
                  latitude: act.latitude,
                  longitude: act.longitude,
                  notes: act.notes,
                  orderIndex: act.orderIndex,
                })),
              },
            };
          }),
        },
      },
      include: {
        itineraryDays: {
          include: { activities: true },
        },
        expenses: true,
      },
    });

    // Populate initial graph nodes from activities with coordinates
    const createdNodes = [];
    for (const day of trip.itineraryDays) {
      for (const act of day.activities) {
        if (act.latitude && act.longitude) {
          const node = await prisma.graphNode.create({
            data: {
              tripId: trip.id,
              name: act.name,
              nodeType: 'attraction',
              latitude: act.latitude,
              longitude: act.longitude,
              description: act.description,
            },
          });
          createdNodes.push(node);
        }
      }
    }

    // Connect sequential nodes in the graph
    for (let i = 0; i < createdNodes.length - 1; i++) {
      await prisma.graphEdge.create({
        data: {
          tripId: trip.id,
          sourceId: createdNodes[i].id,
          targetId: createdNodes[i + 1].id,
          edgeType: 'recommended',
          transportMode: 'Transit',
        },
      });
    }

    return successResponse(res, { trip }, 'Generated itinerary and categorized budget saved to your trips', 201);
  } catch (err) {
    next(err);
  }
};

const syncTripAiBudget = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
      include: {
        itineraryDays: {
          include: { activities: true },
        },
      },
    });

    if (!trip) {
      return errorResponse(res, 'Trip not found or unauthorized', 404);
    }

    // Determine estimated duration in days
    let daysCount = 3;
    if (trip.startDate && trip.endDate) {
      const diffMs = new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) daysCount = diffDays;
    } else if (trip.itineraryDays && trip.itineraryDays.length > 0) {
      daysCount = trip.itineraryDays.length;
    }

    const travelers = trip.numTravelers || 1;
    const currency = trip.currency || 'USD';

    // Calculate sum of activities with estimatedCost if any
    let activityCostSum = 0;
    if (trip.itineraryDays) {
      for (const day of trip.itineraryDays) {
        for (const act of (day.activities || [])) {
          if (act.estimatedCost && act.estimatedCost > 0) {
            activityCostSum += act.estimatedCost;
          }
        }
      }
    }

    // Benchmark total target budget
    let targetTotalBudget = trip.budget;
    if (!targetTotalBudget || targetTotalBudget <= 0) {
      const baseDailyRate = currency === 'INR' ? 3000 : 120;
      targetTotalBudget = baseDailyRate * daysCount * travelers;
    }

    // Proportional cost planning by category
    const activitiesCost = activityCostSum > 0 ? activityCostSum : Math.round(targetTotalBudget * 0.15);
    const remainingForOther = Math.max(0, targetTotalBudget - activitiesCost);
    const transportationCost = Math.round(remainingForOther * 0.30);
    const accommodationCost = Math.round(remainingForOther * 0.40);
    const foodCost = Math.round(remainingForOther * 0.22);
    const miscCost = Math.round(remainingForOther * 0.08);

    const calculatedBreakdown = [
      {
        category: 'transportation',
        title: 'AI Transit Estimate',
        amount: transportationCost,
        description: `AI projection for ${travelers} traveler(s), ${daysCount} days`,
      },
      {
        category: 'accommodation',
        title: 'AI Lodging Estimate',
        amount: accommodationCost,
        description: `AI projected hotel/stay for ${daysCount} nights`,
      },
      {
        category: 'food',
        title: 'AI Dining Estimate',
        amount: foodCost,
        description: `AI projected dining budget for ${travelers} traveler(s)`,
      },
      {
        category: 'activities',
        title: 'AI Activities Estimate',
        amount: activitiesCost,
        description: `AI projected sightseeing & activity passes`,
      },
      {
        category: 'miscellaneous',
        title: 'AI Misc & Buffer',
        amount: miscCost,
        description: `Emergency buffer & miscellaneous contingencies`,
      },
    ];

    // Remove old AI estimated expenses to avoid duplicates
    await prisma.expense.deleteMany({
      where: {
        tripId: trip.id,
        isEstimated: true,
      },
    });

    // Create fresh AI estimated expenses
    const createdExpenses = [];
    for (const item of calculatedBreakdown) {
      if (item.amount > 0) {
        const exp = await prisma.expense.create({
          data: {
            tripId: trip.id,
            userId: req.user.id,
            category: item.category,
            title: item.title,
            description: item.description,
            amount: item.amount,
            currency: currency,
            date: trip.startDate || new Date(),
            isEstimated: true,
          },
        });
        createdExpenses.push(exp);
      }
    }

    // Update trip budget and persistent notes with AI budget plan
    const aiBudgetNotes = JSON.stringify({
      aiBudgetPlan: {
        transportation: transportationCost,
        accommodation: accommodationCost,
        food: foodCost,
        activities: activitiesCost,
        miscellaneous: miscCost,
        totalEstimated: targetTotalBudget,
        currency,
      },
    });

    await prisma.trip.update({
      where: { id: trip.id },
      data: {
        budget: targetTotalBudget,
        notes: aiBudgetNotes,
      },
    });

    return successResponse(
      res,
      {
        tripId: trip.id,
        expenses: createdExpenses,
        totalEstimated: targetTotalBudget,
      },
      'AI cost planning synchronized with trip budget successfully'
    );
  } catch (err) {
    next(err);
  }
};

const chat = async (req, res, next) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return errorResponse(res, 'messages array is required', 400);
    }

    const reply = await aiTravelChat(messages, context);
    return successResponse(res, { reply });
  } catch (err) {
    if (err.message && err.message.startsWith('MISSING_API_KEY')) {
      return res.status(503).json({
        success: false,
        configured: false,
        message: 'Gemini API key is not configured.',
      });
    }
    next(err);
  }
};

module.exports = {
  generateItinerary,
  saveGeneratedItinerary,
  syncTripAiBudget,
  chat,
};
