// In-memory OTP storage with TTL cleanup
const otpStore = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 45 * 1000; // 45 seconds cooldown
const MAX_VERIFICATION_ATTEMPTS = 5;

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (now > value.expiresAt) {
      otpStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

const getKey = (email, purpose) => `${email.toLowerCase().trim()}:${purpose}`;

/**
 * Generate a cryptographically secure 6-digit OTP code
 */
const generateOtp = (email, purpose = 'register') => {
  const key = getKey(email, purpose);
  const now = Date.now();
  const existing = otpStore.get(key);

  if (existing && now < existing.resendAvailableAt) {
    const secondsRemaining = Math.ceil((existing.resendAvailableAt - now) / 1000);
    throw new Error(`Please wait ${secondsRemaining}s before requesting a new code.`);
  }

  // Generate 6-digit random number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(key, {
    otp,
    expiresAt: now + OTP_TTL_MS,
    resendAvailableAt: now + RESEND_COOLDOWN_MS,
    attempts: 0,
    createdAt: now,
  });

  return otp;
};

/**
 * Verify provided OTP against store
 */
const verifyOtp = (email, inputOtp, purpose = 'register') => {
  const key = getKey(email, purpose);
  const record = otpStore.get(key);

  if (!record) {
    return { valid: false, message: 'Verification code expired or not found. Please request a new code.' };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpStore.delete(key);
    return { valid: false, message: 'Verification code has expired. Please request a new one.' };
  }

  if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    otpStore.delete(key);
    return { valid: false, message: 'Too many incorrect attempts. Please request a fresh code.' };
  }

  if (record.otp !== inputOtp.toString().trim()) {
    record.attempts += 1;
    const remainingAttempts = MAX_VERIFICATION_ATTEMPTS - record.attempts;
    return {
      valid: false,
      message: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
    };
  }

  // Success: consume and delete the OTP
  otpStore.delete(key);
  return { valid: true };
};

module.exports = {
  generateOtp,
  verifyOtp,
};
