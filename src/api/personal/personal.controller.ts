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
  Query,
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
  @Get('model/:module_id')
  getAllModel(@Req() req, @Param('module_id') module_id: any): any {
    return this.service.getAll(module_id);
  }

  // Create person
  @HttpCode(200)
  @Post('create')
  createTeacher(@Req() req, @Body() body): any {
    console.log(body);
    return this.service.createTeacher(body.type, body.data);
  }

  //get list person
  @HttpCode(200)
  @Get('list')
  getList(
    @Req() req,
    @Query('type') type: string,
    @Query('department') department: string,
    @Query('class_id') class_id: string,
    @Query('name') name: string,
  ): any {
    return this.service.getList(type, department, class_id, name);
  }

  // get details
  @HttpCode(200)
  @Get('detail/:ID')
  getDetail(
    @Req() req,
    @Param('ID') Id: any,
    @Query('type') type: string,
  ): any {
    return this.service.getDetail(type, Id);
  }
}
