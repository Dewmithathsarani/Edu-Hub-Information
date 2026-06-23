"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const cloudinary_1 = require("../config/cloudinary");
const sharp_1 = __importDefault(require("sharp"));
class UploadService {
    /**
     * Upload an image to Cloudinary (with Sharp optimization)
     */
    static async uploadImage(buffer, folder, transformation) {
        // Strip EXIF and optimize image before upload
        const optimizedBuffer = await (0, sharp_1.default)(buffer)
            .rotate() // Auto-orient based on EXIF
            .withMetadata() // Remove metadata by default when no args passed, but this keeps essential metadata if needed. Let's just convert it.
            .webp({ quality: 80 })
            .toBuffer();
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({
                folder,
                resource_type: 'image',
                transformation: transformation ? [{ raw_transformation: transformation }] : undefined,
            }, (error, result) => {
                if (error)
                    return reject(error);
                if (result)
                    resolve(result);
            });
            uploadStream.end(optimizedBuffer);
        });
    }
    /**
     * Upload a raw document (PDF, DOCX) to Cloudinary
     */
    static async uploadDocument(buffer, folder, filename) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({
                folder,
                resource_type: 'raw',
                public_id: filename.split('.')[0], // remove extension
            }, (error, result) => {
                if (error)
                    return reject(error);
                if (result)
                    resolve(result);
            });
            uploadStream.end(buffer);
        });
    }
    /**
     * Delete a file from Cloudinary by public_id
     */
    static async deleteFile(publicId, resourceType = 'image') {
        await cloudinary_1.cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    }
}
exports.UploadService = UploadService;
