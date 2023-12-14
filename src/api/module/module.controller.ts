import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller('module')
export class ModuleController {
  constructor(public service: ModuleService) {}

  @Get()
  getList() {
    return this.service.getList();
  }

  @Put('/allow/:id')
  updateAllow(@Body() body: any, @Param('id') id: any): any {
    return this.service.updateAllow(id, body.data);
  }

  @Get('weekdays')
  getWeekdays(): any {
    return this.service.getWeekdays();
  }

  @Get('schedule/:id')
  getSchedules(@Body() body: any, @Param('id') id: any): any {
    return this.service.getSchedule(id);
  }

  @Put('schedule/:id')
  updateSchedules(@Body() body: any, @Param('id') id: any): any {
    return this.service.updateSchedule(id, body.data);
  }

  @Get(':id')
  getDetail(@Param('id') id: any): any {
    return this.service.getDetail(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body.data);
  }

  @Post('student')
  addStudent(@Body() body: any) {
    return this.service.addStudent(body.data);
  }

  @Delete('student/:id')
  deleteStudent(@Param('id') id: any) {
    return this.service.deleteStudent(id);
  }

  @Get('list/:id')
  getRollCallList(@Param('id') id: any): any {
    return this.service.getRollCallList(id);
  }

  @Get('list-student/:id')
  getRollCallListStudent(@Param('id') id: any): any {
    return this.service.getRollCallListStudent(id);
  }

  @Get('leave/:id')
  getLeave(@Param('id') id: any): any {
    return this.service.getLeave(id);
  }

  @Put('leave/:id/:flag')
  updateLeave(@Param('id') id: any, @Param('flag') flag: any): any {
    return this.service.updateLeave(id, flag);
  }
}
