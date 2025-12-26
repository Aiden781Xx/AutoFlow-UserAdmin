import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  googleLogin,
} from './auth.service.js';

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await refreshAccessToken(refreshToken);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.body.refreshToken);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const forgotPasswordController = async (req, res, next) => {
  try {
    await forgotPassword(req.body.email);
    res.json({
      success: true,
      message: 'If email exists, reset link sent',
    });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPassword(token, password);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const data = await googleLogin(idToken);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

