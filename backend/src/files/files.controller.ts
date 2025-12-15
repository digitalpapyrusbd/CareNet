import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

// Fix for Express.Multer.File type
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: MulterFile,
  ) {
    return this.filesService.uploadFile(userId, file);
  }

  @Get(':id')
  getFile(@Param('id') id: string) {
    return this.filesService.getFile(id);
  }

  @Delete(':id')
  deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
}
