import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/', AuthMiddleware.authenticateToken, AuthController.getUserProfile);
router.get('/:userId', AuthMiddleware.requireAdmin, AuthController.getUserProfileById);
router.get('/all', AuthMiddleware.requireAdmin, AuthController.getAllUsersProfile);

router.patch('/', AuthMiddleware.authenticateToken, AuthController.updateUserProfile);
router.patch('/:userId', AuthMiddleware.requireAdmin, AuthController.updateUserProfileById);

router.delete('/', AuthMiddleware.authenticateToken, AuthController.getUserProfile);
router.delete('/:userId', AuthMiddleware.requireAdmin, AuthController.getUserProfileById);

export default router;
