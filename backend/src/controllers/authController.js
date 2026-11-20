const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { generateAccessToken, generatePasswordResetToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const { sendOtpEmail } = require('../services/emailService');
const { generateOtp, verifyOtp } = require('../services/otpService');
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

const sendOtp = async (req, res, next) => {
  try {
    const { email, purpose = 'login' } = req.body;
    if (!email) {
      return errorResponse(res, 'Email address is required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    let otp;
    try {
      otp = generateOtp(normalizedEmail, purpose);
    } catch (rateLimitErr) {
      return errorResponse(res, rateLimitErr.message, 429);
    }

    const emailResult = await sendOtpEmail({
      to: normalizedEmail,
      otp,
      purpose,
    });

    return successResponse(
      res,
      {
        email: normalizedEmail,
        purpose,
        devMode: emailResult.devMode || false,
        fallbackOtp: emailResult.devMode ? emailResult.fallbackOtp : undefined,
      },
      `Verification code sent to ${normalizedEmail}`,
      200
    );
  } catch (err) {
    next(err);
  }
};

const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp) {
      return errorResponse(res, 'Name, email, password, and OTP are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpCheck = verifyOtp(normalizedEmail, otp, 'register');
    if (!otpCheck.valid) {
      return errorResponse(res, otpCheck.message, 400);
    }

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const passwordHash = await bcrypt.hash(password, 12);

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: name || user.name, passwordHash },
        select: {
          id: true,
          name: true,
          email: true,
          preferredCurrency: true,
          travelPreferences: true,
          notificationPrefs: true,
          avatarUrl: true,
          createdAt: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          preferredCurrency: true,
          travelPreferences: true,
          notificationPrefs: true,
          avatarUrl: true,
          createdAt: true,
        },
      });
    }

    const token = generateAccessToken({ userId: user.id });
    res.cookie('token', token, cookieOptions);
    return successResponse(res, { user, token }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return errorResponse(res, 'Email and OTP are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpCheck = verifyOtp(normalizedEmail, otp, 'login');
    if (!otpCheck.valid) {
      return errorResponse(res, otpCheck.message, 400);
    }

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Universal OTP: If user does not exist yet, auto-provision account for ANY email!
    if (!user) {
      const rawPrefix = normalizedEmail.split('@')[0] || 'Traveler';
      const cleanName = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1);
      const generatedPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
      const passwordHash = await bcrypt.hash(generatedPassword, 12);

      user = await prisma.user.create({
        data: {
          name: cleanName,
          email: normalizedEmail,
          passwordHash,
          preferredCurrency: 'USD',
          travelPreferences: ['cultural', 'adventure'],
          notificationPrefs: { emailUpdates: true, tripReminders: true },
        },
      });
    }

    if (!user.isActive) {
      return errorResponse(res, 'User account not found or deactivated', 403);
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

    return successResponse(res, { user: safeUser, token }, 'Login successful', 200);
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
  sendOtp,
  verifyRegisterOtp,
  verifyLoginOtp,
};
