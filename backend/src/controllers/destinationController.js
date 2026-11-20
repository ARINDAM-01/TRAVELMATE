const { prisma } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { getIndianStatesList, resolveDestinationImage } = require('../services/indiaTravelData');
const { generateStateDestinations } = require('../services/aiService');

const getIndianStates = async (req, res, next) => {
  try {
    const states = getIndianStatesList();
    return successResponse(res, { states });
  } catch (err) {
    next(err);
  }
};

const getDestinationsByState = async (req, res, next) => {
  try {
    const stateName = decodeURIComponent(req.params.stateName || '').trim();
    if (!stateName) {
      return errorResponse(res, 'State name is required', 400);
    }

    // 1. Check existing in database
    let existing = await prisma.destination.findMany({
      where: {
        OR: [
          { city: { contains: stateName, mode: 'insensitive' } },
          { name: { contains: stateName, mode: 'insensitive' } },
          { tags: { has: stateName.toLowerCase() } },
        ],
      },
      include: {
        attractions: true,
        _count: { select: { attractions: true, favorites: true } },
      },
      orderBy: { name: 'asc' },
    });

    // 2. If already exists and no refresh requested, return them with sanitized verified images
    if (existing && existing.length > 0 && req.query.refresh !== 'true') {
      const sanitized = existing.map((dest) => ({
        ...dest,
        imageUrl: resolveDestinationImage(dest.name, dest.city || stateName, dest.category, dest.imageUrl),
      }));
      return successResponse(res, {
        state: stateName,
        source: 'database',
        destinations: sanitized,
      });
    }

    // 3. Generate in real-time using Gemini AI / India catalog
    const generated = await generateStateDestinations(stateName);

    // 4. Persist to database if not yet present
    const savedDestinations = [];
    for (const item of generated) {
      try {
        let dest = await prisma.destination.findFirst({
          where: { name: { equals: item.name, mode: 'insensitive' } },
          include: { attractions: true, _count: { select: { attractions: true, favorites: true } } },
        });

        if (!dest) {
          dest = await prisma.destination.create({
            data: {
              name: item.name,
              city: item.city || stateName,
              country: item.country || 'India',
              description: item.description,
              imageUrl: item.imageUrl,
              latitude: item.latitude,
              longitude: item.longitude,
              estimatedBudgetPerDay: item.estimatedBudgetPerDay || 3000,
              currency: item.currency || 'INR',
              category: item.category || 'cultural',
              tags: Array.isArray(item.tags) ? item.tags : [stateName.toLowerCase(), 'india'],
              isPopular: true,
              attractions: {
                create: (item.attractions || []).map((att) => ({
                  name: att.name,
                  description: att.description || '',
                  category: att.category || 'landmark',
                  estimatedCost: att.estimatedCost || 100,
                  currency: att.currency || 'INR',
                  estimatedDurationHours: att.estimatedDurationHours || 2,
                  latitude: att.latitude,
                  longitude: att.longitude,
                  rating: att.rating || 4.7,
                  openingHours: att.openingHours || '09:00 - 18:00',
                })),
              },
            },
            include: {
              attractions: true,
              _count: { select: { attractions: true, favorites: true } },
            },
          });
        }
        savedDestinations.push(dest);
      } catch (saveErr) {
        console.warn(`[Destinations] Error saving destination ${item.name}:`, saveErr.message);
        savedDestinations.push(item);
      }
    }

    return successResponse(res, {
      state: stateName,
      source: 'realtime-generated',
      destinations: savedDestinations,
    });
  } catch (err) {
    next(err);
  }
};

const getDestinations = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, state, popular, sortBy = 'name' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
      country: { equals: 'India', mode: 'insensitive' },
      NOT: [
        { name: { in: ['Paris', 'Tokyo', 'Rome', 'Bali', 'Barcelona', 'Dubai', 'Machu Picchu', 'New York', 'Queenstown', 'Santorini'], mode: 'insensitive' } },
        { country: { in: ['France', 'Japan', 'Indonesia', 'USA', 'Spain', 'Italy', 'Greece', 'Peru', 'New Zealand', 'UAE'], mode: 'insensitive' } },
      ],
    };

    if (category) where.category = category;
    if (popular === 'true') where.isPopular = true;
    if (state && state.trim()) {
      const stateTerm = state.trim();
      where.OR = [
        { city: { contains: stateTerm, mode: 'insensitive' } },
        { name: { contains: stateTerm, mode: 'insensitive' } },
        { tags: { has: stateTerm.toLowerCase() } },
      ];
    }
    if (search) {
      const searchWhere = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
      where.OR = where.OR ? [...where.OR, ...searchWhere] : searchWhere;
    }

    const orderBy = {};
    if (sortBy === 'budget') {
      orderBy.estimatedBudgetPerDay = 'asc';
    } else {
      orderBy.name = 'asc';
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          _count: { select: { attractions: true, favorites: true } },
        },
      }),
      prisma.destination.count({ where }),
    ]);

    const sanitizedDestinations = destinations.map((dest) => ({
      ...dest,
      imageUrl: resolveDestinationImage(dest.name, dest.city, dest.category, dest.imageUrl),
    }));

    return paginatedResponse(res, sanitizedDestinations, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

const getDestination = async (req, res, next) => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: req.params.id },
      include: {
        attractions: {
          orderBy: { rating: 'desc' },
        },
      },
    });

    if (!destination) {
      return errorResponse(res, 'Destination not found', 404);
    }

    destination.imageUrl = resolveDestinationImage(
      destination.name,
      destination.city,
      destination.category,
      destination.imageUrl
    );

    return successResponse(res, { destination });
  } catch (err) {
    next(err);
  }
};

const searchDestinations = async (req, res, next) => {
  try {
    const { q, limit = 8 } = req.query;
    if (!q || !q.trim()) {
      return successResponse(res, { destinations: [] });
    }

    const query = q.trim();
    const destinations = await prisma.destination.findMany({
      where: {
        country: { equals: 'India', mode: 'insensitive' },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        country: true,
        city: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
        category: true,
      },
    });

    return successResponse(res, { destinations });
  } catch (err) {
    next(err);
  }
};

const getAttractions = async (req, res, next) => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: req.params.id },
    });

    if (!destination) {
      return errorResponse(res, 'Destination not found', 404);
    }

    const attractions = await prisma.attraction.findMany({
      where: { destinationId: req.params.id },
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });

    return successResponse(res, {
      attractions,
      destination: {
        id: destination.id,
        name: destination.name,
        country: destination.country,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getIndianStates,
  getDestinationsByState,
  getDestinations,
  getDestination,
  searchDestinations,
  getAttractions,
};
