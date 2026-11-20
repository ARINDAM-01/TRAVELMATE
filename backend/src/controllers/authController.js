const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { prisma } = require('../config/database');
const {
  generateAccessToken,
  generatePasswordResetToken,
  hashPasswordResetToken,
} = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const { sendPasswordResetEmail } = require('../services/emailService');
const config = require('../config');

const googleClient = config.googleClientId ? new OAuth2Client(config.googleClientId) : null;
const passwordResetMessage =
  'If an account exists with that email, a password reset link will be sent';

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

    const isMatch = user.passwordHash && await bcrypt.compare(password, user.passwordHash);
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

const googleLogin = async (req, res, next) => {
  try {
    if (!googleClient) {
      return errorResponse(res, 'Google sign-in is not configured', 503);
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: req.body.credential,
        audience: config.googleClientId,
      });
    } catch {
      return errorResponse(res, 'Invalid Google credential', 401);
    }
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || profile.email_verified !== true) {
      return errorResponse(res, 'Google account must have a verified email address', 403);
    }

    const email = profile.email.toLowerCase();
    let user = await prisma.user.findUnique({ where: { googleId: profile.sub } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
      if (user && !user.isActive) {
        return errorResponse(res, 'This account is unavailable', 401);
      }
      if (user?.googleId && user.googleId !== profile.sub) {
        return errorResponse(res, 'Unable to link this Google account', 409);
      }

      const profileData = {
        email,
        emailVerified: true,
        googleId: profile.sub,
        ...(profile.name ? { name: profile.name } : {}),
        ...(profile.picture ? { avatarUrl: profile.picture } : {}),
      };

      user = user
        ? await prisma.user.update({ where: { id: user.id }, data: profileData })
        : await prisma.user.create({
            data: {
              ...profileData,
              name: profile.name || email,
              passwordHash: null,
            },
          });
    } else {
      if (!user.isActive) {
        return errorResponse(res, 'This account is unavailable', 401);
      }
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email,
          emailVerified: true,
          ...(profile.name ? { name: profile.name } : {}),
          ...(profile.picture ? { avatarUrl: profile.picture } : {}),
        },
      });
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

    return successResponse(res, { user: safeUser, token }, 'Google sign-in successful');
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

    if (user?.isActive) {
      const token = generatePasswordResetToken();
      const tokenHash = hashPasswordResetToken(token);
      try {
        await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token: tokenHash,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          },
        });

        const resetUrl = new URL('/reset-password', config.frontendUrl);
        resetUrl.searchParams.set('token', token);
        await sendPasswordResetEmail(user.email, resetUrl.toString());
      } catch (err) {
        console.error('[Password Reset] Request processing failed:', err);
        try {
          await prisma.passwordResetToken.updateMany({
            where: { token: tokenHash, isUsed: false },
            data: { isUsed: true },
          });
        } catch (cleanupErr) {
          console.error('[Password Reset] Failed to invalidate undelivered token:', cleanupErr);
        }
      }
    }

    return successResponse(res, null, passwordResetMessage);
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const record = await prisma.passwordResetToken.findUnique({
      where: { token: hashPasswordResetToken(token) },
      include: { user: true },
    });

    if (!record || record.isUsed || record.expiresAt < new Date()) {
      return errorResponse(res, 'Reset token is invalid or has expired', 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const didReset = await prisma.$transaction(async (transaction) => {
      const claimed = await transaction.passwordResetToken.updateMany({
        where: {
          id: record.id,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        data: { isUsed: true },
      });
      if (claimed.count !== 1) return false;

      await transaction.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      });
      return true;
    });

    if (!didReset) {
      return errorResponse(res, 'Reset token is invalid or has expired', 400);
    }

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

    if (!user?.passwordHash) {
      return errorResponse(res, 'Use the password reset flow to set a password for this account', 400);
    }

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
  googleLogin,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
};
