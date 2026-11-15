const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        destination: {
          include: {
            _count: { select: { attractions: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { favorites });
  } catch (err) {
    next(err);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const { destinationId } = req.body;
    if (!destinationId) {
      return errorResponse(res, 'destinationId is required', 400);
    }

    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    });
    if (!destination) {
      return errorResponse(res, 'Destination does not exist', 404);
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_destinationId: {
          userId: req.user.id,
          destinationId,
        },
      },
    });

    if (existing) {
      return errorResponse(res, 'Destination is already saved in favorites', 409);
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        destinationId,
      },
      include: { destination: true },
    });

    return successResponse(res, { favorite }, 'Saved to favorites', 201);
  } catch (err) {
    next(err);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await prisma.favorite.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!favorite) {
      return errorResponse(res, 'Favorite record not found', 404);
    }

    await prisma.favorite.delete({
      where: { id: req.params.id },
    });

    return successResponse(res, null, 'Destination removed from favorites');
  } catch (err) {
    next(err);
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
