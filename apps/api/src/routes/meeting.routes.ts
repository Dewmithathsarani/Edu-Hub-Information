import { Router } from 'express';
import { MeetingController } from '../controllers/meeting.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/', MeetingController.createMeeting);
router.get('/upcoming', MeetingController.getUpcomingMeetings);
router.get('/past', MeetingController.getPastMeetings);
router.get('/:id/transcription/stream', MeetingController.streamTranscription);

export const meetingRoutes = router;
