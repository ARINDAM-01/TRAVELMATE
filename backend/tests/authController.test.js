process.env.GOOGLE_CLIENT_ID = 'test-google-client';

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn(),
  })),
}));

jest.mock('../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    passwordResetToken: {
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

jest.mock('../src/utils/jwt', () => ({
  generateAccessToken: jest.fn(() => 'app-token'),
  generatePasswordResetToken: jest.fn(() => 'single-use-token'),
  hashPasswordResetToken: jest.fn((token) => `hashed:${token}`),
}));

jest.mock('../src/services/emailService', () => ({
  sendPasswordResetEmail: jest.fn(),
}));

const { OAuth2Client } = require('google-auth-library');
const { prisma } = require('../src/config/database');
const { sendPasswordResetEmail } = require('../src/services/emailService');
const { googleLogin, forgotPassword, resetPassword } = require('../src/controllers/authController');

const makeResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  cookie: jest.fn(),
});

describe('authController', () => {
  const googleClient = OAuth2Client.mock.results[0].value;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates a verified, passwordless account from a verified Google identity', async () => {
    const profile = {
      sub: 'google-user-123',
      email: 'new@example.com',
      email_verified: true,
      name: 'New Traveler',
      picture: 'https://example.com/avatar.png',
    };
    const user = {
      id: 'user-123',
      name: profile.name,
      email: profile.email,
      googleId: profile.sub,
      emailVerified: true,
      isActive: true,
    };
    googleClient.verifyIdToken.mockResolvedValue({ getPayload: () => profile });
    prisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValue(user);
    const res = makeResponse();

    await googleLogin({ body: { credential: 'google-id-token' } }, res, jest.fn());

    expect(googleClient.verifyIdToken).toHaveBeenCalledWith({
      idToken: 'google-id-token',
      audience: 'test-google-client',
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture,
        googleId: profile.sub,
        emailVerified: true,
        passwordHash: null,
      }),
    });
    expect(res.cookie).toHaveBeenCalledWith('token', 'app-token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('rejects Google identities without verified email', async () => {
    googleClient.verifyIdToken.mockResolvedValue({
      getPayload: () => ({ sub: 'google-user-123', email: 'user@example.com', email_verified: false }),
    });
    const res = makeResponse();

    await googleLogin({ body: { credential: 'google-id-token' } }, res, jest.fn());

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('links a verified Google identity to an existing account with the same email', async () => {
    const profile = {
      sub: 'google-user-456',
      email: 'existing@example.com',
      email_verified: true,
      name: 'Updated Name',
    };
    const existing = {
      id: 'existing-user',
      email: profile.email,
      name: 'Original Name',
      isActive: true,
      googleId: null,
    };
    googleClient.verifyIdToken.mockResolvedValue({ getPayload: () => profile });
    prisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(existing);
    prisma.user.update.mockResolvedValue({
      ...existing,
      name: profile.name,
      googleId: profile.sub,
      emailVerified: true,
    });
    const res = makeResponse();

    await googleLogin({ body: { credential: 'google-id-token' } }, res, jest.fn());

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: existing.id },
      data: expect.objectContaining({
        googleId: profile.sub,
        emailVerified: true,
        email: profile.email,
      }),
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('sends a reset link while storing only its hash', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      email: 'user@example.com',
      isActive: true,
    });
    prisma.passwordResetToken.deleteMany.mockResolvedValue({ count: 0 });
    prisma.passwordResetToken.create.mockResolvedValue({});
    sendPasswordResetEmail.mockResolvedValue();
    const res = makeResponse();

    await forgotPassword({ body: { email: 'user@example.com' } }, res, jest.fn());

    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-123',
        token: 'hashed:single-use-token',
      }),
    });
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      'user@example.com',
      expect.stringContaining('single-use-token')
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'If an account exists with that email, a password reset link will be sent',
    }));
  });

  test('returns the same reset response when the email is not registered', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = makeResponse();

    await forgotPassword({ body: { email: 'unknown@example.com' } }, res, jest.fn());

    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'If an account exists with that email, a password reset link will be sent',
    }));
  });

  test('claims an unused reset token before updating the password', async () => {
    prisma.passwordResetToken.findUnique.mockResolvedValue({
      id: 'reset-record',
      userId: 'user-123',
      isUsed: false,
      expiresAt: new Date(Date.now() + 60_000),
    });
    const transaction = {
      passwordResetToken: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      user: { update: jest.fn().mockResolvedValue({}) },
    };
    prisma.$transaction.mockImplementation((callback) => callback(transaction));
    const res = makeResponse();

    await resetPassword(
      { body: { token: 'single-use-token', password: 'StrongPass123' } },
      res,
      jest.fn()
    );

    expect(prisma.passwordResetToken.findUnique).toHaveBeenCalledWith({
      where: { token: 'hashed:single-use-token' },
      include: { user: true },
    });
    expect(transaction.passwordResetToken.updateMany).toHaveBeenCalledWith({
      where: expect.objectContaining({ id: 'reset-record', isUsed: false }),
      data: { isUsed: true },
    });
    expect(transaction.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { passwordHash: 'hashed-password' },
    });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
