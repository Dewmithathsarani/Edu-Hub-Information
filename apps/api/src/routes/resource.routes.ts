import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { protect } from '../middleware/auth';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

router.use(protect);

router.get('/', ResourceController.getResources);
router.post('/', uploadMiddleware.single('file'), ResourceController.uploadResource);
router.get('/my-uploads', ResourceController.getMyUploads);

export default router;
