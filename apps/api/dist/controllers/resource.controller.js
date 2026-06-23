"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceController = void 0;
const models_1 = require("../models");
const upload_service_1 = require("../services/upload.service");
const cache_service_1 = require("../services/cache.service");
class ResourceController {
    static async getResources(req, res) {
        try {
            const { subject, type, search } = req.query;
            const query = { isApproved: true };
            if (subject)
                query.subject = subject;
            if (type)
                query.type = type;
            if (search) {
                query.title = { $regex: search, $options: 'i' };
            }
            const cacheKey = `resources:${JSON.stringify(query)}`;
            const cached = await cache_service_1.cacheService.get(cacheKey);
            if (cached) {
                res.json({ success: true, data: cached });
                return;
            }
            const resources = await models_1.Resource.find(query)
                .sort({ createdAt: -1 })
                .populate('uploaderId', 'name avatar');
            await cache_service_1.cacheService.set(cacheKey, resources, 300);
            res.json({ success: true, data: resources });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch resources' });
        }
    }
    static async uploadResource(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'Please provide a file' });
                return;
            }
            const { title, description, subject, type } = req.body;
            const uploaderId = req.user.userId;
            const isPdf = req.file.mimetype.includes('pdf');
            let result;
            if (isPdf) {
                result = await upload_service_1.UploadService.uploadDocument(req.file.buffer, 'edu-hub/resources', req.file.originalname);
            }
            else {
                result = await upload_service_1.UploadService.uploadImage(req.file.buffer, 'edu-hub/resources');
            }
            const resource = await models_1.Resource.create({
                title,
                description,
                subject,
                type,
                fileUrl: result.secure_url,
                filePublicId: result.public_id,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                uploadedBy: uploaderId,
                status: 'pending', // Requires admin approval
            });
            await cache_service_1.cacheService.invalidate('resources:*');
            res.status(201).json({ success: true, data: resource });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to upload resource' });
        }
    }
    static async getMyUploads(req, res) {
        try {
            const resources = await models_1.Resource.find({ uploadedBy: req.user.userId })
                .sort({ createdAt: -1 });
            res.json({ success: true, data: resources });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch your uploads' });
        }
    }
}
exports.ResourceController = ResourceController;
