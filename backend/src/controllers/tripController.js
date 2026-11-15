const { prisma } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

const getTrips = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: {
              itineraryDays: true,
              expenses: true,
              graphNodes: true,
            },
          },
        },
      }),
      prisma.trip.count({ where }),
    ]);

    return paginatedResponse(res, trips, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startLocation,
      destinations = [],
      startDate,
      endDate,
      numTravelers,
      budget,
      currency,
      travelStyle,
      notes,
      coverImageUrl,
    } = req.body;

    if (!title || !startLocation) {
      return errorResponse(res, 'Trip title and start location are required', 400);
    }

    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title,
        description,
        startLocation,
        destinations: Array.isArray(destinations) ? destinations : [destinations],
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        numTravelers: parseInt(numTravelers) || 1,
        budget: budget != null && budget !== '' ? parseFloat(budget) : null,
        currency: currency || req.user.preferredCurrency || 'USD',
        travelStyle,
        notes,
        coverImageUrl,
      },
    });

    return successResponse(res, { trip }, 'Trip created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getTrip = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        itineraryDays: {
          orderBy: { dayNumber: 'asc' },
          include: {
            activities: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        expenses: {
          orderBy: { date: 'desc' },
        },
        graphNodes: true,
        graphEdges: true,
        tripNotes: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } },
        },
        sharedTrips: true,
      },
    });

    if (!trip) {
      return errorResponse(res, 'Trip not found or unauthorized access', 404);
    }

    return successResponse(res, { trip });
  } catch (err) {
    next(err);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const existing = await prisma.trip.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) {
      return errorResponse(res, 'Trip not found', 404);
    }

    const { startDate, endDate, numTravelers, budget, destinations, ...rest } = req.body;

    const updated = await prisma.trip.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(destinations !== undefined && {
          destinations: Array.isArray(destinations) ? destinations : [destinations],
        }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(numTravelers !== undefined && { numTravelers: parseInt(numTravelers) }),
        ...(budget !== undefined && {
          budget: budget != null && budget !== '' ? parseFloat(budget) : null,
        }),
      },
    });

    return successResponse(res, { trip: updated }, 'Trip updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const existing = await prisma.trip.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) {
      return errorResponse(res, 'Trip not found', 404);
    }

    await prisma.trip.delete({
      where: { id: req.params.id },
    });

    return successResponse(res, null, 'Trip deleted successfully');
  } catch (err) {
    next(err);
  }
};

const duplicateTrip = async (req, res, next) => {
  try {
    const original = await prisma.trip.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        itineraryDays: {
          include: { activities: true },
        },
        graphNodes: true,
        graphEdges: true,
      },
    });

    if (!original) {
      return errorResponse(res, 'Original trip not found', 404);
    }

    const newTrip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title: `${original.title} (Duplicate)`,
        description: original.description,
        startLocation: original.startLocation,
        destinations: original.destinations,
        startDate: original.startDate,
        endDate: original.endDate,
        numTravelers: original.numTravelers,
        budget: original.budget,
        currency: original.currency,
        travelStyle: original.travelStyle,
        status: 'planning',
        notes: original.notes,
        coverImageUrl: original.coverImageUrl,
        itineraryDays: {
          create: original.itineraryDays.map((day) => ({
            dayNumber: day.dayNumber,
            date: day.date,
            location: day.location,
            summary: day.summary,
            weatherNote: day.weatherNote,
            activities: {
              create: day.activities.map((a) => ({
                name: a.name,
                description: a.description,
                location: a.location,
                latitude: a.latitude,
                longitude: a.longitude,
                timeOfDay: a.timeOfDay,
                startTime: a.startTime,
                endTime: a.endTime,
                estimatedCost: a.estimatedCost,
                currency: a.currency,
                category: a.category,
                notes: a.notes,
                orderIndex: a.orderIndex,
              })),
            },
          })),
        },
      },
    });

    return successResponse(res, { trip: newTrip }, 'Trip duplicated successfully', 201);
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totalTrips, trips, favoritesCount, expensesAggregate] = await Promise.all([
      prisma.trip.count({ where: { userId } }),
      prisma.trip.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          _count: { select: { itineraryDays: true, expenses: true } },
        },
      }),
      prisma.favorite.count({ where: { userId } }),
      prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
    ]);

    const upcomingTrips = await prisma.trip.findMany({
      where: {
        userId,
        status: 'planning',
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: 'asc' },
      take: 3,
    });

    const allDestinations = new Set();
    trips.forEach((t) => {
      if (Array.isArray(t.destinations)) {
        t.destinations.forEach((d) => allDestinations.add(d));
      }
    });

    return successResponse(res, {
      totalTrips,
      totalDestinations: allDestinations.size,
      totalFavorites: favoritesCount,
      totalExpenses: expensesAggregate._sum.amount || 0,
      recentTrips: trips,
      upcomingTrips,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  getDashboardStats,
};
