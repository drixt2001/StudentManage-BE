import { Body, Controller, Get, Post } from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller('module')
export class ModuleController {
  constructor(public service: ModuleService) {}

  @Get()
  getList() {
    return this.service.getList();
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body.data);
  }
}
