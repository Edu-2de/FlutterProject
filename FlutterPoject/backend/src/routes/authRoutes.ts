import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/', AuthMiddleware.authenticateToken, AuthController.getUserProfile);
router.get('/:userId', AuthMiddleware.requireAdmin, AuthController.getUserProfileById);
router.get('/all', AuthMiddleware.requireAdmin, AuthController.getAllUsersProfile);

router.patch('/', AuthController.updateUserProfile);
router.patch('/:userId', AuthController.updateUserProfileById);

router.delete('/', AuthController.getUserProfile);
router.delete('/:userId', AuthController.getUserProfileById);

export default router;
