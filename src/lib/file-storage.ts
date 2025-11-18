export interface FileUploadOptions {
  folder?: string;
  isPublic?: boolean;
  metadata?: Record<string, string>;
}

export interface FileUploadResult {
  url: string;
  key: string;
  bucket: string;
  contentType: string;
  size: number;
}

export class FileStorageService {
  private baseUrl: string;
  private uploadDir: string;

  constructor() {
    // For development, use local file storage
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
  }

  async uploadFile(
    file: File | Buffer,
    fileName: string,
    options: FileUploadOptions = {}
  ): Promise<FileUploadResult> {
    const { folder = 'uploads', isPublic = false, metadata = {} } = options;
    
    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = fileName.includes('.')
      ? fileName.substring(fileName.lastIndexOf('.'))
      : '';
    
    const key = `${folder}/${timestamp}_${randomString}_${fileName}${fileExtension}`;
    
    // Get file content and content type
    let fileBuffer: Buffer;
    let contentType: string;
    
    if (file instanceof File) {
      fileBuffer = Buffer.from(await file.arrayBuffer());
      contentType = file.type || 'application/octet-stream';
    } else {
      fileBuffer = file;
      contentType = metadata.contentType || 'application/octet-stream';
    }

    // For development, simulate file upload
    // In production, this would upload to S3 or another cloud storage
    const fs = require('fs');
    const path = require('path');
    
    // Create directory if it doesn't exist
    const dirPath = path.join(this.uploadDir, folder);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write file to disk
    const filePath = path.join(dirPath, `${timestamp}_${randomString}_${fileName}${fileExtension}`);
    fs.writeFileSync(filePath, fileBuffer);
    
    // Generate URL
    const url = `${this.baseUrl}/uploads/${folder}/${timestamp}_${randomString}_${fileName}${fileExtension}`;
    
    return {
      url,
      key,
      bucket: 'local-storage',
      contentType,
      size: fileBuffer.length,
    };
  }

  async getFileUrl(key: string, isPublic = false): Promise<string> {
    // For development, construct local URL
    return `${this.baseUrl}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    // For development, delete from local filesystem
    const fs = require('fs');
    const path = require('path');
    
    const filePath = path.join(this.uploadDir, key.replace('uploads/', ''));
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('File deletion error:', error);
      throw new Error('Failed to delete file');
    }
  }

  async uploadProfilePicture(file: File, userId: string): Promise<FileUploadResult> {
    // Resize and optimize profile picture
    const optimizedFile = await this.optimizeImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.8 });
    
    return this.uploadFile(optimizedFile, `profile_${userId}`, {
      folder: 'profile-pictures',
      isPublic: true,
      metadata: {
        userId,
        type: 'profile-picture',
      },
    });
  }

  async uploadDocument(file: File, userId: string, documentType: string): Promise<FileUploadResult> {
    return this.uploadFile(file, `${documentType}_${userId}`, {
      folder: 'documents',
      isPublic: false,
      metadata: {
        userId,
        type: documentType,
        originalName: file.name,
      },
    });
  }

  async uploadCareLogPhoto(file: File, careLogId: string): Promise<FileUploadResult> {
    // Optimize care log photos
    const optimizedFile = await this.optimizeImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.7 });
    
    return this.uploadFile(optimizedFile, `carelog_${careLogId}_${Date.now()}`, {
      folder: 'care-logs',
      isPublic: false,
      metadata: {
        careLogId,
        type: 'care-log-photo',
      },
    });
  }

  private async optimizeImage(
    file: File,
    options: { maxWidth: number; maxHeight: number; quality: number }
  ): Promise<Buffer> {
    // In a real implementation, you would use a library like sharp for image optimization
    // For now, we'll just return the file as a buffer
    return Buffer.from(await file.arrayBuffer());
  }

  isConfigured(): boolean {
    return true; // Always configured for local development
  }
}

// Singleton instance
export const fileStorage = new FileStorageService();