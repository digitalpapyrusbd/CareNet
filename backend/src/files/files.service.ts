import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

interface MulterFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(userId: string, file: MulterFile) {
    // TODO: Implement Cloudflare R2 upload
    // For now, assume file is saved and we have a URL
    const fileUrl = `https://r2.example.com/${file.filename}`;

    const fileRecord = await this.prisma.files.create({
      data: {
        uploaded_by: userId,
        filename: file.filename || `file-${Date.now()}`,
        original_name: file.originalname,
        mime_type: file.mimetype,
        size: file.size,
        url: fileUrl,
      },
    });

    return fileRecord;
  }

  async getFile(id: string) {
    const file = await this.prisma.files.findUnique({
      where: { id },
    });

    return file;
  }

  async deleteFile(id: string) {
    // TODO: Delete from Cloudflare R2
    await this.prisma.files.delete({
      where: { id },
    });

    return { message: 'File deleted successfully' };
  }
}
