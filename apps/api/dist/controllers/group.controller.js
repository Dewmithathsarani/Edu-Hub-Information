"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const models_1 = require("../models");
const types_1 = require("@edu-hub/types");
class GroupController {
    static async createGroup(req, res) {
        try {
            const parsed = types_1.createGroupSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
                return;
            }
            const { name, description, subject, maxMembers, isMainStream } = parsed.data;
            const user = req.user;
            const group = await models_1.StudyGroup.create({
                name,
                description,
                subject,
                maxMembers: maxMembers || 20,
                isMainStream: user.role === 'admin' ? !!isMainStream : false,
                createdBy: user.userId,
                members: [{ userId: user.userId, role: 'owner' }],
                memberCount: 1
            });
            res.status(201).json({ success: true, data: group });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async getGroups(req, res) {
        try {
            const groups = await models_1.StudyGroup.find({ isActive: true })
                .populate('createdBy', 'name avatar')
                .sort({ createdAt: -1 });
            res.json({ success: true, data: groups });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async getMyGroups(req, res) {
        try {
            const userId = req.user.userId;
            const groups = await models_1.StudyGroup.find({ 'members.userId': userId, isActive: true })
                .populate('createdBy', 'name avatar')
                .sort({ createdAt: -1 });
            res.json({ success: true, data: groups });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async joinGroup(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const group = await models_1.StudyGroup.findById(id);
            if (!group)
                return res.status(404).json({ success: false, message: 'Group not found' });
            const isMember = group.members.some(m => m.userId.toString() === userId);
            if (isMember) {
                return res.status(400).json({ success: false, message: 'Already a member' });
            }
            if (group.memberCount >= group.maxMembers) {
                return res.status(400).json({ success: false, message: 'Group is full' });
            }
            group.members.push({ userId, role: 'member', joinedAt: new Date() });
            group.memberCount += 1;
            await group.save();
            res.json({ success: true, data: group });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async leaveGroup(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const group = await models_1.StudyGroup.findById(id);
            if (!group)
                return res.status(404).json({ success: false, message: 'Group not found' });
            const isOwner = group.members.some(m => m.userId.toString() === userId && m.role === 'owner');
            if (isOwner) {
                const otherMembers = group.members.filter(m => m.userId.toString() !== userId);
                if (otherMembers.length > 0) {
                    // Reassign ownership to the earliest joined member
                    otherMembers[0].role = 'owner';
                    group.members = otherMembers;
                }
                else {
                    // Delete group or mark inactive if no members left
                    group.isActive = false;
                    group.members = [];
                }
            }
            else {
                group.members = group.members.filter(m => m.userId.toString() !== userId);
            }
            group.memberCount = group.members.length;
            await group.save();
            res.json({ success: true, message: 'Left group successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
}
exports.GroupController = GroupController;
