import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .get(TaskController.getTasks)
  .post(TaskController.createTask);

router.post('/ai-prioritize', TaskController.prioritizeTasksAI);

router.route('/:id')
  .get(TaskController.getTaskById)
  .put(TaskController.updateTask)
  .delete(TaskController.deleteTask);

export default router;
