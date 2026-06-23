"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeController = void 0;
const models_1 = require("../models");
class ChallengeController {
    static async getActiveChallenges(req, res) {
        try {
            const challenges = await models_1.Challenge.find({ isActive: true });
            res.json({ success: true, data: challenges });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async createChallenge(req, res) {
        try {
            const { title, description, type, targetValue, rewardBadge } = req.body;
            const challenge = await models_1.Challenge.create({
                title, description, type, target: targetValue, reward: { badge: rewardBadge, xp: 100 },
                startDate: new Date(), endDate: new Date(Date.now() + 86400000 * 7), createdBy: req.user.userId
            });
            res.status(201).json({ success: true, data: challenge });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
}
exports.ChallengeController = ChallengeController;
