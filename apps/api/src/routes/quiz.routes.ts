import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', QuizController.getQuizzes);
router.get('/my-attempts', QuizController.getMyAttempts);
router.get('/:id', QuizController.getQuiz);
router.post('/:id/submit', QuizController.submitAttempt);

export default router;
