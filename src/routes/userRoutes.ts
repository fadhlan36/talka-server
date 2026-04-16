import { Router } from 'express';
import { getUserByUsername } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware'; 

const router = Router();

router.get('/:username', authenticate, getUserByUsername); 

export default router;