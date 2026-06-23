import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middleware/auth';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

router.use(protect);

router.get('/me', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.put('/stream', UserController.setStream);
router.post('/avatar', uploadMiddleware.single('avatar'), UserController.updateAvatar);
router.put('/password', UserController.changePassword);

export default router;
