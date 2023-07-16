import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @HttpCode(200)
  @Get('department/all')
  getList(@Req() req): any {
    console.log(req.body);
    return this.service.GetListDepartments();
  }

  @HttpCode(200)
  @Get('class')
  getListClass(@Req() req, @Query('department_id') department_id: string): any {
    console.log(req.body);
    return this.service.GetListClass(department_id);
  }
}
