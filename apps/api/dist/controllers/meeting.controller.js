"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingController = void 0;
const models_1 = require("../models");
class MeetingController {
    static async createMeeting(req, res) {
        try {
            const { title, description, scheduledFor, zoomLink, groupId } = req.body;
            const hostId = req.user.userId;
            const meeting = await models_1.Meeting.create({
                title,
                description,
                scheduledAt: scheduledFor || new Date(),
                duration: 60,
                zoomLink,
                groupId,
                createdBy: hostId
            });
            res.status(201).json({ success: true, data: meeting });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async getUpcomingMeetings(req, res) {
        try {
            const meetings = await models_1.Meeting.find({
                scheduledAt: { $gte: new Date() },
                status: { $ne: 'cancelled' }
            })
                .populate('createdBy', 'name avatar')
                .populate('groupId', 'name')
                .sort({ scheduledAt: 1 });
            res.json({ success: true, data: meetings });
        }
        catch (error) {
            console.error('[Meeting Error]:', error);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async getPastMeetings(req, res) {
        try {
            const meetings = await models_1.Meeting.find({
                scheduledAt: { $lt: new Date() },
                status: { $ne: 'cancelled' }
            })
                .populate('createdBy', 'name avatar')
                .sort({ scheduledAt: -1 });
            res.json({ success: true, data: meetings });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    // SSE Stream for AI Mock Transcription
    static streamTranscription(req, res) {
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
        req.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    }
}
exports.MeetingController = MeetingController;
