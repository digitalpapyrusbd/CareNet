import { Controller, Get, Post, Delete, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @CurrentUser('id') userId: string,
        @UploadedFile() file: Express.Multer.File,
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
