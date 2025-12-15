import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';
import { RateLimit, RateLimitTier } from '../common/guards/throttle.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
@RateLimit(RateLimitTier.GENERAL)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('folder') folder?: string,
    @Query('type') type?: string,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.filesService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      {
        folder,
        generateThumbnail: type === 'image',
      },
    );

    return {
      success: true,
      data: result,
    };
  }

  @Post('upload/profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Query('userId') userId: string,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('No file provided');
    }

    if (!userId) {
      throw new BadRequestException('User ID required');
    }

    const result = await this.filesService.uploadProfilePhoto(
      file.buffer,
      userId,
    );

    return {
      success: true,
      data: result,
    };
  }

  @Get(':key')
  async getFileUrl(@Param('key') key: string) {
    const url = await this.filesService.getSignedUrl(key);

    return {
      success: true,
      data: { url },
    };
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.filesService.deleteFile(key);

    return {
      success: true,
      message: 'File deleted successfully',
    };
  }
}
