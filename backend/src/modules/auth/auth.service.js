import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../models/User.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/token.js';
import { sendResetEmail } from '../../config/mailer.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { status: 409, message: 'Email already in use' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    provider: 'local',
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  if (user.provider !== 'local') {
    throw { status: 401, message: 'Use Google login' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const refreshAccessToken = async (token) => {
  if (!token) {
    throw { status: 401, message: 'Refresh token required' };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw { status: 401, message: 'Invalid or expired refresh token' };
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw { status: 401, message: 'Invalid refresh token' };
  }

  const newAccessToken = generateAccessToken(user._id);
  return { accessToken: newAccessToken };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw { status: 400, message: 'Refresh token required' };
  }

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return; // Silent success
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

  // Try to send email; fallback to console if mailer not configured
  try {
    await sendResetEmail({ to: email, resetLink });
    console.log(`✅ Reset email sent to ${email}`);
  } catch (err) {
    console.warn(`⚠️ Email sending failed: ${err.message}`);
    console.log(
      `\n🔐 RESET LINK: ${resetLink}\n`
    );
  }
};

export const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw { status: 400, message: 'Invalid or expired token' };
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();
};

export const googleLogin = async (idToken) => {
  // Prefer server-side verification using Firebase Admin
  const admin = (await import('../../config/firebase.js')).default;

  if (!admin) {
    throw { status: 501, message: 'Google auth not configured on server' };
  }

  if (!idToken) {
    throw { status: 400, message: 'ID token required' };
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    throw { status: 401, message: 'Invalid Google ID token' };
  }

  const { email, name, picture } = decodedToken;

  if (!email) {
    throw { status: 400, message: 'Email not found in token' };
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: name || 'Google User',
      email,
      avatar: picture || '',
      provider: 'google',
    });
  } else if (user.provider === 'local') {
    throw {
      status: 400,
      message: 'Email already registered with password. Use password login.',
    };
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

