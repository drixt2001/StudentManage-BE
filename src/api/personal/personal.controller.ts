import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Param,
  Get,
  Delete,
  Body,
  Req,
} from '@nestjs/common';
import { PersonalService } from './personal.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from './upload.utils';

@Controller('personal')
export class PersonalController {
  constructor(private readonly service: PersonalService) {}

  @HttpCode(200)
  @Post('upload/:ID')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets/Pictures/0UploadRoot',
        filename: editFileName,
      }),
    }),
  )
  uploadPicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('ID') Id: any,
  ): any {
    return this.service.uploadPicture(file.path, Id);
  }

  @HttpCode(200)
  @Get('pictures/:ID')
  GetPictures(@Param('ID') Id: any): any {
    return this.service.GetPictures(Id);
  }

  @HttpCode(200)
  @Delete('pictures/:ID/:fileName')
  DeletePicture(@Param('ID') Id: any, @Param('fileName') fileName: any): any {
    return this.service.RemovePicture(Id, fileName);
  }

  @HttpCode(200)
  @Post('model/upload/:ID')
  uploadPersonModel(@Req() req, @Param('ID') Id: any): any {
    return this.service.uploadModel(req.body.model, Id);
  }

  @HttpCode(200)
  @Get('model/all')
  getAllModel(@Req() req): any {
    return this.service.getAll();
  }

  // Create Teacher
  @HttpCode(200)
  @Post('teacher/create')
  createTeacher(@Req() req, @Body() body): any {
    return this.service.createTeacher(body);
  }
}
