import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/', GroupController.createGroup);
router.get('/', GroupController.getGroups);
router.get('/my-groups', GroupController.getMyGroups);
router.post('/:id/join', GroupController.joinGroup);
router.post('/:id/leave', GroupController.leaveGroup);

export const groupRoutes = router;
