const { verifyToken } = require('../utils/jwt');
const { prisma } = require('../config/database');
const { errorResponse } = require('../utils/response');

const authenticateToken = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        preferredCurrency: true,
        travelPreferences: true,
        notificationPrefs: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      return errorResponse(res, 'User session invalid or account inactive', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired authentication token', 401);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        preferredCurrency: true,
        isActive: true,
      },
    });

    req.user = user?.isActive ? user : null;
  } catch {
    req.user = null;
  }
  next();
};

module.exports = { authenticateToken, optionalAuth };
