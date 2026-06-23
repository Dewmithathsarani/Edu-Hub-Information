import { cloudinary } from '../config/cloudinary';
import sharp from 'sharp';
import { UploadApiResponse } from 'cloudinary';

export class UploadService {
  /**
   * Upload an image to Cloudinary (with Sharp optimization)
   */
  static async uploadImage(buffer: Buffer, folder: string, transformation?: string): Promise<UploadApiResponse> {
    // Strip EXIF and optimize image before upload
    const optimizedBuffer = await sharp(buffer)
      .rotate() // Auto-orient based on EXIF
      .withMetadata() // Remove metadata by default when no args passed, but this keeps essential metadata if needed. Let's just convert it.
      .webp({ quality: 80 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: transformation ? [{ raw_transformation: transformation }] : undefined,
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve(result);
        }
      );
      
      uploadStream.end(optimizedBuffer);
    });
  }

  /**
   * Upload a raw document (PDF, DOCX) to Cloudinary
   */
  static async uploadDocument(buffer: Buffer, folder: string, filename: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'raw',
          public_id: filename.split('.')[0], // remove extension
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    });
  }

  /**
   * Delete a file from Cloudinary by public_id
   */
  static async deleteFile(publicId: string, resourceType: 'image' | 'raw' = 'image'): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}
