import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// All admin routes are protected and require 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', AdminController.getDashboardStats);
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/toggle-status', AdminController.toggleUserStatus);
router.get('/resources/pending', AdminController.getPendingResources);
router.patch('/resources/:id/status', AdminController.updateResourceStatus);

export const adminRoutes = router;
