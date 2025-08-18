import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/', AuthController.getUserProfile);
router.get('/:userId', AuthController.getUserProfileById);
router.get('/all', AuthController.getAllUsersProfile);
