import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// ========== Public routes (no authentication required) ==========
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// ========== Routes for logged user to access own profile ==========
router.get('/profile', AuthMiddleware.authenticateToken, AuthController.getUserProfile);
router.put('/profile', AuthMiddleware.authenticateToken, AuthController.updateUserProfile);
router.delete('/profile', AuthMiddleware.authenticateToken, AuthController.deleteUserProfile);

// ========== Admin only routes (access other users' profiles) ==========
router.get('/users/:userId', AuthMiddleware.requireAdmin, AuthController.getUserProfile);
router.put('/users/:userId', AuthMiddleware.requireAdmin, AuthController.updateUserProfile);
router.delete('/users/:userId', AuthMiddleware.requireAdmin, AuthController.deleteUserProfile);

// ========== Admin only routes ==========
router.get('/users', AuthMiddleware.requireAdmin, AuthController.getAllUsers);
router.post('/users', AuthMiddleware.requireAdmin, AuthController.createUserAsAdmin);

// ========== Authenticated routes ==========
router.post('/logout', AuthMiddleware.authenticateToken, AuthController.logout);
router.post('/refresh-token', AuthMiddleware.authenticateToken, AuthController.refreshToken);
router.post('/change-password', AuthMiddleware.authenticateToken, AuthController.changePassword);

export default router;