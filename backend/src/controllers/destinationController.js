const { prisma } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

const getDestinations = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, popular, sortBy = 'name' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (category) where.category = category;
    if (popular === 'true') where.isPopular = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
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

    return paginatedResponse(res, destinations, {
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
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
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
  getDestinations,
  getDestination,
  searchDestinations,
  getAttractions,
};
