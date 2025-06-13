import express from 'express';
import { 
  signup, 
  signin, 
  getProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getSessions,
  revokeSession,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSystemStats
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';
import { validate, authValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/signup', authValidation.signup, validate, signup);
router.post('/signin', authValidation.signin, validate, signin);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', authValidation.forgotPassword, validate, forgotPassword);
router.post('/reset-password/:token', authValidation.resetPassword, validate, resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.get('/sessions', protect, getSessions);
router.delete('/sessions/:token', protect, revokeSession);

// Admin routes
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.get('/admin/users/:id', protect, authorize('admin'), getUserById);
router.put('/admin/users/:id', protect, authorize('admin'), updateUser);
router.delete('/admin/users/:id', protect, authorize('admin'), deleteUser);
router.get('/admin/stats', protect, authorize('admin'), getSystemStats);

export default router; 