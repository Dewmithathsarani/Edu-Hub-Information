import { Response } from 'express';
import { Resource } from '../models';
import { AuthRequest } from '../middleware/auth';
import { UploadService } from '../services/upload.service';
import { cacheService } from '../services/cache.service';

export class ResourceController {
  static async getResources(req: AuthRequest, res: Response) {
    try {
      const { subject, type, search } = req.query;
      
      const query: any = { isApproved: true };
      if (subject) query.subject = subject;
      if (type) query.type = type;
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      const cacheKey = `resources:${JSON.stringify(query)}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        res.json({ success: true, data: cached });
        return;
      }

      const resources = await Resource.find(query)
        .sort({ createdAt: -1 })
        .populate('uploadedBy', 'name avatar');

      await cacheService.set(cacheKey, resources, 300);

      res.json({ success: true, data: resources });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch resources' });
    }
  }

  static async uploadResource(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Please provide a file' });
        return;
      }

      const { title, description, subject, type } = req.body;
      const uploaderId = req.user!.userId;

      const isPdf = req.file.mimetype.includes('pdf');
      let result;
      if (isPdf) {
        result = await UploadService.uploadDocument(req.file.buffer, 'edu-hub/resources', req.file.originalname);
      } else {
        result = await UploadService.uploadImage(req.file.buffer, 'edu-hub/resources');
      }

      const resource = await Resource.create({
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

      await cacheService.invalidate('resources:*');

      res.status(201).json({ success: true, data: resource });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to upload resource' });
    }
  }

  static async getMyUploads(req: AuthRequest, res: Response) {
    try {
      const resources = await Resource.find({ uploadedBy: req.user!.userId })
        .sort({ createdAt: -1 });

      res.json({ success: true, data: resources });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch your uploads' });
    }
  }
}
