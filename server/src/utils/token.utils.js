import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const generateEmailVerifyToken = (userId) => {
  return jwt.sign({ userId, purpose: 'email_verify' }, process.env.EMAIL_VERIFY_SECRET, {
    expiresIn: '24h',
  });
};

export const verifyEmailToken = (token) => {
  return jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
};

export const generatePasswordResetToken = (userId) => {
  return jwt.sign({ userId, purpose: 'password_reset' }, process.env.PASSWORD_RESET_SECRET, {
    expiresIn: '1h',
  });
};

export const verifyPasswordResetToken = (token) => {
  return jwt.verify(token, process.env.PASSWORD_RESET_SECRET);
};
