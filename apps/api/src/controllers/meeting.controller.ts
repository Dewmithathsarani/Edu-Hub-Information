import { Request, Response } from 'express';
import { Meeting } from '../models';
import { createMeetingSchema } from '@edu-hub/types';

export class MeetingController {
  static async createMeeting(req: Request, res: Response) {
    try {
      const parsed = createMeetingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
      }

      const { title, topic, scheduledFor, groupId } = parsed.data;
      const zoomLink = req.body.zoomLink; // Keep zoomLink untyped or add to schema if needed
      const hostId = (req as any).user.userId;

      const meeting = await Meeting.create({
        title,
        description: topic || req.body.description,
        scheduledAt: scheduledFor || new Date(),
        duration: 60,
        zoomLink,
        groupId,
        createdBy: hostId
      });

      res.status(201).json({ success: true, data: meeting });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async getUpcomingMeetings(req: Request, res: Response) {
    try {
      const meetings = await Meeting.find({ 
        scheduledAt: { $gte: new Date() },
        status: { $ne: 'cancelled' }
      })
      .populate('createdBy', 'name avatar')
      .populate('groupId', 'name')
      .sort({ scheduledAt: 1 });

      res.json({ success: true, data: meetings });
    } catch (error) {
      console.error('[Meeting Error]:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async getPastMeetings(req: Request, res: Response) {
    try {
      const meetings = await Meeting.find({ 
        scheduledAt: { $lt: new Date() },
        status: { $ne: 'cancelled' }
      })
      .populate('createdBy', 'name avatar')
      .sort({ scheduledAt: -1 });

      res.json({ success: true, data: meetings });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  // SSE Stream for AI Mock Transcription
  static streamTranscription(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const mockSentences = [
      "[System] AI Transcription initialized...",
      "Okay, let's start the meeting.",
      "Today we'll be discussing the core architecture of the new module.",
      "First, we need to ensure the database schema is correctly normalized.",
      "I agree. We should also add indexes to the frequently queried fields.",
      "What about the caching strategy?",
      "We're going to use Redis for ephemeral data like session state and rate limiting.",
      "[Action Item] Update the Redis configuration to allow 100 max connections.",
      "Perfect. Moving on to the frontend, are we sticking with React Query?",
      "Yes, React Query will handle our data synchronization and cache invalidation.",
      "Let's make sure we test the offline capabilities as well.",
      "[System] Auto-saving notes...",
      "We should wrap up soon. Any final questions?",
      "No, I think we're good. I'll push the updates later today.",
      "[System] Meeting concluded."
    ];

    let sentenceIndex = 0;

    const interval = setInterval(() => {
      if (sentenceIndex >= mockSentences.length) {
        clearInterval(interval);
        res.end();
        return;
      }
      
      const data = JSON.stringify({ 
        id: new Date().getTime().toString(),
        text: mockSentences[sentenceIndex],
        timestamp: new Date().toISOString()
      });
      
      res.write(`data: ${data}\n\n`);
      sentenceIndex++;
    }, 3000); // Send a new sentence every 3 seconds

    const cleanup = () => {
      clearInterval(interval);
      if (!res.writableEnded) res.end();
    };

    req.on('close', cleanup);
    req.on('end', cleanup);
    req.on('error', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);
  }
}
