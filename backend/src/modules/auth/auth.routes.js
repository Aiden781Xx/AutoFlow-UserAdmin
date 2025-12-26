import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  forgotPasswordController,
  resetPasswordController,
  googleAuth,
} from './auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.post('/google', googleAuth);

export default router;
