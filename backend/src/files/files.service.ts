import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import { extname } from 'path';

export interface UploadedFile {
  url: string;
  key: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
}

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private bucketName: string;
  private cdnUrl: string;

  constructor() {
    const endpoint = process.env.R2_ENDPOINT || process.env.S3_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;
    this.bucketName = process.env.R2_BUCKET_NAME || process.env.S3_BUCKET_NAME || 'caregiver-files';
    this.cdnUrl = process.env.R2_PUBLIC_URL || process.env.CDN_URL || '';

    if (endpoint && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: 'auto', // Cloudflare R2 uses 'auto'
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } else {
      console.warn('R2/S3 credentials not configured. File uploads will fail.');
    }
  }

  /**
   * Generate unique file key
   */
  private generateFileKey(originalName: string, folder?: string): string {
    const randomString = randomBytes(16).toString('hex');
    const extension = extname(originalName);
    const timestamp = Date.now();
    const key = `${randomString}-${timestamp}${extension}`;

    return folder ? `${folder}/${key}` : key;
  }

  /**
   * Validate file type
   */
  private validateFileType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const prefix = type.slice(0, -2);
        return mimeType.startsWith(prefix);
      }
      return mimeType === type;
    });
  }

  /**
   * Upload file to R2
   */
  async uploadFile(
    file: Buffer,
    originalName: string,
    mimeType: string,
    options?: {
      folder?: string;
      maxSize?: number;
      allowedTypes?: string[];
      generateThumbnail?: boolean;
    },
  ): Promise<UploadedFile> {
    const maxSize = options?.maxSize || 10 * 1024 * 1024; // 10MB default
    const allowedTypes = options?.allowedTypes || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    // Validate file size
    if (file.length > maxSize) {
      throw new Error(`File size exceeds limit of ${maxSize / 1024 / 1024}MB`);
    }

    // Validate file type
    if (!this.validateFileType(mimeType, allowedTypes)) {
      throw new Error(`File type ${mimeType} not allowed`);
    }

    const key = this.generateFileKey(originalName, options?.folder);

    let processedFile = file;
    let finalMimeType = mimeType;

    // Process images
    if (mimeType.startsWith('image/')) {
      // Compress and convert to WebP if image
      processedFile = await sharp(file)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      finalMimeType = 'image/webp';
    }

    // Upload to R2
    if (!this.s3Client) {
      console.log(`[MOCK UPLOAD] File: ${key}, Size: ${processedFile.length}, Type: ${finalMimeType}`);
      return {
        url: `/mock-uploads/${key}`,
        key,
        size: processedFile.length,
        mimeType: finalMimeType,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: processedFile,
      ContentType: finalMimeType,
    });

    await this.s3Client.send(command);

    const result: UploadedFile = {
      url: this.cdnUrl ? `${this.cdnUrl}/${key}` : await this.getSignedUrl(key),
      key,
      size: processedFile.length,
      mimeType: finalMimeType,
    };

    // Generate thumbnail for images
    if (options?.generateThumbnail && mimeType.startsWith('image/')) {
      const thumbnailKey = `thumbnails/${key}`;
      const thumbnail = await sharp(file)
        .resize(100, 100, { fit: 'cover' })
        .webp({ quality: 70 })
        .toBuffer();

      const thumbnailCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: thumbnailKey,
        Body: thumbnail,
        ContentType: 'image/webp',
      });

      await this.s3Client.send(thumbnailCommand);
      result.thumbnailUrl = this.cdnUrl
        ? `${this.cdnUrl}/${thumbnailKey}`
        : await this.getSignedUrl(thumbnailKey);
    }

    return result;
  }

  /**
   * Upload profile photo (auto-resize to 400x400)
   */
  async uploadProfilePhoto(file: Buffer, userId: string): Promise<UploadedFile> {
    const resizedImage = await sharp(file)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    return this.uploadFile(resizedImage, `profile-${userId}.webp`, 'image/webp', {
      folder: 'profiles',
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/*'],
      generateThumbnail: true,
    });
  }

  /**
   * Get signed URL for private files
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.s3Client) {
      return `/mock-downloads/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Delete file from R2
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.s3Client) {
      console.log(`[MOCK DELETE] File: ${key}`);
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);

    // Also delete thumbnail if exists
    const thumbnailKey = `thumbnails/${key}`;
    try {
      const thumbnailCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: thumbnailKey,
      });
      await this.s3Client.send(thumbnailCommand);
    } catch (error) {
      // Ignore if thumbnail doesn't exist
    }
  }
}
