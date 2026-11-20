const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { generateAccessToken, generatePasswordResetToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const config = require('../config');

const cookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return errorResponse(res, 'An account with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        preferredCurrency: true,
        travelPreferences: true,
        createdAt: true,
      },
    });

    const token = generateAccessToken({ userId: user.id });
    res.cookie('token', token, cookieOptions);
    return successResponse(res, { user, token }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Auto-provision demo user on-demand if database was not yet seeded
    if (!user && email.toLowerCase() === 'demo@travelmate.com' && password === 'Demo123!') {
      try {
        const passwordHash = await bcrypt.hash('Demo123!', 12);
        user = await prisma.user.create({
          data: {
            email: 'demo@travelmate.com',
            name: 'Alex Rivera',
            passwordHash,
            preferredCurrency: 'USD',
            travelPreferences: ['cultural', 'food', 'adventure'],
            notificationPrefs: { emailUpdates: true, tripReminders: true },
          },
        });
      } catch (createErr) {
        // If created concurrently or seed was running, re-query
        user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
      }
    }

    if (!user || !user.isActive) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateAccessToken({ userId: user.id });
    res.cookie('token', token, cookieOptions);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredCurrency: user.preferredCurrency,
      travelPreferences: user.travelPreferences,
      notificationPrefs: user.notificationPrefs,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    return successResponse(res, { user: safeUser, token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', { ...cookieOptions, maxAge: 0 });
    return successResponse(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    return successResponse(res, { user: req.user }, 'Current user retrieved');
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      const token = generatePasswordResetToken();
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      console.log(`[Password Reset] Generated token for ${email}: ${token}`);
    }

    return successResponse(
      res,
      null,
      'If an account exists with that email, a password reset link has been dispatched'
    );
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.isUsed || record.expiresAt < new Date()) {
      return errorResponse(res, 'Reset token is invalid or has expired', 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { isUsed: true },
      }),
    ]);

    return successResponse(res, null, 'Password successfully reset');
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: req.body,
      select: {
        id: true,
        name: true,
        email: true,
        preferredCurrency: true,
        travelPreferences: true,
        notificationPrefs: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });
    return successResponse(res, { user: updated }, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Current password verification failed', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    return successResponse(res, null, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
};
