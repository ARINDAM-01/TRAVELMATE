const axios = require('axios');
const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Calculates a route between geographic waypoints using public OSRM
 */
const calculateRoute = async (req, res, next) => {
  try {
    const { waypoints, mode = 'driving' } = req.body;

    if (!waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return errorResponse(res, 'At least two waypoints with latitude and longitude are required', 400);
    }

    // Verify coordinates validity
    for (const pt of waypoints) {
      if (pt.latitude == null || pt.longitude == null || isNaN(pt.latitude) || isNaN(pt.longitude)) {
        return errorResponse(res, 'All waypoints must have numeric latitude and longitude', 400);
      }
    }

    // OSRM expects coordinates in {longitude},{latitude} order separated by semicolons
    const coordsString = waypoints.map((w) => `${w.longitude},${w.latitude}`).join(';');
    const osrmProfile = mode === 'walking' ? 'foot' : (mode === 'cycling' ? 'bicycle' : 'car');
    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${coordsString}?overview=full&geometries=geojson&steps=true`;

    const response = await axios.get(url, { timeout: 8000 });

    if (response.data.code !== 'Ok' || !response.data.routes || response.data.routes.length === 0) {
      return errorResponse(res, 'Route calculation failed with the provided coordinates', 400);
    }

    const route = response.data.routes[0];

    return successResponse(res, {
      distance: route.distance, // meters
      duration: route.duration, // seconds
      geometry: route.geometry, // GeoJSON LineString
      legs: route.legs,
      waypoints: response.data.waypoints,
      provider: 'OSRM (Open Source Routing Machine)',
    });
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return errorResponse(res, 'Routing service request timed out. Please try again.', 503);
    }
    next(err);
  }
};

/**
 * Gets geographic locations, itinerary stops, and graph nodes for a trip
 */
const getTripMapData = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.id },
      include: {
        graphNodes: true,
        graphEdges: true,
        itineraryDays: {
          include: {
            activities: {
              where: {
                latitude: { not: null },
                longitude: { not: null },
              },
            },
          },
        },
      },
    });

    if (!trip) return errorResponse(res, 'Trip not found or unauthorized', 404);

    return successResponse(res, {
      trip: {
        id: trip.id,
        title: trip.title,
        destinations: trip.destinations,
      },
      graphNodes: trip.graphNodes,
      graphEdges: trip.graphEdges,
      itineraryDays: trip.itineraryDays,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Finds nearby attractions or nodes within radius (km) from coordinates
 */
const getNearbyAttractions = async (req, res, next) => {
  try {
    const { latitude, longitude, radiusKm = 10, limit = 15 } = req.query;

    if (!latitude || !longitude) {
      return errorResponse(res, 'latitude and longitude are required query parameters', 400);
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radiusKm);

    // Rough bounding box in degrees (1 degree lat ~= 111 km)
    const latDelta = rad / 111.0;
    const lonDelta = rad / (111.0 * Math.cos((lat * Math.PI) / 180));

    const attractions = await prisma.attraction.findMany({
      where: {
        latitude: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        longitude: {
          gte: lon - lonDelta,
          lte: lon + lonDelta,
        },
      },
      take: parseInt(limit),
      include: {
        destination: { select: { name: true, country: true } },
      },
    });

    return successResponse(res, { attractions });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  calculateRoute,
  getTripMapData,
  getNearbyAttractions,
};
