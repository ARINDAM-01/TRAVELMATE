const express = require('express');
const router = express.Router();
const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const config = require('../config');

// Public access to shared trip by token
router.get('/:token', optionalAuth, async (req, res, next) => {
  try {
    const sharedTrip = await prisma.sharedTrip.findUnique({
      where: { token: req.params.token },
      include: {
        trip: {
          include: {
            itineraryDays: {
              orderBy: { dayNumber: 'asc' },
              include: {
                activities: {
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
            graphNodes: true,
            graphEdges: true,
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!sharedTrip) {
      return errorResponse(res, 'Shared trip not found', 404);
    }

    if (sharedTrip.expiresAt && sharedTrip.expiresAt < new Date()) {
      return errorResponse(res, 'This shared trip link has expired', 410);
    }

    if (!sharedTrip.isPublic && (!req.user || req.user.id !== sharedTrip.trip.userId)) {
      return errorResponse(res, 'This trip is private and requires owner authorization', 403);
    }

    return successResponse(res, {
      trip: sharedTrip.trip,
      shareInfo: {
        allowEdit: sharedTrip.allowEdit,
        isPublic: sharedTrip.isPublic,
        expiresAt: sharedTrip.expiresAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Create or update share token for a trip (authenticated owner)
router.post('/trips/:tripId/share', authenticateToken, async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { id: req.params.tripId, userId: req.user.id },
    });
    if (!trip) return errorResponse(res, 'Trip not found or unauthorized', 404);

    const { isPublic = true, allowEdit = false, expiresInDays } = req.body;
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const existing = await prisma.sharedTrip.findFirst({
      where: { tripId: req.params.tripId },
    });

    let shared;
    if (existing) {
      shared = await prisma.sharedTrip.update({
        where: { id: existing.id },
        data: { isPublic, allowEdit, expiresAt },
      });
    } else {
      shared = await prisma.sharedTrip.create({
        data: {
          tripId: req.params.tripId,
          isPublic,
          allowEdit,
          expiresAt,
        },
      });
    }

    return successResponse(
      res,
      {
        shareToken: shared.token,
        shareUrl: `${config.frontendUrl}/shared/${shared.token}`,
        isPublic: shared.isPublic,
        allowEdit: shared.allowEdit,
        expiresAt: shared.expiresAt,
      },
      'Share link generated'
    );
  } catch (err) {
    next(err);
  }
});

// Revoke share token for a trip
router.delete('/trips/:tripId/share', authenticateToken, async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { id: req.params.tripId, userId: req.user.id },
    });
    if (!trip) return errorResponse(res, 'Trip not found or unauthorized', 404);

    await prisma.sharedTrip.deleteMany({
      where: { tripId: req.params.tripId },
    });

    return successResponse(res, null, 'Trip sharing revoked');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
